import React, { useMemo } from 'react';
import { useSchedulerStore } from '@/store/scheduler-store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
export function AssignmentsTable() {
  const scheduleEntries = useSchedulerStore(s => s.scheduleEntries);
  const classrooms = useSchedulerStore(s => s.classrooms);
  const subjects = useSchedulerStore(s => s.subjects);
  const teachers = useSchedulerStore(s => s.teachers);
  const removeScheduleEntry = useSchedulerStore(s => s.removeScheduleEntry);
  const loading = useSchedulerStore(s => s.loading);
  const assignments = useMemo(() => {
    return scheduleEntries.filter(e => e.teacherId && e.subjectId);
  }, [scheduleEntries]);
  const getClassName = (id: string) => classrooms.find(c => c.id === id)?.name || "N/A";
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || "N/A";
  const getTeacherName = (id: string) => teachers.find(t => t.id === id)?.name || "N/A";
  const handleDelete = async (id: string) => {
    try {
      await removeScheduleEntry(id);
      toast.success('Assignment deleted');
    } catch (err) {
      toast.error('Failed to delete assignment');
    }
  };
  if (assignments.length === 0) {
    return (
      <Card className="bg-slate-50 border-dashed border-2 h-full">
        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
          <p>No active assignments. Start by using the form or matrix.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-soft border-none bg-card h-full">
      <CardHeader><CardTitle className="text-xl">Current Assignments</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Classroom</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{getClassName(a.classroomId)}</TableCell>
                <TableCell>{getSubjectName(a.subjectId)}</TableCell>
                <TableCell>{getTeacherName(a.teacherId)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="text-destructive" disabled={loading}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}