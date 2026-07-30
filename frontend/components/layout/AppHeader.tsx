'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GridIcon, ListIcon, OtterMark } from '@/components/ui/Icons';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const VIEWS = [
  { href: '/todos', label: 'List view', Icon: ListIcon },
  { href: '/matrix', label: 'Matrix view', Icon: GridIcon },
] as const;

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between gap-3">
      <Link
        href="/"
        className="group flex items-center gap-2 rounded-lg"
        aria-label="Otter home"
      >
        <OtterMark size={28} className="text-primary transition-transform duration-300 group-hover:-translate-y-0.5" />
        <span className="font-display text-xl font-semibold tracking-tight">
          {pathname === '/matrix' ? 'matrix' : 'todos'}
        </span>
      </Link>

      <nav className="flex items-center gap-1 rounded-full p-1" style={{ background: 'var(--surface-sunk)' }}>
        {VIEWS.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className="icon-btn"
            data-active={pathname === href}
            aria-label={label}
            aria-current={pathname === href ? 'page' : undefined}
            title={label}
          >
            <Icon size={17} />
          </Link>
        ))}
        <span className="mx-0.5 h-5 w-px" style={{ background: 'var(--border)' }} aria-hidden="true" />
        <ThemeToggle />
      </nav>
    </header>
  );
}
