import type { JobStatus } from "@/types/job";

const styles: Record<JobStatus, string> = {
  Open: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "In Progress": "bg-amber-50 text-amber-700 ring-amber-200",
  Closed: "bg-slate-100 text-slate-700 ring-slate-300"
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[status]}`}>
      {status}
    </span>
  );
}
