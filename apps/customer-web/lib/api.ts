export type SessionUser = { id: string; name?: string; email?: string; role?: 'customer' | 'seller' | 'admin' | 'super_admin' };

const baseUrl = `${(process.env.NEXT_PUBLIC_LEGACY_API_URL || 'https://gaurav-nursery.onrender.com').replace(/\/$/, '')}/api`;
const tokenKey = 'gaurav_nursery_token';
const userKey = 'gaurav_nursery_user';

export function getSession() {
  if (typeof window === 'undefined') return { token: null, user: null as SessionUser | null };
  const token = window.localStorage.getItem(tokenKey) || window.sessionStorage.getItem(tokenKey);
  const rawUser = window.localStorage.getItem(userKey) || window.sessionStorage.getItem(userKey);
  try { return { token, user: rawUser ? JSON.parse(rawUser) as SessionUser : null }; } catch { return { token, user: null }; }
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  [window.localStorage, window.sessionStorage].forEach((store) => { store.removeItem(tokenKey); store.removeItem(userKey); });
}

export function saveSession(token: string, user: SessionUser, persistent = true) {
  if (typeof window === 'undefined') return;
  const store = persistent ? window.localStorage : window.sessionStorage;
  store.setItem(tokenKey, token);
  store.setItem(userKey, JSON.stringify(user));
}

export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }

export async function apiRequest<T>(path: string, init: RequestInit = {}, options: { auth?: boolean } = {}) {
  const auth = options.auth !== false;
  const { token } = getSession();
  const headers = new Headers(init.headers);
  if (auth && token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (auth && (response.status === 401 || response.status === 403)) clearSession();
    throw new ApiError(response.status, data?.message || 'Request failed');
  }
  return data as T;
}

export const apiBaseUrl = baseUrl;
