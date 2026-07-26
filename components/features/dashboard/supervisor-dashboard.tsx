import { DashboardView } from './dashboard';

export function SupervisorDashboard({ stats, user }: { stats: any; user: any }) {
  return <DashboardView role="supervisor" stats={stats} user={user} />;
}
