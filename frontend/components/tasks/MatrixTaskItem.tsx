'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useUpdateTask } from '@/lib/hooks';
import type { Task } from '@/types';

export function MatrixTaskItem({ task }: { task: Task }) {
  const updateTask = useUpdateTask();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.4 : task.completed ? 0.55 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        background: 'rgba(255,255,255,0.12)',
        borderRadius: 8,
      }}
    >
      <div
        onClick={(e) => { e.stopPropagation(); updateTask.mutate({ id: task.id, data: { completed: !task.completed } }); }}
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          border: task.completed ? 'none' : '1.5px solid rgba(255,255,255,0.6)',
          background: task.completed ? 'rgba(255,255,255,0.8)' : 'transparent',
          flexShrink: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {task.completed && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 4l2 2 4-4" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      <span style={{ flex: 1, color: 'rgba(255,255,255,0.85)', fontSize: 12, textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.text}
      </span>

      <button
        onClick={(e) => { e.stopPropagation(); updateTask.mutate({ id: task.id, data: { quadrant: null } }); }}
        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0, fontSize: 11, lineHeight: 1 }}
        title="Unassign from quadrant"
      >
        ✕
      </button>
    </div>
  );
}
