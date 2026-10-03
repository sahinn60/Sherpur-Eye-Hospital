import api from "@/lib/api";
import type { SiteSettingsMap, SiteSettingsGrouped, SiteSetting, HomepageSection, Notice } from "@/types/cms";

const BASE = "/cms";

// ─── Public (no auth) ────────────────────────────────────────────────────────

export async function fetchPublicSettings(): Promise<SiteSettingsMap> {
  const res = await api.get(`${BASE}/public/settings`);
  return res.data.data;
}

export async function fetchPublicSections(): Promise<HomepageSection[]> {
  const res = await api.get(`${BASE}/public/sections`);
  return res.data.data;
}

export async function fetchActiveNotices(): Promise<Notice[]> {
  const res = await api.get(`${BASE}/public/notices`, { params: { active: "true" } });
  return res.data.data;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function fetchAdminSettings(): Promise<{ map: SiteSettingsMap; grouped: SiteSettingsGrouped }> {
  const res = await api.get(`${BASE}/settings`);
  return res.data.data;
}

export async function saveSettings(settings: Record<string, string>): Promise<SiteSettingsMap> {
  const res = await api.post(`${BASE}/settings`, { settings });
  return res.data.data;
}

export async function fetchAdminSections(): Promise<HomepageSection[]> {
  const res = await api.get(`${BASE}/sections`);
  return res.data.data;
}

export async function saveSections(sections: { key: string; isVisible?: boolean; sortOrder?: number }[]): Promise<HomepageSection[]> {
  const res = await api.post(`${BASE}/sections`, { sections });
  return res.data.data;
}

export async function fetchAdminNotices(): Promise<Notice[]> {
  const res = await api.get(`${BASE}/notices`);
  return res.data.data;
}

export async function createNotice(data: Partial<Notice>): Promise<Notice> {
  const res = await api.post(`${BASE}/notices`, data);
  return res.data.data;
}

export async function updateNotice(id: string, data: Partial<Notice>): Promise<Notice> {
  const res = await api.patch(`${BASE}/notices/${id}`, data);
  return res.data.data;
}

export async function deleteNotice(id: string): Promise<void> {
  await api.delete(`${BASE}/notices/${id}`);
}
