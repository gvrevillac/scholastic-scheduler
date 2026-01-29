import { IndexedEntity } from "./core-utils";
import { ScheduleEntry, Classroom, Subject, Teacher, TimeSlot } from "@shared/types";
import { CLASSROOMS, SUBJECTS, TEACHERS, TIME_SLOTS, MASTER_SCHEDULE } from "@shared/mock-data";
export class ScheduleEntryEntity extends IndexedEntity<ScheduleEntry> {
  static readonly entityName = "scheduleentry";
  static readonly indexName = "scheduleentries";
  static readonly initialState: ScheduleEntry = { 
    id: "", 
    classroomId: "", 
    timeSlotId: "", 
    subjectId: "", 
    teacherId: "" 
  };
  // Migrate legacy mock data to unified entries
  static seedData = MASTER_SCHEDULE.map(m => ({
    id: `${m.classroomId}_${m.timeSlotId}`,
    classroomId: m.classroomId,
    timeSlotId: m.timeSlotId,
    subjectId: m.subjectId,
    teacherId: "" // Initially unassigned
  }));
  static keyOf<U extends { id: string }>(state: U): string {
    const s = state as unknown as ScheduleEntry;
    if (s.classroomId && s.timeSlotId) {
      return `${s.classroomId}_${s.timeSlotId}`;
    }
    return s.id;
  }
}
export class ClassroomEntity extends IndexedEntity<Classroom> {
  static readonly entityName = "classroom";
  static readonly indexName = "classrooms";
  static readonly initialState: Classroom = { id: "", name: "" };
  static seedData = CLASSROOMS;
}
export class TeacherEntity extends IndexedEntity<Teacher> {
  static readonly entityName = "teacher";
  static readonly indexName = "teachers";
  static readonly initialState: Teacher = { id: "", name: "", specialty: "" };
  static seedData = TEACHERS;
}
export class SubjectEntity extends IndexedEntity<Subject> {
  static readonly entityName = "subject";
  static readonly indexName = "subjects";
  static readonly initialState: Subject = { id: "", name: "", color: "#000000" };
  static seedData = SUBJECTS;
}
export class TimeSlotEntity extends IndexedEntity<TimeSlot> {
  static readonly entityName = "timeslot";
  static readonly indexName = "timeslots";
  static readonly initialState: TimeSlot = { id: "", day: "Monday", startTime: "08:00", endTime: "09:00" };
  static seedData = TIME_SLOTS;
}