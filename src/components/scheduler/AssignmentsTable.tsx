import React from 'react';
import { useSchedulerStore } from '@/store/scheduler-store';
import { CLASSROOMS, SUBJECTS, TEACHERS } from '@shared/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
export function AssignmentsTable() {
  const assignments = useSchedulerStore(s => s.assignments);
  const removeAssignment = useSchedulerStore(s => s.removeAssignment);
  const loading = useSchedulerStore(s => s.loading);
  const getClassName = (id: string) => CLASSROOMS.find(c => c.id === id)?.name || id;
  const getSubjectName = (id: string) => SUBJECTS.find(s => s.id === id)?.name || id;
  const getTeacherName = (id: string) => TEACHERS.find(t => t.id === id)?.name || id;
  const handleDelete = async (id: string) => {
    try {
      await removeAssignment(id);
      toast.success('Assignment deleted');
    } catch (err) {
      toast.error('Failed to delete assignment');
    }
  };
  if (assignments.length === 0) {
    return (
      <Card className="bg-slate-50 border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
          <p>No active assignments. Start by using the form.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-soft border-none bg-card">
      <CardHeader>
        <CardTitle className="text-xl">Current Assignments</CardTitle>
      </CardHeader>
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
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(a.id)}
                    className="text-destructive hover:bg-destructive/10"
                    disabled={loading}
                  >
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