'use client';

import { useState, useRef, useEffect } from 'react';
import { useUpdateTask, useDeleteTask } from '@/lib/hooks';
import type { Task } from '@/types';

const BADGE_COLORS: Record<string, string> = {
  A: 'rgba(180,25,70,0.6)',
  B: 'rgba(25,110,55,0.6)',
  C: 'rgba(180,90,10,0.6)',
  D: 'rgba(70,70,90,0.6)',
};

export function TaskItem({ task }: { task: Task }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  useEffect(() => {
    if (editing) inputRef.current?.focus();
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

  function toggleComplete() {
    updateTask.mutate({ id: task.id, data: { completed: !task.completed } });
  }

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: 10,
        opacity: task.completed ? 0.6 : 1,
        listStyle: 'none',
      }}
    >
      {/* Checkbox */}
      <div
        onClick={toggleComplete}
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: task.completed ? 'none' : '2px solid rgba(255,255,255,0.7)',
          background: task.completed ? 'rgba(255,255,255,0.85)' : 'transparent',
          flexShrink: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {task.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Text / edit input */}
      {editing ? (
        <input
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'white',
            fontSize: 14,
          }}
        />
      ) : (
        <span
          style={{
            flex: 1,
            color: 'rgba(255,255,255,0.85)',
            fontSize: 14,
            textDecoration: task.completed ? 'line-through' : 'none',
            cursor: 'default',
          }}
          onDoubleClick={startEdit}
          title="Double-click to edit"
        >
          {task.text}
        </span>
      )}

      {/* Quadrant badge */}
      {task.quadrant && (
        <span
          style={{
            padding: '2px 6px',
            borderRadius: 5,
            background: BADGE_COLORS[task.quadrant],
            color: 'white',
            fontSize: 11,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {task.quadrant}
        </span>
      )}

      {/* Edit button */}
      <button
        onClick={startEdit}
        style={{
          width: 28,
          height: 28,
          borderRadius: 5,
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        title="Edit task"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M8.5 1.5l2 2L3 11H1v-2L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Delete button */}
      <button
        onClick={() => deleteTask.mutate(task.id)}
        style={{
          width: 28,
          height: 28,
          borderRadius: 5,
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        title="Delete task"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1.5 3h9M4 3V2h4v1M5 5.5v4M7 5.5v4M2.5 3l.8 7.5h5.4L9.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </li>
  );
}
