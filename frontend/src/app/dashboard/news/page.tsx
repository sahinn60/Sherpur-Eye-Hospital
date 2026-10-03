"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Edit2, Newspaper } from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { Button, Modal, ConfirmDialog } from "@/components/ui";
import { NewsArticle, NewsCategory, NEWS_CATEGORY_TABS } from "@/types/news";
import api from "@/lib/api";

function fmt(d: string) {
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").slice(0, 80);
}

const inp = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500";

function NewsForm({ article, onSubmit, onCancel, error }: {
  article?: NewsArticle | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  error: string;
}) {
  const [form, setForm] = useState({
    titleBn:       article?.titleBn       || "",
    titleEn:       article?.titleEn       || "",
    slug:          article?.slug          || "",
    shortDescBn:   article?.shortDescBn   || "",
    shortDescEn:   article?.shortDescEn   || "",
    contentBn:     article?.contentBn     || "",
    contentEn:     article?.contentEn     || "",
    category:      article?.category      || "ANNOUNCEMENT" as NewsCategory,
    authorBn:      article?.authorBn      || "হাসপাতাল কর্তৃপক্ষ",
    authorEn:      article?.authorEn      || "Hospital Authority",
    isFeatured:    article?.isFeatured    ?? false,
    featuredImage: article?.featuredImage || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try { await onSubmit(form); } finally { setSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p role="alert" className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">শিরোনাম (বাংলা) <span aria-hidden="true" className="text-red-500">*</span></label>
          <input value={form.titleBn} onChange={(e) => { set("titleBn", e.target.value); if (!article) set("slug", slugify(e.target.value)); }} required className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Title (English) <span aria-hidden="true" className="text-red-500">*</span></label>
          <input value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} required className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Slug <span aria-hidden="true" className="text-red-500">*</span></label>
          <input value={form.slug} onChange={(e) => set("slug", e.target.value)} required className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">ক্যাটাগরি</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inp}>
            {NEWS_CATEGORY_TABS.filter((t) => t.value !== "ALL").map((t) => (
              <option key={t.value} value={t.value}>{t.labelBn}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">লেখক (বাংলা)</label>
          <input value={form.authorBn} onChange={(e) => set("authorBn", e.target.value)} className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Author (English)</label>
          <input value={form.authorEn} onChange={(e) => set("authorEn", e.target.value)} className={inp} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">ছবির URL</label>
          <input type="url" value={form.featuredImage} onChange={(e) => set("featuredImage", e.target.value)} placeholder="https://..." className={inp} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">সংক্ষিপ্ত বিবরণ (বাংলা) <span aria-hidden="true" className="text-red-500">*</span></label>
        <textarea value={form.shortDescBn} onChange={(e) => set("shortDescBn", e.target.value)} required rows={2} className={inp} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Short Description (English) <span aria-hidden="true" className="text-red-500">*</span></label>
        <textarea value={form.shortDescEn} onChange={(e) => set("shortDescEn", e.target.value)} required rows={2} className={inp} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">বিস্তারিত (বাংলা) <span aria-hidden="true" className="text-red-500">*</span></label>
        <textarea value={form.contentBn} onChange={(e) => set("contentBn", e.target.value)} required rows={5} className={inp} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Content (English) <span aria-hidden="true" className="text-red-500">*</span></label>
        <textarea value={form.contentEn} onChange={(e) => set("contentEn", e.target.value)} required rows={5} className={inp} />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-primary-600" />
        <span className="text-sm text-gray-700">ফিচার্ড আর্টিকেল</span>
      </label>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" loading={submitting}>{submitting ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</Button>
      </div>
    </form>
  );
}

export default function NewsAdminPage() {
  const [articles,    setArticles]    = useState<NewsArticle[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [catFilter,   setCatFilter]   = useState("");
  const [showForm,    setShowForm]    = useState(false);
  const [editTarget,  setEditTarget]  = useState<NewsArticle | null>(null);
  const [formError,   setFormError]   = useState("");
  const [deleteTarget, setDeleteTarget] = useState<NewsArticle | null>(null);
  const [deleting,    setDeleting]    = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/news", { params: catFilter ? { category: catFilter } : {} });
      setArticles(res.data.data || []);
    } catch {
      setError("সংবাদ লোড করতে সমস্যা হয়েছে।");
    } finally { setLoading(false); }
  }, [catFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(data: any) {
    setFormError("");
    try { await api.post("/news", data); setShowForm(false); load(); }
    catch (e: any) { setFormError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleUpdate(data: any) {
    if (!editTarget) return;
    setFormError("");
    try { await api.patch(`/news/${editTarget.id}`, data); setEditTarget(null); setShowForm(false); load(); }
    catch (e: any) { setFormError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await api.delete(`/news/${deleteTarget.id}`); setDeleteTarget(null); load(); }
    catch (e: any) { setFormError(e?.response?.data?.message || "মুছতে পারেনি"); }
    finally { setDeleting(false); }
  }

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">সংবাদ ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-500 mt-0.5">মোট {articles.length}টি আর্টিকেল</p>
          </div>
          <Button size="sm" onClick={() => { setEditTarget(null); setFormError(""); setShowForm(true); }}
            className="flex items-center gap-2">
            <Plus size={15} aria-hidden="true" /> নতুন সংবাদ
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap" role="group" aria-label="ক্যাটাগরি ফিল্টার">
          {NEWS_CATEGORY_TABS.map((t) => (
            <button key={t.value}
              onClick={() => setCatFilter(t.value === "ALL" ? "" : t.value)}
              aria-pressed={(t.value === "ALL" && !catFilter) || catFilter === t.value}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${
                (t.value === "ALL" && !catFilter) || catFilter === t.value
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-primary-400"
              }`}>
              {t.labelBn}
            </button>
          ))}
        </div>

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" aria-hidden="true" />
            ))
          ) : articles.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
              <Newspaper size={40} className="mx-auto text-gray-200 mb-3" aria-hidden="true" />
              <p className="text-gray-400 text-sm">কোনো সংবাদ পাওয়া যায়নি</p>
              <Button size="sm" className="mt-4" onClick={() => setShowForm(true)}>
                <Plus size={14} className="mr-1" aria-hidden="true" /> প্রথম সংবাদ যোগ করুন
              </Button>
            </div>
          ) : articles.map((a) => (
            <article key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-4">
              <div className="flex gap-3 flex-1 min-w-0">
                {a.featuredImage && (
                  <img src={a.featuredImage} alt="" role="presentation" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{a.titleBn}</p>
                    {a.isFeatured && <span className="text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">ফিচার্ড</span>}
                    <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{a.category}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{a.shortDescBn}</p>
                  <p className="text-xs text-gray-400 mt-1">{fmt(a.publishedAt)} — {a.authorBn}</p>
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => { setEditTarget(a); setFormError(""); setShowForm(true); }}
                  aria-label={`"${a.titleBn}" সম্পাদনা করুন`}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <Edit2 size={14} aria-hidden="true" />
                </button>
                <button
                  onClick={() => setDeleteTarget(a)}
                  aria-label={`"${a.titleBn}" মুছে ফেলুন`}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400">
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {showForm && (
        <Modal open onClose={() => { setShowForm(false); setEditTarget(null); setFormError(""); }}
          title={editTarget ? "সংবাদ সম্পাদনা" : "নতুন সংবাদ"} size="xl">
          <NewsForm
            article={editTarget}
            onSubmit={editTarget ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditTarget(null); setFormError(""); }}
            error={formError}
          />
        </Modal>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="সংবাদ মুছে ফেলুন"
        message={`"${deleteTarget?.titleBn}" স্থায়ীভাবে মুছে ফেলা হবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`}
        confirmLabel={deleting ? "মুছছে..." : "মুছে ফেলুন"}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </RouteGuard>
  );
}
