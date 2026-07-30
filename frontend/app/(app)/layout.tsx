'use client';

import { usePathname } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMatrix = pathname === '/matrix';

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-8 sm:px-6">
      <div className="app-shell" data-wide={isMatrix}>
        <div className="card flex flex-col gap-5 p-5 sm:p-7">
          <AppHeader />
          {children}
        </div>
      </div>
    </div>
  );
}
