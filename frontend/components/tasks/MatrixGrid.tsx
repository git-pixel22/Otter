'use client';

import { useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useTasks, useUpdateTask } from '@/lib/hooks';
import { MatrixQuadrant } from './MatrixQuadrant';
import { QuadrantModal } from '@/components/modals/QuadrantModal';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Quadrant, Task } from '@/types';

const QUADRANTS: Quadrant[] = ['A', 'B', 'C', 'D'];

export function MatrixGrid() {
  const { data: tasks = [], isLoading } = useTasks();
  const updateTask = useUpdateTask();
  const [modalQuadrant, setModalQuadrant] = useState<Quadrant | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    // Keyboard alternative to dragging: focus a task, Space to lift, arrows to move.
    useSensor(KeyboardSensor)
  );

  const tasksByQuadrant = useMemo(() => {
    const map: Record<Quadrant, Task[]> = { A: [], B: [], C: [], D: [] };
    for (const t of tasks) if (t.quadrant) map[t.quadrant].push(t);
    return map;
  }, [tasks]);

  const unassigned = tasks.filter((t) => t.quadrant === null);
  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newQuadrant = over.id as Quadrant;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.quadrant === newQuadrant) return;

    updateTask.mutate({ id: taskId, data: { quadrant: newQuadrant } });
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3" aria-hidden="true">
        {QUADRANTS.map((q, i) => (
          <div
            key={q}
            className="h-44 animate-pulse rounded-2xl"
            style={{ background: 'var(--surface-sunk)', animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="Nothing to sort yet"
        hint="Add a few tasks in the list view first, then come back here to decide what actually matters."
      />
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        {/* Axis labels give the grid its meaning at a glance */}
        <div className="mb-1.5 flex items-center justify-between px-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">Urgent</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">Not urgent</span>
        </div>

        <div className="flex gap-2">
          <div className="flex w-4 shrink-0 flex-col">
            {['Important', 'Not'].map((label) => (
              <span
                key={label}
                className="flex flex-1 items-center justify-center text-[10px] font-semibold uppercase tracking-[0.16em] text-faint [writing-mode:vertical-rl] rotate-180"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="grid flex-1 grid-cols-2 gap-2 sm:gap-3">
            {QUADRANTS.map((q) => (
              <MatrixQuadrant key={q} quadrant={q} tasks={tasksByQuadrant[q]} onAdd={setModalQuadrant} />
            ))}
          </div>
        </div>

        {/* The dragged task follows the cursor at full opacity */}
        <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }}>
          {activeTask && (
            <div
              className="flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium shadow-lg"
              style={{
                background: 'var(--surface-solid)',
                color: 'var(--text)',
                border: '1px solid var(--border-strong)',
                cursor: 'grabbing',
              }}
            >
              {activeTask.text}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {unassigned.length > 0 && (
        <p className="mt-3 text-center text-xs text-muted">
          <span className="tnum font-semibold text-ink">{unassigned.length}</span>{' '}
          {unassigned.length === 1 ? 'task is' : 'tasks are'} still unsorted — use{' '}
          <PlusHint /> on a quadrant to file them.
        </p>
      )}

      {modalQuadrant && (
        <QuadrantModal
          quadrant={modalQuadrant}
          allTasks={tasks}
          onClose={() => setModalQuadrant(null)}
        />
      )}
    </>
  );
}

function PlusHint() {
  return (
    <span
      className="mx-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full align-text-bottom text-[11px] font-bold"
      style={{ background: 'var(--surface-sunk)', color: 'var(--text)' }}
      aria-hidden="true"
    >
      +
    </span>
  );
}
