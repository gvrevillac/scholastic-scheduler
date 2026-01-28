import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Assignment, Classroom, Subject, Teacher, TimeSlot } from '@shared/types';
import { getResolvedSchedule } from '@/store/scheduler-store';
export function exportScheduleToPdf(
  assignments: Assignment[],
  classrooms: Classroom[],
  subjects: Subject[],
  teachers: Teacher[],
  timeSlots: TimeSlot[]
) {
  const doc = new jsPDF();
  const resolved = getResolvedSchedule(assignments);
  const timestamp = new Date().toLocaleString();
  doc.setFontSize(20);
  doc.text('Scholastic Scheduler - Master Report', 14, 22);
  doc.setFontSize(10);
  doc.text(`Generated on: ${timestamp}`, 14, 30);
  const tableData = resolved.map(entry => {
    const classroom = classrooms.find(c => c.id === entry.classroomId)?.name || "N/A";
    const subject = subjects.find(s => s.id === entry.subjectId)?.name || "N/A";
    const slot = timeSlots.find(t => t.id === entry.timeSlotId);
    const timeStr = slot ? `${slot.day} ${slot.startTime}-${slot.endTime}` : "N/A";
    const teacher = teachers.find(t => t.id === entry.teacherId)?.name || 'Unassigned';
    return [classroom, subject, timeStr, teacher];
  });
  autoTable(doc, {
    startY: 40,
    head: [['Classroom', 'Subject', 'Time Slot', 'Teacher']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] },
  });
  doc.save(`school-schedule-${Date.now()}.pdf`);
}