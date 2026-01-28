export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
export interface TimeSlot {
  id: string;
  day: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}
export interface Subject {
  id: string;
  name: string;
  color: string;
}
export interface Classroom {
  id: string;
  name: string;
}
export interface Teacher {
  id: string;
  name: string;
  specialty: string;
}
export interface MasterScheduleEntry {
  classroomId: string;
  subjectId: string;
  timeSlotId: string;
}
export interface Assignment {
  id: string; // combination of classroomId_subjectId
  classroomId: string;
  subjectId: string;
  teacherId: string;
}
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}