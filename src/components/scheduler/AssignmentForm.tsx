import React, { useState } from 'react';
import { useSchedulerStore } from '@/store/scheduler-store';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
export function AssignmentForm() {
  const [classroomId, setClassroomId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const classrooms = useSchedulerStore(s => s.classrooms);
  const subjects = useSchedulerStore(s => s.subjects);
  const teachers = useSchedulerStore(s => s.teachers);
  const addAssignment = useSchedulerStore(s => s.addAssignment);
  const loading = useSchedulerStore(s => s.loading);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classroomId || !subjectId || !teacherId) {
      toast.error('Please select all fields');
      return;
    }
    try {
      await addAssignment({ classroomId, subjectId, teacherId });
      toast.success('Assignment saved');
      setSubjectId('');
      setTeacherId('');
    } catch (err) {
      toast.error('Failed to save assignment');
    }
  };
  const hasResources = classrooms.length > 0 && subjects.length > 0 && teachers.length > 0;
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
            Please add Classrooms, Subjects, and Teachers in Resource Management first.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="classroom">Classroom</Label>
              <Select value={classroomId} onValueChange={setClassroomId}>
                <SelectTrigger id="classroom"><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {classrooms.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger id="subject"><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>
                  {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
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
            <Button type="submit" className="w-full btn-gradient py-6" disabled={loading}>
              {loading ? "Processing..." : "Assign Teacher"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}