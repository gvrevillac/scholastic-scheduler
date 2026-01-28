import * as XLSX from 'xlsx';
import { Assignment, MasterScheduleEntry, TimeSlot, Classroom, Subject, Teacher } from '@shared/types';
import { CLASSROOMS, SUBJECTS, TEACHERS, TIME_SLOTS, MASTER_SCHEDULE } from '@shared/mock-data';
import { getResolvedSchedule } from '@/store/scheduler-store';
export function exportToExcel(assignments: Assignment[]) {
  const wb = XLSX.utils.book_new();
  const resolved = getResolvedSchedule(assignments);
  // 1. Instructions Sheet
  const instructionsData = [
    ['Scholastic Scheduler - Excel Workbook Instructions'],
    [''],
    ['1. Input Sheet (Schedule Entry):'],
    ['- This sheet contains the flat list of all subject-classroom pairings.'],
    ['- You can filter and sort this table to analyze resource distribution.'],
    [''],
    ['2. Data Integrity:'],
    ['- The Grade/Section, Subject, and Teacher columns correlate to school records.'],
    ['- If "Unassigned" appears, a teacher needs to be linked to that subject-classroom pair.'],
    [''],
    ['3. Converting to Tables:'],
    ['- Select the data range in the Master sheet and press Ctrl+T to enable Excel Table features.'],
    [''],
    ['Generated on:', new Date().toLocaleString()]
  ];
  const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData);
  XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');
  // 2. Master Assignments Sheet (Input Sheet)
  const masterHeaders = ['Day', 'Time Period', 'Grade/Section', 'Subject', 'Teacher'];
  const masterRows = resolved.map(entry => {
    const slot = TIME_SLOTS.find(t => t.id === entry.timeSlotId);
    const classroom = CLASSROOMS.find(c => c.id === entry.classroomId)?.name || entry.classroomId;
    const subject = SUBJECTS.find(s => s.id === entry.subjectId)?.name || entry.subjectId;
    const teacher = TEACHERS.find(t => t.id === entry.teacherId)?.name || 'Unassigned';
    return [
      slot?.day || '',
      slot ? `${slot.startTime}-${slot.endTime}` : '',
      classroom,
      subject,
      teacher
    ];
  });
  const wsMaster = XLSX.utils.aoa_to_sheet([masterHeaders, ...masterRows]);
  // Apply basic auto-filter and column widths
  wsMaster['!autofilter'] = { ref: `A1:E${masterRows.length + 1}` };
  wsMaster['!cols'] = [
    { wch: 15 }, // Day
    { wch: 15 }, // Time
    { wch: 15 }, // Grade
    { wch: 20 }, // Subject
    { wch: 25 }, // Teacher
  ];
  XLSX.utils.book_append_sheet(wb, wsMaster, 'Master List');
  // 3. Class Timetables (Consolidated Grid)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const uniqueTimeSlots = Array.from(new Set(TIME_SLOTS.map(ts => `${ts.startTime}-${ts.endTime}`))).sort();
  const timetableData: any[][] = [['Classroom Timetables Matrix'], ['']];
  CLASSROOMS.forEach(classroom => {
    timetableData.push([`Class: ${classroom.name}`]);
    const headerRow = ['Day / Time', ...uniqueTimeSlots];
    timetableData.push(headerRow);
    days.forEach(day => {
      const row = [day];
      uniqueTimeSlots.forEach(timeRange => {
        const entry = resolved.find(e => {
          const slot = TIME_SLOTS.find(ts => ts.id === e.timeSlotId);
          return e.classroomId === classroom.id && 
                 slot?.day === day && 
                 `${slot.startTime}-${slot.endTime}` === timeRange;
        });
        if (entry) {
          const subject = SUBJECTS.find(s => s.id === entry.subjectId)?.name || '';
          const teacher = TEACHERS.find(t => t.id === entry.teacherId)?.name || 'Unassigned';
          row.push(`${subject} (${teacher})`);
        } else {
          row.push('-');
        }
      });
      timetableData.push(row);
    });
    timetableData.push(['']); // Spacer
  });
  const wsTimetable = XLSX.utils.aoa_to_sheet(timetableData);
  wsTimetable['!cols'] = [{ wch: 15 }, ...uniqueTimeSlots.map(() => ({ wch: 25 }))];
  XLSX.utils.book_append_sheet(wb, wsTimetable, 'Class Timetables');
  // 4. Teacher Workload
  const workloadData: any[][] = [['Teacher Assignment Matrix'], ['']];
  const teacherHeader = ['Teacher', 'Specialty', 'Total Slots', 'Assignments (Day: Time - Class/Subject)'];
  workloadData.push(teacherHeader);
  TEACHERS.forEach(teacher => {
    const teacherAssignments = resolved.filter(e => e.teacherId === teacher.id);
    const scheduleStr = teacherAssignments.map(e => {
      const slot = TIME_SLOTS.find(ts => ts.id === e.timeSlotId);
      const classroom = CLASSROOMS.find(c => c.id === e.classroomId)?.name || '';
      const subject = SUBJECTS.find(s => s.id === e.subjectId)?.name || '';
      return `${slot?.day?.slice(0,3)} ${slot?.startTime}: ${classroom}/${subject}`;
    }).join(' | ');
    workloadData.push([
      teacher.name,
      teacher.specialty,
      teacherAssignments.length,
      scheduleStr
    ]);
  });
  const wsWorkload = XLSX.utils.aoa_to_sheet(workloadData);
  wsWorkload['!cols'] = [
    { wch: 20 }, // Teacher
    { wch: 15 }, // Specialty
    { wch: 12 }, // Total Slots
    { wch: 100 }, // Schedule string
  ];
  XLSX.utils.book_append_sheet(wb, wsWorkload, 'Teacher Workload');
  // Export
  XLSX.writeFile(wb, `Scholastic-Schedule-${new Date().getTime()}.xlsx`);
}