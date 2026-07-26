'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { initAuth } from '@/lib/auth';
import { AppHeader } from '@/components/layout/AppHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isMatrix = pathname === '/matrix';

  useEffect(() => {
    initAuth().then((ok) => {
      if (!ok) router.replace('/login');
      else setReady(true);
    });
  }, [router]);

  if (!ready) {
    return (
      <div className="otter-container">
        <div className="otter-card" style={{ alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="otter-container">
      <div className={`otter-card${isMatrix ? ' matrix-active' : ''}`} style={{ backdropFilter: 'blur(10px)' }}>
        <AppHeader />
        {children}
      </div>
    </div>
  );
}
