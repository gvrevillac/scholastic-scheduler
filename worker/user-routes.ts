import { Hono } from "hono";
import type { Env } from './core-utils';
import { AssignmentEntity } from "./scheduler-entities";
import { ok, bad, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/assignments', async (c) => {
    const page = await AssignmentEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post('/api/assignments', async (c) => {
    const body = await c.req.json();
    const { classroomId, subjectId, teacherId } = body;
    if (!isStr(classroomId) || !isStr(subjectId) || !isStr(teacherId)) {
      return bad(c, 'classroomId, subjectId, and teacherId are required');
    }
    const id = `${classroomId}_${subjectId}`;
    const assignment = await AssignmentEntity.create(c.env, { id, classroomId, subjectId, teacherId });
    return ok(c, assignment);
  });
  app.delete('/api/assignments/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await AssignmentEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
}