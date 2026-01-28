import React, { useState } from 'react';
import { useSchedulerStore } from '@/store/scheduler-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, CalendarClock } from 'lucide-react';
import { toast } from 'sonner';
export function MasterDataManager() {
  const classrooms = useSchedulerStore(s => s.classrooms);
  const teachers = useSchedulerStore(s => s.teachers);
  const subjects = useSchedulerStore(s => s.subjects);
  const timeSlots = useSchedulerStore(s => s.timeSlots);
  const masterSchedule = useSchedulerStore(s => s.masterSchedule);
  const addMaster = useSchedulerStore(s => s.addMaster);
  const removeMaster = useSchedulerStore(s => s.removeMaster);
  const [open, setOpen] = useState(false);
  const handleAdd = async (type: any, data: any) => {
    try {
      await addMaster(type, data);
      toast.success('Resource saved');
      setOpen(false);
    } catch (e) {
      toast.error('Failed to save');
    }
  };
  const handleRemove = async (type: any, id: string) => {
    try {
      await removeMaster(type, id);
      toast.success('Resource removed');
    } catch (e) {
      toast.error('Failed to remove');
    }
  };
  return (
    <Card className="border-none shadow-soft">
      <CardContent className="pt-6">
        <Tabs defaultValue="classrooms">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="classrooms">Classes</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="timeslots">Slots</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          <TabsContent value="classrooms">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Classrooms</h3>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild><Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> New Class</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Classroom</DialogTitle></DialogHeader>
                  <form onSubmit={(e: any) => {
                    e.preventDefault();
                    handleAdd('classrooms', { name: e.target.name.value });
                  }} className="space-y-4">
                    <div className="space-y-2"><Label>Name</Label><Input name="name" placeholder="e.g. Grade 4-A" required /></div>
                    <Button type="submit" className="w-full">Save Classroom</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {classrooms.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleRemove('classrooms', c.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="teachers">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Teachers</h3>
              <Dialog>
                <DialogTrigger asChild><Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> New Teacher</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Teacher</DialogTitle></DialogHeader>
                  <form onSubmit={(e: any) => {
                    e.preventDefault();
                    handleAdd('teachers', { name: e.target.name.value, specialty: e.target.specialty.value });
                  }} className="space-y-4">
                    <div className="space-y-2"><Label>Name</Label><Input name="name" required /></div>
                    <div className="space-y-2"><Label>Specialty</Label><Input name="specialty" required /></div>
                    <Button type="submit" className="w-full">Save Teacher</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Specialty</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {teachers.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.specialty}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleRemove('teachers', t.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="subjects">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Subjects</h3>
              <Dialog>
                <DialogTrigger asChild><Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> New Subject</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Subject</DialogTitle></DialogHeader>
                  <form onSubmit={(e: any) => {
                    e.preventDefault();
                    handleAdd('subjects', { name: e.target.name.value, color: e.target.color.value });
                  }} className="space-y-4">
                    <div className="space-y-2"><Label>Name</Label><Input name="name" required /></div>
                    <div className="space-y-2"><Label>Color</Label><Input name="color" type="color" defaultValue="#4f46e5" className="h-12" required /></div>
                    <Button type="submit" className="w-full">Save Subject</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Color</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {subjects.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell><div className="w-8 h-4 rounded border" style={{ backgroundColor: s.color }} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleRemove('subjects', s.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="timeslots">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Time Slots</h3>
              <Dialog>
                <DialogTrigger asChild><Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> New Slot</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Time Slot</DialogTitle></DialogHeader>
                  <form onSubmit={(e: any) => {
                    e.preventDefault();
                    handleAdd('time-slots', {
                      day: e.target.day.value,
                      startTime: e.target.start.value,
                      endTime: e.target.end.value
                    });
                  }} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Day</Label>
                      <select name="day" className="w-full p-2 rounded border bg-background" required>
                        <option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Start</Label><Input name="start" type="time" required /></div>
                      <div className="space-y-2"><Label>End</Label><Input name="end" type="time" required /></div>
                    </div>
                    <Button type="submit" className="w-full">Save Slot</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Day</TableHead><TableHead>Period</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {timeSlots.map(ts => (
                  <TableRow key={ts.id}>
                    <TableCell className="font-medium">{ts.day}</TableCell>
                    <TableCell>{ts.startTime} - {ts.endTime}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleRemove('time-slots', ts.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="schedule">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-lg">Master Timetable</h3>
              </div>
              <Dialog>
                <DialogTrigger asChild><Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> New Lesson</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Schedule New Lesson</DialogTitle></DialogHeader>
                  <form onSubmit={(e: any) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    handleAdd('master-schedules', {
                      classroomId: formData.get('classroomId'),
                      timeSlotId: formData.get('timeSlotId'),
                      subjectId: formData.get('subjectId')
                    });
                  }} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Classroom</Label>
                      <select name="classroomId" className="w-full p-2 rounded border bg-background" required>
                        {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Time Slot</Label>
                      <select name="timeSlotId" className="w-full p-2 rounded border bg-background" required>
                        {timeSlots.map(ts => <option key={ts.id} value={ts.id}>{ts.day} {ts.startTime}-{ts.endTime}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <select name="subjectId" className="w-full p-2 rounded border bg-background" required>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <Button type="submit" className="w-full">Save Lesson</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Classroom</TableHead><TableHead>Time Slot</TableHead><TableHead>Subject</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {masterSchedule.map(ms => {
                  const cls = classrooms.find(c => c.id === ms.classroomId);
                  const ts = timeSlots.find(t => t.id === ms.timeSlotId);
                  const sub = subjects.find(s => s.id === ms.subjectId);
                  return (
                    <TableRow key={ms.id || `${ms.classroomId}_${ms.timeSlotId}`}>
                      <TableCell className="font-medium">{cls?.name || 'Deleted Class'}</TableCell>
                      <TableCell>{ts ? `${ts.day} ${ts.startTime}` : 'Deleted Slot'}</TableCell>
                      <TableCell><span className="font-bold" style={{ color: sub?.color }}>{sub?.name || 'Deleted Subject'}</span></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleRemove('master-schedules', ms.id || `${ms.classroomId}_${ms.timeSlotId}`)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}