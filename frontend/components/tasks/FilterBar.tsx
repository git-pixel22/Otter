'use client';

import type { Quadrant, QuadrantFilter } from '@/types';

const QUADRANTS: Quadrant[] = ['A', 'B', 'C', 'D'];

const LABELS: Record<QuadrantFilter, string> = {
  all: 'All tasks',
  A: 'Important & urgent',
  B: 'Important, not urgent',
  C: 'Urgent, not important',
  D: 'Neither',
};

export function FilterBar({
  active,
  onChange,
  counts,
}: {
  active: QuadrantFilter;
  onChange: (f: QuadrantFilter) => void;
  counts: Record<QuadrantFilter, number>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter tasks by quadrant">
      {(['all', ...QUADRANTS] as QuadrantFilter[]).map((f) => {
        const isActive = active === f;
        const key = f.toLowerCase();
        const isQuadrant = f !== 'all';

        return (
          <button
            key={f}
            type="button"
            onClick={() => onChange(f)}
            aria-pressed={isActive}
            title={LABELS[f]}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95"
            style={{
              background: !isActive
                ? 'transparent'
                : isQuadrant
                  ? `rgba(var(--q-${key}-tint), 0.2)`
                  : 'var(--surface-raised)',
              borderColor: !isActive
                ? 'var(--border)'
                : isQuadrant
                  ? `rgba(var(--q-${key}-tint), 0.45)`
                  : 'var(--border-strong)',
              color: !isActive
                ? 'var(--text-muted)'
                : isQuadrant
                  ? `var(--q-${key}-ink)`
                  : 'var(--text)',
            }}
          >
            <span>{f === 'all' ? 'All' : f}</span>
            <span className="tnum opacity-60">{counts[f] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
