"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthFormShell } from "@/components/AuthFormShell";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { validateEmail } from "@/lib/validation";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    const emailError = validateEmail(email);
    const nextErrors: Record<string, string> = {};
    if (emailError) nextErrors.email = emailError;
    if (!password) nextErrors.password = "Password is required";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setErrors({ form: err instanceof ApiError ? err.message : "Unable to log in" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthFormShell title="Welcome back" subtitle="Log in to create and manage service requests.">
      <form className="space-y-4" onSubmit={submit} noValidate>
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} error={errors.email} />
        <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} error={errors.password} />
        {errors.form && <p className="text-sm font-semibold text-accent">{errors.form}</p>}
        <Button disabled={submitting} type="submit" className="w-full">
          {submitting ? "Logging in..." : "Login"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        Need an account?{" "}
        <Link className="font-semibold text-brand" href="/register">
          Register
        </Link>
      </p>
    </AuthFormShell>
  );
}
