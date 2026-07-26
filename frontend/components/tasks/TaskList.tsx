'use client';

import { useEffect, useState } from 'react';
import { useTasks } from '@/lib/hooks';
import { TaskItem } from './TaskItem';
import { TaskInput } from './TaskInput';
import { FilterBar } from './FilterBar';
import { Confetti } from '@/components/ui/Confetti';
import type { QuadrantFilter } from '@/types';

export function TaskList() {
  const { data: tasks = [], isLoading } = useTasks();
  const [filter, setFilter] = useState<QuadrantFilter>('all');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (tasks.length > 0 && tasks.every((t) => t.completed)) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [tasks]);

  const visible = filter === 'all' ? tasks : tasks.filter((t) => t.quadrant === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Confetti active={showConfetti} />
      <TaskInput />
      <FilterBar active={filter} onChange={setFilter} />

      {isLoading ? (
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>
          Loading…
        </p>
      ) : visible.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '32px 0', color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ fontSize: 40 }}>🦦</span>
          <span style={{ fontSize: 13 }}>
            {filter === 'all' ? 'No tasks yet — add one above' : `No tasks in quadrant ${filter}`}
          </span>
        </div>
      ) : (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 0, margin: 0 }}>
          {visible.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}
    </div>
  );
}
