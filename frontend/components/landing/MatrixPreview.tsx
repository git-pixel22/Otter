import type { Quadrant } from '@/types';

type Cell = {
  key: Quadrant;
  title: string;
  verb: string;
  blurb: string;
  example: string;
};

const CELLS: Cell[] = [
  {
    key: 'A',
    title: 'Important & Urgent',
    verb: 'Do it now',
    blurb: 'Real deadlines and genuine emergencies.',
    example: 'Ship the thing that is due today',
  },
  {
    key: 'B',
    title: 'Important, Not Urgent',
    verb: 'Give it a time',
    blurb: 'The quiet work that compounds. Easiest to postpone, costliest to skip.',
    example: 'Learn the thing, call the friend',
  },
  {
    key: 'C',
    title: 'Urgent, Not Important',
    verb: 'Trim or hand off',
    blurb: "Loud, but it's someone else's priority wearing your calendar.",
    example: 'Most notifications',
  },
  {
    key: 'D',
    title: 'Neither',
    verb: 'Let it go',
    blurb: 'Be honest. This is the list you are allowed to abandon.',
    example: 'The tab you have had open for a month',
  },
];

export function MatrixPreview() {
  return (
    <div className="w-full">
      {/* Axis labels */}
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-faint">Urgent</span>
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-faint">Not urgent</span>
      </div>

      <div className="flex gap-2">
        {/* Vertical axis */}
        <div className="flex w-4 shrink-0 flex-col">
          {['Important', 'Not'].map((label) => (
            <span
              key={label}
              className="flex flex-1 items-center justify-center text-[11px] font-medium uppercase tracking-[0.18em] text-faint [writing-mode:vertical-rl] rotate-180"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="grid flex-1 grid-cols-2 gap-2 sm:gap-3">
          {CELLS.map((cell) => (
            <div
              key={cell.key}
              className="group relative flex flex-col gap-1.5 overflow-hidden rounded-2xl border p-3.5 transition-transform duration-300 hover:-translate-y-1 sm:p-4"
              style={{
                background: `rgba(var(--q-${cell.key.toLowerCase()}-tint), var(--q-fill))`,
                borderColor: `rgba(var(--q-${cell.key.toLowerCase()}-tint), var(--q-edge))`,
              }}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display text-lg font-semibold leading-none"
                  style={{ color: `var(--q-${cell.key.toLowerCase()}-ink)` }}
                >
                  {cell.key}
                </span>
                <span className="text-[13px] font-medium text-ink">{cell.title}</span>
              </div>

              <p className="text-xs leading-relaxed text-muted">{cell.blurb}</p>

              <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-1.5">
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    background: `rgba(var(--q-${cell.key.toLowerCase()}-tint), 0.2)`,
                    color: `var(--q-${cell.key.toLowerCase()}-ink)`,
                  }}
                >
                  {cell.verb}
                </span>
                <span className="text-[11px] italic text-faint">{cell.example}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
