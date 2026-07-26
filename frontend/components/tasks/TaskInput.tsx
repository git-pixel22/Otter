'use client';

import { useState } from 'react';
import { useCreateTask } from '@/lib/hooks';
import type { Quadrant } from '@/types';

export function TaskInput({ quadrant }: { quadrant?: Quadrant | null }) {
  const [text, setText] = useState('');
  const createTask = useCreateTask();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    createTask.mutate({ text: trimmed, quadrant: quadrant ?? null });
    setText('');
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
      <input
        type="text"
        placeholder="Add a new task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: 16,
          padding: '10px 16px',
          color: 'white',
          fontSize: 14,
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={!text.trim() || createTask.isPending}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'white',
          border: 'none',
          color: '#333',
          fontSize: 22,
          fontWeight: 300,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: !text.trim() ? 0.5 : 1,
          flexShrink: 0,
        }}
      >
        +
      </button>
    </form>
  );
}
