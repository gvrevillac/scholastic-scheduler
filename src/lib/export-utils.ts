import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ScheduleEntry, Classroom, Subject, Teacher, TimeSlot } from '@shared/types';
export function exportScheduleToPdf(
  scheduleEntries: ScheduleEntry[],
  classrooms: Classroom[],
  subjects: Subject[],
  teachers: Teacher[],
  timeSlots: TimeSlot[]
) {
  const doc = new jsPDF('landscape');
  const timestamp = new Date().toLocaleString();
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // indigo-600
  doc.text('Scholastic Scheduler - Master Report', 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Generated on: ${timestamp}`, 14, 28);
  const tableData = scheduleEntries.map(entry => {
    const classroom = classrooms.find(c => c.id === entry.classroomId)?.name || "N/A";
    const subject = subjects.find(s => s.id === entry.subjectId)?.name || "N/A";
    const slot = timeSlots.find(t => t.id === entry.timeSlotId);
    const timeStr = slot ? `${slot.day} ${slot.startTime}-${slot.endTime}` : "N/A";
    const teacher = teachers.find(t => t.id === entry.teacherId)?.name || 'Unassigned';
    return [classroom, subject, timeStr, teacher];
  });
  autoTable(doc, {
    startY: 35,
    head: [['Classroom', 'Subject', 'Time Slot', 'Teacher']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
    styles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });
  doc.save(`Scholastic-Master-${Date.now()}.pdf`);
}