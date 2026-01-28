import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle } from 'lucide-react';
import { useSchedulerStore } from '@/store/scheduler-store';
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
        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-destructive/15 text-destructive text-[10px] font-bold cursor-help border border-destructive/20 transition-colors hover:bg-destructive/25">
          <AlertCircle className="w-3 h-3 animate-pulse" />
          <span>CONFLICT</span>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-destructive text-destructive-foreground border-none shadow-lg px-3 py-1.5"
      >
        <p className="text-xs font-semibold">Teacher double-booked with:</p>
        <p className="text-[11px] opacity-90">{names}</p>
      </TooltipContent>
    </Tooltip>
  );
}