'use client';

import dynamic from 'next/dynamic';

export const LazyAnalyticsDashboard = dynamic(
  () => import('./analytics-dashboard').then((mod) => mod.AnalyticsDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full bg-card rounded-xl border border-border flex items-center justify-center text-sm text-muted-foreground animate-pulse font-semibold">
        Syncing telemetry charts...
      </div>
    ),
  }
);
