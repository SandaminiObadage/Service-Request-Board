"use client";

import Link from "next/link";
import { LogOut, PlusCircle, UserRound, Wrench, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand text-white">
              <Wrench className="h-5 w-5" />
            </span>
            <span className="max-w-36 truncate text-base font-extrabold text-ink sm:max-w-none sm:text-lg">Mini Service Request Board</span>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {!loading && user?.role === "homeowner" && (
              <Link
                href="/jobs/new"
                className="inline-flex min-h-10 items-center gap-2 rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">New Job</span>
              </Link>
            )}

            {!loading && user ? (
              <>
                <button
                  type="button"
                  onClick={() => setProfileOpen(true)}
                  className="inline-flex min-h-10 max-w-44 items-center gap-2 truncate rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:bg-surface hover:text-brand sm:max-w-56"
                >
                  <UserRound className="h-4 w-4 shrink-0" />
                  <span className="hidden truncate md:inline">
                    {user.name} - {user.role}
                  </span>
                </button>
                <Button variant="secondary" onClick={handleLogout} aria-label="Log out" className="min-h-10 px-3">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              !loading && (
                <div className="flex items-center gap-2">
                  <Link className="text-sm font-semibold text-ink hover:text-brand" href="/login">
                    Login
                  </Link>
                  <Link className="hidden text-sm font-semibold text-ink hover:text-brand sm:inline" href="/register">
                    Register
                  </Link>
                </div>
              )
            )}
          </div>
        </nav>
      </header>

      {profileOpen && user && (
        <div className="fixed inset-0 z-[9999] grid place-items-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setProfileOpen(false)}
            aria-label="Close profile"
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-line bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-brand">Profile</p>
                <h2 className="mt-1 text-2xl font-extrabold text-ink">{user.name}</h2>
                <p className="mt-1 text-sm capitalize text-muted">{user.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-md border border-line text-muted transition hover:bg-surface hover:text-ink"
                aria-label="Close profile"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <div className="rounded-md bg-surface p-3">
                <p className="font-bold text-ink">Email</p>
                <p className="mt-1 break-all text-muted">{user.email}</p>
              </div>
              <div className="rounded-md bg-surface p-3">
                <p className="font-bold text-ink">Role</p>
                <p className="mt-1 capitalize text-muted">{user.role}</p>
              </div>
              <div className="rounded-md bg-surface p-3">
                <p className="font-bold text-ink">Joined</p>
                <p className="mt-1 text-muted">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
