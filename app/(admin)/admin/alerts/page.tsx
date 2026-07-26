import { getEscalatedAlerts } from '@/actions/alerts';
import { formatElapsedTime } from '@/lib/escalation';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { ShieldAlert, MapPin, Clock, AlertTriangle, AlertOctagon } from 'lucide-react';

export default async function AlertsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect('/sign-in');
  }

  const role = (session.user as any).role;
  if (role !== 'admin') {
    redirect('/');
  }

  const { alerts = [], error } = await getEscalatedAlerts();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Safety Alerts Registry</h1>
        <p className="text-muted-foreground text-sm">
          Overview of escalated safety violations which have remained pending and unacknowledged for more than 10 minutes.
        </p>
      </div>

      {error && (
        <div className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/10 p-3 rounded-lg border border-rose-200 dark:border-rose-900/50">
          {error}
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/80 font-semibold text-muted-foreground text-left">
              <tr>
                <th className="px-6 py-4">Worker</th>
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">Site / Location</th>
                <th className="px-6 py-4">Violation Type</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Time Elapsed</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="p-3 rounded-full bg-muted text-muted-foreground">
                        <ShieldAlert className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">No escalated alerts</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          All active safety violations have been acknowledged or resolved in a timely manner.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                alerts.map((a) => {
                  let severityBadgeClass = '';
                  let SeverityIcon = AlertTriangle;

                  if (a.severity.toLowerCase() === 'critical' || a.severity.toLowerCase() === 'high') {
                    severityBadgeClass = 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10 dark:bg-rose-950/40 dark:text-rose-400';
                    SeverityIcon = AlertOctagon;
                  } else if (a.severity.toLowerCase() === 'medium') {
                    severityBadgeClass = 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10 dark:bg-amber-950/40 dark:text-amber-400';
                  } else {
                    severityBadgeClass = 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/10 dark:bg-blue-950/40 dark:text-blue-400';
                  }

                  return (
                    <tr key={a.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {a.workerName}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground font-semibold">
                        {a.workerEmployeeId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {a.locationName || a.workerSite || 'General Zone'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <span className="font-semibold text-foreground block capitalize">
                          {a.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs">{a.description}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold ${severityBadgeClass}`}>
                          <SeverityIcon className="h-3 w-3" />
                          {a.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                          <Clock className="h-3.5 w-3.5" />
                          {formatElapsedTime(a.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                          Escalated
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
