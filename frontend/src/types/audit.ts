export type AuditAction =
  | "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE"
  | "LOGIN" | "LOGOUT" | "EXPORT" | "VIEW";

export type AuditModule =
  | "patient" | "appointment" | "prescription" | "visit"
  | "invoice" | "payment" | "employee" | "doctor"
  | "leave" | "attendance" | "surgery" | "inventory"
  | "cms" | "notice" | "news" | "gallery" | "service"
  | "user" | "auth" | "finance" | "billing";

export interface AuditLog {
  id:          string;
  userId:      string | null;
  userName:    string;
  userRole:    string;
  action:      AuditAction;
  module:      AuditModule;
  recordId:    string | null;
  recordLabel: string | null;
  meta:        Record<string, unknown> | null;
  ipAddress:   string | null;
  createdAt:   string;
}

export interface AuditLogListResponse {
  items:      AuditLog[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface AuditStats {
  total:      number;
  last30Days: number;
  byModule:   { module: string; count: number }[];
  byAction:   { action: string; count: number }[];
}

// ─── Display helpers ──────────────────────────────────────────────────────────

export const ACTION_LABELS: Record<AuditAction, { bn: string; color: string }> = {
  CREATE:        { bn: "তৈরি",         color: "bg-green-100 text-green-700" },
  UPDATE:        { bn: "আপডেট",        color: "bg-blue-100 text-blue-700" },
  DELETE:        { bn: "মুছে ফেলা",    color: "bg-red-100 text-red-700" },
  STATUS_CHANGE: { bn: "স্ট্যাটাস",    color: "bg-amber-100 text-amber-700" },
  LOGIN:         { bn: "লগইন",         color: "bg-purple-100 text-purple-700" },
  LOGOUT:        { bn: "লগআউট",        color: "bg-gray-100 text-gray-600" },
  EXPORT:        { bn: "এক্সপোর্ট",    color: "bg-indigo-100 text-indigo-700" },
  VIEW:          { bn: "দেখা",          color: "bg-gray-100 text-gray-500" },
};

export const MODULE_LABELS: Record<string, string> = {
  patient:     "রোগী",
  appointment: "অ্যাপয়েন্টমেন্ট",
  prescription:"প্রেসক্রিপশন",
  visit:       "ভিজিট",
  invoice:     "ইনভয়েস",
  payment:     "পেমেন্ট",
  employee:    "কর্মচারী",
  doctor:      "চিকিৎসক",
  leave:       "ছুটি",
  attendance:  "উপস্থিতি",
  surgery:     "সার্জারি",
  inventory:   "ইনভেন্টরি",
  cms:         "CMS",
  notice:      "নোটিশ",
  news:        "সংবাদ",
  gallery:     "গ্যালারি",
  service:     "সেবা",
  user:        "ব্যবহারকারী",
  auth:        "অথ",
  finance:     "অর্থ",
  billing:     "বিলিং",
};
