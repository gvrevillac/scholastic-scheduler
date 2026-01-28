import * as XLSX from 'xlsx';
import { Assignment, Classroom, Subject, Teacher, TimeSlot } from '@shared/types';
import { getResolvedSchedule } from '@/store/scheduler-store';
export function exportToExcel(
  assignments: Assignment[],
  classrooms: Classroom[],
  subjects: Subject[],
  teachers: Teacher[],
  timeSlots: TimeSlot[]
) {
  const wb = XLSX.utils.book_new();
  const resolved = getResolvedSchedule(assignments);
  // 1. Instructions
  const ins = [
    ['Scholastic Scheduler - Export'],
    ['Generated:', new Date().toLocaleString()],
    [''],
    ['This workbook contains:'],
    ['- Master List: All pairings'],
    ['- Class Timetables: Matrix view per class'],
    ['- Teacher Workload: Assignment count per teacher']
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ins), 'Overview');
  // 2. Master List
  const master = resolved.map(e => {
    const slot = timeSlots.find(ts => ts.id === e.timeSlotId);
    return {
      Day: slot?.day || '',
      Time: slot ? `${slot.startTime}-${slot.endTime}` : '',
      Classroom: classrooms.find(c => c.id === e.classroomId)?.name || '',
      Subject: subjects.find(s => s.id === e.subjectId)?.name || '',
      Teacher: teachers.find(t => t.id === e.teacherId)?.name || 'Unassigned'
    };
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(master), 'Master List');
  // 3. Class Timetables
  const uniqueTimeRanges = Array.from(new Set(timeSlots.map(ts => `${ts.startTime}-${ts.endTime}`))).sort();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const grid: any[][] = [['Classroom Schedule Matrix'], []];
  classrooms.forEach(cls => {
    grid.push([`Class: ${cls.name}`]);
    grid.push(['Day / Time', ...uniqueTimeRanges]);
    days.forEach(day => {
      const row = [day];
      uniqueTimeRanges.forEach(time => {
        const e = resolved.find(x => {
          const s = timeSlots.find(ts => ts.id === x.timeSlotId);
          return x.classroomId === cls.id && s?.day === day && `${s.startTime}-${s.endTime}` === time;
        });
        if (e) {
          const sub = subjects.find(s => s.id === e.subjectId)?.name || '';
          const tea = teachers.find(t => t.id === e.teacherId)?.name || 'Unassigned';
          row.push(`${sub} (${tea})`);
        } else row.push('-');
      });
      grid.push(row);
    });
    grid.push([]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(grid), 'Matrix View');
  XLSX.writeFile(wb, `Scholastic-Export-${Date.now()}.xlsx`);
}