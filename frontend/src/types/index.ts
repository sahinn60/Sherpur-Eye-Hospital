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

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export const ROLE_LABELS: Record<UserRole, { bn: string; en: string }> = {
  SUPER_ADMIN:  { bn: "সুপার অ্যাডমিন",  en: "Super Admin" },
  ADMIN:        { bn: "অ্যাডমিন",         en: "Admin" },
  HR:           { bn: "এইচআর",            en: "HR" },
  DOCTOR:       { bn: "চিকিৎসক",          en: "Doctor" },
  RECEPTION:    { bn: "রিসেপশন",          en: "Reception" },
  ACCOUNTANT:   { bn: "হিসাবরক্ষক",       en: "Accountant" },
  EMPLOYEE:     { bn: "কর্মচারী",          en: "Employee" },
};

export const ADMIN_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN"];
export const STAFF_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "HR", "DOCTOR", "RECEPTION", "ACCOUNTANT", "EMPLOYEE"];
