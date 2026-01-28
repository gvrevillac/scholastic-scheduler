import { create } from 'zustand';
import { Assignment, MasterScheduleEntry, TimeSlot } from '@shared/types';
import { api } from '@/lib/api-client';
import { MASTER_SCHEDULE, TIME_SLOTS } from '@shared/mock-data';
export interface ResolvedEntry {
  classroomId: string;
  subjectId: string;
  timeSlotId: string;
  teacherId?: string;
}
export interface Conflict {
  teacherId: string;
  timeSlotId: string;
  classroomIds: string[];
}
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
// Selectors for resolved schedule and conflict detection
export const getResolvedSchedule = (assignments: Assignment[]): ResolvedEntry[] => {
  return MASTER_SCHEDULE.map(master => {
    const assignment = assignments.find(
      a => a.classroomId === master.classroomId && a.subjectId === master.subjectId
    );
    return {
      ...master,
      teacherId: assignment?.teacherId
    };
  });
};
export const getConflicts = (assignments: Assignment[]): Conflict[] => {
  const resolved = getResolvedSchedule(assignments);
  const teacherTimeMap: Record<string, Record<string, string[]>> = {};
  resolved.forEach(entry => {
    if (!entry.teacherId) return;
    if (!teacherTimeMap[entry.teacherId]) teacherTimeMap[entry.teacherId] = {};
    if (!teacherTimeMap[entry.teacherId][entry.timeSlotId]) {
      teacherTimeMap[entry.teacherId][entry.timeSlotId] = [];
    }
    teacherTimeMap[entry.teacherId][entry.timeSlotId].push(entry.classroomId);
  });
  const conflicts: Conflict[] = [];
  Object.entries(teacherTimeMap).forEach(([teacherId, timeSlots]) => {
    Object.entries(timeSlots).forEach(([timeSlotId, classroomIds]) => {
      if (classroomIds.length > 1) {
        conflicts.push({ teacherId, timeSlotId, classroomIds });
      }
    });
  });
  return conflicts;
};