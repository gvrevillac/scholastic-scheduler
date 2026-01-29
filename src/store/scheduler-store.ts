import { create } from 'zustand';
import { ScheduleEntry, Classroom, Teacher, Subject, TimeSlot } from '@shared/types';
import { api } from '@/lib/api-client';
export interface Conflict {
  teacherId: string;
  timeSlotId: string;
  classroomIds: string[];
}
interface SchedulerState {
  scheduleEntries: ScheduleEntry[];
  classrooms: Classroom[];
  teachers: Teacher[];
  subjects: Subject[];
  timeSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
  fetchResources: () => Promise<void>;
  upsertScheduleEntry: (entry: Omit<ScheduleEntry, 'id'>) => Promise<void>;
  removeScheduleEntry: (id: string) => Promise<void>;
  clearAllScheduleEntries: () => Promise<void>;
  bulkUpsertEntries: (entries: ScheduleEntry[]) => Promise<void>;
  addMaster: (type: string, data: any) => Promise<void>;
  removeMaster: (type: string, id: string) => Promise<void>;
}
export const useSchedulerStore = create<SchedulerState>((set, get) => ({
  scheduleEntries: [],
  classrooms: [],
  teachers: [],
  subjects: [],
  timeSlots: [],
  loading: false,
  error: null,
  fetchResources: async () => {
    set({ loading: true });
    try {
      const [c, t, s, ts, se] = await Promise.all([
        api<Classroom[]>('/api/classrooms'),
        api<Teacher[]>('/api/teachers'),
        api<Subject[]>('/api/subjects'),
        api<TimeSlot[]>('/api/time-slots'),
        api<ScheduleEntry[]>('/api/schedule-entries'),
      ]);
      set({
        classrooms: c,
        teachers: t,
        subjects: s,
        timeSlots: ts,
        scheduleEntries: se,
        loading: false
      });
    } catch (err) {
      set({ error: "Failed to fetch resource library", loading: false });
    }
  },
  upsertScheduleEntry: async (payload) => {
    const id = `${payload.classroomId}_${payload.timeSlotId}`;
    const oldEntries = get().scheduleEntries;
    const newEntry = { ...payload, id };
    set({ scheduleEntries: [...oldEntries.filter(e => e.id !== id), newEntry] });
    try {
      await api<ScheduleEntry>('/api/schedule-entries', {
        method: 'POST',
        body: JSON.stringify(newEntry),
      });
    } catch (err) {
      set({ scheduleEntries: oldEntries });
      throw err;
    }
  },
  removeScheduleEntry: async (id) => {
    const oldEntries = get().scheduleEntries;
    set({ scheduleEntries: oldEntries.filter(e => e.id !== id) });
    try {
      await api(`/api/schedule-entries/${id}`, { method: 'DELETE' });
    } catch (err) {
      set({ scheduleEntries: oldEntries });
      throw err;
    }
  },
  clearAllScheduleEntries: async () => {
    set({ loading: true });
    try {
      await api('/api/schedule-entries/all', { method: 'DELETE' });
      set({ scheduleEntries: [], loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },
  bulkUpsertEntries: async (entries) => {
    set({ loading: true });
    try {
      const results = await api<ScheduleEntry[]>('/api/schedule-entries/bulk', {
        method: 'POST',
        body: JSON.stringify(entries),
      });
      const current = get().scheduleEntries;
      const ids = new Set(results.map(r => r.id));
      set({
        scheduleEntries: [...current.filter(c => !ids.has(c.id)), ...results],
        loading: false
      });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },
  addMaster: async (type, data) => {
    const item = await api<any>(`/api/${type}`, { method: 'POST', body: JSON.stringify(data) });
    const mapping: Record<string, keyof SchedulerState> = {
      'classrooms': 'classrooms',
      'teachers': 'teachers',
      'subjects': 'subjects',
      'time-slots': 'timeSlots',
    };
    const key = mapping[type];
    if (key) set(s => ({ [key]: [...(s[key] as any[]).filter(x => x.id !== item.id), item] } as any));
  },
  removeMaster: async (type, id) => {
    await api(`/api/${type}/${id}`, { method: 'DELETE' });
    const mapping: Record<string, keyof SchedulerState> = {
      'classrooms': 'classrooms',
      'teachers': 'teachers',
      'subjects': 'subjects',
      'time-slots': 'timeSlots',
    };
    const key = mapping[type];
    if (key) set(s => ({ [key]: (s[key] as any[]).filter(x => x.id !== id) } as any));
  }
}));
export const getConflicts = (entries: ScheduleEntry[]): Conflict[] => {
  const teacherTimeMap: Record<string, Record<string, string[]>> = {};
  entries.forEach(entry => {
    if (!entry.teacherId || !entry.timeSlotId) return;
    if (!teacherTimeMap[entry.teacherId]) teacherTimeMap[entry.teacherId] = {};
    if (!teacherTimeMap[entry.teacherId][entry.timeSlotId]) teacherTimeMap[entry.teacherId][entry.timeSlotId] = [];
    if (!teacherTimeMap[entry.teacherId][entry.timeSlotId].includes(entry.classroomId)) {
      teacherTimeMap[entry.teacherId][entry.timeSlotId].push(entry.classroomId);
    }
  });
  const conflicts: Conflict[] = [];
  Object.entries(teacherTimeMap).forEach(([teacherId, slots]) => {
    Object.entries(slots).forEach(([timeSlotId, classroomIds]) => {
      if (classroomIds.length > 1) conflicts.push({ teacherId, timeSlotId, classroomIds });
    });
  });
  return conflicts;
};