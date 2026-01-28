import { Hono } from "hono";
import type { Env } from './core-utils';
import { AssignmentEntity, ClassroomEntity, TeacherEntity, SubjectEntity, TimeSlotEntity, MasterScheduleEntity } from "./scheduler-entities";
import { ok, bad, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Assignments
  app.get('/api/assignments', async (c) => {
    const page = await AssignmentEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post('/api/assignments', async (c) => {
    const body = await c.req.json();
    const { classroomId, subjectId, teacherId } = body;
    if (!isStr(classroomId) || !isStr(subjectId) || !isStr(teacherId)) return bad(c, 'Missing required fields');
    const id = `${classroomId}_${subjectId}`;
    const assignment = await AssignmentEntity.create(c.env, { id, classroomId, subjectId, teacherId });
    return ok(c, assignment);
  });
  app.delete('/api/assignments/:id', async (c) => {
    const id = c.req.param('id');
    await AssignmentEntity.delete(c.env, id);
    return ok(c, { id });
  });
  // Resource CRUD helper generator
  const registerCrud = (path: string, entity: any) => {
    app.get(path, async (c) => {
      await entity.ensureSeed(c.env);
      const page = await entity.list(c.env);
      return ok(c, page.items);
    });
    app.post(path, async (c) => {
      const data = await c.req.json();
      if (!data.id) {
        // Use custom keyOf if available, else random
        data.id = entity.keyOf ? entity.keyOf(data) : crypto.randomUUID();
      }
      const item = await entity.create(c.env, data);
      return ok(c, item);
    });
    app.delete(`${path}/:id`, async (c) => {
      const id = c.req.param('id');
      await entity.delete(c.env, id);
      return ok(c, { id });
    });
  };
  registerCrud('/api/classrooms', ClassroomEntity);
  registerCrud('/api/teachers', TeacherEntity);
  registerCrud('/api/subjects', SubjectEntity);
  registerCrud('/api/time-slots', TimeSlotEntity);
  registerCrud('/api/master-schedules', MasterScheduleEntity);
}