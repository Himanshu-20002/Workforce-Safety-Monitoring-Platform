import { DashboardView } from './dashboard';

export function AdminDashboard({ stats, user }: { stats: any; user: any }) {
  return <DashboardView role="admin" stats={stats} user={user} />;
}
