import React, { useEffect } from 'react';
import { useSchedulerStore } from '@/store/scheduler-store';
import { AssignmentForm } from '@/components/scheduler/AssignmentForm';
import { AssignmentsTable } from '@/components/scheduler/AssignmentsTable';
import { ScheduleVisualizer } from '@/components/scheduler/ScheduleVisualizer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GraduationCap, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { exportScheduleToPdf } from '@/lib/export-utils';
export default function DashboardPage() {
  const fetchAssignments = useSchedulerStore(s => s.fetchAssignments);
  const assignments = useSchedulerStore(s => s.assignments);
  const loading = useSchedulerStore(s => s.loading);
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);
  const handleExport = () => {
    if (assignments.length === 0) {
      toast.error("No assignments to export!");
      return;
    }
    try {
      exportScheduleToPdf(assignments);
      toast.success("Schedule exported successfully");
    } catch (err) {
      toast.error("Failed to generate PDF report");
    }
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
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Scholastic Scheduler</h1>
                <p className="text-muted-foreground text-sm font-medium">Resource Management Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
                onClick={handleExport}
                disabled={loading}
              >
                <FileDown className="w-4 h-4" />
                Export PDF
              </Button>
              <ThemeToggle className="relative top-0 right-0" />
            </div>
          </header>
          <main className="space-y-12">
            {/* Top Section: Assignment Hub */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <AssignmentForm />
                </div>
                <div className="lg:col-span-2">
                  <AssignmentsTable />
                </div>
              </div>
            </section>
            {/* Bottom Section: Visualization Engine */}
            <section className="pt-8 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Schedule Visualization</h2>
                <p className="text-muted-foreground text-sm">Real-time conflict detection and resource distribution</p>
              </div>
              <ScheduleVisualizer />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}