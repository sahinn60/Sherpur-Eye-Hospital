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

export async function uploadCmsImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post(`${BASE}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const { filename } = res.data.data;
  return { url: `/uploads/${filename}` };
}

// ─── Contact Messages ─────────────────────────────────────────────────────────

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export async function submitContactMessage(data: { name: string; phone: string; subject: string; message: string }): Promise<void> {
  await api.post(`${BASE}/public/contact`, data);
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const res = await api.get(`${BASE}/contact-messages`);
  return res.data.data;
}

export async function markContactMessageRead(id: string): Promise<void> {
  await api.patch(`${BASE}/contact-messages/${id}`);
}

export async function deleteContactMessage(id: string): Promise<void> {
  await api.delete(`${BASE}/contact-messages/${id}`);
}
