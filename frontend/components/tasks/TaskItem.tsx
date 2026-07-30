'use client';

import { useEffect, useRef, useState } from 'react';
import { useDeleteTask, useUpdateTask } from '@/lib/hooks';
import { CheckIcon, PencilIcon, TrashIcon } from '@/components/ui/Icons';
import type { Task } from '@/types';

export function TaskItem({ task, index = 0 }: { task: Task; index?: number }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function startEdit() {
    setEditText(task.text);
    setEditing(true);
  }

  function commitEdit() {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== task.text) {
      updateTask.mutate({ id: task.id, data: { text: trimmed } });
    }
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') setEditing(false);
  }

  const quadrantKey = task.quadrant?.toLowerCase();

  return (
    <li
      className="animate-pop group flex items-center gap-3 rounded-xl border p-2.5 pl-3 transition-colors duration-200"
      style={{
        background: 'var(--surface-sunk)',
        // Stagger entrance so a restored list cascades instead of snapping in.
        animationDelay: `${Math.min(index, 10) * 35}ms`,
      }}
    >
      {/* Complete toggle */}
      <button
        type="button"
        onClick={() => updateTask.mutate({ id: task.id, data: { completed: !task.completed } })}
        aria-label={task.completed ? `Mark "${task.text}" as not done` : `Mark "${task.text}" as done`}
        aria-pressed={task.completed}
        className="relative flex shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-90"
        style={{
          width: 22,
          height: 22,
          borderColor: task.completed ? 'var(--primary)' : 'var(--border-strong)',
          background: task.completed ? 'var(--primary)' : 'transparent',
          color: 'var(--on-primary)',
        }}
      >
        {task.completed && <CheckIcon size={12} />}
        {/* keeps the tap target at 44px without inflating the visual dot */}
        <span className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2" />
      </button>

      {/* Text / edit field */}
      {editing ? (
        <input
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          aria-label="Edit task"
          maxLength={200}
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none"
          style={{ color: 'var(--text)' }}
        />
      ) : (
        <span
          className="task-text min-w-0 flex-1 cursor-text text-[15px] leading-snug"
          data-done={task.completed}
          style={{ color: task.completed ? 'var(--text-muted)' : 'var(--text)' }}
          onDoubleClick={startEdit}
          title="Double-click to edit"
        >
          {task.text}
        </span>
      )}

      {/* Quadrant badge */}
      {task.quadrant && (
        <span
          className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-bold"
          style={{
            background: `rgba(var(--q-${quadrantKey}-tint), 0.2)`,
            color: `var(--q-${quadrantKey}-ink)`,
          }}
          title={`Quadrant ${task.quadrant}`}
        >
          {task.quadrant}
        </span>
      )}

      {/* Actions — always reachable, emphasised on hover/focus */}
      <div className="flex shrink-0 items-center opacity-60 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={startEdit}
          className="icon-btn"
          style={{ width: 30, height: 30 }}
          aria-label={`Edit "${task.text}"`}
        >
          <PencilIcon size={14} />
        </button>
        <button
          type="button"
          onClick={() => deleteTask.mutate(task.id)}
          className="icon-btn hover:!text-[color:var(--accent)]"
          style={{ width: 30, height: 30 }}
          aria-label={`Delete "${task.text}"`}
        >
          <TrashIcon size={14} />
        </button>
      </div>
    </li>
  );
}
