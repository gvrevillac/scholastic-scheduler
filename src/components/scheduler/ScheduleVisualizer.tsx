import React, { useMemo, useState } from 'react';
import { useSchedulerStore, getConflicts } from '@/store/scheduler-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConflictBadge } from './ConflictBadge';
import { Calendar, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
export function ScheduleVisualizer() {
  const scheduleEntries = useSchedulerStore(s => s.scheduleEntries);
  const classrooms = useSchedulerStore(s => s.classrooms);
  const subjects = useSchedulerStore(s => s.subjects);
  const teachers = useSchedulerStore(s => s.teachers);
  const timeSlots = useSchedulerStore(s => s.timeSlots);
  const [activeTab, setActiveTab] = useState('time');
  const conflicts = useMemo(() => getConflicts(scheduleEntries), [scheduleEntries]);
  const findConflict = (teacherId?: string, timeSlotId?: string) => {
    if (!teacherId || !timeSlotId) return null;
    return conflicts.find(c => c.teacherId === teacherId && c.timeSlotId === timeSlotId);
  };
  return (
    <Card className="shadow-soft border-none bg-card">
      <CardHeader className="pb-7">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" /> Visualization Engine
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-8 bg-secondary/30 rounded-lg p-1">
          {['time', 'classroom', 'teacher'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-all capitalize",
                activeTab === tab ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === 'time' && <Clock className="w-4 h-4 mr-2" />}
              {tab === 'classroom' && <Users className="w-4 h-4 mr-2" />}
              {tab === 'teacher' && <Calendar className="w-4 h-4 mr-2" />}
              {tab}
            </button>
          ))}
        </div>
        {activeTab === 'time' && (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40 sticky left-0 z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Time Slot</TableHead>
                  {classrooms.map(c => <TableHead key={c.id} className="min-w-[180px] text-center border-l">{c.name}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeSlots.map(slot => (
                  <TableRow key={slot.id}>
                    <TableCell className="font-medium sticky left-0 z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r">
                      <div className="text-[10px] text-indigo-600 font-bold uppercase">{slot.day}</div>
                      <div className="text-sm">{slot.startTime} - {slot.endTime}</div>
                    </TableCell>
                    {classrooms.map(classroom => {
                      const entry = scheduleEntries.find(e => e.timeSlotId === slot.id && e.classroomId === classroom.id);
                      if (!entry || !entry.subjectId) return <TableCell key={classroom.id} className="bg-slate-50/10 border-l" />;
                      const subject = subjects.find(s => s.id === entry.subjectId);
                      const teacher = teachers.find(t => t.id === entry.teacherId);
                      const conflict = findConflict(entry.teacherId, entry.timeSlotId);
                      return (
                        <TableCell key={classroom.id} className="p-2 border-l">
                          <div className={cn("rounded-md p-3 h-full border-l-4 transition-all hover:shadow-md", conflict ? "bg-destructive/5 border-destructive" : "bg-white dark:bg-slate-800 border-indigo-500 shadow-sm")}>
                            <div className="font-bold text-sm" style={{ color: subject?.color }}>{subject?.name || 'Subject'}</div>
                            <div className="text-xs text-muted-foreground flex items-center justify-between mt-1">
                              <span className="truncate">{teacher?.name || "Unassigned"}</span>
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
          </div>
        )}
        {activeTab === 'classroom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map(classroom => (
              <Card key={classroom.id} className="border bg-slate-50/30">
                <CardHeader className="py-3 bg-white dark:bg-slate-900 border-b"><CardTitle className="text-sm font-bold">{classroom.name}</CardTitle></CardHeader>
                <CardContent className="p-3 space-y-2">
                  {timeSlots.map(slot => {
                    const entry = scheduleEntries.find(e => e.timeSlotId === slot.id && e.classroomId === classroom.id);
                    if (!entry || !entry.subjectId) return null;
                    const subject = subjects.find(s => s.id === entry.subjectId);
                    const teacher = teachers.find(t => t.id === entry.teacherId);
                    const conflict = findConflict(entry.teacherId, entry.timeSlotId);
                    return (
                      <div key={slot.id} className="p-2 bg-white dark:bg-slate-800 rounded border shadow-sm">
                        <div className="flex justify-between text-[9px] text-muted-foreground font-medium"><span>{slot.day}</span><span>{slot.startTime}</span></div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="font-bold text-xs" style={{ color: subject?.color }}>{subject?.name}</span>
                          <span className="text-[10px] font-medium">{teacher?.name || 'Unassigned'}</span>
                        </div>
                        {conflict && <div className="mt-2"><ConflictBadge otherClassroomIds={conflict.classroomIds.filter(id => id !== classroom.id)} /></div>}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {activeTab === 'teacher' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teachers.map(teacher => {
              const schedule = scheduleEntries.filter(r => r.teacherId === teacher.id && r.subjectId);
              return (
                <Card key={teacher.id} className="border">
                  <CardHeader className="py-3 bg-indigo-50/50 dark:bg-indigo-950/20"><CardTitle className="text-sm font-bold flex justify-between items-center">
                    {teacher.name}
                    <span className="text-[10px] text-muted-foreground bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border">{teacher.specialty}</span>
                  </CardTitle></CardHeader>
                  <CardContent className="p-0">
                    {schedule.length > 0 ? (
                      <Table>
                        <TableBody>
                          {schedule.map((entry, idx) => {
                            const slot = timeSlots.find(t => t.id === entry.timeSlotId);
                            const classroom = classrooms.find(c => c.id === entry.classroomId);
                            const subject = subjects.find(s => s.id === entry.subjectId);
                            const conflict = findConflict(teacher.id, entry.timeSlotId);
                            return (
                              <TableRow key={idx}>
                                <TableCell className="py-2 text-[11px] font-medium text-muted-foreground">{slot?.day} {slot?.startTime}</TableCell>
                                <TableCell className="py-2 text-[11px] font-bold">{classroom?.name}</TableCell>
                                <TableCell className="py-2 text-[11px] font-medium" style={{ color: subject?.color }}>{subject?.name}</TableCell>
                                <TableCell className="py-2 text-right">{conflict && <ConflictBadge otherClassroomIds={conflict.classroomIds.filter(id => id !== entry.classroomId)} />}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    ) : <div className="p-6 text-center text-xs text-muted-foreground italic">No classes assigned.</div>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}