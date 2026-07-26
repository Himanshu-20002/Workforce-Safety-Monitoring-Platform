import { getWorkers } from '@/actions/workers';
import { WorkersFilter } from '@/components/workers/workers-filter';
import { WorkersPagination } from '@/components/workers/workers-pagination';
import { Users } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    site?: string;
    page?: string;
  }>;
}

export default async function SupervisorWorkersPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || '';
  const site = resolvedParams.site || 'all';
  const page = parseInt(resolvedParams.page || '1', 10);
  const limit = 10;

  const { workers, totalPages, sites } = await getWorkers({
    search,
    site,
    page,
    limit,
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Workers Registry</h1>
        <p className="text-muted-foreground text-sm">
          View all registered workforce personnel, job profiles, and active safety locations (Read-Only).
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
        {/* Filters */}
        <WorkersFilter
          sites={sites}
          currentSearch={search}
          currentSite={site}
        />

        {/* Responsive Table with Sticky Header */}
        <div className="overflow-x-auto rounded-lg border border-border max-h-[600px] overflow-y-auto">
          <table className="min-w-full divide-y divide-border text-sm relative">
            <thead className="bg-muted/80 font-semibold text-muted-foreground text-left sticky top-0 backdrop-blur-sm z-10 border-b border-border">
              <tr>
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">Worker Name</th>
                <th className="px-6 py-4">Site</th>
                <th className="px-6 py-4">Job Profile</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {workers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="p-3 rounded-full bg-muted text-muted-foreground">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">No workers found</p>
                        <p className="text-xs text-muted-foreground max-w-xs mt-1">
                          No personnel matched the name search or selected safety site location.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                workers.map((worker) => {
                  const status = worker.status || 'Active';
                  let statusBadgeClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                  
                  if (status.toLowerCase() === 'active') {
                    statusBadgeClass = 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20';
                  } else if (status.toLowerCase() === 'pending') {
                    statusBadgeClass = 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20';
                  } else if (status.toLowerCase() === 'escalated') {
                    statusBadgeClass = 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20';
                  }

                  return (
                    <tr key={worker.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-foreground font-semibold">
                        {worker.employeeId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {worker.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {worker.site}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {worker.jobProfile || 'Staff'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${statusBadgeClass}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <WorkersPagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
