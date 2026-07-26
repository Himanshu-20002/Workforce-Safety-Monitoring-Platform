import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  description?: string;
  colorClass?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export function MetricCard({
  title,
  value,
  icon,
  description,
  colorClass = 'text-foreground',
  trend,
}: MetricCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:border-foreground/15 transition-colors flex flex-col justify-between min-h-[140px] h-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 outline-none">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className={`text-3xl font-bold tracking-tight ${colorClass}`}>
            {value}
          </p>
        </div>
        {icon && (
          <div className={`p-2.5 rounded-lg bg-muted/60 ${colorClass} flex items-center justify-center`}>
            {icon}
          </div>
        )}
      </div>
      {(description || trend) && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50 text-xs">
          {description && (
            <span className="text-muted-foreground font-medium">{description}</span>
          )}
          {trend && (
            <span
              className={`font-semibold ${
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
