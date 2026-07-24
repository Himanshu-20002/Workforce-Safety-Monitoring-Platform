'use client';

import { DashboardView } from './dashboard';

export function SupervisorDashboard({ stats }: { stats: any }) {
  return <DashboardView role="supervisor" stats={stats} />;
}
