import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Assignment, Classroom, Subject, Teacher, TimeSlot } from '@shared/types';
import { getResolvedSchedule } from '@/store/scheduler-store';
import { CLASSROOMS, SUBJECTS, TEACHERS, TIME_SLOTS } from '@shared/mock-data';
export function exportScheduleToPdf(assignments: Assignment[]) {
  const doc = new jsPDF();
  const resolved = getResolvedSchedule(assignments);
  const timestamp = new Date().toLocaleString();
  doc.setFontSize(20);
  doc.text('Scholastic Scheduler - Master Report', 14, 22);
  doc.setFontSize(10);
  doc.text(`Generated on: ${timestamp}`, 14, 30);
  // Table 1: Master List
  const tableData = resolved.map(entry => {
    const classroom = CLASSROOMS.find(c => c.id === entry.classroomId)?.name || entry.classroomId;
    const subject = SUBJECTS.find(s => s.id === entry.subjectId)?.name || entry.subjectId;
    const slot = TIME_SLOTS.find(t => t.id === entry.timeSlotId);
    const timeStr = slot ? `${slot.day} ${slot.startTime}-${slot.endTime}` : entry.timeSlotId;
    const teacher = TEACHERS.find(t => t.id === entry.teacherId)?.name || 'Unassigned';
    return [classroom, subject, timeStr, teacher];
  });
  autoTable(doc, {
    startY: 40,
    head: [['Classroom', 'Subject', 'Time Slot', 'Teacher']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] }, // Indigo 600
  });
  doc.save(`school-schedule-${new Date().getTime()}.pdf`);
}