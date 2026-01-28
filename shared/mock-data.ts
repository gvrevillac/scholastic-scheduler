import { Classroom, Subject, Teacher, TimeSlot, MasterScheduleEntry } from './types';
export const CLASSROOMS: Classroom[] = [
  { id: '1a', name: 'Grade 1-A' },
  { id: '1b', name: 'Grade 1-B' },
  { id: '2a', name: 'Grade 2-A' },
  { id: '2b', name: 'Grade 2-B' },
  { id: '3a', name: 'Grade 3-A' },
];
export const SUBJECTS: Subject[] = [
  { id: 'math', name: 'Mathematics', color: '#4f46e5' },
  { id: 'sci', name: 'Science', color: '#10b981' },
  { id: 'eng', name: 'English', color: '#f59e0b' },
  { id: 'hist', name: 'History', color: '#ef4444' },
  { id: 'art', name: 'Arts', color: '#ec4899' },
  { id: 'phys', name: 'Physical Ed', color: '#8b5cf6' },
  { id: 'mus', name: 'Music', color: '#06b6d4' },
  { id: 'comp', name: 'Computer Sci', color: '#3b82f6' },
];
export const TEACHERS: Teacher[] = [
  { id: 't1', name: 'Mr. Anderson', specialty: 'Mathematics' },
  { id: 't2', name: 'Ms. Baker', specialty: 'Science' },
  { id: 't3', name: 'Mr. Collins', specialty: 'English' },
  { id: 't4', name: 'Ms. Davis', specialty: 'History' },
  { id: 't5', name: 'Mr. Evans', specialty: 'Arts' },
  { id: 't6', name: 'Ms. Foster', specialty: 'Physical Ed' },
];
export const TIME_SLOTS: TimeSlot[] = [
  { id: 'mon1', day: 'Monday', startTime: '08:00', endTime: '09:00' },
  { id: 'mon2', day: 'Monday', startTime: '09:00', endTime: '10:00' },
  { id: 'tue1', day: 'Tuesday', startTime: '08:00', endTime: '09:00' },
  { id: 'tue2', day: 'Tuesday', startTime: '09:00', endTime: '10:00' },
  { id: 'wed1', day: 'Wednesday', startTime: '08:00', endTime: '09:00' },
  { id: 'wed2', day: 'Wednesday', startTime: '09:00', endTime: '10:00' },
];
// Master Schedule: When each subject happens for each class
export const MASTER_SCHEDULE: MasterScheduleEntry[] = [
  // Grade 1-A
  { classroomId: '1a', subjectId: 'math', timeSlotId: 'mon1' },
  { classroomId: '1a', subjectId: 'eng', timeSlotId: 'mon2' },
  { classroomId: '1a', subjectId: 'sci', timeSlotId: 'tue1' },
  // Grade 1-B
  { classroomId: '1b', subjectId: 'sci', timeSlotId: 'mon1' },
  { classroomId: '1b', subjectId: 'math', timeSlotId: 'mon2' },
  { classroomId: '1b', subjectId: 'hist', timeSlotId: 'tue1' },
  // Grade 2-A
  { classroomId: '2a', subjectId: 'art', timeSlotId: 'mon1' },
  { classroomId: '2a', subjectId: 'mus', timeSlotId: 'mon2' },
  { classroomId: '2a', subjectId: 'phys', timeSlotId: 'wed1' },
];
export const MOCK_USERS = [];
export const MOCK_CHATS = [];
export const MOCK_CHAT_MESSAGES = [];