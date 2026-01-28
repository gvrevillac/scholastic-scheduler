import React, { useEffect } from 'react';
import { useSchedulerStore } from '@/store/scheduler-store';
import { AssignmentForm } from '@/components/scheduler/AssignmentForm';
import { AssignmentsTable } from '@/components/scheduler/AssignmentsTable';
import { ScheduleVisualizer } from '@/components/scheduler/ScheduleVisualizer';
import { MasterDataManager } from '@/components/scheduler/MasterDataManager';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GraduationCap, FileDown, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { exportScheduleToPdf } from '@/lib/export-utils';
import { exportToExcel } from '@/lib/excel-utils';
export default function DashboardPage() {
  const fetchAssignments = useSchedulerStore(s => s.fetchAssignments);
  const fetchAllMasters = useSchedulerStore(s => s.fetchAllMasters);
  const assignments = useSchedulerStore(s => s.assignments);
  const classrooms = useSchedulerStore(s => s.classrooms);
  const subjects = useSchedulerStore(s => s.subjects);
  const teachers = useSchedulerStore(s => s.teachers);
  const timeSlots = useSchedulerStore(s => s.timeSlots);
  const loading = useSchedulerStore(s => s.loading);
  useEffect(() => {
    fetchAssignments();
    fetchAllMasters();
  }, [fetchAssignments, fetchAllMasters]);
  const handleExport = () => {
    if (assignments.length === 0) {
      toast.error("No assignments to export!");
      return;
    }
    try {
      exportScheduleToPdf(assignments, classrooms, subjects, teachers, timeSlots);
      toast.success("Schedule exported successfully");
    } catch (err) {
      toast.error("Failed to generate PDF report");
    }
  };
  const handleExcelExport = () => {
    if (assignments.length === 0) {
      toast.error("No assignments to export!");
      return;
    }
    try {
      exportToExcel(assignments, classrooms, subjects, teachers, timeSlots);
      toast.success("Excel workbook generated successfully");
    } catch (err) {
      toast.error("Failed to generate Excel file");
    }
  };
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Scholastic Scheduler</h1>
                <p className="text-muted-foreground text-sm font-medium">Resource Management Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 bg-white dark:bg-slate-900" onClick={handleExport} disabled={loading}>
                <FileDown className="w-4 h-4" /> PDF
              </Button>
              <Button variant="outline" className="gap-2 bg-white dark:bg-slate-900" onClick={handleExcelExport} disabled={loading}>
                <FileDown className="w-4 h-4 text-green-600" /> XLSX
              </Button>
              <ThemeToggle className="relative top-0 right-0" />
            </div>
          </header>
          <main className="space-y-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="resource-management" className="border-none">
                <AccordionTrigger className="hover:no-underline bg-white dark:bg-slate-900 px-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Settings2 className="w-5 h-5" />
                    <span>Resource Management</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <MasterDataManager />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1"><AssignmentForm /></div>
              <div className="lg:col-span-2"><AssignmentsTable /></div>
            </div>
            <section className="pt-8 border-t">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Schedule Visualization</h2>
              </div>
              <ScheduleVisualizer />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}