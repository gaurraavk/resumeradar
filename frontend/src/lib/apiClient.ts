// Central API client with resilience for Render cold-starts & cloud hosting
// Features:
// - 90-second timeout via AbortController
// - Automatic retry (3 attempts total with backoff) on network errors and 502/503/504
// - Safe response parsing (safeJson) with friendly messages on HTML error pages
// - Waking server indicator (notified if request > 3 seconds)
// - Special 409 handling on retried registrations: "Your account may already be created - try signing in"
// - Server wake-up utility on /healthz

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
export const USER_TOKEN_KEY = 'resumeradar_user_token';
export const ADMIN_TOKEN_KEY = 'resumeradar_admin_token';

export function getUserToken(): string | null {
  return localStorage.getItem(USER_TOKEN_KEY);
}

export function setUserToken(token: string): void {
  localStorage.setItem(USER_TOKEN_KEY, token);
}

export function clearUserToken(): void {
  localStorage.removeItem(USER_TOKEN_KEY);
}

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

// ==================== Server Waking State Management ====================
type WakingListener = (isWaking: boolean) => void;
const wakingListeners = new Set<WakingListener>();
let activeRequestsCount = 0;
let wakingTimer: any = null;
let currentWakingState = false;

function notifyWakingState(state: boolean) {
  if (currentWakingState !== state) {
    currentWakingState = state;
    wakingListeners.forEach(listener => {
      try {
        listener(state);
      } catch (err) {
        console.error('Error in waking listener:', err);
      }
    });
  }
}

function beginRequest() {
  activeRequestsCount++;
  if (activeRequestsCount === 1) {
    if (wakingTimer) clearTimeout(wakingTimer);
    wakingTimer = setTimeout(() => {
      if (activeRequestsCount > 0) {
        notifyWakingState(true);
      }
    }, 3000);
  }
}

function endRequest() {
  activeRequestsCount = Math.max(0, activeRequestsCount - 1);
  if (activeRequestsCount === 0) {
    if (wakingTimer) {
      clearTimeout(wakingTimer);
      wakingTimer = null;
    }
    notifyWakingState(false);
  }
}

export function subscribeServerWaking(listener: WakingListener): () => void {
  wakingListeners.add(listener);
  // Immediately emit current state to new subscriber
  listener(currentWakingState);
  return () => {
    wakingListeners.delete(listener);
  };
}

// ==================== Safe JSON Response Parsing ====================
export interface SafeJsonResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

export async function safeJson<T = any>(res: Response): Promise<SafeJsonResponse<T>> {
  try {
    const text = await res.text();
    if (!text || text.trim() === '') {
      return {
        success: res.ok,
        message: res.ok ? 'Success' : `Request failed with status ${res.status}`,
      };
    }

    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === 'object' && parsed !== null) {
        if (parsed.success === undefined) {
          parsed.success = res.ok;
        }
        return parsed;
      }
      return { success: res.ok, data: parsed };
    } catch {
      // Body is not JSON (e.g. 502/503 HTML from Render / Cloud proxy)
      let msg: string;
      if (res.status === 502 || res.status === 503 || res.status === 504) {
        msg = `Server is currently starting up or temporarily unavailable (${res.status}). Please wait a few seconds and try again.`;
      } else if (res.status === 404) {
        msg = 'The requested resource was not found on the server (404).';
      } else if (res.status === 401) {
        msg = 'Invalid credentials or session expired (401).';
      } else if (res.status === 403) {
        msg = 'Access denied (403).';
      } else if (res.status === 409) {
        msg = 'An account with this email already exists - try signing in.';
      } else if (!res.ok) {
        msg = `Server returned status ${res.status}. Please try again.`;
      } else {
        msg = 'Server returned a non-JSON response.';
      }

      return {
        success: false,
        message: msg,
      };
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to parse response from server.',
    };
  }
}

// ==================== Resilient Request Core ====================
const REQUEST_TIMEOUT_MS = 90000; // 90 seconds
const MAX_ATTEMPTS = 3;

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

async function resilientFetch(
  path: string,
  init?: RequestOptions,
  authType: 'user' | 'admin' | 'none' = 'user'
): Promise<Response> {
  const fullUrl = path.startsWith('http://') || path.startsWith('https://') ? path : `${BASE}${path}`;
  const isRegister = path.includes('/api/v1/auth/register');

  let lastError: Error | null = null;
  let lastResponse: Response | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort(new Error(`Request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`));
    }, init?.timeoutMs || REQUEST_TIMEOUT_MS);

    beginRequest();

    try {
      const headers = new Headers(init?.headers || {});
      if (authType === 'user') {
        const token = getUserToken();
        if (token && !headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      } else if (authType === 'admin') {
        const token = getAdminToken();
        if (token && !headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }

      const response = await fetch(fullUrl, {
        ...init,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeout);
      endRequest();

      // Special handling: if retried registration returns 409 (Conflict),
      // it means the initial request created the account before network dropped
      if (isRegister && attempt > 1 && response.status === 409) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Your account may already be created - try signing in',
          }),
          {
            status: 409,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Check for transient server errors (502, 503, 504) that should trigger a retry
      if ((response.status === 502 || response.status === 503 || response.status === 504) && attempt < MAX_ATTEMPTS) {
        lastResponse = response;
        const delay = attempt === 1 ? 1000 : 2000;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      return response;
    } catch (err: any) {
      clearTimeout(timeout);
      endRequest();

      lastError = err instanceof Error ? err : new Error(String(err));

      // Network error or fetch failure: retry if attempts remaining
      if (attempt < MAX_ATTEMPTS) {
        const delay = attempt === 1 ? 1000 : 2000;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
    }
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw lastError || new Error('Network error. Failed to communicate with server.');
}

// ==================== Public Client Methods ====================
export async function apiFetch(path: string, init?: RequestOptions): Promise<Response> {
  return resilientFetch(path, init, 'user');
}

export async function adminFetch(path: string, init?: RequestOptions): Promise<Response> {
  return resilientFetch(path, init, 'admin');
}

export async function apiUpload(path: string, formData: FormData, init?: RequestOptions): Promise<Response> {
  return resilientFetch(
    path,
    {
      ...init,
      method: 'POST',
      body: formData,
    },
    'user'
  );
}

// Server wake-up ping for initial app mount
export function wakeUpServer(): void {
  // Fire-and-forget ping to wake up free hosting tier
  apiFetch('/healthz').catch(() => {});
}
