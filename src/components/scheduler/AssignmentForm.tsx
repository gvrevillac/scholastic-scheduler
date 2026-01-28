import React, { useState } from 'react';
import { useSchedulerStore } from '@/store/scheduler-store';
import { CLASSROOMS, SUBJECTS, TEACHERS } from '@shared/mock-data';
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
      // Reset form partially
      setSubjectId('');
      setTeacherId('');
    } catch (err) {
      toast.error('Failed to save assignment');
    }
  };
  return (
    <Card className="shadow-soft border-none bg-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-indigo-600" />
          Assign Teacher
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="classroom">Classroom</Label>
            <Select value={classroomId} onValueChange={setClassroomId}>
              <SelectTrigger id="classroom" className="bg-secondary/50">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {CLASSROOMS.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger id="subject" className="bg-secondary/50">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher</Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger id="teacher" className="bg-secondary/50">
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {TEACHERS.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name} ({t.specialty})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full btn-gradient py-6" disabled={loading}>
            {loading ? "Processing..." : "Assign Teacher"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}