export function JobSkeleton() {
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="h-3 w-20 rounded bg-slate-200" />
      <div className="mt-4 h-5 w-3/4 rounded bg-slate-200" />
      <div className="mt-5 space-y-2">
        <div className="h-3 rounded bg-slate-200" />
        <div className="h-3 w-5/6 rounded bg-slate-200" />
        <div className="h-3 w-2/3 rounded bg-slate-200" />
      </div>
      <div className="mt-6 h-4 w-1/2 rounded bg-slate-200" />
    </div>
  );
}
