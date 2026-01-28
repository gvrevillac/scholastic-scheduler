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
      set({ assignments: data ?? [], loading: false });
    } catch (err: any) {
      console.error('[Store] Fetch failed:', err);
      set({ error: "Could not sync assignments from server.", loading: false });
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
      // Filter out any existing assignment for the same slot (UPSERT)
      const filtered = current.filter(a => a.id !== newAssignment.id);
      set({ assignments: [...filtered, newAssignment], loading: false });
    } catch (err: any) {
      console.error('[Store] Save failed:', err);
      set({ error: "Unable to save assignment. Please try again.", loading: false });
      throw err;
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
      console.error('[Store] Delete failed:', err);
      set({ error: "Failed to remove assignment.", loading: false });
      throw err;
    }
  },
}));
/**
 * Derives a full schedule by merging master schedule slots with dynamic teacher assignments.
 */
export const getResolvedSchedule = (assignments: Assignment[]): ResolvedEntry[] => {
  if (!assignments) return MASTER_SCHEDULE.map(m => ({ ...m }));
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
/**
 * Identifies instances where a teacher is assigned to multiple classes in the same time slot.
 */
export const getConflicts = (assignments: Assignment[]): Conflict[] => {
  const resolved = getResolvedSchedule(assignments);
  const teacherTimeMap: Record<string, Record<string, string[]>> = {};
  resolved.forEach(entry => {
    if (!entry.teacherId || !entry.timeSlotId) return;
    if (!teacherTimeMap[entry.teacherId]) {
      teacherTimeMap[entry.teacherId] = {};
    }
    if (!teacherTimeMap[entry.teacherId][entry.timeSlotId]) {
      teacherTimeMap[entry.teacherId][entry.timeSlotId] = [];
    }
    // Check if classroom is already tracked to avoid duplicate entries from master schedule repeats
    if (!teacherTimeMap[entry.teacherId][entry.timeSlotId].includes(entry.classroomId)) {
      teacherTimeMap[entry.teacherId][entry.timeSlotId].push(entry.classroomId);
    }
  });
  const conflicts: Conflict[] = [];
  Object.entries(teacherTimeMap).forEach(([teacherId, slots]) => {
    Object.entries(slots).forEach(([timeSlotId, classroomIds]) => {
      if (classroomIds.length > 1) {
        conflicts.push({ teacherId, timeSlotId, classroomIds });
      }
    });
  });
  return conflicts;
};