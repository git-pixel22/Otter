import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task, TaskCreate, TaskUpdate } from '@/types';

const STORAGE_KEY = 'myTasks';
const MAX_TASKS = 30;
const TASKS_QUERY_KEY = ['tasks'];

function readTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as Partial<Task>[];
  const now = new Date().toISOString();
  // Migrate entries saved by older versions of the app (no id/position/timestamps).
  return parsed.map((t, index) => ({
    id: t.id ?? crypto.randomUUID(),
    text: t.text ?? '',
    completed: t.completed ?? false,
    quadrant: t.quadrant ?? null,
    position: t.position ?? index,
    created_at: t.created_at ?? now,
    updated_at: t.updated_at ?? now,
  }));
}

function writeTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function useTasks() {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async () => readTasks(),
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: TaskCreate) => {
      const tasks = readTasks();
      if (tasks.length >= MAX_TASKS) {
        throw new Error('You can have a maximum of 30 tasks at a time.');
      }
      const now = new Date().toISOString();
      const task: Task = {
        id: crypto.randomUUID(),
        text: body.text,
        completed: false,
        quadrant: body.quadrant ?? null,
        position: tasks.length,
        created_at: now,
        updated_at: now,
      };
      writeTasks([...tasks, task]);
      return task;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
    onError: (err: Error) => alert(err.message),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TaskUpdate }) => {
      const tasks = readTasks();
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Task not found');
      const updated: Task = { ...tasks[index], ...data, updated_at: new Date().toISOString() };
      tasks[index] = updated;
      writeTasks(tasks);
      return updated;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      writeTasks(readTasks().filter((t) => t.id !== id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
  });
}
