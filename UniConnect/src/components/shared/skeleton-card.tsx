export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3 animate-pulse" role="status" aria-label="Loading">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-muted" />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-full bg-muted" />
        <div className="h-5 w-12 rounded-full bg-muted" />
      </div>
      <div className="h-3 w-1/3 rounded bg-muted" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3 animate-pulse" role="status" aria-label="Loading table">
      <div className="h-10 w-full rounded-lg bg-muted" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 w-full rounded-lg bg-muted/50" />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 animate-pulse" role="status" aria-label="Loading stats">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="mx-auto h-7 w-7 rounded-full bg-muted" />
          <div className="mx-auto h-6 w-16 rounded bg-muted" />
          <div className="mx-auto h-3 w-20 rounded bg-muted" />
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
