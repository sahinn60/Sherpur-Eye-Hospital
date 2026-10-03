export type LeaveType =
  | "CASUAL" | "SICK" | "ANNUAL" | "MATERNITY"
  | "PATERNITY" | "UNPAID" | "EMERGENCY" | "OTHER";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export const LEAVE_TYPE_BN: Record<LeaveType, string> = {
  CASUAL:    "নৈমিত্তিক ছুটি",
  SICK:      "অসুস্থতাজনিত ছুটি",
  ANNUAL:    "বার্ষিক ছুটি",
  MATERNITY: "মাতৃত্বকালীন ছুটি",
  PATERNITY: "পিতৃত্বকালীন ছুটি",
  UNPAID:    "বেতনহীন ছুটি",
  EMERGENCY: "জরুরি ছুটি",
  OTHER:     "অন্যান্য ছুটি",
};

export const LEAVE_STATUS_CONFIG: Record<LeaveStatus, { label: string; bg: string; text: string; border: string }> = {
  PENDING:   { label: "অপেক্ষমাণ",  bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
  APPROVED:  { label: "অনুমোদিত",   bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  REJECTED:  { label: "প্রত্যাখ্যাত", bg: "bg-red-50",    text: "text-red-700",     border: "border-red-200" },
  CANCELLED: { label: "বাতিল",       bg: "bg-gray-100",   text: "text-gray-500",    border: "border-gray-200" },
};

export interface LeaveRequest {
  id:         string;
  leaveType:  LeaveType;
  startDate:  string;
  endDate:    string;
  totalDays:  number;
  reason:     string;
  attachment: string | null;
  status:     LeaveStatus;
  reviewNote: string | null;
  reviewedAt: string | null;
  createdAt:  string;
  updatedAt:  string;
  user: {
    id:   string;
    name: string;
    role: string;
    employee: {
      employeeId:    string;
      nameBn:        string;
      designationBn: string;
      department:    { id: string; name: string } | null;
    } | null;
    doctor: { nameBn: string; designationBn: string } | null;
  };
  reviewer: { id: string; name: string; role: string } | null;
}

export interface LeaveListResponse {
  items:      LeaveRequest[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface LeaveSummary {
  pending:           number;
  approved:          number;
  rejected:          number;
  cancelled:         number;
  totalApprovedDays: number;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationType =
  | "LEAVE_APPLIED" | "LEAVE_APPROVED" | "LEAVE_REJECTED" | "LEAVE_CANCELLED"
  | "APPOINTMENT_NEW" | "APPOINTMENT_CONFIRMED" | "APPOINTMENT_CANCELLED"
  | "ATTENDANCE_LATE" | "ATTENDANCE_ABSENT"
  | "HOSPITAL_NOTICE" | "SYSTEM" | "GENERAL";

export interface Notification {
  id:        string;
  type:      NotificationType;
  titleBn:   string;
  bodyBn:    string;
  isRead:    boolean;
  refId:     string | null;
  refType:   string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  items:       Notification[];
  total:       number;
  unreadCount: number;
  page:        number;
  limit:       number;
  totalPages:  number;
}
