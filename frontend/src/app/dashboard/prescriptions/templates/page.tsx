"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Filter, BookTemplate } from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { Button, Modal } from "@/components/ui";
import { TemplateCard, TemplateForm } from "@/components/prescriptions";
import {
  fetchTemplates, createTemplate, updateTemplate, deleteTemplate,
} from "@/lib/services/templateService";
import { PrescriptionTemplate, TEMPLATE_CATEGORIES } from "@/types/prescription";

export default function TemplatesPage() {
  const [templates,  setTemplates]  = useState<PrescriptionTemplate[]>([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [category,   setCategory]   = useState("");

  const [showForm,   setShowForm]   = useState(false);
  const [editTarget, setEditTarget] = useState<PrescriptionTemplate | null>(null);
  const [formError,  setFormError]  = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchTemplates({
        search: search || undefined,
        category: category || undefined,
        page, limit: 20,
      });
      setTemplates(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [search, category, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, category]);

  async function handleCreate(data: any) {
    setFormError("");
    try {
      await createTemplate(data);
      setShowForm(false);
      load();
    } catch (e: any) {
      setFormError(e?.response?.data?.message || "সমস্যা হয়েছে");
      throw e;
    }
  }

  async function handleUpdate(data: any) {
    if (!editTarget) return;
    setFormError("");
    try {
      await updateTemplate(editTarget.id, data);
      setEditTarget(null);
      load();
    } catch (e: any) {
      setFormError(e?.response?.data?.message || "সমস্যা হয়েছে");
      throw e;
    }
  }

  async function handleDelete(t: PrescriptionTemplate) {
    if (!confirm(`"${t.nameBn}" টেমপ্লেট মুছে ফেলতে চান?`)) return;
    try { await deleteTemplate(t.id); load(); }
    catch (e: any) { alert(e?.response?.data?.message || "মুছতে পারেনি"); }
  }

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DOCTOR"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">প্রেসক্রিপশন টেমপ্লেট</h1>
            <p className="text-sm text-gray-500 mt-0.5">মোট {total}টি টেমপ্লেট</p>
          </div>
          <Button onClick={() => { setEditTarget(null); setFormError(""); setShowForm(true); }}
            className="flex items-center gap-2">
            <Plus size={15} /> নতুন টেমপ্লেট
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="টেমপ্লেট নাম খুঁজুন..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option value="">সব ক্যাটাগরি</option>
              {TEMPLATE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            ))
          ) : templates.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
              <BookTemplate size={40} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">কোনো টেমপ্লেট পাওয়া যায়নি</p>
              <button onClick={() => setShowForm(true)}
                className="mt-3 text-sm text-primary-600 hover:underline">
                প্রথম টেমপ্লেট তৈরি করুন
              </button>
            </div>
          ) : templates.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              canEdit={true}
              onEdit={(tmpl) => { setEditTarget(tmpl); setFormError(""); setShowForm(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">মোট {total}টি</p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</Button>
              <span className="text-xs text-gray-500 self-center">{page}/{totalPages}</span>
              <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</Button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <Modal open onClose={() => { setShowForm(false); setEditTarget(null); setFormError(""); }}
          title={editTarget ? "টেমপ্লেট সম্পাদনা" : "নতুন টেমপ্লেট তৈরি"} size="xl">
          <TemplateForm
            template={editTarget}
            onSubmit={editTarget ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditTarget(null); setFormError(""); }}
            error={formError}
          />
        </Modal>
      )}
    </RouteGuard>
  );
}
