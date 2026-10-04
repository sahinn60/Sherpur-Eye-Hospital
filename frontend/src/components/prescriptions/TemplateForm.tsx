"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
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

const ROUTE_OPTIONS = ["Eye Drop", "Eye Ointment", "Oral", "Topical", "Subconjunctival", "Intravitreal", "IV", "IM"];
const FREQ_OPTIONS  = [
  "OD (Once daily)", "BD (Twice daily)", "TDS (Three times daily)", "QID (Four times daily)",
  "1+0+1", "1+1+1", "1+0+0", "0+0+1",
  "1 drop OD TDS", "1 drop OS TDS", "1 drop BE TDS",
  "1 drop OD BD",  "1 drop OS BD",  "1 drop BE BD",
  "1 drop OD QID", "1 drop OS QID", "1 drop BE QID",
  "Every 4 hours", "Every 6 hours", "Every 8 hours",
  "At bedtime (HS)", "SOS (As needed)", "Weekly",
];
const DUR_OPTIONS   = [
  "3 days", "5 days", "7 days", "10 days", "14 days",
  "1 month", "2 months", "3 months", "6 months", "Ongoing",
];
const EYE_OPTIONS   = ["", "RE", "LE", "BE"];
const FOLLOWUP_OPTS = [
  { label: "1 Week", days: 7 }, { label: "2 Weeks", days: 14 },
  { label: "1 Month", days: 30 }, { label: "3 Months", days: 90 },
];

const inp  = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white";
const lbl  = "block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide";

