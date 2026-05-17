"use client";

import Link from "next/link";
import { Mail, MapPin, Trash2, UserCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { StatusBadge } from "@/components/StatusBadge";
import { Textarea } from "@/components/Textarea";
import { api, ApiError } from "@/lib/api";
import { validateEmail, validateInternationalLocation, validateInternationalName } from "@/lib/validation";
import { useAuth } from "@/hooks/useAuth";
import type { Category, JobRequest, JobStatus, UserSummary } from "@/types/job";
import { categories, statuses } from "@/types/job";

function userId(user?: UserSummary | null) {
  return user ? ("id" in user ? user.id : user._id) : "";
}

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<JobRequest | null>(null);
  const [message, setMessage] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isOwner = Boolean(user && job?.createdBy && userId(job.createdBy) === user.id);
  const isAssignedTradesperson = Boolean(user && job?.assignedTo && userId(job.assignedTo) === user.id);
  const alreadyRequested = Boolean(
    user && job?.requests.some((request) => userId(request.tradesperson) === user.id)
  );

  const editForm = useMemo(
    () =>
      job
        ? {
            title: job.title,
            description: job.description,
            category: job.category,
            location: job.location,
            contactName: job.contactName,
            contactEmail: job.contactEmail
          }
        : null,
    [job]
  );
  const [form, setForm] = useState(editForm);

  useEffect(() => {
    if (editForm) setForm(editForm);
  }, [editForm]);

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.getJob(params.id);
        setJob(response.data.job);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Unable to load job");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [params.id]);

  const updateStatus = async (status: JobStatus) => {
    if (!job) return;
    setSaving(true);
    setError("");

    try {
      const response = await api.updateStatus(job._id, status);
      setJob(response.data.job);
      setMessage("Status updated");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to update status");
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async () => {
    if (!job || !form) return;
    const nextErrors: Record<string, string> = {};
    if (form.title.trim().length < 3) nextErrors.title = "Title must be at least 3 characters";
    if (form.description.trim().length < 10) nextErrors.description = "Description must be at least 10 characters";
    const locationError = validateInternationalLocation(form.location);
    const nameError = validateInternationalName(form.contactName, "Contact name");
    const emailError = validateEmail(form.contactEmail);
    if (locationError) nextErrors.location = locationError;
    if (nameError) nextErrors.contactName = nameError;
    if (emailError) nextErrors.contactEmail = emailError;

    setEditErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await api.updateJob(job._id, form);
      setJob(response.data.job);
      setEditing(false);
      setEditErrors({});
      setMessage("Job updated");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to update job");
    } finally {
      setSaving(false);
    }
  };

  const requestJob = async () => {
    if (!job) return;
    setSaving(true);
    setError("");

    try {
      const response = await api.requestJob(job._id, requestMessage);
      setJob(response.data.job);
      setRequestMessage("");
      setMessage("Your request was sent to the homeowner");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to request job");
    } finally {
      setSaving(false);
    }
  };

  const decideRequest = async (requestId: string, decision: "accept" | "decline") => {
    if (!job) return;
    setSaving(true);
    setError("");

    try {
      const response = await api.decideJobRequest(job._id, requestId, decision);
      setJob(response.data.job);
      setMessage(decision === "accept" ? "Tradesperson confirmed" : "Request declined");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to update request");
    } finally {
      setSaving(false);
    }
  };

  const deleteJob = async () => {
    if (!job || !window.confirm("Delete this job request? This action cannot be undone.")) return;
    setSaving(true);

    try {
      await api.deleteJob(job._id);
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to delete job");
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-lg border border-line bg-white p-8 text-sm text-muted shadow-soft">Loading job details...</div>;
  }

  if (error && !job) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-semibold">{error}</p>
        <Link className="mt-4 inline-block text-sm font-bold text-brand" href="/">
          Back to board
        </Link>
      </div>
    );
  }

  if (!job) return null;

  return (
    <section className="mx-auto max-w-4xl">
      <Link href="/" className="text-sm font-semibold text-brand hover:text-brand/80">
        Back to jobs
      </Link>

      <article className="mt-5 rounded-lg border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-5 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-brand">{job.category}</p>
            <h1 className="mt-2 text-3xl font-extrabold text-ink">{job.title}</h1>
            <p className="mt-2 text-sm text-muted">Posted by {job.createdBy?.name || "Unknown homeowner"}</p>
          </div>
          <StatusBadge status={job.status} />
        </div>

        {editing && form ? (
          <form className="mt-6 space-y-4" noValidate onSubmit={(event) => { event.preventDefault(); saveEdit(); }}>
            <Input
              label="Title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              error={editErrors.title}
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              error={editErrors.description}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as Category })}>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <Input
                label="Location"
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
                error={editErrors.location}
              />
              <Input
                label="Contact name"
                value={form.contactName}
                onChange={(event) => setForm({ ...form, contactName: event.target.value })}
                error={editErrors.contactName}
              />
              <Input
                label="Contact email"
                value={form.contactEmail}
                onChange={(event) => setForm({ ...form, contactEmail: event.target.value })}
                error={editErrors.contactEmail}
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                Save changes
              </Button>
              <Button type="button" variant="secondary" onClick={() => { setEditing(false); setEditErrors({}); }}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <p className="mt-6 whitespace-pre-line text-base leading-8 text-ink">{job.description}</p>
        )}

        <div className="mt-8 grid gap-4 rounded-lg bg-surface p-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-brand" />
            <div>
              <p className="text-sm font-bold text-ink">Location</p>
              <p className="text-sm text-muted">{job.location || "Location not specified"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-brand" />
            <div>
              <p className="text-sm font-bold text-ink">{job.contactName}</p>
              <p className="text-sm text-muted">{job.contactEmail}</p>
            </div>
          </div>
        </div>

        {job.assignedTo && (
          <div className="mt-5 flex items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <UserCheck className="h-5 w-5" />
            Assigned to {job.assignedTo.name}
          </div>
        )}

        <div className="mt-8 space-y-5 border-t border-line pt-5">
          {isAssignedTradesperson && (
            <Select label="Update status" value={job.status} onChange={(event) => updateStatus(event.target.value as JobStatus)} disabled={saving}>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          )}

          {isOwner && (
            <div className="flex flex-wrap gap-3">
              {!job.assignedTo && (
                <Button type="button" variant="secondary" onClick={() => setEditing(true)} disabled={saving}>
                  Edit job
                </Button>
              )}
              <Button type="button" variant="danger" onClick={deleteJob} disabled={saving}>
                <Trash2 className="h-4 w-4" />
                Delete job
              </Button>
            </div>
          )}

          {user?.role === "tradesperson" && !isAssignedTradesperson && !alreadyRequested && !job.assignedTo && job.status === "Open" && (
            <div className="space-y-3 rounded-lg border border-line p-4">
              <Textarea
                label="Message to homeowner"
                value={requestMessage}
                onChange={(event) => setRequestMessage(event.target.value)}
                placeholder="Briefly introduce yourself and your availability"
              />
              <Button type="button" onClick={requestJob} disabled={saving}>
                Request this job
              </Button>
            </div>
          )}

          {user?.role === "tradesperson" && alreadyRequested && !isAssignedTradesperson && (
            <p className="rounded-md bg-surface p-4 text-sm font-medium text-muted">You have already requested this job.</p>
          )}
        </div>

        {isOwner && job.requests.length > 0 && (
          <section className="mt-8 border-t border-line pt-5">
            <h2 className="text-lg font-bold text-ink">Tradesperson requests</h2>
            <div className="mt-4 space-y-3">
              {job.requests.map((request) => (
                <div key={request._id} className="rounded-lg border border-line p-4">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <p className="font-bold text-ink">{request.tradesperson.name}</p>
                      <p className="text-sm text-muted">{request.tradesperson.email}</p>
                      {request.message && <p className="mt-2 text-sm leading-6 text-ink">{request.message}</p>}
                    </div>
                    <span className="text-sm font-semibold text-muted">{request.status}</span>
                  </div>
                  {request.status === "Pending" && !job.assignedTo && (
                    <div className="mt-4 flex gap-2">
                      <Button type="button" onClick={() => decideRequest(request._id, "accept")} disabled={saving}>
                        Confirm
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => decideRequest(request._id, "decline")} disabled={saving}>
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {message && <p className="mt-4 text-sm font-semibold text-brand">{message}</p>}
        {error && <p className="mt-4 text-sm font-semibold text-accent">{error}</p>}
      </article>
    </section>
  );
}
