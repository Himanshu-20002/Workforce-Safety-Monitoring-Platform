import { MetricCard } from './metric-card';
import {
  Users,
  UserCheck,
  ShieldAlert,
  AlertTriangle,
  Calendar,
  CheckSquare,
  Award,
  ChevronRight,
  TrendingUp,
  Activity,
  UserX,
  FileText,
  Clock,
  ShieldCheck,
  PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import { LazyDashboardCharts } from './lazy-dashboard-charts';
import { formatElapsedTime } from '@/lib/escalation';

interface DashboardStats {
  // Admin stats
  totalWorkers?: number;
  totalSupervisors?: number;
  escalatedAlerts?: number;
  resolvedViolations?: number;
  recentViolations?: any[];
  recentEscalated?: any[];
  analyticsData?: {
    violationsBySite: any[];
    violationsByPpeType: any[];
  };
  
  // Supervisor stats
  todayViolations?: number;
  acknowledgedViolations?: number;

  // Shared stats
  pendingViolations?: number;
}

interface DashboardProps {
  role: 'admin' | 'supervisor';
  stats?: DashboardStats;
  user?: {
    name?: string | null;
    email: string;
    role: string;
  } | null;
}

export function DashboardView({ role, stats, user }: DashboardProps) {
  if (!user) {
    return <div className="text-center py-12">Not authenticated</div>;
  }

  const userName = user.name || (role === 'admin' ? 'Admin Officer' : 'Safety Supervisor');

  // Resolve KPI Cards dynamically based on user role
  const kpiCards =
    role === 'admin'
      ? [
          {
            title: 'Total Workers',
            value: stats?.totalWorkers || 0,
            icon: <Users className="h-5 w-5" />,
            colorClass: 'text-blue-500',
            description: 'Registered field personnel',
          },
          {
            title: 'Total Supervisors',
            value: stats?.totalSupervisors || 0,
            icon: <UserCheck className="h-5 w-5" />,
            colorClass: 'text-emerald-500',
            description: 'Safety officers assigned',
          },
          {
            title: 'Pending Violations',
            value: stats?.pendingViolations || 0,
            icon: <ShieldAlert className="h-5 w-5" />,
            colorClass: 'text-rose-500',
            description: 'Awaiting safety review',
          },
          {
            title: 'Escalated Alerts',
            value: stats?.escalatedAlerts || 0,
            icon: <AlertTriangle className="h-5 w-5" />,
            colorClass: 'text-amber-500',
            description: 'High severity alerts open',
          },
        ]
      : [
          {
            title: "Today's Violations",
            value: stats?.todayViolations || 0,
            icon: <Calendar className="h-5 w-5" />,
            colorClass: 'text-blue-500',
            description: 'Reported in the last 24 hours',
          },
          {
            title: 'Pending Violations',
            value: stats?.pendingViolations || 0,
            icon: <ShieldAlert className="h-5 w-5" />,
            colorClass: 'text-rose-500',
            description: 'Open cases needing review',
          },
          {
            title: 'Acknowledged Violations',
            value: stats?.acknowledgedViolations || 0,
            icon: <CheckSquare className="h-5 w-5" />,
            colorClass: 'text-amber-500',
            description: 'Under active resolution',
          },
        ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, <span className="text-primary">{userName}</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            {role === 'admin' 
              ? 'Manage safety monitoring operations, registry metrics, and system compliance alerts.' 
              : 'Review, acknowledge, and resolve active PPE safety violations reported from site monitors.'}
          </p>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            System Live
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Database Synced
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${role === 'admin' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}>
        {kpiCards.map((card, idx) => (
          <MetricCard
            key={idx}
            title={card.title}
            value={card.value}
            icon={card.icon}
            colorClass={card.colorClass}
            description={card.description}
          />
        ))}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Recent PPE Violations + Analytics Charts + Escalated Alerts) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent PPE Violations Table */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Recent PPE Violations</h3>
                  <p className="text-[10px] text-muted-foreground font-semibold">Latest worker safety breaches</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="min-w-full divide-y divide-border text-xs text-left">
                <thead className="bg-muted/80 font-bold text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Worker</th>
                    <th className="px-4 py-3">Site</th>
                    <th className="px-4 py-3">Violation Type</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {!stats?.recentViolations || stats.recentViolations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No recent safety violations recorded.
                      </td>
                    </tr>
                  ) : (
                    stats.recentViolations.map((v) => {
                      const isPending = v.status.toLowerCase() === 'open' || v.status.toLowerCase() === 'pending';
                      return (
                        <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-semibold text-foreground">{v.workerName}</td>
                          <td className="px-4 py-3 text-muted-foreground">{v.locationName || v.workerSite || 'General'}</td>
                          <td className="px-4 py-3 font-semibold capitalize text-foreground">{v.type.replace('_', ' ')}</td>
                          <td className="px-4 py-3 text-muted-foreground">{formatElapsedTime(v.createdAt)}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isPending 
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' 
                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                            }`}>
                              {v.status}
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

          {/* Dynamic Recharts Charts */}
          <LazyDashboardCharts 
            violationsBySite={stats?.analyticsData?.violationsBySite || []}
            violationsByPpeType={stats?.analyticsData?.violationsByPpeType || []}
          />

          {/* Recent Escalated Alerts Table */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-foreground">Recent Escalated Alerts</h3>
                <p className="text-[10px] text-muted-foreground font-semibold">Violations unacknowledged for &gt;10 minutes</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="min-w-full divide-y divide-border text-xs text-left">
                <thead className="bg-muted/80 font-bold text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Worker</th>
                    <th className="px-4 py-3">Site</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">Time Elapsed</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {!stats?.recentEscalated || stats.recentEscalated.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No safety alerts currently escalated.
                      </td>
                    </tr>
                  ) : (
                    stats.recentEscalated.map((v) => (
                      <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-semibold text-foreground">{v.workerName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{v.locationName || v.workerSite || 'General'}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-700 px-2 py-0.5 text-[10px] font-bold dark:bg-rose-500/10 dark:text-rose-400 capitalize">
                            {v.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatElapsedTime(v.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full bg-amber-500/15 text-amber-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
                            Escalated
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (Quick Actions + Workforce Summary) */}
        <div className="space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quick Operations</h3>
            <div className="flex flex-col gap-2">
              {role === 'admin' ? (
                <>
                  <Link
                    href="/admin/workers"
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-xs font-semibold text-foreground"
                  >
                    <span>Manage Workers Registry</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/admin/supervisors"
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-xs font-semibold text-foreground"
                  >
                    <span>Register Safety Supervisors</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/supervisor/violations"
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-xs font-semibold text-foreground"
                  >
                    <span>View Safety Violations</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/admin/alerts"
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-xs font-semibold text-foreground"
                  >
                    <span>View Escalated Alerts</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/admin/analytics"
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-xs font-semibold text-foreground"
                  >
                    <span>View Safety Analytics</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/supervisor/violations"
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-xs font-semibold text-foreground"
                  >
                    <span>View Safety Violations</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/supervisor/reports"
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-xs font-semibold text-foreground"
                  >
                    <span>Export Safety Reports</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/supervisor/analytics"
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-xs font-semibold text-foreground"
                  >
                    <span>View Safety Analytics</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Workforce Summary Card */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Workforce Summary</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Resolved Cases
                </span>
                <span className="font-bold text-foreground">{stats?.resolvedViolations || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-rose-500" />
                  Pending Cases
                </span>
                <span className="font-bold text-foreground">{stats?.pendingViolations || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Escalated Alerts
                </span>
                <span className="font-bold text-foreground">{stats?.escalatedAlerts || 0}</span>
              </div>
              <div className="flex justify-between py-2">
                {role === 'admin' ? (
                  <>
                    <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                      <UserCheck className="h-4 w-4 text-blue-500" />
                      Active Officers
                    </span>
                    <span className="font-bold text-foreground">{stats?.totalSupervisors || 0}</span>
                  </>
                ) : (
                  <>
                    <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      Today's Violations
                    </span>
                    <span className="font-bold text-foreground">{stats?.todayViolations || 0}</span>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
