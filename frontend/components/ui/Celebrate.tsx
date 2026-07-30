'use client';

import { useEffect, useState } from 'react';

type Drop = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  color: string;
};

// Brand teal plus the four quadrant hues, so the celebration still reads as Otter.
const COLORS = [
  'var(--primary)',
  'rgb(var(--q-a))',
  'rgb(var(--q-b))',
  'rgb(var(--q-c))',
  'rgb(var(--q-d))',
];

/**
 * A burst of rising bubbles when every task is done — an otter surfacing,
 * rather than generic falling confetti.
 */
export function Celebrate({ active }: { active: boolean }) {
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    if (!active) {
      setDrops([]);
      return;
    }

    // Honour reduced-motion: the aria-live message in the list still fires.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setDrops(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 6 + Math.random() * 14,
        delay: Math.random() * 1.2,
        duration: 2.6 + Math.random() * 2.2,
        drift: (Math.random() - 0.5) * 140,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    );
  }, [active]);

  if (drops.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {drops.map((d) => (
        <span
          key={d.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            border: `1.5px solid ${d.color}`,
            background: `color-mix(in srgb, ${d.color} 22%, transparent)`,
            animation: `bubble-up ${d.duration}s ease-out ${d.delay}s forwards`,
            ['--drift' as string]: `${d.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
