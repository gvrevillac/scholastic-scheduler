import { IndexedEntity } from "./core-utils";
import { Assignment } from "@shared/types";
export class AssignmentEntity extends IndexedEntity<Assignment> {
  static readonly entityName = "assignment";
  static readonly indexName = "assignments";
  static readonly initialState: Assignment = { id: "", classroomId: "", subjectId: "", teacherId: "" };
  static keyOf(state: Assignment): string {
    return `${state.classroomId}_${state.subjectId}`;
  }
}