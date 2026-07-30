export type Quadrant = 'A' | 'B' | 'C' | 'D';
export type QuadrantFilter = 'all' | Quadrant;

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  quadrant: Quadrant | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  text: string;
  quadrant?: Quadrant | null;
}

export interface TaskUpdate {
  text?: string;
  completed?: boolean;
  quadrant?: Quadrant | null;
  position?: number;
}

export const QUADRANT_META: Record<
  Quadrant,
  { desc: string; color: string; bg: string; border: string; badge: string }
> = {
  A: {
    desc: 'Important & Urgent',
    color: 'rgba(180,25,70,1)',
    bg: 'rgba(180,25,70,0.12)',
    border: 'rgba(180,25,70,0.35)',
    badge: 'bg-[rgba(180,25,70,0.25)] text-[rgba(255,120,150,1)]',
  },
  B: {
    desc: 'Important, Not Urgent',
    color: 'rgba(25,110,55,1)',
    bg: 'rgba(25,110,55,0.12)',
    border: 'rgba(25,110,55,0.35)',
    badge: 'bg-[rgba(25,110,55,0.25)] text-[rgba(80,200,120,1)]',
  },
  C: {
    desc: 'Urgent, Not Important',
    color: 'rgba(180,90,10,1)',
    bg: 'rgba(180,90,10,0.12)',
    border: 'rgba(180,90,10,0.35)',
    badge: 'bg-[rgba(180,90,10,0.25)] text-[rgba(255,165,60,1)]',
  },
  D: {
    desc: 'Not Important, Not Urgent',
    color: 'rgba(70,70,90,1)',
    bg: 'rgba(70,70,90,0.12)',
    border: 'rgba(70,70,90,0.35)',
    badge: 'bg-[rgba(70,70,90,0.25)] text-[rgba(160,160,190,1)]',
  },
};
