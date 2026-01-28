import React, { useMemo } from 'react';
import { useSchedulerStore, getResolvedSchedule, getConflicts } from '@/store/scheduler-store';
import { CLASSROOMS, SUBJECTS, TEACHERS, TIME_SLOTS } from '@shared/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConflictBadge } from './ConflictBadge';
import { Calendar, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
export function ScheduleVisualizer() {
  const assignments = useSchedulerStore(s => s.assignments);
  const resolved = useMemo(() => getResolvedSchedule(assignments), [assignments]);
  const conflicts = useMemo(() => getConflicts(assignments), [assignments]);
  const findConflict = (teacherId?: string, timeSlotId?: string) => {
    if (!teacherId || !timeSlotId) return null;
    return conflicts.find(c => c.teacherId === teacherId && c.timeSlotId === timeSlotId);
  };
  return (
    <Card className="shadow-soft border-none bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-xl">Visualization Engine</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="time" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-secondary/30">
            <TabsTrigger value="time" className="gap-2"><Clock className="w-4 h-4" /> Time Grid</TabsTrigger>
            <TabsTrigger value="classroom" className="gap-2"><Users className="w-4 h-4" /> By Class</TabsTrigger>
            <TabsTrigger value="teacher" className="gap-2"><Calendar className="w-4 h-4" /> By Teacher</TabsTrigger>
          </TabsList>
          <TabsContent value="time" className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-40 bg-slate-50 dark:bg-slate-900 sticky left-0 z-10">Time Slot</TableHead>
                  {CLASSROOMS.map(c => (
                    <TableHead key={c.id} className="min-w-[180px] text-center">{c.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {TIME_SLOTS.map(slot => (
                  <TableRow key={slot.id}>
                    <TableCell className="font-medium bg-slate-50 dark:bg-slate-900 sticky left-0 z-10 border-r">
                      <div className="text-xs text-muted-foreground">{slot.day}</div>
                      <div>{slot.startTime} - {slot.endTime}</div>
                    </TableCell>
                    {CLASSROOMS.map(classroom => {
                      const entry = resolved.find(e => e.timeSlotId === slot.id && e.classroomId === classroom.id);
                      if (!entry) return <TableCell key={classroom.id} className="bg-slate-50/30" />;
                      const subject = SUBJECTS.find(s => s.id === entry.subjectId);
                      const teacher = TEACHERS.find(t => t.id === entry.teacherId);
                      const conflict = findConflict(entry.teacherId, entry.timeSlotId);
                      return (
                        <TableCell key={classroom.id} className="p-2">
                          <div className={cn(
                            "rounded-md p-3 h-full border-l-4",
                            conflict ? "bg-destructive/5 border-destructive" : "bg-white dark:bg-slate-800 border-indigo-500 shadow-sm"
                          )}>
                            <div className="font-bold text-sm" style={{ color: subject?.color }}>{subject?.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center justify-between mt-1">
                              {teacher?.name || <span className="italic opacity-50">Unassigned</span>}
                              {conflict && <ConflictBadge otherClassroomIds={conflict.classroomIds.filter(id => id !== classroom.id)} />}
                            </div>
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="classroom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CLASSROOMS.map(classroom => (
                <Card key={classroom.id} className="border bg-slate-50/30 dark:bg-slate-900/30">
                  <CardHeader className="py-3 bg-white dark:bg-slate-800 border-b">
                    <CardTitle className="text-sm font-bold">{classroom.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2">
                    {TIME_SLOTS.map(slot => {
                      const entry = resolved.find(e => e.timeSlotId === slot.id && e.classroomId === classroom.id);
                      if (!entry) return null;
                      const subject = SUBJECTS.find(s => s.id === entry.subjectId);
                      const teacher = TEACHERS.find(t => t.id === entry.teacherId);
                      const conflict = findConflict(entry.teacherId, entry.timeSlotId);
                      return (
                        <div key={slot.id} className="flex flex-col p-2 bg-white dark:bg-slate-800 rounded border shadow-xs">
                          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                            <span>{slot.day}</span>
                            <span>{slot.startTime}-{slot.endTime}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-xs" style={{ color: subject?.color }}>{subject?.name}</span>
                            <span className="text-[11px] font-medium">{teacher?.name || '?'}</span>
                          </div>
                          {conflict && (
                            <div className="mt-1 pt-1 border-t border-destructive/10">
                              <ConflictBadge otherClassroomIds={conflict.classroomIds.filter(id => id !== classroom.id)} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="teacher">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TEACHERS.map(teacher => {
                const teacherSchedule = resolved.filter(r => r.teacherId === teacher.id);
                return (
                  <Card key={teacher.id} className="border">
                    <CardHeader className="py-3 bg-indigo-50 dark:bg-indigo-950/30">
                      <CardTitle className="text-sm font-bold">{teacher.name} <span className="text-xs font-normal opacity-70">({teacher.specialty})</span></CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {teacherSchedule.length > 0 ? (
                        <Table>
                          <TableBody>
                            {teacherSchedule.map((entry, idx) => {
                              const slot = TIME_SLOTS.find(t => t.id === entry.timeSlotId);
                              const classroom = CLASSROOMS.find(c => c.id === entry.classroomId);
                              const conflict = findConflict(teacher.id, entry.timeSlotId);
                              return (
                                <TableRow key={idx}>
                                  <TableCell className="py-2 text-[11px] font-medium">{slot?.day} {slot?.startTime}</TableCell>
                                  <TableCell className="py-2 text-[11px]">{classroom?.name}</TableCell>
                                  <TableCell className="py-2 text-right">
                                    {conflict && <ConflictBadge otherClassroomIds={conflict.classroomIds.filter(id => id !== entry.classroomId)} />}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="p-8 text-center text-xs text-muted-foreground italic">No assignments yet</div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}