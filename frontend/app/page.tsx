"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { JobCard } from "@/components/JobCard";
import { JobSkeleton } from "@/components/JobSkeleton";
import { Select } from "@/components/Select";
import { api, ApiError } from "@/lib/api";
import type { Category, JobRequest, JobStatus } from "@/types/job";
import { categories, statuses } from "@/types/job";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [category, setCategory] = useState<Category | "">("");
  const [status, setStatus] = useState<JobStatus | "">("");
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedKeyword(keyword.trim()), 250);
    return () => clearTimeout(timeout);
  }, [keyword]);

  const params = useMemo(() => {
    const query = new URLSearchParams();
    if (category) query.set("category", category);
    if (status) query.set("status", status);
    if (debouncedKeyword) query.set("keyword", debouncedKeyword);
    return query;
  }, [category, status, debouncedKeyword]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const loadJobs = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.getJobs(params, controller.signal);
        if (active) setJobs(response.data.jobs);
      } catch (err) {
        if (active && !(err instanceof DOMException && err.name === "AbortError")) {
          setError(err instanceof ApiError ? err.message : "Unable to load jobs");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadJobs();
    return () => {
      active = false;
      controller.abort();
    };
  }, [params]);

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 border-b border-line pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand">Service Requests</p>
          <h1 className="mt-2 text-2xl font-extrabold text-ink sm:text-4xl">Mini Service Request Board</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
            Browse open homeowner jobs, filter by category or status, and manage request progress from one clean board.
          </p>
        </div>
        {user?.role === "homeowner" && (
          <Link href="/jobs/new">
            <Button>Create new job</Button>
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-3 rounded-lg border border-line bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px]">
        <label className="relative block">
          <span className="sr-only">Search jobs</span>
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search title or description"
            className="focus-ring min-h-11 w-full rounded-md border border-line bg-white pl-9 pr-3 text-sm"
          />
        </label>
        <Select value={category} onChange={(event) => setCategory(event.target.value as Category | "")}>
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select value={status} onChange={(event) => setStatus(event.target.value as JobStatus | "")}>
          <option value="">All statuses</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? Array.from({ length: 3 }).map((_, index) => <JobSkeleton key={index} />) : jobs.map((job) => <JobCard key={job._id} job={job} />)}
      </div>

      {!loading && !error && jobs.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-line bg-white p-10 text-center">
          <h2 className="text-lg font-bold text-ink">No job requests found</h2>
          <p className="mt-2 text-sm text-muted">Try changing the filters or check back later.</p>
        </div>
      )}
    </section>
  );
}
