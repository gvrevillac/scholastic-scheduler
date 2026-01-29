import React, { useState, useMemo } from 'react';
import { useSchedulerStore } from '@/store/scheduler-store';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Info } from 'lucide-react';
import { toast } from 'sonner';
export function AssignmentForm() {
  const [classroomId, setClassroomId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const classrooms = useSchedulerStore(s => s.classrooms);
  const subjects = useSchedulerStore(s => s.subjects);
  const teachers = useSchedulerStore(s => s.teachers);
  const scheduleEntries = useSchedulerStore(s => s.scheduleEntries);
  const upsertScheduleEntry = useSchedulerStore(s => s.upsertScheduleEntry);
  const loading = useSchedulerStore(s => s.loading);
  const availableSubjects = useMemo(() => {
    if (!classroomId) return [];
    const scheduledSubjectIds = scheduleEntries
      .filter(se => se.classroomId === classroomId && se.subjectId)
      .map(se => se.subjectId);
    const uniqueIds = Array.from(new Set(scheduledSubjectIds));
    return subjects.filter(s => uniqueIds.includes(s.id));
  }, [classroomId, subjects, scheduleEntries]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classroomId || !subjectId || !teacherId) {
      toast.error('Please select all fields');
      return;
    }
    // Find all slots for this classroom/subject combination
    const targetEntries = scheduleEntries.filter(
      se => se.classroomId === classroomId && se.subjectId === subjectId
    );
    if (targetEntries.length === 0) {
      toast.error('This subject is not scheduled for the selected classroom.');
      return;
    }
    try {
      await Promise.all(targetEntries.map(entry => 
        upsertScheduleEntry({
          classroomId: entry.classroomId,
          timeSlotId: entry.timeSlotId,
          subjectId: entry.subjectId,
          teacherId: teacherId
        })
      ));
      toast.success('Teacher assigned to all subject periods');
      setSubjectId('');
      setTeacherId('');
    } catch (err) {
      toast.error('Failed to save assignment');
    }
  };
  const hasResources = classrooms.length > 0 && teachers.length > 0;
  return (
    <Card className="shadow-soft border-none bg-card h-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-indigo-600" /> Assign Teacher
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasResources ? (
          <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg italic">
            Please add Classrooms and Teachers in Resource Management first.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="classroom">Classroom</Label>
              <Select value={classroomId} onValueChange={(val) => { setClassroomId(val); setSubjectId(''); }}>
                <SelectTrigger id="classroom"><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {classrooms.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subjectId} onValueChange={setSubjectId} disabled={!classroomId || availableSubjects.length === 0}>
                <SelectTrigger id="subject"><SelectValue placeholder={!classroomId ? "Select class first" : "Select subject"} /></SelectTrigger>
                <SelectContent>
                  {availableSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {classroomId && availableSubjects.length === 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-medium mt-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>No subjects scheduled for this classroom yet. Use the matrix to add subjects first.</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher">Teacher</Label>
              <Select value={teacherId} onValueChange={setTeacherId}>
                <SelectTrigger id="teacher"><SelectValue placeholder="Select teacher" /></SelectTrigger>
                <SelectContent>
                  {teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full btn-gradient py-6 font-bold" disabled={loading || availableSubjects.length === 0}>
              {loading ? "Processing..." : "Assign Teacher"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}