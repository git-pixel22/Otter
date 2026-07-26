'use client';

import type { QuadrantFilter, Quadrant } from '@/types';

const QUADRANTS: Quadrant[] = ['A', 'B', 'C', 'D'];

const ACTIVE_COLORS: Record<string, string> = {
  all: 'rgba(255,255,255,0.25)',
  A: 'rgba(180,25,70,0.6)',
  B: 'rgba(25,110,55,0.6)',
  C: 'rgba(180,90,10,0.6)',
  D: 'rgba(70,70,90,0.6)',
};

export function FilterBar({ active, onChange }: { active: QuadrantFilter; onChange: (f: QuadrantFilter) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {(['all', ...QUADRANTS] as QuadrantFilter[]).map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            padding: '4px 12px',
            borderRadius: 20,
            border: 'none',
            fontSize: 13,
            cursor: 'pointer',
            background: active === f ? ACTIVE_COLORS[f] : 'rgba(255,255,255,0.1)',
            color: active === f ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
            transition: 'background 0.15s',
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
