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

// Ensure new settings exist (run on startup)
export async function ensureNewSettings() {
  const newSettings = [
    { key: "hero_prescription_image", value: "",       group: "page_heroes", labelBn: "Prescription পেজ হিরো ছবি", labelEn: "Prescription Page Hero Image", type: "image" },
    { key: "hero_contact_image",      value: "",       group: "page_heroes", labelBn: "Contact পেজ হিরো ছবি",      labelEn: "Contact Page Hero Image",      type: "image" },
    { key: "hero_bg_image",           value: "",       group: "hero",        labelBn: "হিরো ব্যাকগ্রাউন্ড ছবি",    labelEn: "Hero Background Image",        type: "image" },
    { key: "hero_bg_enabled",         value: "false",  group: "hero",        labelBn: "ব্যাকগ্রাউন্ড ছবি চালু",   labelEn: "Background Image Enabled",     type: "text" },
    { key: "hero_bg_opacity",         value: "15",     group: "hero",        labelBn: "ব্যাকগ্রাউন্ড অপাসিটি",    labelEn: "Background Image Opacity",     type: "text" },
    { key: "hero_bg_overlay",         value: "50",     group: "hero",        labelBn: "Navy ওভারলে শক্তি",         labelEn: "Navy Overlay Strength",         type: "text" },
    { key: "hero_bg_position",        value: "center", group: "hero",        labelBn: "ব্যাকগ্রাউন্ড পজিশন",      labelEn: "Background Position",          type: "text" },
  ];
  for (const s of newSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // Ensure nav-based permissions exist
  const navPerms = [
    { key: "nav.doctors",        labelBn: "চিকিৎসক",           labelEn: "Doctors",           group: "nav" },
    { key: "nav.employees",      labelBn: "কর্মচারী",          labelEn: "Employees",         group: "nav" },
    { key: "nav.attendance",     labelBn: "উপস্থিতি",          labelEn: "Attendance",        group: "nav" },
    { key: "nav.leave",          labelBn: "ছুটি",               labelEn: "Leave",             group: "nav" },
    { key: "nav.clinic",         labelBn: "ক্লিনিক",           labelEn: "Clinic",            group: "nav" },
    { key: "nav.patients",       labelBn: "রোগী",              labelEn: "Patients",          group: "nav" },
    { key: "nav.appointments",   labelBn: "অ্যাপয়েন্টমেন্ট",  labelEn: "Appointments",      group: "nav" },
    { key: "nav.prescriptions",  labelBn: "প্রেসক্রিপশন",      labelEn: "Prescriptions",     group: "nav" },
    { key: "nav.rx_templates",   labelBn: "Rx টেমপ্লেট",      labelEn: "Rx Templates",      group: "nav" },
    { key: "nav.billing",        labelBn: "বিলিং",             labelEn: "Billing",           group: "nav" },
    { key: "nav.income",         labelBn: "আয়",                labelEn: "Income",            group: "nav" },
    { key: "nav.expenses",       labelBn: "ব্যয়",              labelEn: "Expenses",          group: "nav" },
    { key: "nav.inventory",      labelBn: "ইনভেন্টরি",         labelEn: "Inventory",         group: "nav" },
    { key: "nav.surgery",        labelBn: "সার্জারি/OT",        labelEn: "Surgery/OT",        group: "nav" },
    { key: "nav.reports",        labelBn: "রিপোর্ট",           labelEn: "Reports",           group: "nav" },
    { key: "nav.cms",            labelBn: "ওয়েবসাইট CMS",     labelEn: "Website CMS",       group: "nav" },
    { key: "nav.news",           labelBn: "সংবাদ",             labelEn: "News",              group: "nav" },
    { key: "nav.gallery",        labelBn: "গ্যালারি",          labelEn: "Gallery",           group: "nav" },
    { key: "nav.users",          labelBn: "ব্যবহারকারী",       labelEn: "Users",             group: "nav" },
    { key: "nav.audit",          labelBn: "অডিট লগ",           labelEn: "Audit Log",         group: "nav" },
    { key: "nav.settings",       labelBn: "সেটিংস",            labelEn: "Settings",          group: "nav" },
    { key: "nav.rx_settings",    labelBn: "Rx সেটিংস",         labelEn: "Rx Settings",       group: "nav" },
  ];
  for (const p of navPerms) {
    await prisma.permission.upsert({
      where: { key: p.key },
      update: {},
      create: { id: `perm-${p.key.replace(".", "-")}`, ...p },
    });
  }
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
