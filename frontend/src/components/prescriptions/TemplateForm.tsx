"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { PrescriptionTemplate, TemplateItem, TEMPLATE_CATEGORIES } from "@/types/prescription";

interface Props {
  template?: PrescriptionTemplate | null;
  onSubmit:  (data: any) => Promise<void>;
  onCancel:  () => void;
  error:     string;
}

const EMPTY_ITEM: TemplateItem = {
  medicineName: "", strength: "", dosageForm: "", eye: "",
  dose: "", frequency: "", duration: "", instructions: "", sortOrder: 0,
};

const EYE_OPTIONS  = ["", "RE", "LE", "BE"];
const FREQ_OPTIONS = ["দিনে ১ বার", "দিনে ২ বার", "দিনে ৩ বার", "দিনে ৪ বার",
  "১ ফোঁটা OD TDS", "১ ফোঁটা OS TDS", "১ ফোঁটা BE TDS", "সকাল-রাত", "প্রয়োজনে"];
const DUR_OPTIONS  = ["৩ দিন", "৫ দিন", "৭ দিন", "১০ দিন", "১৪ দিন", "১ মাস", "২ মাস", "৩ মাস", "চলমান"];

const inp = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500";

export function TemplateForm({ template, onSubmit, onCancel, error }: Props) {
  const [form, setForm] = useState({
    name:         template?.name         ?? "",
    nameBn:       template?.nameBn       ?? "",
    category:     template?.category     ?? "GENERAL",
    diagnosis:    template?.diagnosis    ?? "",
    advice:       template?.advice       ?? "",
    instructions: template?.instructions ?? "",
    isShared:     template?.isShared     ?? false,
  });
  const [items, setItems] = useState<TemplateItem[]>(
    template?.items.length ? template.items : [{ ...EMPTY_ITEM }]
  );
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  function addItem()           { setItems((m) => [...m, { ...EMPTY_ITEM, sortOrder: m.length }]); }
  function removeItem(i: number) { setItems((m) => m.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, k: keyof TemplateItem, v: string) {
    setItems((m) => m.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ ...form, items: items.map((item, i) => ({ ...item, sortOrder: i })) });
    } finally { setSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      {/* Basic info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">টেমপ্লেট নাম (বাংলা) *</label>
          <input value={form.nameBn} onChange={(e) => set("nameBn", e.target.value)} required className={inp}
            placeholder="যেমন: ছানি অপারেশন পরবর্তী" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Template Name (English) *</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} required className={inp}
            placeholder="e.g. Post-op Cataract" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">ক্যাটাগরি</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inp}>
            {TEMPLATE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3 pt-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isShared} onChange={(e) => set("isShared", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600" />
            <span className="text-sm text-gray-700">সকল চিকিৎসকের সাথে শেয়ার করুন</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">রোগ নির্ণয় (Diagnosis)</label>
        <textarea rows={2} value={form.diagnosis} onChange={(e) => set("diagnosis", e.target.value)}
          className={`${inp} resize-none`} placeholder="ছানি (Cataract), গ্লুকোমা..." />
      </div>

      {/* Medicine items */}
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">ওষুধের তালিকা</p>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="col-span-2 sm:col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">ওষুধের নাম *</label>
                  <input value={item.medicineName} onChange={(e) => updateItem(i, "medicineName", e.target.value)}
                    placeholder="যেমন: Timolol 0.5% Eye Drop" className={inp} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">চোখ (Eye)</label>
                  <select value={item.eye ?? ""} onChange={(e) => updateItem(i, "eye", e.target.value)} className={inp}>
                    {EYE_OPTIONS.map((o) => <option key={o} value={o}>{o || "—"}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">মাত্রা (Dose)</label>
                  <input value={item.dose ?? ""} onChange={(e) => updateItem(i, "dose", e.target.value)}
                    placeholder="১ ফোঁটা" className={inp} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">সময় (Frequency)</label>
                  <select value={item.frequency ?? ""} onChange={(e) => updateItem(i, "frequency", e.target.value)} className={inp}>
                    <option value="">নির্বাচন করুন</option>
                    {FREQ_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">মেয়াদ (Duration)</label>
                  <select value={item.duration ?? ""} onChange={(e) => updateItem(i, "duration", e.target.value)} className={inp}>
                    <option value="">নির্বাচন করুন</option>
                    {DUR_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(i)}
                  className="mt-2 text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
                  <Trash2 size={11} /> বাদ দিন
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addItem}
            className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors">
            <Plus size={14} /> ওষুধ যোগ করুন
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">পরামর্শ (Advice)</label>
        <textarea rows={3} value={form.advice} onChange={(e) => set("advice", e.target.value)}
          className={`${inp} resize-none`} placeholder="চোখ ডলবেন না&#10;রোদ থেকে দূরে থাকুন..." />
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "সংরক্ষণ হচ্ছে..." : template ? "আপডেট করুন" : "টেমপ্লেট তৈরি করুন"}
        </Button>
      </div>
    </form>
  );
}
