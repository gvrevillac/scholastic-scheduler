import { create } from 'zustand';
import { Assignment } from '@shared/types';
import { api } from '@/lib/api-client';
interface SchedulerState {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  fetchAssignments: () => Promise<void>;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => Promise<void>;
  removeAssignment: (id: string) => Promise<void>;
}
export const useSchedulerStore = create<SchedulerState>((set, get) => ({
  assignments: [],
  loading: false,
  error: null,
  fetchAssignments: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api<Assignment[]>('/api/assignments');
      set({ assignments: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  addAssignment: async (payload) => {
    set({ loading: true, error: null });
    try {
      const newAssignment = await api<Assignment>('/api/assignments', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const current = get().assignments;
      const filtered = current.filter(a => a.id !== newAssignment.id);
      set({ assignments: [...filtered, newAssignment], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  removeAssignment: async (id) => {
    set({ loading: true, error: null });
    try {
      await api(`/api/assignments/${id}`, { method: 'DELETE' });
      set({
        assignments: get().assignments.filter((a) => a.id !== id),
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));