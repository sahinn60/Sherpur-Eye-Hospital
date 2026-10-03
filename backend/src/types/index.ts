export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "HR"
  | "DOCTOR"
  | "RECEPTION"
  | "ACCOUNTANT"
  | "EMPLOYEE";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
