import React from 'react';
import DashboardPage from './DashboardPage';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  return (
    <>
      <DashboardPage />
      <Toaster richColors position="top-right" />
    </>
  );
}