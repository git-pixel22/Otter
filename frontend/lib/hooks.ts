import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiPatch, apiDelete } from './api';
import type { Task, TaskCreate, TaskUpdate, TaskListResponse } from '@/types';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => apiGet<TaskListResponse>('/tasks').then((r) => r.tasks),
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: TaskCreate) => apiPost<Task>('/tasks', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskUpdate }) =>
      apiPatch<Task>(`/tasks/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/tasks/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}
