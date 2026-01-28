import React, { useMemo } from 'react';
import { useSchedulerStore, getConflicts } from '@/store/scheduler-store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConflictBadge } from './ConflictBadge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
export function EditableScheduleGrid() {
  const scheduleEntries = useSchedulerStore(s => s.scheduleEntries);
  const classrooms = useSchedulerStore(s => s.classrooms);
  const teachers = useSchedulerStore(s => s.teachers);
  const subjects = useSchedulerStore(s => s.subjects);
  const timeSlots = useSchedulerStore(s => s.timeSlots);
  const upsertScheduleEntry = useSchedulerStore(s => s.upsertScheduleEntry);
  const removeScheduleEntry = useSchedulerStore(s => s.removeScheduleEntry);
  const conflicts = useMemo(() => getConflicts(scheduleEntries), [scheduleEntries]);
  const handleUpdate = async (classroomId: string, timeSlotId: string, subjectId: string, teacherId: string) => {
    try {
      if (!subjectId && !teacherId) {
        await removeScheduleEntry(`${classroomId}_${timeSlotId}`);
      } else {
        await upsertScheduleEntry({ classroomId, timeSlotId, subjectId, teacherId });
      }
    } catch (e) {
      toast.error("Failed to update schedule cell");
    }
  };
  const getCellConflict = (teacherId: string, timeSlotId: string, classroomId: string) => {
    if (!teacherId) return null;
    return conflicts.find(c => c.teacherId === teacherId && c.timeSlotId === timeSlotId && c.classroomIds.includes(classroomId));
  };
  return (
    <div className="rounded-xl border bg-white dark:bg-slate-900 overflow-hidden shadow-soft">
      <div className="overflow-x-auto max-h-[70vh]">
        <Table className="border-collapse">
          <TableHeader className="sticky top-0 z-20 bg-slate-50 dark:bg-slate-900 shadow-sm">
            <TableRow>
              <TableHead className="w-[140px] sticky left-0 z-30 bg-slate-100 dark:bg-slate-800 border-r">Time Slot</TableHead>
              {classrooms.map(cls => (
                <TableHead key={cls.id} className="min-w-[200px] border-l text-center py-4 font-bold text-slate-900 dark:text-slate-100">
                  {cls.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeSlots.map(slot => (
              <TableRow key={slot.id} className="group">
                <TableCell className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-900 border-r font-medium text-xs">
                  <div className="text-indigo-600 font-bold uppercase tracking-wider">{slot.day}</div>
                  <div className="text-slate-500">{slot.startTime} - {slot.endTime}</div>
                </TableCell>
                {classrooms.map(cls => {
                  const entry = scheduleEntries.find(e => e.classroomId === cls.id && e.timeSlotId === slot.id);
                  const subject = subjects.find(s => s.id === entry?.subjectId);
                  const conflict = getCellConflict(entry?.teacherId || '', slot.id, cls.id);
                  return (
                    <TableCell key={cls.id} className={cn(
                      "p-3 border-l transition-colors h-24",
                      conflict ? "bg-red-50/50 dark:bg-red-950/20" : "group-hover:bg-slate-50/50 dark:group-hover:bg-slate-800/30"
                    )}>
                      <div className={cn(
                        "space-y-2 p-2 rounded-lg border-2 border-dashed transition-all",
                        entry ? "border-solid bg-white dark:bg-slate-800 shadow-sm" : "border-slate-200 dark:border-slate-700",
                        conflict && "border-red-500 ring-1 ring-red-500"
                      )} style={entry ? { borderLeftColor: subject?.color, borderLeftWidth: '4px' } : {}}>
                        <Select 
                          value={entry?.subjectId || "none"} 
                          onValueChange={(val) => handleUpdate(cls.id, slot.id, val === "none" ? "" : val, entry?.teacherId || "")}
                        >
                          <SelectTrigger className="h-7 text-[11px] border-none bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 focus:ring-0 px-1">
                            <SelectValue placeholder="Add Subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {subjects.map(s => (
                              <SelectItem key={s.id} value={s.id}>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                                  {s.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center justify-between gap-1">
                          <Select 
                            value={entry?.teacherId || "none"} 
                            onValueChange={(val) => handleUpdate(cls.id, slot.id, entry?.subjectId || "", val === "none" ? "" : val)}
                          >
                            <SelectTrigger className="h-7 text-[11px] border-none bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 focus:ring-0 px-1 font-semibold text-slate-600 dark:text-slate-400">
                              <SelectValue placeholder="Assign Teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Unassigned</SelectItem>
                              {teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          {conflict && (
                            <ConflictBadge 
                              otherClassroomIds={conflict.classroomIds.filter(id => id !== cls.id)} 
                            />
                          )}
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
    </div>
  );
}