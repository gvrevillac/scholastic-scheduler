import * as XLSX from 'xlsx';
import { ScheduleEntry, Classroom, Subject, Teacher, TimeSlot } from '@shared/types';
export function exportToExcel(
  scheduleEntries: ScheduleEntry[],
  classrooms: Classroom[],
  subjects: Subject[],
  teachers: Teacher[],
  timeSlots: TimeSlot[]
) {
  const wb = XLSX.utils.book_new();
  // 1. Overview Sheet
  const ins = [
    ['Scholastic Scheduler - Unified Export'],
    ['Generated:', new Date().toLocaleString()],
    [''],
    ['Summary:'],
    ['Total Lessons:', scheduleEntries.length],
    ['Classrooms:', classrooms.length],
    ['Teachers:', teachers.length]
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ins), 'Overview');
  // 2. Master List
  const master = scheduleEntries.map(e => {
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
  // 3. Matrix View
  const uniqueTimeRanges = Array.from(new Set(timeSlots.map(ts => `${ts.startTime}-${ts.endTime}`))).sort();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const grid: any[][] = [['Classroom Schedule Matrix'], []];
  classrooms.forEach(cls => {
    grid.push([`Class: ${cls.name}`]);
    grid.push(['Day / Time', ...uniqueTimeRanges]);
    days.forEach(day => {
      const row = [day];
      uniqueTimeRanges.forEach(time => {
        const e = scheduleEntries.find(x => {
          const s = timeSlots.find(ts => ts.id === x.timeSlotId);
          return x.classroomId === cls.id && s?.day === day && `${s.startTime}-${s.endTime}` === time;
        });
        if (e) {
          const sub = subjects.find(s => s.id === e.subjectId)?.name || 'N/A';
          const tea = teachers.find(t => t.id === e.teacherId)?.name || 'Unassigned';
          row.push(`${sub} (${tea})`);
        } else row.push('-');
      });
      grid.push(row);
    });
    grid.push([]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(grid), 'Matrix View');
  XLSX.writeFile(wb, `Scholastic-Report-${Date.now()}.xlsx`);
}