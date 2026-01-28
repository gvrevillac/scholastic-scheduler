import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle } from 'lucide-react';
import { CLASSROOMS } from '@shared/mock-data';
interface ConflictBadgeProps {
  otherClassroomIds: string[];
}
export function ConflictBadge({ otherClassroomIds }: ConflictBadgeProps) {
  const names = otherClassroomIds.map(id => CLASSROOMS.find(c => c.id === id)?.name || id).join(', ');
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold cursor-help animate-pulse border border-destructive/20">
            <AlertCircle className="w-3 h-3" />
            CONFLICT
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-destructive text-destructive-foreground border-none">
          <p className="text-xs font-medium">Teacher double-booked with: {names}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}