'use client';

import { useDroppable } from '@dnd-kit/core';
import { QUADRANT_META } from '@/types';
import { MatrixTaskItem } from './MatrixTaskItem';
import { PlusIcon } from '@/components/ui/Icons';
import type { Quadrant, Task } from '@/types';

export function MatrixQuadrant({
  quadrant,
  tasks,
  onAdd,
}: {
  quadrant: Quadrant;
  tasks: Task[];
  onAdd: (q: Quadrant) => void;
}) {
  const meta = QUADRANT_META[quadrant];
  const { setNodeRef, isOver } = useDroppable({ id: quadrant });
  const key = quadrant.toLowerCase();

  return (
    <section
      className="flex flex-col overflow-hidden rounded-2xl border transition-all duration-200"
      style={{
        minHeight: 172,
        background: `rgba(var(--q-${key}-tint), ${isOver ? 'var(--q-fill-over)' : 'var(--q-fill)'})`,
        borderColor: `rgba(var(--q-${key}-tint), ${isOver ? 0.7 : 'var(--q-edge)'})`,
        transform: isOver ? 'scale(1.015)' : undefined,
      }}
      aria-label={`Quadrant ${quadrant}: ${meta.desc}`}
    >
      <header className="flex items-center justify-between gap-2 border-b px-3 py-2">
        <div className="flex min-w-0 items-baseline gap-1.5">
          <span
            className="font-display text-sm font-bold leading-none"
            style={{ color: `var(--q-${key}-ink)` }}
          >
            {quadrant}
          </span>
          <span className="truncate text-[11px] text-muted">{meta.desc}</span>
        </div>
        <button
          type="button"
          onClick={() => onAdd(quadrant)}
          className="icon-btn shrink-0"
          style={{ width: 26, height: 26 }}
          aria-label={`Add a task to quadrant ${quadrant}`}
          title={`Add to ${quadrant}`}
        >
          <PlusIcon size={15} />
        </button>
      </header>

      <div ref={setNodeRef} className="flex flex-1 flex-col gap-1.5 p-2">
        {tasks.map((task) => (
          <MatrixTaskItem key={task.id} task={task} />
        ))}

        {tasks.length === 0 && (
          <p
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed px-2 py-5 text-center text-[11px] leading-relaxed text-faint transition-colors duration-200"
            style={{
              borderColor: isOver ? `rgba(var(--q-${key}-tint), 0.6)` : 'var(--border)',
            }}
          >
            {isOver ? 'Drop to file it here' : 'Drag tasks here'}
          </p>
        )}
      </div>
    </section>
  );
}
