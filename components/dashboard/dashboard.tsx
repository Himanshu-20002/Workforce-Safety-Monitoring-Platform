'use client';

import { useSession } from '@/hooks/use-session';
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
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  // Admin stats
  totalWorkers?: number;
  totalSupervisors?: number;
  escalatedAlerts?: number;
  
  // Supervisor stats
  todayViolations?: number;
  acknowledgedViolations?: number;

  // Shared stats
  pendingViolations?: number;
}

interface DashboardProps {
  role: 'admin' | 'supervisor';
  stats?: DashboardStats;
}

export function DashboardView({ role, stats }: DashboardProps) {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="text-center py-20 text-muted-foreground animate-pulse font-semibold">
        Syncing telemetry feeds...
      </div>
    );
  }

  if (!session) {
    return <div className="text-center py-12">Not authenticated</div>;
  }

  const userName = session.name || (role === 'admin' ? 'Admin Officer' : 'Safety Supervisor');

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

  // Quick Action properties based on role
  const quickAction =
    role === 'admin'
      ? {
          title: 'Need Immediate Assist?',
          description:
            'Initiate emergency protocols, broadcast safety updates, or dispatch supervisors to active zones in one tap.',
          btnText: 'Dispatch Supervisor',
          btnHref: '/admin/supervisors',
        }
      : {
          title: 'Need Immediate Assist?',
          description:
            'Review, acknowledge, and resolve active PPE safety violations reported from site monitors.',
          btnText: 'Manage Violations',
          btnHref: '/supervisor/violations',
        };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back, <span className="text-primary">{userName}</span>
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Manage your safety monitoring operations and field compliance metrics.
        </p>

        {/* Status Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-950/20 dark:text-emerald-400">
            ✓ System Operational
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/10 dark:bg-blue-950/20 dark:text-blue-400">
            ✓ Telemetry Live
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/10 dark:bg-indigo-950/20 dark:text-indigo-400">
            ✓ Database Synced
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
        {/* Left Column (Feed + Alerts/Violations) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Live Telemetry Feed */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-primary">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Live Telemetry Feed</h3>
              </div>
              <Link
                href={role === 'admin' ? '/admin/analytics' : '/supervisor/violations'}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
              >
                {role === 'admin' ? 'View analytics' : 'View violations'}{' '}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-border/60">
              {/* Item 1 */}
              <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">TX-99238 • Refinery East</p>
                  <p className="text-xs text-muted-foreground">Pulse Rate & GPS Stream</p>
                </div>
                <div className="text-right space-y-1.5">
                  <p className="text-sm font-bold text-foreground">98 bpm</p>
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-950/30 dark:text-emerald-400">
                    stable
                  </span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">TX-99241 • Deep Core 2</p>
                  <p className="text-xs text-muted-foreground">High Temperature Threshold</p>
                </div>
                <div className="text-right space-y-1.5">
                  <p className="text-sm font-bold text-foreground">42° C</p>
                  <span className="inline-flex items-center rounded-md bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 ring-1 ring-inset ring-rose-600/10 dark:bg-rose-950/30 dark:text-rose-400">
                    alert triggered
                  </span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">TX-99105 • Storage Site A</p>
                  <p className="text-xs text-muted-foreground">Gas Level Telemetry</p>
                </div>
                <div className="text-right space-y-1.5">
                  <p className="text-sm font-bold text-foreground">0.02% ppm</p>
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-600/10 dark:bg-blue-950/30 dark:text-blue-400">
                    syncing logs
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Feed container (Alerts for Admin, Violations for Supervisor) */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              {role === 'admin' ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h3 className="text-base font-bold text-foreground">Recent Safety Alerts</h3>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-5 w-5 text-rose-500" />
                  <h3 className="text-base font-bold text-foreground">Recent Safety Violations</h3>
                </>
              )}
            </div>
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground font-medium">
                {role === 'admin'
                  ? 'No unresolved high-severity safety alerts requiring attention.'
                  : 'No recent safety violations recorded.'}
              </p>
            </div>
          </div>

        </div>

        {/* Right Column (Emergency Quick Actions + Score + Hubs) */}
        <div className="space-y-6">
          {/* Solid Color Assist Panel */}
          <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white rounded-xl p-6 shadow-md shadow-blue-500/10 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold tracking-tight">{quickAction.title}</h3>
              <p className="text-sm text-blue-100/90 leading-relaxed font-medium">
                {quickAction.description}
              </p>
            </div>
            <Link
              href={quickAction.btnHref}
              className="w-full inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 transition-colors font-bold text-sm px-4 py-2.5 rounded-lg shadow-sm"
            >
              {quickAction.btnText} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Compliance Score Card */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl">
              <Award className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Safety Rating</p>
              <h4 className="text-lg font-extrabold text-foreground">98.2 / 100 (A+)</h4>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> Top-tier client safety standing
              </p>
            </div>
          </div>

          {/* Operating Hubs Summary Card */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Operating Hubs</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground font-medium">Primary Site</span>
                <span className="font-bold text-foreground">Refinery East</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground font-medium">Refinery Partners</span>
                <span className="font-bold text-foreground">IOCL, HPCL</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground font-medium">Active Supervisors</span>
                <span className="font-bold text-foreground">3 Partners</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
