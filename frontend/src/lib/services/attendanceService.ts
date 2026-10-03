import api from "@/lib/api";
import { ApiResponse } from "@/types";
import {
  AttendanceRecord, AttendanceListResponse, TodaySummary,
  AttendanceSettings,
  DailyReport, WeeklyReport, MonthlyReport,
  EmployeeReport, DepartmentReport,
} from "@/types/attendance";

// ─── Self ─────────────────────────────────────────────────────────────────────

export async function checkIn(payload: { selfie?: string; latitude?: number; longitude?: number }): Promise<AttendanceRecord> {
  const res = await api.post<ApiResponse<AttendanceRecord>>("/attendance/check-in", payload);
  return res.data.data!;
}

export async function checkOut(payload: { selfie?: string; latitude?: number; longitude?: number }): Promise<AttendanceRecord> {
  const res = await api.post<ApiResponse<AttendanceRecord>>("/attendance/check-out", payload);
  return res.data.data!;
}

export async function fetchTodayAttendance(): Promise<AttendanceRecord | null> {
  const res = await api.get<ApiResponse<AttendanceRecord | null>>("/attendance/today");
  return res.data.data ?? null;
}

export async function fetchMyHistory(page = 1, limit = 30): Promise<AttendanceListResponse> {
  const res = await api.get<ApiResponse<AttendanceListResponse>>("/attendance/my-history", { params: { page, limit } });
  return res.data.data!;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function fetchAllAttendances(params: {
  userId?: string; departmentId?: string;
  date?: string; dateFrom?: string; dateTo?: string;
  status?: string; page?: number; limit?: number;
}): Promise<AttendanceListResponse> {
  const res = await api.get<ApiResponse<AttendanceListResponse>>("/attendance", { params });
  return res.data.data!;
}

export async function fetchTodaySummary(): Promise<TodaySummary> {
  const res = await api.get<ApiResponse<TodaySummary>>("/attendance/summary");
  return res.data.data!;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function fetchSettings(): Promise<AttendanceSettings> {
  const res = await api.get<ApiResponse<AttendanceSettings>>("/attendance/settings");
  return res.data.data!;
}

export async function saveSettings(data: Partial<AttendanceSettings>): Promise<AttendanceSettings> {
  const res = await api.patch<ApiResponse<AttendanceSettings>>("/attendance/settings", data);
  return res.data.data!;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function fetchDailyReport(params: { date: string; departmentId?: string; status?: string }): Promise<DailyReport> {
  const res = await api.get<ApiResponse<DailyReport>>("/attendance/reports/daily", { params });
  return res.data.data!;
}

export async function fetchWeeklyReport(params: { dateFrom: string; dateTo: string; departmentId?: string }): Promise<WeeklyReport> {
  const res = await api.get<ApiResponse<WeeklyReport>>("/attendance/reports/weekly", { params });
  return res.data.data!;
}

export async function fetchMonthlyReport(params: { year: number; month: number; departmentId?: string }): Promise<MonthlyReport> {
  const res = await api.get<ApiResponse<MonthlyReport>>("/attendance/reports/monthly", { params });
  return res.data.data!;
}

export async function fetchEmployeeReport(params: { dateFrom: string; dateTo: string; userId?: string; departmentId?: string }): Promise<EmployeeReport> {
  const res = await api.get<ApiResponse<EmployeeReport>>("/attendance/reports/employee", { params });
  return res.data.data!;
}

export async function fetchDepartmentReport(params: { dateFrom: string; dateTo: string }): Promise<DepartmentReport> {
  const res = await api.get<ApiResponse<DepartmentReport>>("/attendance/reports/department", { params });
  return res.data.data!;
}
