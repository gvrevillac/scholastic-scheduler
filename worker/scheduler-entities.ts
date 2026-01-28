import { IndexedEntity } from "./core-utils";
import { Assignment } from "@shared/types";
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