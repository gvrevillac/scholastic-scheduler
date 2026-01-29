import { Hono } from "hono";
import type { Env } from './core-utils';
import { ScheduleEntryEntity, ClassroomEntity, TeacherEntity, SubjectEntity, TimeSlotEntity } from "./scheduler-entities";
import { ok, bad, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // CRUD helper generator
  const registerCrud = (path: string, entity: any) => {
    app.get(path, async (c) => {
      await entity.ensureSeed(c.env);
      const page = await entity.list(c.env);
      return ok(c, page.items);
    });
    app.post(path, async (c) => {
      const data = await c.req.json();
      if (!data.id) {
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
  // Resources
  registerCrud('/api/classrooms', ClassroomEntity);
  registerCrud('/api/teachers', TeacherEntity);
  registerCrud('/api/subjects', SubjectEntity);
  registerCrud('/api/time-slots', TimeSlotEntity);
  registerCrud('/api/schedule-entries', ScheduleEntryEntity);
  // Bulk operation for Excel Imports
  app.post('/api/schedule-entries/bulk', async (c) => {
    const entries = await c.req.json<any[]>();
    if (!Array.isArray(entries)) return bad(c, 'Expected array');
    const results = await Promise.all(entries.map(e => {
      const id = e.id || `${e.classroomId}_${e.timeSlotId}`;
      return ScheduleEntryEntity.create(c.env, { ...e, id });
    }));
    return ok(c, results);
  });
  // Clear all for resets
  app.delete('/api/schedule-entries/all', async (c) => {
    const page = await ScheduleEntryEntity.list(c.env);
    const ids = page.items.map(i => i.id);
    await ScheduleEntryEntity.deleteMany(c.env, ids);
    return ok(c, { count: ids.length });
  });
}