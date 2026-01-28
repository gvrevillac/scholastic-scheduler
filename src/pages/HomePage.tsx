import React from 'react';
import DashboardPage from './DashboardPage';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
export function HomePage() {
  return (
    <TooltipProvider delayDuration={300}>
      <DashboardPage />
      <Toaster richColors position="top-right" closeButton />
    </TooltipProvider>
  );
}