'use client';

import { usePathname } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMatrix = pathname === '/matrix';

  return (
    <div className="otter-container">
      <div className={`otter-card${isMatrix ? ' matrix-active' : ''}`} style={{ backdropFilter: 'blur(10px)' }}>
        <AppHeader />
        {children}
      </div>
    </div>
  );
}