export function TemplateForm({ template, onSubmit, onCancel, error }: Props) {
  const [form, setForm] = useState({
    name:           template?.name           ?? "",
    nameBn:         template?.nameBn         ?? "",
    category:       template?.category       ?? "GENERAL",
    chiefComplaint: template?.chiefComplaint ?? "",
    history:        template?.history        ?? "",
    diagnosis:      template?.diagnosis      ?? "",
    advice:         template?.advice         ?? "",
    instructions:   template?.instructions   ?? "",
    followUpNote:   template?.followUpNote   ?? "",
    followUpDays:   template?.followUpDays   ?? null as number | null,
    isShared:       template?.isShared       ?? false,
  });
  const [items,      setItems]      = useState<TemplateItem[]>(
    template?.items.length ? template.items.map((i) => ({ ...i })) : [{ ...EMPTY_ITEM }]
  );
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  function addItem()              { setItems((m) => [...m, { ...EMPTY_ITEM, sortOrder: m.length }]); }
  function removeItem(i: number)  { setItems((m) => m.filter((_, idx) => idx !== i)); }
  function moveUp(i: number)      { if (i === 0) return; const n = [...items]; [n[i-1], n[i]] = [n[i], n[i-1]]; setItems(n); }
  function moveDown(i: number)    { if (i === items.length - 1) return; const n = [...items]; [n[i], n[i+1]] = [n[i+1], n[i]]; setItems(n); }
  function updateItem(i: number, k: keyof TemplateItem, v: string) {
    setItems((m) => m.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        followUpDays: form.followUpDays || null,
        items: items.filter((i) => i.medicineName.trim()).map((item, i) => ({ ...item, sortOrder: i })),
      });
    } finally { setSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      {/* ── Identity ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Template Name (English) *</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} required className={inp}
            placeholder="e.g. Post-op Cataract" />
        </div>
        <div>
          <label className={lbl}>টেমপ্লেট নাম (বাংলা) *</label>
          <input value={form.nameBn} onChange={(e) => set("nameBn", e.target.value)} required className={inp}
            placeholder="যেমন: ছানি অপারেশন পরবর্তী" />
        </div>
        <div>
          <label className={lbl}>Category</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inp}>
            {TEMPLATE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3 pt-5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={form.isShared} onChange={(e) => set("isShared", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600" />
            <span className="text-sm text-gray-700">Share with all doctors</span>
          </label>
        </div>
      </div>

      {/* ── Chief Complaint & History ── */}
      <div className="space-y-3">
        <p className={lbl}>Chief Complaint & History (defaults)</p>
        <textarea rows={2} value={form.chiefComplaint} onChange={(e) => set("chiefComplaint", e.target.value)}
          placeholder="Chief complaint default text..." className={`${inp} resize-none`} />
        <textarea rows={2} value={form.history} onChange={(e) => set("history", e.target.value)}
          placeholder="History default text..." className={`${inp} resize-none`} />
      </div>

      {/* ── Diagnosis ── */}
      <div>
        <label className={lbl}>Diagnosis</label>
        <textarea rows={2} value={form.diagnosis} onChange={(e) => set("diagnosis", e.target.value)}
          className={`${inp} resize-none`} placeholder="e.g. Cataract — BE, Dry Eye Syndrome" />
      </div>

      {/* ── Medicines ── */}
      <div>
        <p className={lbl}>Medicines ({items.filter((i) => i.medicineName.trim()).length})</p>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 w-6 h-6 rounded-full flex items-center justify-center shrink-0">{i + 1}</span>
                <div className="flex gap-0.5 ml-auto">
                  <button type="button" onClick={() => moveUp(i)} disabled={i === 0}
                    className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20"><ChevronUp size={13} /></button>
                  <button type="button" onClick={() => moveDown(i)} disabled={i === items.length - 1}
                    className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20"><ChevronDown size={13} /></button>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)}
                      className="p-1 text-gray-300 hover:text-red-500"><Trash2 size={13} /></button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">Medicine Name *</label>
                  <input value={item.medicineName} onChange={(e) => updateItem(i, "medicineName", e.target.value)}
                    placeholder="e.g. Timolol Eye Drop" className={inp} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Route</label>
                  <select value={item.dosageForm ?? ""} onChange={(e) => updateItem(i, "dosageForm", e.target.value)} className={inp}>
                    <option value="">—</option>
                    {ROUTE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Strength</label>
                  <input value={item.strength ?? ""} onChange={(e) => updateItem(i, "strength", e.target.value)}
                    placeholder="0.5%, 500mg" className={inp} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Eye</label>
                  <select value={item.eye ?? ""} onChange={(e) => updateItem(i, "eye", e.target.value)} className={inp}>
                    {EYE_OPTIONS.map((o) => <option key={o} value={o}>{o || "—"}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Dose</label>
                  <input value={item.dose ?? ""} onChange={(e) => updateItem(i, "dose", e.target.value)}
                    placeholder="1 drop, 1 tab" className={inp} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Frequency</label>
                  <select value={item.frequency ?? ""} onChange={(e) => updateItem(i, "frequency", e.target.value)} className={inp}>
                    <option value="">— Select —</option>
                    {FREQ_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Duration</label>
                  <select value={item.duration ?? ""} onChange={(e) => updateItem(i, "duration", e.target.value)} className={inp}>
                    <option value="">— Select —</option>
                    {DUR_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <label className="text-xs text-gray-500 mb-1 block">Instructions</label>
                  <input value={item.instructions ?? ""} onChange={(e) => updateItem(i, "instructions", e.target.value)}
                    placeholder="After meals, Before bedtime..." className={inp} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addItem}
            className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
            <Plus size={14} /> Add Medicine
          </button>
        </div>
      </div>

      {/* ── Advice ── */}
      <div>
        <label className={lbl}>Advice to Patient</label>
        <textarea rows={3} value={form.advice} onChange={(e) => set("advice", e.target.value)}
          className={`${inp} resize-none`}
          placeholder={"Do not rub your eyes\nWear sunglasses outdoors\nUse medicines regularly as prescribed"} />
      </div>

      {/* ── Follow-up ── */}
      <div className="space-y-3">
        <p className={lbl}>Default Follow-up</p>
        <div className="grid grid-cols-4 gap-2">
          {FOLLOWUP_OPTS.map((p) => (
            <button key={p.days} type="button" onClick={() => set("followUpDays", form.followUpDays === p.days ? null : p.days)}
              className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                form.followUpDays === p.days
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}>
              {p.label}
            </button>
          ))}
        </div>
        <input value={form.followUpNote} onChange={(e) => set("followUpNote", e.target.value)}
          placeholder="Follow-up instructions (e.g. Review with IOP check)..." className={inp} />
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 sticky bottom-0 bg-white pb-1">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : template ? "Update Template" : "Create Template"}
        </Button>
      </div>
    </form>
  );
}
