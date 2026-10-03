import api from "@/lib/api";
import { ApiResponse } from "@/types";
import {
  LeaveRequest, LeaveListResponse, LeaveSummary,
  NotificationListResponse,
} from "@/types/leave";

// ─── Leave ────────────────────────────────────────────────────────────────────

export async function applyLeave(data: {
  leaveType: string; startDate: string; endDate: string;
  reason: string; attachment?: string;
}): Promise<LeaveRequest> {
  const res = await api.post<ApiResponse<LeaveRequest>>("/leave", data);
  return res.data.data!;
}

export async function fetchMyLeaves(page = 1, limit = 20): Promise<LeaveListResponse> {
  const res = await api.get<ApiResponse<LeaveListResponse>>("/leave/my", { params: { page, limit } });
  return res.data.data!;
}

export async function fetchLeaveSummary(): Promise<LeaveSummary> {
  const res = await api.get<ApiResponse<LeaveSummary>>("/leave/summary");
  return res.data.data!;
}

export async function cancelLeave(id: string): Promise<LeaveRequest> {
  const res = await api.patch<ApiResponse<LeaveRequest>>(`/leave/${id}/cancel`);
  return res.data.data!;
}

export async function fetchAllLeaves(params: {
  status?: string; userId?: string; departmentId?: string;
  dateFrom?: string; dateTo?: string; page?: number; limit?: number;
}): Promise<LeaveListResponse> {
  const res = await api.get<ApiResponse<LeaveListResponse>>("/leave/admin", { params });
  return res.data.data!;
}

export async function reviewLeave(id: string, data: {
  status: "APPROVED" | "REJECTED"; reviewNote?: string;
}): Promise<LeaveRequest> {
  const res = await api.patch<ApiResponse<LeaveRequest>>(`/leave/${id}/review`, data);
  return res.data.data!;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function fetchNotifications(page = 1, limit = 20): Promise<NotificationListResponse> {
  const res = await api.get<ApiResponse<NotificationListResponse>>("/notifications", { params: { page, limit } });
  return res.data.data!;
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await api.get<ApiResponse<{ count: number }>>("/notifications/unread");
  return res.data.data?.count ?? 0;
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.patch("/notifications/read-all");
}
