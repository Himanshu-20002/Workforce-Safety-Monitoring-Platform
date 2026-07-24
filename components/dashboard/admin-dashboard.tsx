'use client';

import { DashboardView } from './dashboard';

export function AdminDashboard({ stats }: { stats: any }) {
  return <DashboardView role="admin" stats={stats} />;
}
