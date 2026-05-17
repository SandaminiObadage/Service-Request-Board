"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthFormShell } from "@/components/AuthFormShell";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/job";
import { validateEmail, validateInternationalName } from "@/lib/validation";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "homeowner" as User["role"]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    const nameError = validateInternationalName(form.name);
    const emailError = validateEmail(form.email);
    if (nameError) nextErrors.name = nameError;
    if (emailError) nextErrors.email = emailError;
    if (form.password.length < 8) nextErrors.password = "Password must be at least 8 characters";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register(form);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setErrors(Object.fromEntries(err.errors.map((item) => [item.field, item.message])));
      } else {
        setErrors({ form: err instanceof ApiError ? err.message : "Unable to register" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthFormShell title="Create account" subtitle="Register as a homeowner or tradesperson to use the board.">
      <form className="space-y-4" onSubmit={submit} noValidate>
        <Input label="Name" value={form.name} onChange={(event) => update("name", event.target.value)} error={errors.name} />
        <Input label="Email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} error={errors.email} />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(event) => update("password", event.target.value)}
          error={errors.password}
        />
        <Select label="Role" value={form.role} onChange={(event) => update("role", event.target.value)}>
          <option value="homeowner">Homeowner</option>
          <option value="tradesperson">Tradesperson</option>
        </Select>
        {errors.form && <p className="text-sm font-semibold text-accent">{errors.form}</p>}
        <Button disabled={submitting} type="submit" className="w-full">
          {submitting ? "Creating account..." : "Register"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link className="font-semibold text-brand" href="/login">
          Login
        </Link>
      </p>
    </AuthFormShell>
  );
}
