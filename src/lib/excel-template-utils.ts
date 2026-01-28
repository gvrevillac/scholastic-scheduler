import * as XLSX from 'xlsx';
import { Classroom, Subject, Teacher, TimeSlot, ScheduleEntry } from '@shared/types';
export const generateScheduleTemplate = (
  classrooms: Classroom[],
  teachers: Teacher[],
  subjects: Subject[],
  timeSlots: TimeSlot[]
) => {
  const wb = XLSX.utils.book_new();
  // 1. Data Entry Sheet (Simplified)
  const entryHeaders = [['Classroom', 'Day', 'Time Range', 'Subject', 'Teacher']];
  const wsEntry = XLSX.utils.aoa_to_sheet(entryHeaders);
  XLSX.utils.book_append_sheet(wb, wsEntry, 'Input');
  // 2. Reference Sheets (For data validation in Excel)
  const wsRefs = XLSX.utils.json_to_sheet([
    ...classrooms.map(c => ({ Category: 'Classroom', Value: c.name })),
    ...teachers.map(t => ({ Category: 'Teacher', Value: t.name })),
    ...subjects.map(s => ({ Category: 'Subject', Value: s.name })),
    ...timeSlots.map(ts => ({ Category: 'TimeSlot', Value: `${ts.day} ${ts.startTime}-${ts.endTime}` }))
  ]);
  XLSX.utils.book_append_sheet(wb, wsRefs, 'Dropdowns');
  XLSX.writeFile(wb, `Scholastic-Template-${Date.now()}.xlsx`);
};
export const parseScheduleImport = async (
  file: File,
  classrooms: Classroom[],
  teachers: Teacher[],
  subjects: Subject[],
  timeSlots: TimeSlot[]
): Promise<ScheduleEntry[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(firstSheet);
        const entries: ScheduleEntry[] = [];
        rows.forEach(row => {
          const cls = classrooms.find(c => c.name === row.Classroom);
          const slot = timeSlots.find(ts => `${ts.day} ${ts.startTime}-${ts.endTime}` === row['Time Range']);
          const sub = subjects.find(s => s.name === row.Subject);
          const tea = teachers.find(t => t.name === row.Teacher);
          if (cls && slot) {
            entries.push({
              id: `${cls.id}_${slot.id}`,
              classroomId: cls.id,
              timeSlotId: slot.id,
              subjectId: sub?.id || '',
              teacherId: tea?.id || ''
            });
          }
        });
        resolve(entries);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};