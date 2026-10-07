"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";

// ─── Debounce hook ────────────────────────────────────────────────────────────
function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
import {
  ArrowLeft, Plus, Trash2, Save, User, Phone, Hash,
  AlertCircle, CheckCircle, ChevronDown, ChevronUp,
  Search, X, Edit2, Check, BookOpen, Eye, EyeOff,
} from "lucide-react";
import { PatientDetail, GENDER_BN } from "@/types/patient";
import { Doctor } from "@/types/doctor";
import { fetchPatient } from "@/lib/services/patientService";
import { createRx } from "@/lib/services/prescriptionService";
import { fetchDoctors } from "@/lib/services/doctorService";
import { Button } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { TemplateSelector } from "@/components/prescriptions";
import { PrescriptionTemplate } from "@/types/prescription";
import { LiveRxPreview } from "@/components/clinic";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MedRow {
  id: string;
  medicineName: string;
  genericName: string;
  strength: string;
  dose: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
}

interface DiagnosisItem { id: string; text: string; }
interface RefractionRow { sph: string; cyl: string; axis: string; add: string; }
interface EyeExamRow {
  lids: string; conjunctiva: string; cornea: string; ac: string;
  iris: string; pupil: string; lens: string;
  vitreous: string; disc: string; macula: string; vessels: string; periphery: string;
}

const EMPTY_EYE_EXAM: EyeExamRow = {
  lids: "", conjunctiva: "", cornea: "", ac: "",
  iris: "", pupil: "", lens: "",
  vitreous: "", disc: "", macula: "", vessels: "", periphery: "",
};

// ─── Constants ────────────────────────────────────────────────────────────────

const ROUTE_OPTIONS = ["Eye Drop","Eye Ointment","Oral","Topical","Subconjunctival","Intravitreal","IV","IM"];

const FREQ_OPTIONS = [
  "OD (Once daily)","BD (Twice daily)","TDS (Three times daily)","QID (Four times daily)",
  "1+0+1","1+1+1","1+0+0","0+0+1",
  "1 drop OD TDS","1 drop OS TDS","1 drop BE TDS",
  "1 drop OD BD","1 drop OS BD","1 drop BE BD",
  "1 drop OD QID","1 drop OS QID","1 drop BE QID",
  "Every 4 hours","Every 6 hours","Every 8 hours",
  "At bedtime (HS)","SOS (As needed)","Weekly",
];

const DUR_OPTIONS = [
  "3 days","5 days","7 days","10 days","14 days",
  "1 month","2 months","3 months","6 months","Ongoing",
];

const COMMON_DIAGNOSES = [
  "Cataract — OD","Cataract — OS","Cataract — BE",
  "Glaucoma — Primary Open Angle","Glaucoma — Angle Closure",
  "Diabetic Retinopathy","Hypertensive Retinopathy",
  "Age-related Macular Degeneration (AMD)",
  "Dry Eye Syndrome","Allergic Conjunctivitis",
  "Bacterial Conjunctivitis","Viral Conjunctivitis",
  "Corneal Ulcer","Pterygium","Chalazion","Stye (Hordeolum)",
  "Refractive Error — Myopia","Refractive Error — Hyperopia",
  "Refractive Error — Astigmatism","Presbyopia",
  "Retinal Detachment","Vitreous Hemorrhage",
  "Central Retinal Artery Occlusion (CRAO)",
  "Central Retinal Vein Occlusion (CRVO)",
  "Optic Neuritis","Amblyopia","Strabismus",
  "Uveitis — Anterior","Uveitis — Posterior",
  "Post-operative follow-up",
];

const ADVICE_PRESETS = [
  "Do not rub your eyes",
  "Wear sunglasses outdoors",
  "Avoid dusty environments",
  "Use medicines regularly as prescribed",
  "Wash hands before applying eye drops",
  "Do not share eye drops with others",
  "Avoid swimming until further notice",
  "Avoid heavy lifting and straining",
  "Keep follow-up appointment",
  "Return immediately if vision worsens",
];

const FOLLOWUP_PRESETS = [
  { label: "1 Week", days: 7 },
  { label: "2 Weeks", days: 14 },
  { label: "1 Month", days: 30 },
  { label: "3 Months", days: 90 },
];

const CATARACT_GRADES = ["Immature","Mature","Hypermature","Nuclear","Cortical","PSC","Mixed"];
const SURGERY_RECS    = ["Advised","Urgent","Elective","Not indicated","Deferred","Post-op follow-up"];

// ─── Style helpers ────────────────────────────────────────────────────────────

const inp = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors placeholder:text-gray-300";
const smallInp = "w-full text-xs border border-gray-200 rounded-md px-2 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-center transition-colors placeholder:text-gray-300";
const lbl = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide";

