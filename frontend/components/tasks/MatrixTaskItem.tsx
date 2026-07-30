'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useUpdateTask } from '@/lib/hooks';
import { CheckIcon, CloseIcon } from '@/components/ui/Icons';
import type { Task } from '@/types';

export function MatrixTaskItem({ task }: { task: Task }) {
  const updateTask = useUpdateTask();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors duration-200"
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.35 : 1,
        background: 'var(--surface-raised)',
        // While dragging, this element must sit above sibling quadrants.
        zIndex: isDragging ? 20 : undefined,
        position: 'relative',
      }}
    >
      <button
        type="button"
        onClick={() => updateTask.mutate({ id: task.id, data: { completed: !task.completed } })}
        aria-label={task.completed ? `Mark "${task.text}" as not done` : `Mark "${task.text}" as done`}
        aria-pressed={task.completed}
        className="flex shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-90"
        style={{
          width: 16,
          height: 16,
          borderColor: task.completed ? 'var(--primary)' : 'var(--border-strong)',
          background: task.completed ? 'var(--primary)' : 'transparent',
          color: 'var(--on-primary)',
        }}
      >
        {task.completed && <CheckIcon size={9} />}
      </button>

      {/* The text doubles as the drag handle, so the buttons stay tappable.
          dnd-kit's attributes make this keyboard-draggable too. */}
      <span
        {...listeners}
        {...attributes}
        className="task-text line-clamp-2 min-w-0 flex-1 text-xs leading-snug"
        data-done={task.completed}
        style={{
          color: task.completed ? 'var(--text-muted)' : 'var(--text)',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
        title={task.text}
      >
        {task.text}
      </span>

      <button
        type="button"
        onClick={() => updateTask.mutate({ id: task.id, data: { quadrant: null } })}
        className="icon-btn shrink-0"
        style={{ width: 22, height: 22 }}
        aria-label={`Remove "${task.text}" from this quadrant`}
        title="Remove from quadrant"
      >
        <CloseIcon size={12} />
      </button>
    </div>
  );
}
