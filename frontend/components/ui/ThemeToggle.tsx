'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from './Icons';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`icon-btn ${className}`}
      // Until mounted we don't know the theme, so keep the label neutral
      // rather than announcing something that may be wrong.
      aria-label={mounted ? (isDark ? 'Switch to light mode' : 'Switch to dark mode') : 'Toggle theme'}
      title={mounted ? (isDark ? 'Light mode' : 'Dark mode') : 'Toggle theme'}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
