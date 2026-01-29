import React, { useEffect } from 'react';
import { useSchedulerStore, getConflicts } from '@/store/scheduler-store';
import { ScheduleVisualizer } from '@/components/scheduler/ScheduleVisualizer';
import { MasterDataManager } from '@/components/scheduler/MasterDataManager';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GraduationCap, FileDown, LayoutDashboard, AlertTriangle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { exportScheduleToPdf } from '@/lib/export-utils';
import { exportToExcel } from '@/lib/excel-utils';
import { Card, CardContent } from '@/components/ui/card';
export default function DashboardPage() {
  const fetchResources = useSchedulerStore(s => s.fetchResources);
  const scheduleEntries = useSchedulerStore(s => s.scheduleEntries);
  const classrooms = useSchedulerStore(s => s.classrooms);
  const subjects = useSchedulerStore(s => s.subjects);
  const teachers = useSchedulerStore(s => s.teachers);
  const timeSlots = useSchedulerStore(s => s.timeSlots);
  const loading = useSchedulerStore(s => s.loading);
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);
  const conflicts = getConflicts(scheduleEntries);
  const assignedPercentage = Math.round((scheduleEntries.filter(e => e.teacherId && e.subjectId).length / (classrooms.length * timeSlots.length || 1)) * 100);
  const handleExport = () => {
    try {
      exportScheduleToPdf(scheduleEntries, classrooms, subjects, teachers, timeSlots);
      toast.success("PDF exported successfully");
    } catch (err) {
      toast.error("Failed to generate PDF");
    }
  };
  const handleExcelExport = () => {
    try {
      exportToExcel(scheduleEntries, classrooms, subjects, teachers, timeSlots);
      toast.success("Excel exported successfully");
    } catch (err) {
      toast.error("Failed to generate Excel");
    }
  };
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-primary">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Scholastic Scheduler</h1>
                <p className="text-slate-500 text-sm font-medium">Professional School Logistics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 bg-white dark:bg-slate-900" onClick={handleExport} disabled={loading}>
                <FileDown className="w-4 h-4" /> PDF
              </Button>
              <Button variant="outline" className="gap-2 bg-white dark:bg-slate-900 text-green-600" onClick={handleExcelExport} disabled={loading}>
                <FileDown className="w-4 h-4" /> XLSX
              </Button>
              <ThemeToggle className="relative top-0 right-0" />
            </div>
          </header>
          <main className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-none shadow-soft bg-indigo-50/50 dark:bg-indigo-950/20">
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg"><BookOpen className="text-indigo-600 w-5 h-5" /></div>
                  <div>
                    <div className="text-2xl font-bold">{scheduleEntries.length}</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Lessons</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-soft">
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg"><LayoutDashboard className="text-amber-600 w-5 h-5" /></div>
                  <div>
                    <div className="text-2xl font-bold">{assignedPercentage}%</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Coverage Rate</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-soft bg-red-50/50 dark:bg-red-950/20">
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg"><AlertTriangle className="text-red-600 w-5 h-5" /></div>
                  <div>
                    <div className="text-2xl font-bold">{conflicts.length}</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Active Conflicts</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <section className="space-y-6">
              <MasterDataManager />
            </section>
            <section className="pt-8 border-t">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reporting & Visualization</h2>
              </div>
              <ScheduleVisualizer />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}