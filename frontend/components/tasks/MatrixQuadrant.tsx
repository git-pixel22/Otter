'use client';

import { useDroppable } from '@dnd-kit/core';
import { QUADRANT_META } from '@/types';
import { MatrixTaskItem } from './MatrixTaskItem';
import type { Task, Quadrant } from '@/types';

export function MatrixQuadrant({ quadrant, tasks, onAdd }: { quadrant: Quadrant; tasks: Task[]; onAdd: (q: Quadrant) => void }) {
  const meta = QUADRANT_META[quadrant];
  const { setNodeRef, isOver } = useDroppable({ id: quadrant });

  return (
    <div
      style={{
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.1)',
        background: isOver
          ? meta.bg.replace('0.12)', '0.3)')
          : meta.bg,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 180,
        overflow: 'hidden',
        transition: 'background 0.15s',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <span style={{ fontWeight: 700, color: meta.color, fontSize: 13 }}>{quadrant}</span>
          <span style={{ marginLeft: 6, color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{meta.desc}</span>
        </div>
        <button
          onClick={() => onAdd(quadrant)}
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: 'white',
            fontSize: 16,
            fontWeight: 300,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          +
        </button>
      </div>

      {/* Drop zone */}
      <div ref={setNodeRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, padding: 8 }}>
        {tasks.map((task) => <MatrixTaskItem key={task.id} task={task} />)}
        {tasks.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, textAlign: 'center', padding: '12px 0' }}>
            Drop tasks here
          </p>
        )}
      </div>
    </div>
  );
}
