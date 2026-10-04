"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, FileText, Share2, Lock, ChevronRight, AlertCircle } from "lucide-react";
import { PrescriptionTemplate, TEMPLATE_CATEGORIES } from "@/types/prescription";
import { fetchTemplates } from "@/lib/services/templateService";
import { TemplateCategoryBadge } from "./TemplateCategoryBadge";

interface Props {
  onApply:  (t: PrescriptionTemplate) => void;
  onClose:  () => void;
}

export function TemplateSelector({ onApply, onClose }: Props) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [category,  setCategory]  = useState("");
  const [preview,   setPreview]   = useState<PrescriptionTemplate | null>(null);
  const [error,     setError]     = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchTemplates({ search: search || undefined, category: category || undefined, limit: 50 });
      setTemplates(res.items);
    } catch {
      setError("Failed to load templates.");
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => { load(); }, [load]);

  function handleApply(t: PrescriptionTemplate) {
    onApply(t);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Select Template</h2>
            <p className="text-xs text-gray-400 mt-0.5">Choose a template to pre-fill the prescription. You can edit everything before saving.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Filters */}
        <div className="px-5 py-3 border-b border-gray-100 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
            <option value="">All Categories</option>
            {TEMPLATE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        {/* Body — split list + preview */}
        <div className="flex flex-1 overflow-hidden">

          {/* Template list */}
          <div className="w-1/2 border-r border-gray-100 overflow-y-auto">
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs px-4 py-3">
                <AlertCircle size={14} /> {error}
              </div>
            )}
            {loading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <FileText size={32} className="text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No templates found</p>
                <p className="text-xs text-gray-300 mt-1">Create templates from the Templates page</p>
              </div>
            ) : (
              <div className="p-3 space-y-1.5">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setPreview(t)}
                    className={`w-full text-left px-3 py-3 rounded-xl border transition-all ${
                      preview?.id === t.id
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          <p className="text-sm font-semibold text-gray-900 truncate">{template_display_name(t)}</p>
                          <TemplateCategoryBadge category={t.category} />
                        </div>
                        <div className="flex items-center gap-2">
                          {t.isShared
                            ? <span className="flex items-center gap-0.5 text-[10px] text-emerald-600"><Share2 size={9} /> Shared</span>
                            : <span className="flex items-center gap-0.5 text-[10px] text-gray-400"><Lock size={9} /> Private</span>
                          }
                          {t.items.length > 0 && (
                            <span className="text-[10px] text-gray-400">{t.items.length} medicine{t.items.length > 1 ? "s" : ""}</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={14} className={`shrink-0 mt-1 transition-colors ${preview?.id === t.id ? "text-blue-500" : "text-gray-300"}`} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preview panel */}
          <div className="w-1/2 overflow-y-auto">
            {!preview ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10">
                <FileText size={36} className="text-gray-200 mb-3" />
                <p className="text-sm text-gray-400">Select a template to preview</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{preview.nameBn}</h3>
                  <p className="text-xs text-gray-400">{preview.name}</p>
                </div>

                {preview.chiefComplaint && (
                  <PreviewSection label="Chief Complaint" text={preview.chiefComplaint} />
                )}
                {preview.history && (
                  <PreviewSection label="History" text={preview.history} />
                )}
                {preview.diagnosis && (
                  <PreviewSection label="Diagnosis" text={preview.diagnosis} />
                )}

                {preview.items.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Medicines ({preview.items.length})
                    </p>
                    <div className="space-y-1.5">
                      {preview.items.map((item, i) => (
                        <div key={i} className="bg-blue-50 rounded-lg px-3 py-2">
                          <p className="text-xs font-semibold text-gray-800">
                            {item.dosageForm && <span className="text-gray-400 font-normal">{item.dosageForm} </span>}
                            {item.medicineName}
                            {item.strength && <span className="text-gray-500 ml-1">{item.strength}</span>}
                            {item.eye && <span className="ml-1 text-blue-600">({item.eye})</span>}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {[item.dose, item.frequency, item.duration ? `× ${item.duration}` : ""].filter(Boolean).join(" — ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {preview.advice && (
                  <PreviewSection label="Advice" text={preview.advice} />
                )}

                {(preview.followUpDays || preview.followUpNote) && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Follow-up</p>
                    <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                      {preview.followUpDays ? `${preview.followUpDays} days` : ""}
                      {preview.followUpNote ? (preview.followUpDays ? ` — ${preview.followUpNote}` : preview.followUpNote) : ""}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[10px] text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3">
                    ⚠ Template data will pre-fill the form. Review and edit before saving the prescription.
                  </p>
                  <button
                    onClick={() => handleApply(preview)}
                    className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Use This Template →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function template_display_name(t: PrescriptionTemplate) {
  return t.nameBn || t.name;
}

function PreviewSection({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-xs text-gray-700 bg-gray-50 rounded-lg px-3 py-2 whitespace-pre-line line-clamp-3">{text}</p>
    </div>
  );
}
