import type { ApiResponse, JobRequest, JobStatus, User } from "@/types/job";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type RequestOptions = RequestInit & {
  json?: unknown;
};

export class ApiError extends Error {
  status: number;
  errors?: { field: string; message: string }[];

  constructor(status: number, message: string, errors?: { field: string; message: string }[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.json ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    },
    body: options.json ? JSON.stringify(options.json) : options.body,
    cache: "no-store"
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, payload?.message || "Request failed", payload?.errors);
  }

  return payload;
}

function withTimeout(milliseconds: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), milliseconds);
  return { controller, timeout };
}

export const api = {
  getJobs: (params: URLSearchParams, signal?: AbortSignal) =>
    request<ApiResponse<{ jobs: JobRequest[] }>>(`/jobs?${params.toString()}`, { signal }),
  getJob: (id: string) => request<ApiResponse<{ job: JobRequest }>>(`/jobs/${id}`),
  createJob: (body: Pick<JobRequest, "title" | "description" | "category" | "location" | "contactName" | "contactEmail">) =>
    request<ApiResponse<{ job: JobRequest }>>("/jobs", { method: "POST", json: body }),
  updateJob: (id: string, body: Pick<JobRequest, "title" | "description" | "category" | "location" | "contactName" | "contactEmail">) =>
    request<ApiResponse<{ job: JobRequest }>>(`/jobs/${id}`, { method: "PUT", json: body }),
  updateStatus: (id: string, status: JobStatus) =>
    request<ApiResponse<{ job: JobRequest }>>(`/jobs/${id}`, { method: "PATCH", json: { status } }),
  requestJob: (id: string, message: string) =>
    request<ApiResponse<{ job: JobRequest }>>(`/jobs/${id}/requests`, { method: "POST", json: { message } }),
  decideJobRequest: (jobId: string, requestId: string, decision: "accept" | "decline") =>
    request<ApiResponse<{ job: JobRequest }>>(`/jobs/${jobId}/requests/${requestId}`, { method: "PATCH", json: { decision } }),
  deleteJob: (id: string) => request<ApiResponse<unknown>>(`/jobs/${id}`, { method: "DELETE" }),
  register: (body: { name: string; email: string; password: string; role: User["role"] }) =>
    request<ApiResponse<{ user: User }>>("/auth/register", { method: "POST", json: body }),
  login: (body: { email: string; password: string }) =>
    request<ApiResponse<{ user: User }>>("/auth/login", { method: "POST", json: body }),
  me: async () => {
    const { controller, timeout } = withTimeout(2500);
    try {
      return await request<ApiResponse<{ user: User }>>("/auth/me", { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  },
  logout: () => request<ApiResponse<unknown>>("/auth/logout", { method: "POST" })
};
