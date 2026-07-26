export default function SupervisorLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse p-4 md:p-6">
      {/* Title skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-muted rounded-lg w-1/4" />
        <div className="h-4 bg-muted/60 rounded-lg w-2/5" />
      </div>

      {/* Grid KPI skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-8 w-8 bg-muted rounded-lg" />
            </div>
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted/60 rounded w-3/4" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-muted rounded w-1/6" />
          <div className="h-9 bg-muted rounded-lg w-1/12" />
        </div>
        <div className="space-y-3 pt-4">
          <div className="h-10 bg-muted/85 rounded-lg w-full" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted/40 rounded-lg w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
