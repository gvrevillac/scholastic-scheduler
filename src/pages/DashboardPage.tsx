import React, { useEffect } from 'react';
import { useSchedulerStore } from '@/store/scheduler-store';
import { AssignmentForm } from '@/components/scheduler/AssignmentForm';
import { AssignmentsTable } from '@/components/scheduler/AssignmentsTable';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GraduationCap, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
export default function DashboardPage() {
  const fetchAssignments = useSchedulerStore(s => s.fetchAssignments);
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);
  const handleExport = () => {
    toast.info("Exporting functionality coming in Phase 2!");
  };
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Scholastic Scheduler</h1>
                <p className="text-muted-foreground text-sm">Resource Management Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2" onClick={handleExport}>
                <FileDown className="w-4 h-4" />
                Export PDF
              </Button>
              <ThemeToggle className="relative top-0 right-0" />
            </div>
          </header>
          <main className="space-y-10">
            {/* Top Section: Assignment Hub */}
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <AssignmentForm />
                </div>
                <div className="lg:col-span-2">
                  <AssignmentsTable />
                </div>
              </div>
            </section>
            {/* Bottom Section: Visualization Engine Placeholder */}
            <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                <h3 className="text-lg font-semibold mb-2">Schedule Visualization Engine</h3>
                <p className="text-muted-foreground max-w-md">
                  In Phase 2, this section will feature interactive grids for viewing schedules by Time, Classroom, and Teacher with real-time conflict detection.
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}