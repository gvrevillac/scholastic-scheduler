import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle } from 'lucide-react';
import { useSchedulerStore, getConflicts } from '@/store/scheduler-store';
interface ConflictBadgeProps {
  otherClassroomIds: string[];
}
export function ConflictBadge({ otherClassroomIds }: ConflictBadgeProps) {
  const classrooms = useSchedulerStore(s => s.classrooms);
  const names = otherClassroomIds
    .map(id => classrooms.find(c => c.id === id)?.name || id)
    .join(', ');
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-[9px] font-bold cursor-help border border-red-200 dark:border-red-900 transition-colors animate-in fade-in zoom-in duration-300">
          <AlertCircle className="w-3 h-3 animate-pulse" />
          <span>CONFLICT</span>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-red-600 text-white border-none shadow-xl px-3 py-2 max-w-[200px]"
      >
        <p className="text-[11px] font-bold mb-1">Teacher double-booked!</p>
        <p className="text-[10px] opacity-90 leading-tight">
          Also scheduled in: <span className="font-bold underline">{names}</span> at this same time.
        </p>
      </TooltipContent>
    </Tooltip>
  );
}