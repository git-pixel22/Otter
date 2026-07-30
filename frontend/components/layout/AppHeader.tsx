'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  const isTodos = pathname === '/todos';

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <h1 style={{ fontSize: '2rem', color: 'white', fontWeight: 700 }}>
        {isTodos ? 'todos' : 'matrix'}
      </h1>

      <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 4 }}>
        {/* Todos view */}
        <NavBtn
          active={isTodos}
          onClick={() => router.push('/todos')}
          title="List view"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="3" width="14" height="2" rx="1" fill="currentColor"/>
            <rect x="1" y="7" width="14" height="2" rx="1" fill="currentColor"/>
            <rect x="1" y="11" width="14" height="2" rx="1" fill="currentColor"/>
          </svg>
        </NavBtn>

        {/* Matrix view */}
        <NavBtn
          active={!isTodos}
          onClick={() => router.push('/matrix')}
          title="Matrix view"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/>
          </svg>
        </NavBtn>

        {/* Dark mode toggle */}
        <NavBtn active={false} onClick={toggleDark} title={isDark ? 'Light mode' : 'Dark mode'}>
          {isDark ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3.5" fill="currentColor"/>
              <line x1="8" y1="1" x2="8" y2="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="8" y1="13.5" x2="8" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="1" y1="8" x2="2.5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="13.5" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="3.05" y1="3.05" x2="4.1" y2="4.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="11.9" y1="11.9" x2="12.95" y2="12.95" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="12.95" y1="3.05" x2="11.9" y2="4.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="4.1" y1="11.9" x2="3.05" y2="12.95" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" fill="currentColor"/>
            </svg>
          )}
        </NavBtn>
      </div>
    </div>
  );
}

function NavBtn({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: active ? 'rgba(255,255,255,0.25)' : 'transparent',
        border: 'none',
        color: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
        width: 34,
        height: 34,
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.2s, color 0.2s',
      }}
    >
      {children}
    </button>
  );
}
