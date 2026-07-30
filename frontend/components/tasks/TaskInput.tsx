'use client';

import { useState } from 'react';
import { useCreateTask } from '@/lib/hooks';
import { PlusIcon } from '@/components/ui/Icons';
import type { Quadrant } from '@/types';

export function TaskInput({
  quadrant,
  autoFocus = false,
  placeholder = 'What needs doing?',
}: {
  quadrant?: Quadrant | null;
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const [text, setText] = useState('');
  const createTask = useCreateTask();
  const trimmed = text.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trimmed) return;
    createTask.mutate({ text: trimmed, quadrant: quadrant ?? null });
    setText('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <label htmlFor="new-task" className="sr-only">
        New task
      </label>
      <input
        id="new-task"
        name="new-task"
        type="text"
        className="field"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus={autoFocus}
        autoComplete="off"
        maxLength={200}
        style={{ minHeight: 44 }}
      />
      <button
        type="submit"
        className="btn btn-primary shrink-0"
        disabled={!trimmed || createTask.isPending}
        aria-label="Add task"
        style={{ width: 44, height: 44 }}
      >
        <PlusIcon size={20} />
      </button>
    </form>
  );
}
