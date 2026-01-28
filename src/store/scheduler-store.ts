import { create } from 'zustand';
import { Assignment, Classroom, Teacher, Subject, TimeSlot, MasterScheduleEntry } from '@shared/types';
import { api } from '@/lib/api-client';
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
  classrooms: Classroom[];
  teachers: Teacher[];
  subjects: Subject[];
  timeSlots: TimeSlot[];
  masterSchedule: MasterScheduleEntry[];
  loading: boolean;
  error: string | null;
  fetchAssignments: () => Promise<void>;
  fetchAllMasters: () => Promise<void>;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => Promise<void>;
  removeAssignment: (id: string) => Promise<void>;
  addMaster: (type: 'classrooms'|'teachers'|'subjects'|'time-slots'|'master-schedules', data: any) => Promise<void>;
  removeMaster: (type: 'classrooms'|'teachers'|'subjects'|'time-slots'|'master-schedules', id: string) => Promise<void>;
}
export const useSchedulerStore = create<SchedulerState>((set, get) => ({
  assignments: [],
  classrooms: [],
  teachers: [],
  subjects: [],
  timeSlots: [],
  masterSchedule: [],
  loading: false,
  error: null,
  fetchAssignments: async () => {
    set({ loading: true });
    try {
      const data = await api<Assignment[]>('/api/assignments');
      set({ assignments: data ?? [], loading: false });
    } catch (err) {
      set({ error: "Failed to fetch assignments", loading: false });
    }
  },
  fetchAllMasters: async () => {
    set({ loading: true });
    try {
      const [c, t, s, ts, ms] = await Promise.all([
        api<Classroom[]>('/api/classrooms'),
        api<Teacher[]>('/api/teachers'),
        api<Subject[]>('/api/subjects'),
        api<TimeSlot[]>('/api/time-slots'),
        api<MasterScheduleEntry[]>('/api/master-schedules'),
      ]);
      set({ classrooms: c, teachers: t, subjects: s, timeSlots: ts, masterSchedule: ms, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch resources", loading: false });
    }
  },
  addAssignment: async (payload) => {
    const id = `${payload.classroomId}_${payload.subjectId}`;
    const newAssignment = await api<Assignment>('/api/assignments', {
      method: 'POST',
      body: JSON.stringify({ ...payload, id }),
    });
    set(s => ({ assignments: [...s.assignments.filter(a => a.id !== id), newAssignment] }));
  },
  removeAssignment: async (id) => {
    await api(`/api/assignments/${id}`, { method: 'DELETE' });
    set(s => ({ assignments: s.assignments.filter(a => a.id !== id) }));
  },
  addMaster: async (type, data) => {
    const item = await api<any>(`/api/${type}`, { method: 'POST', body: JSON.stringify(data) });
    const mapping: Record<string, keyof SchedulerState> = {
      'classrooms': 'classrooms',
      'teachers': 'teachers',
      'subjects': 'subjects',
      'time-slots': 'timeSlots',
      'master-schedules': 'masterSchedule'
    };
    const key = mapping[type];
    set(s => ({ [key]: [...(s[key] as any[]).filter(x => x.id !== item.id), item] } as any));
  },
  removeMaster: async (type, id) => {
    await api(`/api/${type}/${id}`, { method: 'DELETE' });
    const mapping: Record<string, keyof SchedulerState> = {
      'classrooms': 'classrooms',
      'teachers': 'teachers',
      'subjects': 'subjects',
      'time-slots': 'timeSlots',
      'master-schedules': 'masterSchedule'
    };
    const key = mapping[type];
    set(s => ({ [key]: (s[key] as any[]).filter(x => x.id !== id) } as any));
  }
}));
export const getResolvedSchedule = (assignments: Assignment[], masterSchedule: MasterScheduleEntry[]): ResolvedEntry[] => {
  return masterSchedule.map(master => {
    const assignment = assignments.find(
      a => a.classroomId === master.classroomId && a.subjectId === master.subjectId
    );
    return { ...master, teacherId: assignment?.teacherId };
  });
};
export const getConflicts = (assignments: Assignment[], masterSchedule: MasterScheduleEntry[]): Conflict[] => {
  const resolved = getResolvedSchedule(assignments, masterSchedule);
  const teacherTimeMap: Record<string, Record<string, string[]>> = {};
  resolved.forEach(entry => {
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