function uid() { return Math.random().toString(36).slice(2, 9); }

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, badge, children, defaultOpen = true, accent = false }: {
  title: string; badge?: number; children: React.ReactNode;
  defaultOpen?: boolean; accent?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-2xl border shadow-sm bg-white ${accent ? "border-blue-200" : "border-gray-200"}`}>
      <button type="button" onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-5 py-3.5 transition-colors ${accent ? "bg-blue-50 hover:bg-blue-100" : "bg-gray-50 hover:bg-gray-100"}`}>
        <div className="flex items-center gap-2.5">
          <span className={`text-xs font-bold uppercase tracking-widest ${accent ? "text-blue-700" : "text-gray-600"}`}>{title}</span>
          {badge !== undefined && badge > 0 && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>{badge}</span>
          )}
        </div>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && <div className="p-5 overflow-x-auto">{children}</div>}
    </div>
  );
}

// ─── Patient Banner ───────────────────────────────────────────────────────────

function PatientBanner({ patient }: { patient: PatientDetail }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 text-white shadow-lg">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-base font-bold shrink-0">
            {patient.nameBn.slice(0, 2)}
          </div>
          <div>
            <h2 className="text-base font-bold leading-tight">{patient.nameBn}</h2>
            {patient.nameEn && <p className="text-blue-200 text-xs">{patient.nameEn}</p>}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-blue-200 mb-0.5">Date</p>
          <p className="text-xs font-semibold">{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { icon: <Hash size={11} />, label: "Patient ID", value: patient.patientId },
          { icon: <User size={11} />, label: "Age", value: patient.age ? `${patient.age} yrs` : "—" },
          { icon: <User size={11} />, label: "Gender", value: GENDER_BN[patient.gender] },
          { icon: <Phone size={11} />, label: "Phone", value: patient.phone },
        ].map((f) => (
          <div key={f.label} className="bg-white/10 rounded-xl px-3 py-2">
            <p className="text-blue-200 text-[10px] uppercase tracking-wide flex items-center gap-1 mb-0.5">{f.icon} {f.label}</p>
            <p className="text-xs font-semibold truncate">{f.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Medicine Panel ───────────────────────────────────────────────────────────

function MedicinePanel({ medicines, onChange }: {
  medicines: MedRow[];
  onChange: (meds: MedRow[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm,  setShowForm]  = useState(false);
  const [draft,     setDraft]     = useState<MedRow | null>(null);
  const [search,    setSearch]    = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  function emptyMed(): MedRow {
    return { id: uid(), medicineName: "", genericName: "", strength: "", dose: "", frequency: "", duration: "", route: "", instructions: "" };
  }

  function openAdd() {
    setDraft(emptyMed()); setEditingId(null); setShowForm(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  }

  function openEdit(med: MedRow) { setDraft({ ...med }); setEditingId(med.id); setShowForm(true); }

  function saveDraft() {
    if (!draft || !draft.medicineName.trim()) return;
    if (editingId) onChange(medicines.map((m) => m.id === editingId ? draft : m));
    else onChange([...medicines, draft]);
    setShowForm(false); setDraft(null); setEditingId(null); setSearch("");
  }

  function cancelDraft() { setShowForm(false); setDraft(null); setEditingId(null); setSearch(""); }
  function removeMed(id: string) { onChange(medicines.filter((m) => m.id !== id)); }

  function moveUp(i: number) {
    if (i === 0) return;
    const next = [...medicines]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; onChange(next);
  }
  function moveDown(i: number) {
    if (i === medicines.length - 1) return;
    const next = [...medicines]; [next[i], next[i + 1]] = [next[i + 1], next[i]]; onChange(next);
  }

  function setField(key: keyof MedRow, val: string) { setDraft((d) => d ? { ...d, [key]: val } : d); }
  function handleSearch(val: string) { setSearch(val); setField("medicineName", val); }

  return (
    <div className="space-y-3">
      {medicines.length > 0 && (
        <div className="space-y-2">
          {medicines.map((med, i) => (
            <div key={med.id} className="bg-white border border-gray-200 rounded-xl p-3.5 group hover:border-blue-200 hover:shadow-sm transition-all">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 w-6 h-6 rounded-full flex items-center justify-center">{i + 1}</span>
                  <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => moveUp(i)} disabled={i === 0} className="text-gray-300 hover:text-gray-500 disabled:opacity-20"><ChevronUp size={12} /></button>
                    <button type="button" onClick={() => moveDown(i)} disabled={i === medicines.length - 1} className="text-gray-300 hover:text-gray-500 disabled:opacity-20"><ChevronDown size={12} /></button>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 leading-tight">
                        {med.route && <span className="text-gray-400 font-normal">{med.route} </span>}
                        {med.medicineName}
                        {med.strength && <span className="text-gray-500 font-semibold ml-1">{med.strength}</span>}
                      </p>
                      {med.genericName && <p className="text-xs text-gray-400 italic mt-0.5">({med.genericName})</p>}
                      <p className="text-xs text-gray-600 mt-1">
                        {[med.dose, med.frequency, med.duration ? `× ${med.duration}` : ""].filter(Boolean).join(" — ")}
                      </p>
                      {med.instructions && <p className="text-xs text-amber-600 mt-0.5 italic">{med.instructions}</p>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => openEdit(med)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Edit2 size={13} /></button>
                      <button type="button" onClick={() => removeMed(med.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && draft && (
        <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">{editingId ? "Edit Medicine" : "Add Medicine"}</p>
          <div>
            <label className={lbl}>Medicine Name *</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input ref={searchRef} value={search || draft.medicineName} onChange={(e) => handleSearch(e.target.value)} placeholder="Type medicine name..." className={`${inp} pl-9`} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div><label className={lbl}>Generic Name</label><input value={draft.genericName} onChange={(e) => setField("genericName", e.target.value)} placeholder="e.g. Timolol" className={inp} /></div>
            <div><label className={lbl}>Strength</label><input value={draft.strength} onChange={(e) => setField("strength", e.target.value)} placeholder="e.g. 0.5%, 500mg" className={inp} /></div>
            <div>
              <label className={lbl}>Route</label>
              <select value={draft.route} onChange={(e) => setField("route", e.target.value)} className={inp}>
                <option value="">— Select —</option>
                {ROUTE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div><label className={lbl}>Dosage</label><input value={draft.dose} onChange={(e) => setField("dose", e.target.value)} placeholder="e.g. 1 drop, 1 tab" className={inp} /></div>
            <div>
              <label className={lbl}>Frequency</label>
              <select value={draft.frequency} onChange={(e) => setField("frequency", e.target.value)} className={inp}>
                <option value="">— Select —</option>
                {FREQ_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Duration</label>
              <select value={draft.duration} onChange={(e) => setField("duration", e.target.value)} className={inp}>
                <option value="">— Select —</option>
                {DUR_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div><label className={lbl}>Instructions</label><input value={draft.instructions} onChange={(e) => setField("instructions", e.target.value)} placeholder="e.g. After meals, Before bedtime" className={inp} /></div>
          {draft.medicineName && (
            <div className="bg-white border border-blue-100 rounded-xl px-4 py-2.5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Preview</p>
              <p className="text-sm font-bold text-gray-900">
                {draft.route && <span className="text-gray-400 font-normal">{draft.route} </span>}
                {draft.medicineName}{draft.strength && <span className="text-gray-600 ml-1">{draft.strength}</span>}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">{[draft.dose, draft.frequency, draft.duration ? `× ${draft.duration}` : ""].filter(Boolean).join(" — ")}</p>
              {draft.instructions && <p className="text-xs text-amber-600 italic mt-0.5">{draft.instructions}</p>}
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={cancelDraft} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="button" onClick={saveDraft} disabled={!draft.medicineName.trim()} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <Check size={14} /> {editingId ? "Update" : "Add Medicine"}
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <button type="button" onClick={openAdd} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
          <Plus size={15} /> Add Medicine
        </button>
      )}
    </div>
  );
}

// ─── Diagnosis Panel ──────────────────────────────────────────────────────────

function DiagnosisPanel({ items, onChange }: { items: DiagnosisItem[]; onChange: (items: DiagnosisItem[]) => void; }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? COMMON_DIAGNOSES.filter((d) => d.toLowerCase().includes(query.toLowerCase()) && !items.find((i) => i.text === d))
    : COMMON_DIAGNOSES.filter((d) => !items.find((i) => i.text === d)).slice(0, 8);

  function addItem(text: string) {
    if (!text.trim() || items.find((i) => i.text === text.trim())) return;
    onChange([...items, { id: uid(), text: text.trim() }]);
    setQuery(""); inputRef.current?.focus();
  }
  function removeItem(id: string) { onChange(items.filter((i) => i.id !== id)); }
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); if (filtered.length > 0 && query.trim()) addItem(filtered[0]); else if (query.trim()) addItem(query); }
    if (e.key === "Escape") setFocused(false);
  }

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <div key={item.id} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium px-3 py-1.5 rounded-full">
              <span className="text-blue-400 font-bold mr-0.5">{i + 1}.</span>{item.text}
              <button type="button" onClick={() => removeItem(item.id)} className="ml-1 text-blue-400 hover:text-blue-700"><X size={12} /></button>
            </div>
          ))}
        </div>
      )}
      <div className="relative">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={handleKeyDown} placeholder="Search or type diagnosis..."
            className={`${inp} pl-9 pr-10`} />
          {query && <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"><X size={14} /></button>}
        </div>
        {focused && (filtered.length > 0 || query.trim()) && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-56 overflow-y-auto">
            {filtered.map((d) => (
              <button key={d} type="button" onMouseDown={() => addItem(d)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-50 last:border-0">{d}</button>
            ))}
            {query.trim() && !COMMON_DIAGNOSES.includes(query.trim()) && (
              <button type="button" onMouseDown={() => addItem(query)} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-100 flex items-center gap-2">
                <Plus size={13} /> Add "{query.trim()}"
              </button>
            )}
          </div>
        )}
      </div>
      {items.length === 0 && !focused && (
        <div>
          <p className="text-xs text-gray-400 mb-2">Common diagnoses:</p>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_DIAGNOSES.slice(0, 6).map((d) => (
              <button key={d} type="button" onClick={() => addItem(d)} className="text-xs px-2.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">{d}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Advice Panel ─────────────────────────────────────────────────────────────

function AdvicePanel({ advice, instructions, onAdviceChange, onInstructionsChange }: {
  advice: string; instructions: string;
  onAdviceChange: (v: string) => void; onInstructionsChange: (v: string) => void;
}) {
  function togglePreset(text: string) {
    const lines = advice.split("\n").map((l: string) => l.trim()).filter(Boolean);
    if (lines.includes(text)) onAdviceChange(lines.filter((l: string) => l !== text).join("\n"));
    else onAdviceChange([...lines, text].join("\n"));
  }
  const activeLines = advice.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-gray-400 mb-2">Quick add:</p>
        <div className="flex flex-wrap gap-1.5">
          {ADVICE_PRESETS.map((preset) => {
            const active = activeLines.includes(preset);
            return (
              <button key={preset} type="button" onClick={() => togglePreset(preset)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${active ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50"}`}>
                {active ? "✓ " : ""}{preset}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className={lbl}>Advice to Patient</label>
        <textarea rows={5} value={advice} onChange={(e) => onAdviceChange(e.target.value)}
          placeholder={"Write each advice on a new line...\ne.g. Do not rub your eyes"}
          className={`${inp} resize-none font-mono text-xs leading-relaxed`} />
        {activeLines.length > 0 && <p className="text-xs text-gray-400 mt-1">{activeLines.length} advice line{activeLines.length > 1 ? "s" : ""}</p>}
      </div>
      <div>
        <label className={lbl}>General Instructions</label>
        <textarea rows={2} value={instructions} onChange={(e) => onInstructionsChange(e.target.value)}
          placeholder="Use medicines regularly as prescribed..." className={`${inp} resize-none`} />
      </div>
    </div>
  );
}

// ─── Follow-up Panel ──────────────────────────────────────────────────────────

function FollowUpPanel({ followUpDate, followUpNote, onDateChange, onNoteChange }: {
  followUpDate: string; followUpNote: string;
  onDateChange: (v: string) => void; onNoteChange: (v: string) => void;
}) {
  function setPreset(days: number) {
    const d = new Date(); d.setDate(d.getDate() + days); onDateChange(d.toISOString().split("T")[0]);
  }
  const presetDates = FOLLOWUP_PRESETS.map((p) => {
    const d = new Date(); d.setDate(d.getDate() + p.days); return d.toISOString().split("T")[0];
  });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {FOLLOWUP_PRESETS.map((p, i) => (
          <button key={p.days} type="button" onClick={() => setPreset(p.days)}
            className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${followUpDate === presetDates[i] ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"}`}>
            {p.label}
          </button>
        ))}
      </div>
      <div>
        <label className={lbl}>Follow-up Date</label>
        <input type="date" value={followUpDate} onChange={(e) => onDateChange(e.target.value)} className={inp} />
        {followUpDate && <p className="text-xs text-emerald-600 mt-1">📅 {new Date(followUpDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>}
      </div>
      <div>
        <label className={lbl}>Follow-up Instructions</label>
        <input value={followUpNote} onChange={(e) => onNoteChange(e.target.value)} placeholder="e.g. Review with OCT, Check IOP, Post-op review..." className={inp} />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function NewPrescriptionEditor({ patientId }: { patientId: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const [patient,   setPatient]   = useState<PatientDetail | null>(null);
  const [doctors,   setDoctors]   = useState<Doctor[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState(false);
  const [savedRxId, setSavedRxId] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  // Mobile: toggle preview panel
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Doctor
  const [doctorId, setDoctorId] = useState("");

  // History
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [history,        setHistory]        = useState("");

  // Eye exam
  const [vaRE,  setVaRE]  = useState("");
  const [vaLE,  setVaLE]  = useState("");
  const [iopRE, setIopRE] = useState("");
  const [iopLE, setIopLE] = useState("");
  const [reRE,  setReRE]  = useState<RefractionRow>({ sph: "", cyl: "", axis: "", add: "" });
  const [reLE,  setReLE]  = useState<RefractionRow>({ sph: "", cyl: "", axis: "", add: "" });
  const [examOD, setExamOD] = useState<EyeExamRow>({ ...EMPTY_EYE_EXAM });
  const [examOS, setExamOS] = useState<EyeExamRow>({ ...EMPTY_EYE_EXAM });
  const [cataractOD,   setCataractOD]   = useState("");
  const [cataractOS,   setCataractOS]   = useState("");
  const [surgeryRecOD, setSurgeryRecOD] = useState("");
  const [surgeryRecOS, setSurgeryRecOS] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [examNotes,     setExamNotes]     = useState("");

  // Diagnosis, medicines, advice, follow-up
  const [diagnoses,      setDiagnoses]      = useState<DiagnosisItem[]>([]);
  const [investigations, setInvestigations] = useState("");
  const [medicines,      setMedicines]      = useState<MedRow[]>([]);
  const [advice,         setAdvice]         = useState("");
  const [instructions,   setInstructions]   = useState("");
  const [followUpDate,   setFollowUpDate]   = useState("");
  const [followUpNote,   setFollowUpNote]   = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, docs] = await Promise.all([fetchPatient(patientId), fetchDoctors()]);
      setPatient(p);
      setDoctors(docs);
      if (user?.role === "DOCTOR") {
        const match = docs.find((d) => d.nameEn?.toLowerCase() === user.name?.toLowerCase() || d.nameBn === user.name);
        if (match) setDoctorId(match.id);
      }
    } catch {
      setError("Failed to load patient data.");
    } finally {
      setLoading(false);
    }
  }, [patientId, user]);

  useEffect(() => { load(); }, [load]);

  function applyTemplate(t: PrescriptionTemplate) {
    if (t.chiefComplaint) setChiefComplaint(t.chiefComplaint);
    if (t.history)        setHistory(t.history);
    if (t.diagnosis) {
      const parts = t.diagnosis.split(/;\s*/).filter(Boolean);
      setDiagnoses(parts.map((text) => ({ id: uid(), text })));
    }
    if (t.advice)       setAdvice(t.advice);
    if (t.instructions) setInstructions(t.instructions);
    if (t.followUpNote) setFollowUpNote(t.followUpNote);
    if (t.followUpDays) {
      const d = new Date(); d.setDate(d.getDate() + t.followUpDays);
      setFollowUpDate(d.toISOString().split("T")[0]);
    }
    if (t.items.length > 0) {
      setMedicines(t.items.map((item) => ({
        id: uid(), medicineName: item.medicineName, genericName: "",
        strength: item.strength || "", dose: item.dose || "",
        frequency: item.frequency || "", duration: item.duration || "",
        route: item.dosageForm || "", instructions: item.instructions || "",
      })));
    }
  }

  // ── Build live preview data (memoised) ────────────────────────────────────
  const diagnosisText = diagnoses.map((d) => d.text).join("; ");

  const previewData = useMemo(() => ({
    doctorId: doctorId || undefined,
    patient: patient ? {
      id: patient.id, patientId: patient.patientId,
      nameBn: patient.nameBn, nameEn: patient.nameEn || "",
      phone: patient.phone, age: patient.age, gender: patient.gender,
      address: patient.address || null,
    } : null,
    chiefComplaint: chiefComplaint || undefined,
    history: history || undefined,
    vaRightEye: vaRE || undefined,
    vaLeftEye: vaLE || undefined,
    iopRightEye: iopRE || undefined,
    iopLeftEye: iopLE || undefined,
    refractionRE: (reRE.sph || reRE.cyl || reRE.axis || reRE.add) ? JSON.stringify(reRE) : undefined,
    refractionLE: (reLE.sph || reLE.cyl || reLE.axis || reLE.add) ? JSON.stringify(reLE) : undefined,
    examNotes: examNotes || undefined,
    diagnosis: diagnosisText || undefined,
    investigations: investigations || undefined,
    advice: advice || undefined,
    instructions: instructions || undefined,
    followUpDate: followUpDate || undefined,
    followUpNote: followUpNote || undefined,
    items: medicines.map((m, i) => ({
      id: m.id,
      medicineName: m.medicineName,
      strength: m.strength || undefined,
      dosageForm: m.route || undefined,
      route: m.route || undefined,
      dose: m.dose || undefined,
      frequency: m.frequency || undefined,
      duration: m.duration || undefined,
      instructions: [m.genericName ? `(${m.genericName})` : "", m.instructions].filter(Boolean).join(" ") || undefined,
      sortOrder: i,
    })),
  }), [
    doctorId, patient, chiefComplaint, history, vaRE, vaLE, iopRE, iopLE,
    reRE, reLE, examNotes, diagnosisText, investigations,
    advice, instructions, followUpDate, followUpNote, medicines,
  ]);

  // ── Debounce preview data 400ms so iframe doesn't reload on every keystroke
  const debouncedPreviewData = useDebounced(previewData, 400);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!diagnosisText && medicines.length === 0) {
      setError("Please add at least one diagnosis or medicine.");
      return;
    }
    setSaving(true);
    try {
      const saved = await createRx({
        patientId,
        doctorId: doctorId || undefined,
        chiefComplaint: chiefComplaint || undefined,
        history: history || undefined,
        vaRightEye: vaRE || undefined,
        vaLeftEye: vaLE || undefined,
        iopRightEye: iopRE || undefined,
        iopLeftEye: iopLE || undefined,
        refractionRE: (reRE.sph || reRE.cyl || reRE.axis || reRE.add) ? JSON.stringify(reRE) : undefined,
        refractionLE: (reLE.sph || reLE.cyl || reLE.axis || reLE.add) ? JSON.stringify(reLE) : undefined,
        examNotes: [
          examNotes,
          (Object.values(examOD).some(Boolean) || Object.values(examOS).some(Boolean)) ? JSON.stringify({ OD: examOD, OS: examOS }) : "",
          cataractOD   ? `Cataract OD: ${cataractOD}`     : "",
          cataractOS   ? `Cataract OS: ${cataractOS}`     : "",
          surgeryRecOD ? `Surgery OD: ${surgeryRecOD}`    : "",
          surgeryRecOS ? `Surgery OS: ${surgeryRecOS}`    : "",
          clinicalNotes ? `Clinical Notes: ${clinicalNotes}` : "",
        ].filter(Boolean).join("\n") || undefined,
        diagnosis: diagnosisText || undefined,
        investigations: investigations || undefined,
        advice: advice || undefined,
        instructions: instructions || undefined,
        followUpDate: followUpDate || undefined,
        followUpNote: followUpNote || undefined,
        items: medicines.map((m, i) => ({
          medicineName: m.medicineName,
          strength:     m.strength     || undefined,
          dosageForm:   m.route        || undefined,
          route:        m.route        || undefined,
          dose:         m.dose         || undefined,
          frequency:    m.frequency    || undefined,
          duration:     m.duration     || undefined,
          instructions: [m.genericName ? `(${m.genericName})` : "", m.instructions].filter(Boolean).join(" ") || undefined,
          sortOrder: i,
        })),
      });
      setSavedRxId((saved as any).id);
      setSuccess(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to save prescription.");
    } finally {
      setSaving(false);
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded-lg" />
      <div className="h-28 bg-blue-100 rounded-2xl" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="space-y-4">{[1,2,3,4].map((i) => <div key={i} className="h-40 bg-gray-100 rounded-2xl" />)}</div>
        <div className="h-[600px] bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );

  // ── Error ────────────────────────────────────────────────────────────────
  if (!patient) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <AlertCircle size={40} className="text-red-300" />
      <p className="text-red-500 text-sm">{error || "Patient not found"}</p>
      <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
    </div>
  );

  // ── Success ──────────────────────────────────────────────────────────────
  if (success) return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
        <CheckCircle size={32} className="text-emerald-500" />
      </div>
      <p className="text-lg font-bold text-gray-800">Prescription Saved!</p>
      <div className="flex items-center gap-3">
        {savedRxId && (
          <button onClick={() => router.push(`/dashboard/prescriptions/${savedRxId}/preview`)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            Preview &amp; Print
          </button>
        )}
        <button onClick={() => router.push(`/dashboard/patients?open=${patientId}&tab=prescriptions`)}
          className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          Back to Patient
        </button>
      </div>
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-10">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <button type="button" onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="flex-1 text-base font-bold text-gray-900 truncate">New Prescription</h1>

        {/* Mobile preview toggle */}
        <button type="button" onClick={() => setShowMobilePreview((v) => !v)}
          className="xl:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors">
          {showMobilePreview ? <EyeOff size={14} /> : <Eye size={14} />}
          {showMobilePreview ? "Hide Preview" : "View Preview"}
        </button>

        <button type="button" onClick={() => setShowTemplateSelector(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors shrink-0">
          <BookOpen size={15} /> Use Template
        </button>
        <Button type="submit" loading={saving} className="flex items-center gap-2 shrink-0">
          <Save size={15} /> Save
        </Button>
      </div>

      {showTemplateSelector && (
        <TemplateSelector onApply={applyTemplate} onClose={() => setShowTemplateSelector(false)} />
      )}

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {/* ── Two-panel layout: Editor (left) + Live Preview (right) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">

        {/* ── LEFT: Editor ── */}
        <div className="space-y-4 min-w-0">

          <PatientBanner patient={patient} />

          {/* Doctor */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <label className={lbl}>Attending Doctor</label>
            <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className={inp}>
              <option value="">— Select Doctor —</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.nameBn} — {d.designationBn}</option>)}
            </select>
          </div>

          {/* Chief Complaint & History */}
          <Section title="Chief Complaint & History">
            <div className="space-y-4">
              <div>
                <label className={lbl}>Chief Complaint</label>
                <textarea rows={2} value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="Eye pain, blurred vision, redness..." className={`${inp} resize-none`} />
              </div>
              <div>
                <label className={lbl}>History</label>
                <textarea rows={3} value={history} onChange={(e) => setHistory(e.target.value)}
                  placeholder="Duration, previous treatment, family history..." className={`${inp} resize-none`} />
              </div>
            </div>
          </Section>

          {/* Eye Examination */}
          <Section title="Eye Examination" accent>
            <div className="space-y-5">
              {/* VA */}
              <div>
                <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 bg-blue-500 rounded-full" /><p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Visual Acuity (VA)</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-blue-700 mb-2">OD — Right Eye</p>
                    <input value={vaRE} onChange={(e) => setVaRE(e.target.value)} placeholder="e.g. 6/60" className={inp} />
                  </div>
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-indigo-700 mb-2">OS — Left Eye</p>
                    <input value={vaLE} onChange={(e) => setVaLE(e.target.value)} placeholder="e.g. 6/60" className={inp} />
                  </div>
                </div>
              </div>
              {/* IOP */}
              <div>
                <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 bg-purple-500 rounded-full" /><p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Intraocular Pressure (IOP)</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-purple-700 mb-2">OD — Right Eye</p>
                    <input value={iopRE} onChange={(e) => setIopRE(e.target.value)} placeholder="e.g. 14 mmHg" className={inp} />
                  </div>
                  <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-violet-700 mb-2">OS — Left Eye</p>
                    <input value={iopLE} onChange={(e) => setIopLE(e.target.value)} placeholder="e.g. 14 mmHg" className={inp} />
                  </div>
                </div>
              </div>
              {/* Refraction */}
              <div>
                <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 bg-emerald-500 rounded-full" /><p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Refraction</p></div>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm min-w-[380px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left text-xs font-bold text-gray-500 px-4 py-2.5 w-16">Eye</th>
                        {["SPH","CYL","AXIS","ADD"].map((h) => (
                          <th key={h} className="text-center text-xs font-bold text-gray-600 px-3 py-2.5">
                            <span className="bg-white border border-gray-200 px-2 py-1 rounded-lg shadow-sm">{h}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {([
                        { eyeLabel: "OD", color: "text-blue-700", state: reRE, set: setReRE },
                        { eyeLabel: "OS", color: "text-indigo-700", state: reLE, set: setReLE },
                      ] as const).map(({ eyeLabel, color, state, set }) => (
                        <tr key={eyeLabel} className="border-b border-gray-100 last:border-0">
                          <td className="px-4 py-3"><span className={`text-xs font-bold ${color} bg-gray-100 px-2 py-1.5 rounded-lg`}>{eyeLabel}</span></td>
                          {(["sph","cyl","axis","add"] as const).map((k) => (
                            <td key={k} className="px-3 py-3">
                              <input value={state[k]} onChange={(e) => set((r) => ({ ...r, [k]: e.target.value }))} placeholder="—" className={smallInp} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Anterior Segment */}
              <div>
                <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 bg-amber-500 rounded-full" /><p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Anterior Segment</p></div>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm min-w-[420px]">
                    <thead><tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left text-xs font-bold text-gray-500 px-4 py-2.5 w-28">Structure</th>
                      <th className="text-center text-xs font-bold text-blue-600 px-3 py-2.5">OD (Right)</th>
                      <th className="text-center text-xs font-bold text-indigo-600 px-3 py-2.5">OS (Left)</th>
                    </tr></thead>
                    <tbody>
                      {([
                        { key: "lids" as const, label: "Lids & Lashes" },
                        { key: "conjunctiva" as const, label: "Conjunctiva" },
                        { key: "cornea" as const, label: "Cornea" },
                        { key: "ac" as const, label: "Ant. Chamber" },
                        { key: "iris" as const, label: "Iris" },
                        { key: "pupil" as const, label: "Pupil" },
                        { key: "lens" as const, label: "Lens" },
                      ]).map(({ key, label: rowLabel }) => (
                        <tr key={key} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                          <td className="px-4 py-2.5"><span className="text-xs font-semibold text-gray-600">{rowLabel}</span></td>
                          <td className="px-3 py-2"><input value={examOD[key]} onChange={(e) => setExamOD((r) => ({ ...r, [key]: e.target.value }))} placeholder="Normal" className={smallInp} /></td>
                          <td className="px-3 py-2"><input value={examOS[key]} onChange={(e) => setExamOS((r) => ({ ...r, [key]: e.target.value }))} placeholder="Normal" className={smallInp} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Posterior Segment */}
              <div>
                <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 bg-rose-500 rounded-full" /><p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Posterior Segment / Fundus</p></div>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm min-w-[420px]">
                    <thead><tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left text-xs font-bold text-gray-500 px-4 py-2.5 w-28">Structure</th>
                      <th className="text-center text-xs font-bold text-blue-600 px-3 py-2.5">OD (Right)</th>
                      <th className="text-center text-xs font-bold text-indigo-600 px-3 py-2.5">OS (Left)</th>
                    </tr></thead>
                    <tbody>
                      {([
                        { key: "vitreous" as const, label: "Vitreous" },
                        { key: "disc" as const, label: "Optic Disc" },
                        { key: "macula" as const, label: "Macula" },
                        { key: "vessels" as const, label: "Blood Vessels" },
                        { key: "periphery" as const, label: "Periphery" },
                      ]).map(({ key, label: rowLabel }) => (
                        <tr key={key} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                          <td className="px-4 py-2.5"><span className="text-xs font-semibold text-gray-600">{rowLabel}</span></td>
                          <td className="px-3 py-2"><input value={examOD[key]} onChange={(e) => setExamOD((r) => ({ ...r, [key]: e.target.value }))} placeholder="Normal" className={smallInp} /></td>
                          <td className="px-3 py-2"><input value={examOS[key]} onChange={(e) => setExamOS((r) => ({ ...r, [key]: e.target.value }))} placeholder="Normal" className={smallInp} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Cataract + Surgery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 bg-orange-400 rounded-full" /><p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Cataract Status</p></div>
                  {[{ label: "OD", val: cataractOD, set: setCataractOD }, { label: "OS", val: cataractOS, set: setCataractOS }].map(({ label: el, val, set }) => (
                    <div key={el} className="mb-2">
                      <p className="text-xs font-semibold text-gray-500 mb-1">{el}</p>
                      <select value={val} onChange={(e) => set(e.target.value)} className={inp}>
                        <option value="">— Not assessed —</option>
                        {CATARACT_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3"><div className="w-1 h-4 bg-red-500 rounded-full" /><p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Surgery Rec.</p></div>
                  {[{ label: "OD", val: surgeryRecOD, set: setSurgeryRecOD }, { label: "OS", val: surgeryRecOS, set: setSurgeryRecOS }].map(({ label: el, val, set }) => (
                    <div key={el} className="mb-2">
                      <p className="text-xs font-semibold text-gray-500 mb-1">{el}</p>
                      <select value={val} onChange={(e) => set(e.target.value)} className={inp}>
                        <option value="">— None —</option>
                        {SURGERY_RECS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              {/* Clinical Notes + Exam Summary */}
              <div className="space-y-3">
                <div>
                  <label className={lbl}>Clinical Notes</label>
                  <textarea rows={2} value={clinicalNotes} onChange={(e) => setClinicalNotes(e.target.value)} placeholder="Additional observations..." className={`${inp} resize-none`} />
                </div>
                <div>
                  <label className={lbl}>Examination Summary</label>
                  <textarea rows={2} value={examNotes} onChange={(e) => setExamNotes(e.target.value)} placeholder="Overall examination summary (appears on prescription)..." className={`${inp} resize-none`} />
                </div>
              </div>
            </div>
          </Section>

          {/* Diagnosis */}
          <Section title="Diagnosis" badge={diagnoses.length}>
            <div className="space-y-4">
              <DiagnosisPanel items={diagnoses} onChange={setDiagnoses} />
              <div>
                <label className={lbl}>Investigation / Tests Ordered</label>
                <textarea rows={2} value={investigations} onChange={(e) => setInvestigations(e.target.value)} placeholder="B-scan, OCT, FFA, Corneal topography, HVF..." className={`${inp} resize-none`} />
              </div>
            </div>
          </Section>

          {/* Medicines */}
          <Section title="℞ Medicines" badge={medicines.length} accent>
            <MedicinePanel medicines={medicines} onChange={setMedicines} />
          </Section>

          {/* Advice */}
          <Section title="Advice & Instructions" defaultOpen={false}>
            <AdvicePanel advice={advice} instructions={instructions} onAdviceChange={setAdvice} onInstructionsChange={setInstructions} />
          </Section>

          {/* Follow-up */}
          <Section title="Follow-up">
            <FollowUpPanel followUpDate={followUpDate} followUpNote={followUpNote} onDateChange={setFollowUpDate} onNoteChange={setFollowUpNote} />
          </Section>

          {/* Save card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
            <div className="space-y-1 mb-3">
              {diagnoses.length > 0 && <p className="text-xs text-gray-500"><span className="font-semibold text-gray-700">{diagnoses.length}</span> diagnosis</p>}
              {medicines.length > 0 && <p className="text-xs text-gray-500"><span className="font-semibold text-gray-700">{medicines.length}</span> medicine{medicines.length > 1 ? "s" : ""}</p>}
              {followUpDate && <p className="text-xs text-emerald-600">Follow-up: {new Date(followUpDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>}
            </div>
            <Button type="submit" loading={saving} className="w-full flex items-center justify-center gap-2 py-3">
              <Save size={15} /> Save Prescription
            </Button>
            <button type="button" onClick={() => router.back()} className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
          </div>
        </div>

        {/* ── RIGHT: Live Preview ── */}
        {/* Desktop: always visible sticky panel */}
        <div className="hidden xl:block">
          <div className="sticky top-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Eye size={13} className="text-blue-500" /> Live Preview
              </p>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Updates as you type</span>
            </div>
            <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-gray-50" style={{ height: "calc(100vh - 120px)" }}>
              <LiveRxPreview data={debouncedPreviewData} />
            </div>
          </div>
        </div>

        {/* Mobile: collapsible preview below editor */}
        {showMobilePreview && (
          <div className="xl:hidden">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Eye size={13} className="text-blue-500" /> Live Preview
              </p>
              <button type="button" onClick={() => setShowMobilePreview(false)} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                <EyeOff size={12} /> Hide
              </button>
            </div>
            <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-gray-50" style={{ height: "80vh" }}>
              <LiveRxPreview data={debouncedPreviewData} />
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

