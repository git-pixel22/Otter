'use client';

import { useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useTasks, useUpdateTask } from '@/lib/hooks';
import { MatrixQuadrant } from './MatrixQuadrant';
import { QuadrantModal } from '@/components/modals/QuadrantModal';
import type { Quadrant, Task } from '@/types';

const QUADRANTS: Quadrant[] = ['A', 'B', 'C', 'D'];

export function MatrixGrid() {
  const { data: tasks = [], isLoading } = useTasks();
  const updateTask = useUpdateTask();
  const [modalQuadrant, setModalQuadrant] = useState<Quadrant | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const tasksByQuadrant = useMemo(() => {
    const map: Record<Quadrant, Task[]> = { A: [], B: [], C: [], D: [] };
    for (const t of tasks) {
      if (t.quadrant) map[t.quadrant].push(t);
    }
    return map;
  }, [tasks]);

  function handleDragEnd(event: DragEndEvent) {
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
      <p className="text-sm py-8 text-center" style={{ color: 'var(--text-muted)' }}>
        Loading…
      </p>
    );
  }

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 gap-4">
          {QUADRANTS.map((q) => (
            <MatrixQuadrant
              key={q}
              quadrant={q}
              tasks={tasksByQuadrant[q]}
              onAdd={setModalQuadrant}
            />
          ))}
        </div>
      </DndContext>

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
