'use client';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Activity, ShieldAlert, BarChart3, PieChartIcon } from 'lucide-react';
import DashboardCharts from '@/components/dashboard/dashboard-charts';

const COLORS = ['#2563eb', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4', '#8b5cf6'];

interface AnalyticsDashboardProps {
  data: {
    violationsBySite: Array<{ site: string; count: number }>;
    violationsByPpeType: Array<{ name: string; value: number }>;
    dailyViolations: Array<{ date: string; count: number }>;
  };
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const { violationsBySite, violationsByPpeType, dailyViolations } = data;

  const totalViolations = violationsByPpeType.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stat Row */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-primary rounded-xl">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Violations Summary</h2>
            <p className="text-sm text-muted-foreground">Total PPE violations recorded in database</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold text-foreground">{totalViolations}</span>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total Cases</p>
        </div>
      </div>

      {/* Daily Violations Area Chart */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold text-foreground">Daily Violations Trend</h3>
        </div>
        <div className="h-80 w-full">
          {dailyViolations.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              No historical data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyViolations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-zinc-800" />
                <XAxis 
                  dataKey="date" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)', 
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#2563eb" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Grid of Site Bar & PPE Type Pie */}
      <DashboardCharts 
        violationsBySite={violationsBySite} 
        violationsByPpeType={violationsByPpeType} 
      />
    </div>
  );
}
