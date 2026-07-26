'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAccessToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { detail?: string }).detail ?? 'Login failed');
        return;
      }
      const data = await res.json();
      setAccessToken(data.access_token);
      router.replace('/todos');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="otter-container">
      <div className="otter-card" style={{ maxWidth: 380 }}>
        <h1 style={{ fontSize: '2rem', color: 'white', fontWeight: 700 }}>🦦 otter</h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 16, padding: '10px 16px', color: 'white', fontSize: 14, outline: 'none' }}
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 16, padding: '10px 16px', color: 'white', fontSize: 14, outline: 'none' }}
          />
          {error && <p style={{ color: '#ff8899', fontSize: 13 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ background: 'rgba(180,25,70,0.8)', border: 'none', borderRadius: 16, padding: '10px', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center' }}>
          No account?{' '}
          <a href="/register" style={{ color: 'white' }}>Register</a>
        </p>
      </div>
    </div>
  );
}
