import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { JobRequest } from "@/types/job";
import { StatusBadge } from "@/components/StatusBadge";

export function JobCard({ job }: { job: JobRequest }) {
  return (
    <Link
      href={`/jobs/${job._id}`}
      className="group block rounded-lg border border-line bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand/40"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand">{job.category}</p>
          <h2 className="mt-2 text-lg font-bold text-ink group-hover:text-brand">{job.title}</h2>
        </div>
        <StatusBadge status={job.status} />
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{job.description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          {job.location || "Location not specified"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" />
          {new Date(job.createdAt).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
}
