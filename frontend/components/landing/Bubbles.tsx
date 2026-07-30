'use client';

import { useEffect, useState } from 'react';

type Bubble = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
};

/**
 * Slow rising bubbles behind the hero.
 * Values are randomised on the client only — generating them during render
 * would produce a server/client mismatch on hydration.
 */
export function Bubbles({ count = 14 }: { count?: number }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Users who prefer reduced motion get no drifting bubbles at all.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setBubbles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 5 + Math.random() * 16,
        delay: Math.random() * 14,
        duration: 16 + Math.random() * 14,
        drift: (Math.random() - 0.5) * 90,
      }))
    );
  }, [count]);

  if (bubbles.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      // Fade the column at both ends so bubbles never collide with the
      // content below the hero — they surface and dissolve.
      style={{
        maskImage: 'linear-gradient(to top, transparent 0%, black 18%, black 70%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to top, transparent 0%, black 18%, black 70%, transparent 100%)',
      }}
    >
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            border: '1px solid color-mix(in srgb, var(--primary) 45%, transparent)',
            background: 'color-mix(in srgb, var(--primary) 10%, transparent)',
            animation: `bubble-up ${b.duration}s linear ${b.delay}s infinite`,
            ['--drift' as string]: `${b.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
