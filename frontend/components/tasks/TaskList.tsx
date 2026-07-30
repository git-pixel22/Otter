'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTasks } from '@/lib/hooks';
import { TaskItem } from './TaskItem';
import { TaskInput } from './TaskInput';
import { FilterBar } from './FilterBar';
import { Celebrate } from '@/components/ui/Celebrate';
import { EmptyState } from '@/components/ui/EmptyState';
import type { QuadrantFilter } from '@/types';

const MAX_TASKS = 30;

export function TaskList() {
  const { data: tasks = [], isLoading } = useTasks();
  const [filter, setFilter] = useState<QuadrantFilter>('all');
  const [celebrating, setCelebrating] = useState(false);

  const done = tasks.filter((t) => t.completed).length;
  const allDone = tasks.length > 0 && done === tasks.length;

  useEffect(() => {
    if (!allDone) {
      setCelebrating(false);
      return;
    }
    setCelebrating(true);
    const timer = setTimeout(() => setCelebrating(false), 5000);
    return () => clearTimeout(timer);
  }, [allDone]);

  const counts = useMemo(() => {
    const base: Record<QuadrantFilter, number> = { all: tasks.length, A: 0, B: 0, C: 0, D: 0 };
    for (const t of tasks) if (t.quadrant) base[t.quadrant] += 1;
    return base;
  }, [tasks]);

  const visible = filter === 'all' ? tasks : tasks.filter((t) => t.quadrant === filter);
  const progress = tasks.length ? (done / tasks.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-4">
      <Celebrate active={celebrating} />

      <TaskInput />

      {/* Progress — only meaningful once something exists */}
      {tasks.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="tnum">
              {done} of {tasks.length} done
            </span>
            {tasks.length >= MAX_TASKS - 5 && (
              <span className="tnum text-faint">{MAX_TASKS - tasks.length} slots left</span>
            )}
          </div>
          <div
            className="h-1 overflow-hidden rounded-full"
            style={{ background: 'var(--surface-sunk)' }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Tasks completed"
          >
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%`, background: 'var(--primary)' }}
            />
          </div>
        </div>
      )}

      {tasks.length > 0 && <FilterBar active={filter} onChange={setFilter} counts={counts} />}

      {/* Politely announce completion for screen reader users */}
      <p aria-live="polite" className="sr-only">
        {allDone ? 'All tasks complete.' : ''}
      </p>

      {isLoading ? (
        <div className="flex flex-col gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-xl"
              style={{ background: 'var(--surface-sunk)', animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          title={filter === 'all' ? 'A clear surface' : `Nothing in ${filter}`}
          hint={
            filter === 'all'
              ? 'Add the first thing on your mind above. You can sort it into the matrix afterwards.'
              : 'Drag tasks into this quadrant from the matrix view, or pick a different filter.'
          }
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((task, i) => (
            <TaskItem key={task.id} task={task} index={i} />
          ))}
        </ul>
      )}
    </div>
  );
}
