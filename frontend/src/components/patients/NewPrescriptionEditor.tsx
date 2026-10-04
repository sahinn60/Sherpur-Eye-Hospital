"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Plus, Trash2, Save, User, Phone, Hash,
  Calendar, AlertCircle, CheckCircle, ChevronDown, ChevronUp,
} from "lucide-react";
import { PatientDetail, GENDER_BN } from "@/types/patient";
import { Doctor } from "@/types/doctor";
import { fetchPatient, createPrescription } from "@/lib/services/patientService";
import { fetchDoctors } from "@/lib/services/doctorService";
import { Button } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

// ── Types ─────────────────────────────────────────────────────────────────────

interface MedRow {
  medicineName: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface RefractionRow {
  sph: string;
  cyl: string;
  axis: string;
  add: string;
}

interface EyeExamRow {
  // Anterior segment
  lids: string;
  conjunctiva: string;
  cornea: string;
  ac: string;        // Anterior Chamber
  iris: string;
  pupil: string;
  lens: string;
  // Posterior segment
  vitreous: string;
  disc: string;
  macula: string;
  vessels: string;
  periphery: string;
}

const EMPTY_EYE_EXAM: EyeExamRow = {
  lids: "", conjunctiva: "", cornea: "", ac: "",
  iris: "", pupil: "", lens: "",
  vitreous: "", disc: "", macula: "", vessels: "", periphery: "",
};

const CATARACT_GRADES = ["", "Immature", "Mature", "Hypermature", "Nuclear", "Cortical", "PSC", "Mixed"];
const SURGERY_RECS    = ["", "Advised", "Urgent", "Elective", "Not indicated", "Deferred", "Post-op follow-up"];

// ── Constants ─────────────────────────────────────────────────────────────────

const FREQ_OPTIONS = [
  "১ ফোঁটা OD TDS", "১ ফোঁটা OS TDS", "১ ফোঁটা BE TDS",
  "দিনে ১ বার", "দিনে ২ বার", "দিনে ৩ বার", "দিনে ৪ বার",
  "সকাল-রাত", "প্রয়োজনে", "সাপ্তাহিক",
];
const DUR_OPTIONS = [
  "৩ দিন", "৫ দিন", "৭ দিন", "১০ দিন", "১৪ দিন",
  "১ মাস", "২ মাস", "৩ মাস", "চলমান",
];
const FOLLOWUP_PRESETS = [
  { label: "৭ দিন", days: 7 },
  { label: "১৪ দিন", days: 14 },
  { label: "১ মাস", days: 30 },
  { label: "৩ মাস", days: 90 },
];
const ADVICE_PRESETS = [
  "চোখ ডলবেন না",
  "রোদে সানগ্লাস পরুন",
  "পরিষ্কার পানি দিয়ে চোখ ধুবেন না",
  "ওষুধ নিয়মিত ব্যবহার করুন",
  "ভারী কাজ এড়িয়ে চলুন",
];

// ── Style helpers ─────────────────────────────────────────────────────────────

const inp =
  "w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors placeholder:text-gray-300";
const smallInp =
  "w-full text-xs border border-gray-200 rounded-md px-2 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-center transition-colors placeholder:text-gray-300";
const label = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide";

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  title, icon, children, defaultOpen = true, accent = false,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accent?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-2xl border overflow-hidden shadow-sm ${accent ? "border-blue-200" : "border-gray-200"} bg-white`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-5 py-3.5 transition-colors ${
          accent ? "bg-blue-50 hover:bg-blue-100" : "bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-2.5">
          {icon && <span className={accent ? "text-blue-500" : "text-gray-400"}>{icon}</span>}
          <span className={`text-xs font-bold uppercase tracking-widest ${accent ? "text-blue-700" : "text-gray-600"}`}>
            {title}
          </span>
        </div>
        {open
          ? <ChevronUp size={14} className="text-gray-400" />
          : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}

// ── Patient Banner ────────────────────────────────────────────────────────────

function PatientBanner({ patient }: { patient: PatientDetail }) {
  const fields = [
    { icon: <Hash size={13} />, label: "রোগী আইডি", value: patient.patientId },
    { icon: <User size={13} />, label: "বয়স", value: patient.age ? `${patient.age} বছর` : "—" },
    { icon: <User size={13} />, label: "লিঙ্গ", value: GENDER_BN[patient.gender] },
    { icon: <Phone size={13} />, label: "ফোন", value: patient.phone },
  ];
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-lg font-bold shrink-0">
            {patient.nameBn.slice(0, 2)}
          </div>
          <div>
            <h2 className="text-lg font-bold leading-tight">{patient.nameBn}</h2>
            {patient.nameEn && (
              <p className="text-blue-200 text-sm">{patient.nameEn}</p>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-blue-200 mb-0.5">তারিখ</p>
          <p className="text-sm font-semibold">
            {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {fields.map((f) => (
          <div key={f.label} className="bg-white/10 rounded-xl px-3 py-2">
            <p className="text-blue-200 text-[10px] uppercase tracking-wide flex items-center gap-1 mb-0.5">
              {f.icon} {f.label}
            </p>
            <p className="text-sm font-semibold truncate">{f.value}</p>
          </div>
        ))}
      </div>
      {patient.address && (
        <p className="mt-3 text-xs text-blue-200 truncate">📍 {patient.address}</p>
      )}
    </div>
  );
}

// ── Medicine Row ──────────────────────────────────────────────────────────────

function MedicineRow({
  med, index, total, onChange, onRemove,
}: {
  med: MedRow;
  index: number;
  total: number;
  onChange: (key: keyof MedRow, val: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          ওষুধ #{index + 1}
        </span>
        {total > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={12} /> বাদ দিন
          </button>
        )}
      </div>

      {/* Medicine name — full width */}
      <div className="mb-3">
        <label className={label}>ওষুধের নাম *</label>
        <input
          value={med.medicineName}
          onChange={(e) => onChange("medicineName", e.target.value)}
          placeholder="যেমন: Timolol 0.5% Eye Drop"
          className={inp}
        />
      </div>

      {/* Dose + Frequency + Duration in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div>
          <label className={label}>মাত্রা / Dose</label>
          <input
            value={med.dose}
            onChange={(e) => onChange("dose", e.target.value)}
            placeholder="১ ফোঁটা / 1 tab"
            className={inp}
          />
        </div>
        <div>
          <label className={label}>সময় / Frequency</label>
          <select value={med.frequency} onChange={(e) => onChange("frequency", e.target.value)} className={inp}>
            <option value="">— নির্বাচন করুন —</option>
            {FREQ_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>মেয়াদ / Duration</label>
          <select value={med.duration} onChange={(e) => onChange("duration", e.target.value)} className={inp}>
            <option value="">— নির্বাচন করুন —</option>
            {DUR_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Instructions */}
      <div>
        <label className={label}>নির্দেশনা (ঐচ্ছিক)</label>
        <input
          value={med.instructions}
          onChange={(e) => onChange("instructions", e.target.value)}
          placeholder="খাবার পরে / ঘুমানোর আগে / চোখে দেওয়ার আগে হাত ধুবেন"
          className={inp}
        />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function NewPrescriptionEditor({ patientId }: { patientId: string }) {
  const router = useRouter();
  const { user } = useAuth();

  // Remote data
  const [patient,  setPatient]  = useState<PatientDetail | null>(null);
  const [doctors,  setDoctors]  = useState<Doctor[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);

  // Form fields
  const [doctorId,       setDoctorId]       = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [history,        setHistory]        = useState("");
  const [vaRE,           setVaRE]           = useState("");
  const [vaLE,           setVaLE]           = useState("");
  const [iopRE,          setIopRE]          = useState("");
  const [iopLE,          setIopLE]          = useState("");
  const [reRE,           setReRE]           = useState<RefractionRow>({ sph: "", cyl: "", axis: "", add: "" });
  const [reLE,           setReLE]           = useState<RefractionRow>({ sph: "", cyl: "", axis: "", add: "" });
  const [examNotes,      setExamNotes]      = useState("");
  // Structured slit-lamp / fundus exam
  const [examOD,         setExamOD]         = useState<EyeExamRow>({ ...EMPTY_EYE_EXAM });
  const [examOS,         setExamOS]         = useState<EyeExamRow>({ ...EMPTY_EYE_EXAM });
  // Cataract & surgery
  const [cataractOD,     setCataractOD]     = useState("");
  const [cataractOS,     setCataractOS]     = useState("");
  const [surgeryRecOD,   setSurgeryRecOD]   = useState("");
  const [surgeryRecOS,   setSurgeryRecOS]   = useState("");
  const [clinicalNotes,  setClinicalNotes]  = useState("");
  const [diagnosis,      setDiagnosis]      = useState("");
  const [investigations, setInvestigations] = useState("");
  const [medicines,      setMedicines]      = useState<MedRow[]>([
    { medicineName: "", dose: "", frequency: "", duration: "", instructions: "" },
  ]);
  const [advice,       setAdvice]       = useState("");
  const [instructions, setInstructions] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");

  // Load patient + doctors
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, docs] = await Promise.all([
        fetchPatient(patientId),
        fetchDoctors(),
      ]);
      setPatient(p);
      setDoctors(docs);
      // Auto-select if current user is a doctor
      if (user?.role === "DOCTOR") {
        const match = docs.find(
          (d) => d.nameEn?.toLowerCase() === user.name?.toLowerCase() ||
                 d.nameBn === user.name
        );
        if (match) setDoctorId(match.id);
      }
    } catch {
      setError("রোগীর তথ্য লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [patientId, user]);

  useEffect(() => { load(); }, [load]);

  // Medicine helpers
  function addMed() {
    setMedicines((m) => [...m, { medicineName: "", dose: "", frequency: "", duration: "", instructions: "" }]);
  }
  function removeMed(i: number) {
    setMedicines((m) => m.filter((_, idx) => idx !== i));
  }
  function updateMed(i: number, key: keyof MedRow, val: string) {
    setMedicines((m) => m.map((med, idx) => idx === i ? { ...med, [key]: val } : med));
  }

  // Follow-up preset
  function setFollowUpPreset(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setFollowUpDate(d.toISOString().split("T")[0]);
  }

  // Advice preset toggle
  function toggleAdvicePreset(text: string) {
    setAdvice((prev) => {
      const lines = prev.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.includes(text)) {
        return lines.filter((l) => l !== text).join("\n");
      }
      return [...lines, text].join("\n");
    });
  }

  // Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validMeds = medicines.filter((m) => m.medicineName.trim());
    if (!diagnosis.trim() && validMeds.length === 0) {
      setError("Diagnosis অথবা কমপক্ষে একটি ওষুধ যোগ করুন।");
      return;
    }

    setSaving(true);
    try {
      await createPrescription(patientId, {
        doctorId: doctorId || undefined,
        chiefComplaint: chiefComplaint || undefined,
        history: history || undefined,
        vaRightEye: vaRE || undefined,
        vaLeftEye: vaLE || undefined,
        iopRightEye: iopRE || undefined,
        iopLeftEye: iopLE || undefined,
        refractionRE: (reRE.sph || reRE.cyl || reRE.axis || reRE.add)
          ? JSON.stringify(reRE) : undefined,
        refractionLE: (reLE.sph || reLE.cyl || reLE.axis || reLE.add)
          ? JSON.stringify(reLE) : undefined,
        examNotes: [
          examNotes,
          // Serialize structured exam into examNotes as JSON block
          (Object.values(examOD).some(Boolean) || Object.values(examOS).some(Boolean))
            ? JSON.stringify({ OD: examOD, OS: examOS })
            : "",
          cataractOD ? `Cataract OD: ${cataractOD}` : "",
          cataractOS ? `Cataract OS: ${cataractOS}` : "",
          surgeryRecOD ? `Surgery OD: ${surgeryRecOD}` : "",
          surgeryRecOS ? `Surgery OS: ${surgeryRecOS}` : "",
          clinicalNotes ? `Clinical Notes: ${clinicalNotes}` : "",
        ].filter(Boolean).join("\n") || undefined,
        diagnosis: diagnosis || undefined,
        investigations: investigations || undefined,
        advice: advice || undefined,
        instructions: instructions || undefined,
        followUpDate: followUpDate || undefined,
        followUpNote: followUpNote || undefined,
        items: validMeds.map((m, i) => ({ ...m, sortOrder: i })),
      } as any);

      setSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/patients?open=${patientId}&tab=prescriptions`);
      }, 1200);
    } catch (e: any) {
      setError(e?.response?.data?.message || "সংরক্ষণ করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  }

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded-lg" />
      <div className="h-32 bg-blue-100 rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 bg-gray-100 rounded-2xl" />)}
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-40 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
    </div>
  );

  // ── Fatal error ─────────────────────────────────────────────────────────────
  if (!patient) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <AlertCircle size={40} className="text-red-300" />
      <p className="text-red-500 text-sm">{error || "রোগী পাওয়া যায়নি"}</p>
      <Button variant="secondary" onClick={() => router.back()}>ফিরে যান</Button>
    </div>
  );

  // ── Success overlay ─────────────────────────────────────────────────────────
  if (success) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
        <CheckCircle size={32} className="text-emerald-500" />
      </div>
      <p className="text-lg font-bold text-gray-800">প্রেসক্রিপশন সংরক্ষিত হয়েছে</p>
      <p className="text-sm text-gray-400">রোগীর প্রোফাইলে নিয়ে যাওয়া হচ্ছে...</p>
    </div>
  );

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-10">

      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} /> ফিরে যান
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate">নতুন প্রেসক্রিপশন</h1>
        </div>
        <Button
          type="submit"
          loading={saving}
          className="flex items-center gap-2 shrink-0"
        >
          <Save size={15} /> সংরক্ষণ করুন
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Patient banner */}
      <PatientBanner patient={patient} />

      {/* Doctor selector */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <label className={label}>চিকিৎসক নির্বাচন করুন</label>
        <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className={inp}>
          <option value="">— চিকিৎসক নির্বাচন করুন —</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nameBn} — {d.designationBn}
            </option>
          ))}
        </select>
      </div>

      {/* Two-column layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* ── LEFT / MAIN column (2/3) ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* 1. Chief Complaint & History */}
          <Section title="Chief Complaint & History" defaultOpen>
            <div className="space-y-4">
              <div>
                <label className={label}>Chief Complaint</label>
                <textarea
                  rows={2}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="চোখে ব্যথা, ঝাপসা দেখা, চোখ লাল, আলোর চারপাশে রিং..."
                  className={`${inp} resize-none`}
                />
              </div>
              <div>
                <label className={label}>History</label>
                <textarea
                  rows={3}
                  value={history}
                  onChange={(e) => setHistory(e.target.value)}
                  placeholder="রোগের ইতিহাস, পূর্ববর্তী চিকিৎসা, পারিবারিক ইতিহাস..."
                  className={`${inp} resize-none`}
                />
              </div>
            </div>
          </Section>

          {/* 2. Eye Examination */}
          <Section title="Eye Examination" defaultOpen accent>
            <div className="space-y-6">

              {/* ── Visual Acuity ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-blue-500 rounded-full" />
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Visual Acuity (VA)</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-blue-700 mb-2">OD — Right Eye</p>
                    <label className={label}>Unaided / UCVA</label>
                    <input value={vaRE} onChange={(e) => setVaRE(e.target.value)}
                      placeholder="e.g. 6/60" className={inp} />
                  </div>
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-indigo-700 mb-2">OS — Left Eye</p>
                    <label className={label}>Unaided / UCVA</label>
                    <input value={vaLE} onChange={(e) => setVaLE(e.target.value)}
                      placeholder="e.g. 6/60" className={inp} />
                  </div>
                </div>
              </div>

              {/* ── IOP ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-purple-500 rounded-full" />
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Intraocular Pressure (IOP)</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-purple-700 mb-2">OD — Right Eye</p>
                    <label className={label}>IOP (mmHg)</label>
                    <input value={iopRE} onChange={(e) => setIopRE(e.target.value)}
                      placeholder="e.g. 14 mmHg" className={inp} />
                  </div>
                  <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-violet-700 mb-2">OS — Left Eye</p>
                    <label className={label}>IOP (mmHg)</label>
                    <input value={iopLE} onChange={(e) => setIopLE(e.target.value)}
                      placeholder="e.g. 14 mmHg" className={inp} />
                  </div>
                </div>
              </div>

              {/* ── Refraction ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Refraction</p>
                </div>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm min-w-[420px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left text-xs font-bold text-gray-500 px-4 py-2.5 w-20">Eye</th>
                        {["SPH", "CYL", "AXIS", "ADD"].map((h) => (
                          <th key={h} className="text-center text-xs font-bold text-gray-600 px-3 py-2.5">
                            <span className="bg-white border border-gray-200 px-2.5 py-1 rounded-lg shadow-sm">{h}</span>
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
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold ${color} bg-gray-100 px-2.5 py-1.5 rounded-lg`}>{eyeLabel}</span>
                          </td>
                          {(["sph", "cyl", "axis", "add"] as const).map((k) => (
                            <td key={k} className="px-3 py-3">
                              <input
                                value={state[k]}
                                onChange={(e) => set((r) => ({ ...r, [k]: e.target.value }))}
                                placeholder="—"
                                className={smallInp}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Slit-lamp / Anterior Segment ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-amber-500 rounded-full" />
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Anterior Segment Examination</p>
                </div>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left text-xs font-bold text-gray-500 px-4 py-2.5 w-32">Structure</th>
                        <th className="text-center text-xs font-bold text-blue-600 px-3 py-2.5">OD (Right)</th>
                        <th className="text-center text-xs font-bold text-indigo-600 px-3 py-2.5">OS (Left)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {([
                        { key: "lids" as const,        label: "Lids & Lashes" },
                        { key: "conjunctiva" as const, label: "Conjunctiva" },
                        { key: "cornea" as const,      label: "Cornea" },
                        { key: "ac" as const,          label: "Ant. Chamber" },
                        { key: "iris" as const,        label: "Iris" },
                        { key: "pupil" as const,       label: "Pupil" },
                        { key: "lens" as const,        label: "Lens" },
                      ]).map(({ key, label: rowLabel }) => (
                        <tr key={key} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                          <td className="px-4 py-2.5">
                            <span className="text-xs font-semibold text-gray-600">{rowLabel}</span>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              value={examOD[key]}
                              onChange={(e) => setExamOD((r) => ({ ...r, [key]: e.target.value }))}
                              placeholder="Normal"
                              className={smallInp}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              value={examOS[key]}
                              onChange={(e) => setExamOS((r) => ({ ...r, [key]: e.target.value }))}
                              placeholder="Normal"
                              className={smallInp}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Posterior Segment / Fundus ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-rose-500 rounded-full" />
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Posterior Segment / Fundus</p>
                </div>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left text-xs font-bold text-gray-500 px-4 py-2.5 w-32">Structure</th>
                        <th className="text-center text-xs font-bold text-blue-600 px-3 py-2.5">OD (Right)</th>
                        <th className="text-center text-xs font-bold text-indigo-600 px-3 py-2.5">OS (Left)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {([
                        { key: "vitreous" as const,  label: "Vitreous" },
                        { key: "disc" as const,      label: "Optic Disc" },
                        { key: "macula" as const,    label: "Macula" },
                        { key: "vessels" as const,   label: "Blood Vessels" },
                        { key: "periphery" as const, label: "Periphery" },
                      ]).map(({ key, label: rowLabel }) => (
                        <tr key={key} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                          <td className="px-4 py-2.5">
                            <span className="text-xs font-semibold text-gray-600">{rowLabel}</span>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              value={examOD[key]}
                              onChange={(e) => setExamOD((r) => ({ ...r, [key]: e.target.value }))}
                              placeholder="Normal"
                              className={smallInp}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              value={examOS[key]}
                              onChange={(e) => setExamOS((r) => ({ ...r, [key]: e.target.value }))}
                              placeholder="Normal"
                              className={smallInp}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Cataract Status ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-orange-400 rounded-full" />
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Cataract Status</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-orange-700 mb-2">OD — Right Eye</p>
                    <label className={label}>Cataract Grade / Type</label>
                    <select value={cataractOD} onChange={(e) => setCataractOD(e.target.value)} className={inp}>
                      <option value="">— Not assessed —</option>
                      {CATARACT_GRADES.filter(Boolean).map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-orange-700 mb-2">OS — Left Eye</p>
                    <label className={label}>Cataract Grade / Type</label>
                    <select value={cataractOS} onChange={(e) => setCataractOS(e.target.value)} className={inp}>
                      <option value="">— Not assessed —</option>
                      {CATARACT_GRADES.filter(Boolean).map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Surgery Recommendation ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-red-500 rounded-full" />
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Surgery Recommendation</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-red-50/40 border border-red-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-red-700 mb-2">OD — Right Eye</p>
                    <label className={label}>Recommendation</label>
                    <select value={surgeryRecOD} onChange={(e) => setSurgeryRecOD(e.target.value)} className={inp}>
                      <option value="">— None —</option>
                      {SURGERY_RECS.filter(Boolean).map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="bg-red-50/40 border border-red-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-red-700 mb-2">OS — Left Eye</p>
                    <label className={label}>Recommendation</label>
                    <select value={surgeryRecOS} onChange={(e) => setSurgeryRecOS(e.target.value)} className={inp}>
                      <option value="">— None —</option>
                      {SURGERY_RECS.filter(Boolean).map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Clinical Notes ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-gray-400 rounded-full" />
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Clinical Notes</p>
                </div>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Additional clinical observations, special findings, patient cooperation, dilation status..."
                  className={`${inp} resize-none`}
                />
              </div>

              {/* ── General Exam Notes ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-teal-500 rounded-full" />
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Examination Summary Notes</p>
                </div>
                <textarea
                  rows={2}
                  value={examNotes}
                  onChange={(e) => setExamNotes(e.target.value)}
                  placeholder="Overall examination summary for prescription print..."
                  className={`${inp} resize-none`}
                />
              </div>

            </div>
          </Section>

          {/* 3. Diagnosis & Investigation */}
          <Section title="Diagnosis & Investigation" defaultOpen>
            <div className="space-y-4">
              <div>
                <label className={label}>Diagnosis</label>
                <textarea
                  rows={2}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="ছানি (Cataract), গ্লুকোমা, রেটিনা সমস্যা, Dry Eye..."
                  className={`${inp} resize-none`}
                />
              </div>
              <div>
                <label className={label}>Investigation</label>
                <textarea
                  rows={2}
                  value={investigations}
                  onChange={(e) => setInvestigations(e.target.value)}
                  placeholder="B-scan, OCT, FFA, Corneal topography..."
                  className={`${inp} resize-none`}
                />
              </div>
            </div>
          </Section>

          {/* 4. Medicines */}
          <Section title="℞ Medicines" defaultOpen accent>
            <div className="space-y-3">
              {medicines.map((med, i) => (
                <MedicineRow
                  key={i}
                  med={med}
                  index={i}
                  total={medicines.length}
                  onChange={(key, val) => updateMed(i, key, val)}
                  onRemove={() => removeMed(i)}
                />
              ))}
              <button
                type="button"
                onClick={addMed}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                <Plus size={15} /> আরো ওষুধ যোগ করুন
              </button>
            </div>
          </Section>
        </div>

        {/* ── RIGHT / SIDEBAR column (1/3) ── */}
        <div className="space-y-5">

          {/* 5. Advice */}
          <Section title="Advice" defaultOpen={false}>
            <div className="space-y-3">
              {/* Quick presets */}
              <div>
                <p className="text-xs text-gray-400 mb-2">দ্রুত যোগ করুন:</p>
                <div className="flex flex-wrap gap-1.5">
                  {ADVICE_PRESETS.map((preset) => {
                    const active = advice.includes(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => toggleAdvicePreset(preset)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                          active
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                        }`}
                      >
                        {active ? "✓ " : ""}{preset}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className={label}>Advice</label>
                <textarea
                  rows={5}
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="প্রতিটি পরামর্শ নতুন লাইনে লিখুন..."
                  className={`${inp} resize-none`}
                />
              </div>
              <div>
                <label className={label}>General Instructions</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="ওষুধ নিয়মিত ব্যবহার করুন..."
                  className={`${inp} resize-none`}
                />
              </div>
            </div>
          </Section>

          {/* 6. Follow-up */}
          <Section title="Follow-up" defaultOpen>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-2">দ্রুত নির্বাচন:</p>
                <div className="grid grid-cols-2 gap-2">
                  {FOLLOWUP_PRESETS.map((p) => (
                    <button
                      key={p.days}
                      type="button"
                      onClick={() => setFollowUpPreset(p.days)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                        followUpDate === (() => {
                          const d = new Date();
                          d.setDate(d.getDate() + p.days);
                          return d.toISOString().split("T")[0];
                        })()
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={label}>Follow-up তারিখ</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className={label}>Follow-up নোট</label>
                <input
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  placeholder="পরবর্তী পরীক্ষার জন্য..."
                  className={inp}
                />
              </div>
            </div>
          </Section>

          {/* Save button — sticky on mobile, visible in sidebar on desktop */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <Button
              type="submit"
              loading={saving}
              className="w-full flex items-center justify-center gap-2 py-3"
            >
              <Save size={15} /> প্রেসক্রিপশন সংরক্ষণ করুন
            </Button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full mt-2 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              বাতিল করুন
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
