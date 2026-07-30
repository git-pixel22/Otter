'use client';

import { useEffect, useId, useRef } from 'react';
import { useUpdateTask } from '@/lib/hooks';
import { TaskInput } from '@/components/tasks/TaskInput';
import { ArrowRightIcon, CloseIcon } from '@/components/ui/Icons';
import { QUADRANT_META } from '@/types';
import type { Quadrant, Task } from '@/types';

export function QuadrantModal({
  quadrant,
  allTasks,
  onClose,
}: {
  quadrant: Quadrant;
  allTasks: Task[];
  onClose: () => void;
}) {
  const updateTask = useUpdateTask();
  const meta = QUADRANT_META[quadrant];
  const key = quadrant.toLowerCase();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const unassigned = allTasks.filter((t) => t.quadrant === null);

  // Escape closes; focus returns to whatever opened the modal.
  useEffect(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      restoreFocusRef.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-pop flex w-full max-w-sm flex-col gap-4 rounded-2xl border p-5"
        style={{
          background: 'var(--surface-solid)',
          borderColor: `rgba(var(--q-${key}-tint), 0.5)`,
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 id={titleId} className="font-display text-lg font-semibold leading-tight tracking-tight">
              Quadrant {quadrant}
            </h2>
            <p className="text-xs" style={{ color: `var(--q-${key}-ink)` }}>
              {meta.desc}
            </p>
          </div>
          <button type="button" onClick={onClose} className="icon-btn shrink-0" aria-label="Close dialog">
            <CloseIcon size={16} />
          </button>
        </div>

        <TaskInput quadrant={quadrant} autoFocus placeholder={`Add a task to ${quadrant}…`} />

        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
            {unassigned.length > 0 ? 'Or file an unsorted task' : 'Unsorted tasks'}
          </p>

          {unassigned.length === 0 ? (
            <p className="rounded-lg px-3 py-4 text-center text-xs text-muted" style={{ background: 'var(--surface-sunk)' }}>
              Everything is already sorted.
            </p>
          ) : (
            <ul className="flex max-h-52 flex-col gap-1.5 overflow-y-auto">
              {unassigned.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => updateTask.mutate({ id: t.id, data: { quadrant } }, { onSuccess: onClose })}
                    className="group flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors duration-200"
                    style={{ background: 'var(--surface-sunk)', minHeight: 44 }}
                  >
                    <span
                      className="task-text min-w-0 flex-1 truncate text-[13px]"
                      data-done={t.completed}
                      style={{ color: t.completed ? 'var(--text-muted)' : 'var(--text)' }}
                    >
                      {t.text}
                    </span>
                    <span
                      className="flex shrink-0 items-center gap-1 text-[11px] font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                      style={{ color: `var(--q-${key}-ink)` }}
                    >
                      File
                      <ArrowRightIcon size={12} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
