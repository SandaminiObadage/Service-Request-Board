export type Category = "Plumbing" | "Electrical" | "Painting" | "Joinery";
export type JobStatus = "Open" | "In Progress" | "Closed";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "homeowner" | "tradesperson";
  createdAt: string;
};

export type UserSummary = Pick<User, "id" | "name" | "email" | "role"> | {
  _id: string;
  name: string;
  email: string;
  role: User["role"];
};

export type TradespersonRequest = {
  _id: string;
  tradesperson: UserSummary;
  message: string;
  status: "Pending" | "Accepted" | "Declined";
  requestedAt: string;
};

export type JobRequest = {
  _id: string;
  title: string;
  description: string;
  category: Category;
  location: string;
  contactName: string;
  contactEmail: string;
  status: JobStatus;
  createdBy?: UserSummary | null;
  assignedTo: UserSummary | null;
  requests: TradespersonRequest[];
  createdAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
  errors?: { field: string; message: string }[];
};

export const categories: Category[] = ["Plumbing", "Electrical", "Painting", "Joinery"];
export const statuses: JobStatus[] = ["Open", "In Progress", "Closed"];
