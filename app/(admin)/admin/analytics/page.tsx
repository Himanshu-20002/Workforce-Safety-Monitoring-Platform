import { getAnalyticsData } from '@/actions/analytics';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { LazyAnalyticsDashboard } from '@/components/features/analytics/lazy-analytics-dashboard';

export default async function AnalyticsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect('/sign-in');
  }

  const role = (session.user as any).role;
  if (role !== 'admin') {
    redirect('/');
  }

  const { data, success, error } = await getAnalyticsData();

  return (
    <main className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Safety Analytics</h1>
        <p className="text-muted-foreground text-sm">
          Real-time metrics, geographical distribution, and compliance trends of active workplace safety violations.
        </p>
      </div>

      {!success && error && (
        <div className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/10 p-3 rounded-lg border border-rose-200 dark:border-rose-900/50">
          {error}
        </div>
      )}

      {data && (
        <LazyAnalyticsDashboard data={data} />
      )}
    </main>
  );
}
