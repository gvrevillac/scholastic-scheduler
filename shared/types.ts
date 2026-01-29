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
/**
 * Unified model for a lesson slot
 * Represents a specific subject taught by a teacher in a classroom at a specific time
 */
export interface ScheduleEntry {
  id: string; // formatted as classroomId_timeSlotId
  classroomId: string;
  timeSlotId: string;
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