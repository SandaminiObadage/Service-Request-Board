"use client";

import Link from "next/link";
import { BriefcaseBusiness, PlusCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="rounded-lg border border-line bg-white p-8 text-sm text-muted shadow-soft">Loading profile...</div>;
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-lg rounded-lg border border-line bg-white p-8 text-center shadow-soft">
        <h1 className="text-2xl font-extrabold text-ink">Login required</h1>
        <p className="mt-2 text-sm text-muted">Please log in to view your profile.</p>
        <Link href="/login" className="mt-6 inline-block">
          <Button>Login</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-brand text-white">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-brand">Profile</p>
            <h1 className="mt-1 text-3xl font-extrabold text-ink">{user.name}</h1>
            <p className="mt-2 text-sm text-muted">{user.email}</p>
          </div>
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-surface p-4">
            <dt className="text-sm font-bold text-ink">Role</dt>
            <dd className="mt-1 capitalize text-muted">{user.role}</dd>
          </div>
          <div className="rounded-lg bg-surface p-4">
            <dt className="text-sm font-bold text-ink">Account created</dt>
            <dd className="mt-1 text-muted">{new Date(user.createdAt).toLocaleDateString()}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/">
            <Button variant="secondary">
              <BriefcaseBusiness className="h-4 w-4" />
              Browse jobs
            </Button>
          </Link>
          {user.role === "homeowner" && (
            <Link href="/jobs/new">
              <Button>
                <PlusCircle className="h-4 w-4" />
                Create job
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
