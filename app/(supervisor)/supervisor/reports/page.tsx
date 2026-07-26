import { getViolations } from '@/actions/violations';
import { ReportsDashboard } from '@/components/features/reports/reports-dashboard';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export default async function ReportsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect('/sign-in');
  }

  const role = (session.user as any).role;
  if (role !== 'supervisor' && role !== 'admin') {
    redirect('/');
  }

  const { violations = [] } = await getViolations();

  return (
    <main className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Safety Reports</h1>
        <p className="text-muted-foreground text-sm">
          Generate, compile, and download safety compliance logs from the database violations registry.
        </p>
      </div>

      <ReportsDashboard violations={violations as any} />
    </main>
  );
}
