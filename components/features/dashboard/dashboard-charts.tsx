'use client';

import {
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
import { BarChart3, PieChartIcon } from 'lucide-react';

const COLORS = ['#2563eb', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4', '#8b5cf6'];

interface DashboardChartsProps {
  violationsBySite: Array<{ site: string; count: number }>;
  violationsByPpeType: Array<{ name: string; value: number }>;
}

export default function DashboardCharts({ violationsBySite, violationsByPpeType }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Site Bar Chart */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-emerald-500" />
          <h3 className="text-sm font-bold text-foreground">Violations by Site</h3>
        </div>
        <div className="h-64 w-full">
          {violationsBySite.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              No site distribution data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationsBySite} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-zinc-800" />
                <XAxis 
                  dataKey="site" 
                  stroke="#888888" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)', 
                    borderRadius: '8px',
                    color: 'var(--foreground)',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={35} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* PPE Type Pie Chart */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-rose-500" />
          <h3 className="text-sm font-bold text-foreground">Violations by PPE Type</h3>
        </div>
        <div className="h-64 w-full flex items-center justify-center">
          {violationsByPpeType.length === 0 ? (
            <div className="text-xs text-muted-foreground">
              No PPE classification data available.
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={violationsByPpeType}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {violationsByPpeType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderColor: 'var(--border)', 
                      borderRadius: '8px',
                      color: 'var(--foreground)',
                      fontSize: '11px'
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
