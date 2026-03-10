export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="animate-pulse overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
        <div className="border-b border-border/60 bg-muted/30 px-5 py-5 sm:px-6">
          <div className="h-5 w-40 rounded-lg bg-muted" />
          <div className="mt-2 h-4 w-64 rounded bg-muted/80" />
        </div>
        <div className="space-y-2 p-5 sm:p-6">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-muted/60" />
          ))}
          <div className="h-14 rounded-xl bg-muted/60" />
          <div className="h-10 rounded-xl bg-muted/60" />
          <div className="h-24 rounded-xl bg-muted/60" />
          <div className="h-11 rounded-xl bg-muted/60" />
        </div>
      </div>
    </div>
  );
}
