"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Building2, Clock, Share2, Sparkles, BarChart2, Info,
  LayoutDashboard, Bell, Plus, Trash2, Edit2, Save, Eye, EyeOff,
  GripVertical, CheckCircle,
} from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { Button, Modal } from "@/components/ui";
import {
  fetchAdminSettings, saveSettings,
  fetchAdminSections, saveSections,
  fetchAdminNotices, createNotice, updateNotice, deleteNotice,
} from "@/lib/services/cmsService";
import type { SiteSettingsGrouped, SiteSetting, HomepageSection, Notice } from "@/types/cms";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const inp = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500";
const ta  = `${inp} resize-none`;

function Field({ s, value, onChange }: { s: SiteSetting; value: string; onChange: (v: string) => void }) {
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
  const fields = grouped[group] || [];
  if (!fields.length) return <p className="text-sm text-gray-400 py-8 text-center">কোনো সেটিং নেই</p>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <Field key={f.key} s={f} value={draft[f.key] ?? ""} onChange={(v) => setDraft({ ...draft, [f.key]: v })} />
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
  { key: "hospital",  labelBn: "হাসপাতাল তথ্য",  icon: Building2 },
  { key: "contact",   labelBn: "যোগাযোগ",          icon: Info },
  { key: "hours",     labelBn: "সময়সূচি",          icon: Clock },
  { key: "social",    labelBn: "সোশ্যাল লিংক",     icon: Share2 },
  { key: "hero",      labelBn: "হিরো সেকশন",       icon: Sparkles },
  { key: "stats",     labelBn: "পরিসংখ্যান",        icon: BarChart2 },
  { key: "about",     labelBn: "আমাদের সম্পর্কে",  icon: Info },
  { key: "sections",  labelBn: "হোমপেজ সেকশন",     icon: LayoutDashboard },
  { key: "notices",   labelBn: "নোটিশ",             icon: Bell },
];

export default function CmsAdminPage() {
  const [activeTab, setActiveTab]   = useState("hospital");
  const [grouped,   setGrouped]     = useState<SiteSettingsGrouped>({});
  const [draft,     setDraft]       = useState<Record<string, string>>({});
  const [sections,  setSections]    = useState<HomepageSection[]>([]);
  const [notices,   setNotices]     = useState<Notice[]>([]);
  const [loading,   setLoading]     = useState(true);
  const [saving,    setSaving]      = useState(false);
  const [saved,     setSaved]       = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsRes, sectionsRes, noticesRes] = await Promise.all([
        fetchAdminSettings(),
        fetchAdminSections(),
        fetchAdminNotices(),
      ]);
      setGrouped(settingsRes.grouped);
      setDraft(settingsRes.map);
      setSections(sectionsRes);
      setNotices(noticesRes);
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

  const isSettingsTab = activeTab !== "sections" && activeTab !== "notices";

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
              </>
            )}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
