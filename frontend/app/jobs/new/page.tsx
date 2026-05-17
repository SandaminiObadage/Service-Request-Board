"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { Category } from "@/types/job";
import { categories } from "@/types/job";
import { validateEmail, validateInternationalLocation, validateInternationalName } from "@/lib/validation";

type FormState = {
  title: string;
  description: string;
  category: Category;
  location: string;
  contactName: string;
  contactEmail: string;
};

const initialForm: FormState = {
  title: "",
  description: "",
  category: "Plumbing",
  location: "",
  contactName: "",
  contactEmail: ""
};

export default function NewJobPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (form.title.trim().length < 3) nextErrors.title = "Title must be at least 3 characters";
    if (form.description.trim().length < 10) nextErrors.description = "Description must be at least 10 characters";
    const nameError = validateInternationalName(form.contactName, "Contact name");
    const locationError = validateInternationalLocation(form.location);
    const emailError = validateEmail(form.contactEmail);
    if (nameError) nextErrors.contactName = nameError;
    if (locationError) nextErrors.location = locationError;
    if (emailError) nextErrors.contactEmail = emailError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setMessage("");

    try {
      const response = await api.createJob(form);
      setMessage("Job request created successfully");
      router.push(`/jobs/${response.data.job._id}`);
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setErrors(Object.fromEntries(err.errors.map((item) => [item.field, item.message])));
      } else {
        setMessage(err instanceof ApiError ? err.message : "Unable to create job");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return <div className="rounded-lg border border-line bg-white p-8 text-sm text-muted shadow-soft">Checking your session...</div>;
  }

  if (user.role !== "homeowner") {
    return (
      <div className="rounded-lg border border-line bg-white p-8 shadow-soft">
        <h1 className="text-xl font-bold text-ink">Homeowner account required</h1>
        <p className="mt-2 text-sm text-muted">Tradespeople can browse jobs and request work from each job page.</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-brand">New request</p>
        <h1 className="mt-2 text-3xl font-extrabold text-ink">Create a service request</h1>
      </div>

      <form onSubmit={submit} noValidate className="space-y-5 rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6">
        <Input label="Title" value={form.title} onChange={(event) => update("title", event.target.value)} error={errors.title} />
        <Textarea
          label="Description"
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          error={errors.description}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Category" value={form.category} onChange={(event) => update("category", event.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Input label="Location" value={form.location} onChange={(event) => update("location", event.target.value)} error={errors.location} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Contact name"
            value={form.contactName}
            onChange={(event) => update("contactName", event.target.value)}
            error={errors.contactName}
          />
          <Input
            label="Contact email"
            type="email"
            value={form.contactEmail}
            onChange={(event) => update("contactEmail", event.target.value)}
            error={errors.contactEmail}
          />
        </div>
        {message && <p className="text-sm font-medium text-muted">{message}</p>}
        <Button disabled={submitting} type="submit">
          {submitting ? "Creating..." : "Create job"}
        </Button>
      </form>
    </section>
  );
}
