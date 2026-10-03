"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Image } from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { Button, Modal } from "@/components/ui";
import { GalleryImage, GalleryCategory, GALLERY_CATEGORY_TABS } from "@/types/gallery";
import api from "@/lib/api";

function GalleryForm({ onSubmit, onCancel, error }: {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  error: string;
}) {
  const [form, setForm] = useState({
    titleBn: "", titleEn: "", category: "HOSPITAL" as GalleryCategory,
    imageUrl: "", publicId: "", width: 0, height: 0, sortOrder: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const inp = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try { await onSubmit(form); } finally { setSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">শিরোনাম (বাংলা) *</label>
          <input value={form.titleBn} onChange={(e) => set("titleBn", e.target.value)} required className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Title (English) *</label>
          <input value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} required className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">ক্যাটাগরি</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inp}>
            {GALLERY_CATEGORY_TABS.filter((t) => t.value !== "ALL").map((t) => (
              <option key={t.value} value={t.value}>{t.labelBn}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">ক্রম</label>
          <input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", parseInt(e.target.value) || 0)} className={inp} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">ছবির URL *</label>
        <input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} required placeholder="https://..." className={inp} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Cloudinary Public ID *</label>
        <input value={form.publicId} onChange={(e) => set("publicId", e.target.value)} required placeholder="folder/image_id" className={inp} />
      </div>
      {form.imageUrl && (
        <div className="rounded-xl overflow-hidden border border-gray-200 max-h-48">
          <img src={form.imageUrl} alt="preview" className="w-full h-48 object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "যোগ হচ্ছে..." : "ছবি যোগ করুন"}</Button>
      </div>
    </form>
  );
}

export default function GalleryAdminPage() {
  const [images,    setImages]    = useState<GalleryImage[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [catFilter, setCatFilter] = useState("");
  const [showForm,  setShowForm]  = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/gallery", { params: catFilter ? { category: catFilter } : {} });
      setImages(res.data.data || []);
    } finally { setLoading(false); }
  }, [catFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(data: any) {
    setFormError("");
    try { await api.post("/gallery", data); setShowForm(false); load(); }
    catch (e: any) { setFormError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleDelete(img: GalleryImage) {
    if (!confirm(`"${img.titleBn}" মুছে ফেলতে চান?`)) return;
    try { await api.delete(`/gallery/${img.id}`); load(); }
    catch (e: any) { alert(e?.response?.data?.message || "মুছতে পারেনি"); }
  }

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">গ্যালারি ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-500 mt-0.5">মোট {images.length}টি ছবি</p>
          </div>
          <Button size="sm" onClick={() => { setFormError(""); setShowForm(true); }}
            className="flex items-center gap-2">
            <Plus size={15} /> ছবি যোগ করুন
          </Button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {GALLERY_CATEGORY_TABS.map((t) => (
            <button key={t.value}
              onClick={() => setCatFilter(t.value === "ALL" ? "" : t.value)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${
                (t.value === "ALL" && !catFilter) || catFilter === t.value
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-primary-400"
              }`}>
              {t.labelBn}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
            <Image size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">কোনো ছবি পাওয়া যায়নি</p>
            <Button size="sm" className="mt-4" onClick={() => setShowForm(true)}>
              <Plus size={14} className="mr-1" /> প্রথম ছবি যোগ করুন
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square">
                <img src={img.imageUrl} alt={img.titleBn}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white text-xs font-medium truncate">{img.titleBn}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-white/70 text-xs">{img.category}</span>
                      <button onClick={() => handleDelete(img)}
                        className="p-1 rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <Modal open onClose={() => { setShowForm(false); setFormError(""); }} title="নতুন ছবি যোগ করুন" size="md">
          <GalleryForm
            onSubmit={handleCreate}
            onCancel={() => { setShowForm(false); setFormError(""); }}
            error={formError}
          />
        </Modal>
      )}
    </RouteGuard>
  );
}
