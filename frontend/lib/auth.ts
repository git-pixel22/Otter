const API_URL = process.env.NEXT_PUBLIC_API_URL!;

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export async function initAuth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      accessToken = null;
      return false;
    }
    const data = await res.json();
    accessToken = data.access_token;
    return true;
  } catch {
    accessToken = null;
    return false;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // ignore network errors on logout
  }
  accessToken = null;
}
