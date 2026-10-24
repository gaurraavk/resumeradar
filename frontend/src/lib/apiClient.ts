// Central API client — reads VITE_API_URL at build time.
// In development, leave VITE_API_URL unset and rely on Vite's proxy.
// In production, set VITE_API_URL to your Render backend URL,
// e.g. https://resumeradar-backend.onrender.com

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

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers || {});
  const userToken = getUserToken();
  if (userToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${userToken}`);
  }
  return fetch(`${BASE}${path}`, {
    ...init,
    headers,
  });
}

export async function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers || {});
  const adminToken = getAdminToken();
  if (adminToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${adminToken}`);
  }
  return fetch(`${BASE}${path}`, {
    ...init,
    headers,
  });
}

export async function apiUpload(path: string, formData: FormData): Promise<Response> {
  const headers = new Headers();
  const userToken = getUserToken();
  if (userToken) {
    headers.set('Authorization', `Bearer ${userToken}`);
  }
  return fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });
}
