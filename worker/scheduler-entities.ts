import { IndexedEntity } from "./core-utils";
import { Assignment, Classroom, Subject, Teacher, TimeSlot } from "@shared/types";
import { CLASSROOMS, SUBJECTS, TEACHERS, TIME_SLOTS } from "@shared/mock-data";
export class AssignmentEntity extends IndexedEntity<Assignment> {
  static readonly entityName = "assignment";
  static readonly indexName = "assignments";
  static readonly initialState: Assignment = { id: "", classroomId: "", subjectId: "", teacherId: "" };
  static keyOf<U extends { id: string }>(state: U): string {
    const s = state as unknown as Assignment;
    if (s.classroomId && s.subjectId) {
      return `${s.classroomId}_${s.subjectId}`;
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