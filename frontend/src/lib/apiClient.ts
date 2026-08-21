// Central API client — reads VITE_API_URL at build time.
// In development, leave VITE_API_URL unset and rely on Vite's proxy.
// In production, set VITE_API_URL to your Render backend URL,
// e.g. https://resumeradar-backend.onrender.com

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${BASE}${path}`, init);
}
