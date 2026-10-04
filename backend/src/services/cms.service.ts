import { prisma } from "../config/database";

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getAllSettings() {
  const rows = await prisma.siteSetting.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] });
  // Return as flat map + grouped
  const map: Record<string, string> = {};
  const grouped: Record<string, typeof rows> = {};
  for (const r of rows) {
    map[r.key] = r.value;
    if (!grouped[r.group]) grouped[r.group] = [];
    grouped[r.group].push(r);
  }
  return { map, grouped };
}

export async function getPublicSettings() {
  const rows = await prisma.siteSetting.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] });
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}

export async function upsertSettings(settings: Record<string, string>) {
  const ops = Object.entries(settings).map(([key, value]) =>
    prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, group: "general", labelBn: key, labelEn: key, type: "text" },
    })
  );
  await Promise.all(ops);
  return getPublicSettings();
}

// ─── Homepage Sections ────────────────────────────────────────────────────────

export async function getAllSections() {
  return prisma.homepageSection.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function bulkUpdateSections(
  sections: { key: string; isVisible?: boolean; sortOrder?: number }[]
) {
  const ops = sections.map((s) =>
    prisma.homepageSection.update({
      where: { key: s.key },
      data: {
        ...(s.isVisible !== undefined && { isVisible: s.isVisible }),
        ...(s.sortOrder !== undefined && { sortOrder: s.sortOrder }),
      },
    })
  );
  await Promise.all(ops);
  return getAllSections();
}

// ─── Notices ─────────────────────────────────────────────────────────────────

export async function listNotices(activeOnly = false) {
  const now = new Date();
  return prisma.notice.findMany({
    where: activeOnly
      ? { isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }
      : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function createNotice(data: {
  textBn: string;
  textEn?: string;
  link?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  expiresAt?: string | null;
}) {
  return prisma.notice.create({
    data: {
      textBn:    data.textBn,
      textEn:    data.textEn ?? "",
      link:      data.link || null,
      isActive:  data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  });
}

export async function updateNotice(id: string, data: {
  textBn?: string;
  textEn?: string;
  link?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  expiresAt?: string | null;
}) {
  const payload: any = { ...data };
  if (payload.expiresAt !== undefined) {
    payload.expiresAt = payload.expiresAt ? new Date(payload.expiresAt) : null;
  }
  return prisma.notice.update({ where: { id }, data: payload });
}

export async function deleteNotice(id: string) {
  return prisma.notice.delete({ where: { id } });
}

// ─── Contact Messages ─────────────────────────────────────────────────────────

export async function createContactMessage(data: { name: string; phone: string; subject: string; message: string }) {
  return prisma.contactMessage.create({ data });
}

export async function listContactMessages() {
  return prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export async function markMessageRead(id: string) {
  return prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
}

export async function deleteContactMessage(id: string) {
  return prisma.contactMessage.delete({ where: { id } });
}
