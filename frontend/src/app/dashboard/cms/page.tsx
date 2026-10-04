"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Building2, Clock, Share2, Sparkles, BarChart2, Info,
  LayoutDashboard, Bell, Plus, Trash2, Edit2, Save, Eye, EyeOff,
  GripVertical, CheckCircle, Upload, X, Image as ImageIcon,
} from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { Button, Modal } from "@/components/ui";
import {
  fetchAdminSettings, saveSettings,
  fetchAdminSections, saveSections,
  fetchAdminNotices, createNotice, updateNotice, deleteNotice,
  uploadCmsImage,
  fetchContactMessages, markContactMessageRead, deleteContactMessage,
} from "@/lib/services/cmsService";
import type { SiteSettingsGrouped, SiteSetting, HomepageSection, Notice } from "@/types/cms";
import type { ContactMessage } from "@/lib/services/cmsService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const inp = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500";
const ta  = `${inp} resize-none`;

function Field({ s, value, onChange }: { s: SiteSetting; value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  if (s.type === "image") {
    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      setUploadError("");
      try {
        const res = await uploadCmsImage(file);
        onChange(res.url);
      } catch (err: any) {
        setUploadError(err?.response?.data?.message || "আপলোড ব্যর্থ হয়েছে");
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    }
    return (
      <div className="col-span-2">
        <label className="block text-xs font-medium text-gray-600 mb-2">{s.labelBn} / {s.labelEn}</label>
        <div className="flex items-start gap-4">
          {value ? (
            <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="preview"
                className="max-w-full max-h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <button type="button" onClick={() => onChange("")} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                <X size={10} />
              </button>
            </div>
          ) : (
            <div className="w-32 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 flex-shrink-0">
              <ImageIcon size={24} className="text-gray-300" />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <Button size="sm" variant="secondary" type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2">
              <Upload size={13} />
              {uploading ? "আপলোড হচ্ছে..." : "ছবি আপলোড করুন"}
            </Button>
            {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
            {value && !uploadError && <p className="text-xs text-green-600">✓ আপলোড সফল</p>}
          </div>
        </div>
      </div>
    );
  }

  if (s.type === "textarea") {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{s.labelBn} / {s.labelEn}</label>
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={ta} />
      </div>
    );
  }
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{s.labelBn} / {s.labelEn}</label>
      <input type={s.type === "url" ? "url" : "text"} value={value} onChange={(e) => onChange(e.target.value)} className={inp} />
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({ group, grouped, draft, setDraft, onSave, saving }: {
  group: string;
  grouped: SiteSettingsGrouped;
  draft: Record<string, string>;
  setDraft: (d: Record<string, string>) => void;
  onSave: () => void;
  saving: boolean;
}) {
  // For 'about' group, hide image fields (they are in About Images tab)
  const allFields = grouped[group] || [];
  const fields = group === "about" ? allFields.filter((f) => f.type !== "image") : allFields;
  if (!fields.length) return <p className="text-sm text-gray-400 py-8 text-center">কোনো সেটিং নেই</p>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key} className={f.type === "image" || f.type === "textarea" ? "col-span-1 sm:col-span-2" : ""}>
            <Field key={f.key} s={f} value={draft[f.key] ?? ""} onChange={(v) => setDraft({ ...draft, [f.key]: v })} />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <Button onClick={onSave} disabled={saving} className="flex items-center gap-2">
          <Save size={14} /> {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </Button>
      </div>
    </div>
  );
}

// ─── Sections Tab ─────────────────────────────────────────────────────────────

function SectionsTab({ sections, onToggle, onSave, saving }: {
  sections: HomepageSection[];
  onToggle: (key: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">হোমপেজের কোন সেকশনগুলো দেখাবে তা নিয়ন্ত্রণ করুন।</p>
      <div className="space-y-2">
        {sections.map((sec) => (
          <div key={sec.key} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <GripVertical size={16} className="text-gray-300" />
              <div>
                <p className="text-sm font-medium text-gray-800">{sec.labelBn}</p>
                <p className="text-xs text-gray-400">{sec.labelEn}</p>
              </div>
            </div>
            <button
              onClick={() => onToggle(sec.key)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                sec.isVisible
                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {sec.isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
              {sec.isVisible ? "দৃশ্যমান" : "লুকানো"}
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving} className="flex items-center gap-2">
          <Save size={14} /> {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </Button>
      </div>
    </div>
  );
}

// ─── Notice Form ──────────────────────────────────────────────────────────────

function NoticeForm({ notice, onSubmit, onCancel, error }: {
  notice?: Notice | null;
  onSubmit: (d: any) => Promise<void>;
  onCancel: () => void;
  error: string;
}) {
  const [form, setForm] = useState({
    textBn:    notice?.textBn    || "",
    textEn:    notice?.textEn    || "",
    link:      notice?.link      || "",
    isActive:  notice?.isActive  ?? true,
    sortOrder: notice?.sortOrder ?? 0,
    expiresAt: notice?.expiresAt ? notice.expiresAt.slice(0, 10) : "",
  });
  const [submitting, setSubmitting] = useState(false);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        link: form.link || null,
      });
    } finally { setSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">নোটিশ টেক্সট (বাংলা) *</label>
        <textarea value={form.textBn} onChange={(e) => set("textBn", e.target.value)} required rows={2} className={ta} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Notice Text (English)</label>
        <textarea value={form.textEn} onChange={(e) => set("textEn", e.target.value)} rows={2} className={ta} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">লিংক (ঐচ্ছিক)</label>
          <input type="url" value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://..." className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">মেয়াদ শেষ তারিখ</label>
          <input type="date" value={form.expiresAt} onChange={(e) => set("expiresAt", e.target.value)} className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">ক্রম</label>
          <input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", +e.target.value)} className={inp} />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-600" />
        <span className="text-sm text-gray-700">সক্রিয়</span>
      </label>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</Button>
      </div>
    </form>
  );
}

// ─── Notices Tab ──────────────────────────────────────────────────────────────

function NoticesTab({ notices, onRefresh }: { notices: Notice[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Notice | null>(null);
  const [formError, setFormError] = useState("");

  async function handleCreate(data: any) {
    setFormError("");
    try { await createNotice(data); setShowForm(false); onRefresh(); }
    catch (e: any) { setFormError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleUpdate(data: any) {
    if (!editTarget) return;
    setFormError("");
    try { await updateNotice(editTarget.id, data); setEditTarget(null); onRefresh(); }
    catch (e: any) { setFormError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleDelete(n: Notice) {
    if (!confirm(`"${n.textBn}" মুছে ফেলতে চান?`)) return;
    try { await deleteNotice(n.id); onRefresh(); }
    catch { alert("মুছতে পারেনি"); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">মোট {notices.length}টি নোটিশ</p>
        <Button size="sm" onClick={() => { setEditTarget(null); setFormError(""); setShowForm(true); }} className="flex items-center gap-2">
          <Plus size={14} /> নতুন নোটিশ
        </Button>
      </div>

      {notices.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-12 text-center">
          <Bell size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm">কোনো নোটিশ নেই</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notices.map((n) => (
            <div key={n.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${n.isActive ? "bg-green-500" : "bg-gray-300"}`} />
                  <p className="text-sm font-medium text-gray-800 truncate">{n.textBn}</p>
                </div>
                {n.textEn && <p className="text-xs text-gray-400 truncate ml-4">{n.textEn}</p>}
                <div className="flex gap-3 mt-1 ml-4">
                  {n.link && <span className="text-xs text-primary-600 truncate">{n.link}</span>}
                  {n.expiresAt && (
                    <span className="text-xs text-gray-400">
                      মেয়াদ: {new Date(n.expiresAt).toLocaleDateString("bn-BD")}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => { setEditTarget(n); setFormError(""); setShowForm(true); }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(n)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <Modal open onClose={() => { setShowForm(false); setEditTarget(null); }}
          title={editTarget ? "নোটিশ সম্পাদনা" : "নতুন নোটিশ"} size="lg">
          <NoticeForm
            notice={editTarget}
            onSubmit={editTarget ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditTarget(null); }}
            error={formError}
          />
        </Modal>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { key: "hospital",     labelBn: "হাসপাতাল তথ্য",       icon: Building2 },
  { key: "contact",      labelBn: "যোগাযোগ",              icon: Info },
  { key: "hours",        labelBn: "সময়সূচি",              icon: Clock },
  { key: "social",       labelBn: "সোশ্যাল লিংক",         icon: Share2 },
  { key: "hero",         labelBn: "হিরো সেকশন",           icon: Sparkles },
  { key: "stats",        labelBn: "পরিসংখ্যান",            icon: BarChart2 },
  { key: "about",        labelBn: "আমাদের সম্পর্কে",      icon: Info },
  { key: "about_images", labelBn: "About পেজ ছবি",        icon: ImageIcon },
  { key: "page_heroes",  labelBn: "পেজ হিরো ছবি",          icon: ImageIcon },
  { key: "nav_icons",    labelBn: "নেভিগেশন আইকন",         icon: ImageIcon },
  { key: "icons_services",  labelBn: "সেবা আইকন",            icon: Sparkles },
  { key: "icons_why",       labelBn: "কেন আমরা আইকন",         icon: Sparkles },
  { key: "icons_facilities",labelBn: "সুবিধা আইকন",           icon: Sparkles },
  { key: "icons_about",     labelBn: "About পেজ আইকন",       icon: Sparkles },
  { key: "sections",     labelBn: "হোমপেজ সেকশন",         icon: LayoutDashboard },
  { key: "notices",      labelBn: "নোটিশ",                 icon: Bell },
  { key: "messages",     labelBn: "যোগাযোগ বার্তা",           icon: Bell },
];

export default function CmsAdminPage() {
  const [activeTab, setActiveTab]   = useState("hospital");
  const [grouped,   setGrouped]     = useState<SiteSettingsGrouped>({});
  const [draft,     setDraft]       = useState<Record<string, string>>({});
  const [sections,  setSections]    = useState<HomepageSection[]>([]);
  const [notices,   setNotices]     = useState<Notice[]>([]);
  const [messages,  setMessages]    = useState<ContactMessage[]>([]);
  const [loading,   setLoading]     = useState(true);
  const [saving,    setSaving]      = useState(false);
  const [saved,     setSaved]       = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsRes, sectionsRes, noticesRes, messagesRes] = await Promise.all([
        fetchAdminSettings(),
        fetchAdminSections(),
        fetchAdminNotices(),
        fetchContactMessages(),
      ]);
      setGrouped(settingsRes.grouped);
      setDraft(settingsRes.map);
      setSections(sectionsRes);
      setNotices(noticesRes);
      setMessages(messagesRes);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSaveSettings() {
    setSaving(true);
    try {
      // Only save keys belonging to current group
      const groupKeys = (grouped[activeTab] || []).map((f) => f.key);
      const patch: Record<string, string> = {};
      groupKeys.forEach((k) => { patch[k] = draft[k] ?? ""; });
      await saveSettings(patch);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  async function handleSaveSections() {
    setSaving(true);
    try {
      const updated = await saveSections(sections.map((s) => ({ key: s.key, isVisible: s.isVisible, sortOrder: s.sortOrder })));
      setSections(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  function toggleSection(key: string) {
    setSections((prev) => prev.map((s) => s.key === key ? { ...s, isVisible: !s.isVisible } : s));
  }

  const isSettingsTab = ![
    "sections", "notices", "about_images", "page_heroes", "nav_icons", "messages"
  ].includes(activeTab);

  // For about_images tab: show only image-type fields from 'about' group
  const aboutImageFields = (grouped["about"] || []).filter((f) => f.type === "image");

  // For page_heroes tab: all fields from 'page_heroes' group
  const pageHeroFields = grouped["page_heroes"] || [];

  // For nav_icons tab: all fields from 'nav_icons' group
  const navIconFields = grouped["nav_icons"] || [];

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">ওয়েবসাইট CMS</h1>
            <p className="text-sm text-gray-500 mt-0.5">পাবলিক ওয়েবসাইটের সমস্ত কন্টেন্ট এখান থেকে পরিচালনা করুন</p>
          </div>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
              <CheckCircle size={14} /> সংরক্ষিত হয়েছে
            </span>
          )}
        </div>

        <div className="flex gap-5 flex-col lg:flex-row">
          {/* Sidebar tabs */}
          <div className="lg:w-52 shrink-0">
            <nav className="space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                      activeTab === tab.key
                        ? "bg-primary-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={15} />
                    {tab.labelBn}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6">
            {/* Tab heading */}
            {!loading && (
              <div className="mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">
                  {TABS.find(t => t.key === activeTab)?.labelBn}
                </h2>
              </div>
            )}
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {isSettingsTab && (
                  <SettingsTab
                    group={activeTab}
                    grouped={grouped}
                    draft={draft}
                    setDraft={setDraft}
                    onSave={handleSaveSettings}
                    saving={saving}
                  />
                )}
                {activeTab === "about_images" && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">About পেজের ছবিগুলো এখান থেকে আপলোড করুন। ছবি না দিলে default placeholder দেখাবে।</p>
                    <div className="grid grid-cols-1 gap-6">
                      {aboutImageFields.length === 0 ? (
                        <p className="text-sm text-gray-400 py-8 text-center">ডাটাবেসে image settings পাওয়া যায়নি। Backend restart করুন।</p>
                      ) : (
                        aboutImageFields.map((f) => (
                          <Field
                            key={f.key}
                            s={f}
                            value={draft[f.key] ?? ""}
                            onChange={(v) => setDraft({ ...draft, [f.key]: v })}
                          />
                        ))
                      )}
                    </div>
                    {aboutImageFields.length > 0 && (
                      <div className="flex justify-end pt-2">
                        <Button
                          onClick={async () => {
                            setSaving(true);
                            try {
                              const patch: Record<string, string> = {};
                              aboutImageFields.forEach((f) => { patch[f.key] = draft[f.key] ?? ""; });
                              await saveSettings(patch);
                              setSaved(true);
                              setTimeout(() => setSaved(false), 2500);
                            } finally { setSaving(false); }
                          }}
                          disabled={saving}
                          className="flex items-center gap-2"
                        >
                          <Save size={14} /> {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "page_heroes" && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">প্রতিটি পেজের হিরো সেকশনের ব্যাকগ্রাউন্ড ছবি আপলোড করুন। ছবি না দিলে default gradient দেখাবে।</p>
                    <div className="grid grid-cols-1 gap-6">
                      {pageHeroFields.length === 0 ? (
                        <p className="text-sm text-gray-400 py-8 text-center">ডাটাবেসে page hero settings পাওয়া যায়নি। Backend restart করুন।</p>
                      ) : (
                        pageHeroFields.map((f) => (
                          <Field key={f.key} s={f} value={draft[f.key] ?? ""} onChange={(v) => setDraft({ ...draft, [f.key]: v })} />
                        ))
                      )}
                    </div>
                    {pageHeroFields.length > 0 && (
                      <div className="flex justify-end pt-2">
                        <Button
                          onClick={async () => {
                            setSaving(true);
                            try {
                              const patch: Record<string, string> = {};
                              pageHeroFields.forEach((f) => { patch[f.key] = draft[f.key] ?? ""; });
                              await saveSettings(patch);
                              setSaved(true);
                              setTimeout(() => setSaved(false), 2500);
                            } finally { setSaving(false); }
                          }}
                          disabled={saving}
                          className="flex items-center gap-2"
                        >
                          <Save size={14} /> {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "nav_icons" && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">Navbar, Mobile Menu এবং Footer-এ প্রতিটি পেজের পাশে দেখানোর জন্য PNG আইকন আপলোড করুন। আইকন না দিলে শুধু নাম দেখাবে।</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {navIconFields.length === 0 ? (
                        <p className="text-sm text-gray-400 py-8 text-center col-span-2">ডাটাবেসে nav icon settings পাওয়া যায়নি। Backend restart করুন।</p>
                      ) : (
                        navIconFields.map((f) => (
                          <div key={f.key} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                            <Field s={f} value={draft[f.key] ?? ""} onChange={(v) => setDraft({ ...draft, [f.key]: v })} />
                            {draft[f.key] && (
                              <div className="mt-3 flex items-center gap-3">
                                <span className="text-xs text-gray-400">Preview:</span>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={draft[f.key]} alt="" style={{ width: 24, height: 24, objectFit: "contain" }} />
                                <span className="text-xs text-gray-400">→ Navbar-এ এই size-এ দেখাবে</span>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    {navIconFields.length > 0 && (
                      <div className="flex justify-end pt-2">
                        <Button
                          onClick={async () => {
                            setSaving(true);
                            try {
                              const patch: Record<string, string> = {};
                              navIconFields.forEach((f) => { patch[f.key] = draft[f.key] ?? ""; });
                              await saveSettings(patch);
                              setSaved(true);
                              setTimeout(() => setSaved(false), 2500);
                            } finally { setSaving(false); }
                          }}
                          disabled={saving}
                          className="flex items-center gap-2"
                        >
                          <Save size={14} /> {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "sections" && (
                  <SectionsTab
                    sections={sections}
                    onToggle={toggleSection}
                    onSave={handleSaveSections}
                    saving={saving}
                  />
                )}
                {activeTab === "notices" && (
                  <NoticesTab notices={notices} onRefresh={load} />
                )}
                {activeTab === "messages" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">মোট {messages.length}টি বার্তা</p>
                      {messages.filter(m => !m.isRead).length > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 font-semibold px-2.5 py-1 rounded-full">
                          {messages.filter(m => !m.isRead).length}টি অপঠিত
                        </span>
                      )}
                    </div>
                    {messages.length === 0 ? (
                      <div className="py-16 text-center">
                        <Bell size={40} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-400 text-sm">এখনো কোনো বার্তা নেই</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((msg) => (
                          <div key={msg.id} className={`rounded-xl border p-4 transition-all ${
                            msg.isRead ? "border-gray-100 bg-gray-50" : "border-primary-200 bg-primary-50/50"
                          }`}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0 space-y-2">
                                {/* Unread badge + date */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {!msg.isRead && (
                                      <span className="text-[10px] font-bold bg-primary-600 text-white px-2 py-0.5 rounded-full">অপঠিত</span>
                                    )}
                                    <span className="text-gray-400 text-xs">{new Date(msg.createdAt).toLocaleString("bn-BD")}</span>
                                  </div>
                                </div>
                                {/* Fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 bg-white rounded-lg p-3 border border-gray-100">
                                  <div className="flex gap-2">
                                    <span className="text-xs font-semibold text-gray-400 w-16 shrink-0">নাম:</span>
                                    <span className="text-sm font-semibold text-gray-900">{msg.name}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <span className="text-xs font-semibold text-gray-400 w-16 shrink-0">ফোন:</span>
                                    <a href={`tel:${msg.phone}`} className="text-sm font-medium text-primary-600 hover:underline">{msg.phone}</a>
                                  </div>
                                  {msg.subject && (
                                    <div className="flex gap-2 sm:col-span-2">
                                      <span className="text-xs font-semibold text-gray-400 w-16 shrink-0">বিষয়:</span>
                                      <span className="text-sm text-gray-700">{msg.subject}</span>
                                    </div>
                                  )}
                                  <div className="flex gap-2 sm:col-span-2">
                                    <span className="text-xs font-semibold text-gray-400 w-16 shrink-0">বার্তা:</span>
                                    <span className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</span>
                                  </div>
                                </div>
                              </div>
                              {/* Actions */}
                              <div className="flex gap-1 shrink-0">
                                {!msg.isRead && (
                                  <button
                                    onClick={async () => { await markContactMessageRead(msg.id); load(); }}
                                    title="পঠিত হিসেবে চিহ্নিত করুন"
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                                  >
                                    <CheckCircle size={15} />
                                  </button>
                                )}
                                <button
                                  onClick={async () => {
                                    if (!confirm("বার্তাটি মুছে ফেলতে চান?")) return;
                                    await deleteContactMessage(msg.id); load();
                                  }}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
