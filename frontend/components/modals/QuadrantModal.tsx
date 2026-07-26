'use client';

import { useState, useRef, useEffect } from 'react';
import { useCreateTask, useUpdateTask } from '@/lib/hooks';
import { QUADRANT_META } from '@/types';
import type { Task, Quadrant } from '@/types';

export function QuadrantModal({ quadrant, allTasks, onClose }: { quadrant: Quadrant; allTasks: Task[]; onClose: () => void }) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const meta = QUADRANT_META[quadrant];

  const unassigned = allTasks.filter((t) => t.quadrant === null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    createTask.mutate({ text: trimmed, quadrant }, { onSuccess: onClose });
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 360,
          background: 'rgba(30,28,26,0.95)',
          border: `1px solid ${meta.border}`,
          borderRadius: 16,
          padding: 20,
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: meta.color, fontWeight: 700, fontSize: 14 }}>
            Quadrant {quadrant} — {meta.desc}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14 }}>✕</button>
        </div>

        <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8 }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="New task…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 10,
              padding: '8px 12px',
              color: 'white',
              fontSize: 13,
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={!text.trim()}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              border: 'none',
              background: meta.color,
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              opacity: !text.trim() ? 0.4 : 1,
            }}
          >
            Add
          </button>
        </form>

        {unassigned.length > 0 && (
          <div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 6 }}>Assign unassigned task:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 200, overflowY: 'auto' }}>
              {unassigned.map((t) => (
                <div
                  key={t.id}
                  onClick={() => updateTask.mutate({ id: t.id, data: { quadrant } }, { onSuccess: onClose })}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 8,
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: 13,
                    cursor: 'pointer',
                    opacity: t.completed ? 0.5 : 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{t.text}</span>
                  <span style={{ color: meta.color, fontSize: 11 }}>assign →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {unassigned.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center' }}>No unassigned tasks</p>
        )}
      </div>
    </div>
  );
}
