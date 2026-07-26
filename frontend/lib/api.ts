import { getAccessToken, initAuth } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(init.headers as Record<string, string>),
    },
    credentials: 'include',
  });

  if (res.status === 401) {
    const refreshed = await initAuth();
    if (!refreshed) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Session expired');
    }
    return fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      credentials: 'include',
    });
  }

  return res;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await apiFetch(path);
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: 'POST',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `${res.status}`);
  }
  return res.json();
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `${res.status}`);
  }
  return res.json();
}

export async function apiDelete(path: string): Promise<void> {
  const res = await apiFetch(path, { method: 'DELETE' });
  if (!res.ok) throw new Error(`${res.status}`);
}
