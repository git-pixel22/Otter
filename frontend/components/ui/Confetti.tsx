'use client';

import { useEffect, useState } from 'react';

const COLORS = ['#b4193e', '#196e37', '#b45a0a', '#464659', '#f59e0b', '#3b82f6', '#ec4899'];

interface Piece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

export function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!active) { setPieces([]); return; }
    setPieces(
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 6,
        delay: Math.random() * 1.5,
        duration: 2 + Math.random() * 2,
      }))
    );
  }, [active]);

  if (!pieces.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm animate-bounce"
          style={{
            left: `${p.x}%`,
            top: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `fall ${p.duration}s ${p.delay}s linear forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
