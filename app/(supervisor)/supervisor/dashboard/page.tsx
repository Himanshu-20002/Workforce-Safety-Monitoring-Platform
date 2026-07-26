import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { SupervisorDashboard } from '@/components/dashboard/supervisor-dashboard';
import { getSupervisorStats } from '@/actions/dashboard';

export default async function SupervisorDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect('/sign-in');
  }

  const stats = await getSupervisorStats();

  return <SupervisorDashboard stats={stats} user={session.user} />;
}
