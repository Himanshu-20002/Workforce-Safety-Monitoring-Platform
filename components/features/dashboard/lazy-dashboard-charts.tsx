'use client';

import dynamic from 'next/dynamic';

export const LazyDashboardCharts = dynamic(
  () => import('./dashboard-charts'),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full bg-card rounded-xl border border-border flex items-center justify-center text-xs text-muted-foreground animate-pulse font-semibold">
        Syncing safety telemetry charts...
      </div>
    ),
  }
);
