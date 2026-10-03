import api from "@/lib/api";
import type { AuditLogListResponse, AuditStats } from "@/types/audit";

export async function fetchAuditLogs(params: {
  userId?:   string;
  module?:   string;
  action?:   string;
  search?:   string;
  dateFrom?: string;
  dateTo?:   string;
  page?:     number;
  limit?:    number;
}): Promise<AuditLogListResponse> {
  const res = await api.get("/audit", { params });
  return res.data.data;
}

export async function fetchAuditStats(): Promise<AuditStats> {
  const res = await api.get("/audit/stats");
  return res.data.data;
}
