import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { getAdminStats } from '@/actions/dashboard';

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect('/sign-in');
  }

  const stats = await getAdminStats();

  return <AdminDashboard stats={stats} />;
}
