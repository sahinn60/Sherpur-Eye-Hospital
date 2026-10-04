"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Printer, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui";
import { ClinicPrescription } from "@/types/clinic";
import { fetchDoctors } from "@/lib/services/doctorService";
import { Doctor } from "@/types/doctor";

interface MedRow {
  medicineName: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Props {
  patientId: string;
  visitId?: string;
  patientName: string;
  patientAge?: number | null;
  onSave: (data: any) => Promise<ClinicPrescription>;
  onPrint: (rx: ClinicPrescription) => void;
  onCancel: () => void;
}

const FREQ_OPTIONS = ["১ ফোঁটা OD TDS", "১ ফোঁটা OS TDS", "১ ফোঁটা BE TDS", "দিনে ১ বার", "দিনে ২ বার", "দিনে ৩ বার", "দিনে ৪ বার", "সকাল-রাত", "প্রয়োজনে", "সাপ্তাহিক"];
const DUR_OPTIONS = ["৩ দিন", "৫ দিন", "৭ দিন", "১০ দিন", "১৪ দিন", "১ মাস", "২ মাস", "৩ মাস", "চলমান"];
const FOLLOWUP_PRESETS = [
  { label: "৭ দিন", days: 7 },
  { label: "১৪ দিন", days: 14 },
  { label: "১ মাস", days: 30 },
  { label: "৩ মাস", days: 90 },
];

const inp = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";
const smallInp = "w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-center";

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-600">{title}</span>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

export function PrescriptionEditor({ patientId, visitId, patientName, patientAge, onSave, onPrint, onCancel }: Props) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [doctorId, setDoctorId] = useState("");

  // Clinical
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [history, setHistory] = useState("");

  // Eye exam
  const [vaRE, setVaRE] = useState("");
  const [vaLE, setVaLE] = useState("");
  const [iopRE, setIopRE] = useState("");
  const [iopLE, setIopLE] = useState("");
  const [reRE, setReRE] = useState({ sph: "", cyl: "", axis: "", add: "" });
  const [reLE, setReLE] = useState({ sph: "", cyl: "", axis: "", add: "" });
  const [examNotes, setExamNotes] = useState("");

  // Diagnosis & Rx
  const [diagnosis, setDiagnosis] = useState("");
  const [investigations, setInvestigations] = useState("");
  const [medicines, setMedicines] = useState<MedRow[]>([{ medicineName: "", dose: "", frequency: "", duration: "", instructions: "" }]);

  // Advice & Follow-up
  const [advice, setAdvice] = useState("");
  const [instructions, setInstructions] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");

  useEffect(() => { fetchDoctors().then(setDoctors).catch(() => {}); }, []);

  function addMed() { setMedicines(m => [...m, { medicineName: "", dose: "", frequency: "", duration: "", instructions: "" }]); }
  function removeMed(i: number) { setMedicines(m => m.filter((_, idx) => idx !== i)); }
  function updateMed(i: number, key: keyof MedRow, val: string) {
    setMedicines(m => m.map((med, idx) => idx === i ? { ...med, [key]: val } : med));
  }

  function setFollowUpPreset(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setFollowUpDate(d.toISOString().split("T")[0]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!doctorId) { setError("চিকিৎসক নির্বাচন করুন"); return; }
    const validMeds = medicines.filter(m => m.medicineName.trim());
    if (validMeds.length === 0) { setError("কমপক্ষে একটি ওষুধ যোগ করুন"); return; }
    setError(""); setSaving(true);
    try {
      const rx = await onSave({
        visitId,
        doctorId,
        chiefComplaint: chiefComplaint || undefined,
        history: history || undefined,
        vaRightEye: vaRE || undefined,
        vaLeftEye: vaLE || undefined,
        iopRightEye: iopRE || undefined,
        iopLeftEye: iopLE || undefined,
        refractionRE: (reRE.sph || reRE.cyl || reRE.axis || reRE.add) ? JSON.stringify(reRE) : undefined,
        refractionLE: (reLE.sph || reLE.cyl || reLE.axis || reLE.add) ? JSON.stringify(reLE) : undefined,
        examNotes: examNotes || undefined,
        diagnosis: diagnosis || undefined,
        investigations: investigations || undefined,
        advice: advice || undefined,
        instructions: instructions || undefined,
        followUpDate: followUpDate || undefined,
        followUpNote: followUpNote || undefined,
        items: validMeds.map((m, i) => ({ ...m, sortOrder: i })),
      });
      onPrint(rx);
    } catch (e: any) {
      setError(e?.response?.data?.message || "সমস্যা হয়েছে");
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 overflow-y-auto max-h-[78vh] pr-1">

      {/* Patient banner */}
      <div className="bg-blue-50 rounded-xl px-4 py-3 border border-blue-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-blue-900">{patientName}</p>
          {patientAge && <p className="text-xs text-blue-600">বয়স: {patientAge} বছর</p>}
        </div>
        <div className="text-xs text-blue-500">{new Date().toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })}</div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>}

      {/* Doctor */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">চিকিৎসক *</label>
        <select value={doctorId} onChange={e => setDoctorId(e.target.value)} className={inp}>
          <option value="">— চিকিৎসক নির্বাচন করুন —</option>
          {doctors.map(d => <option key={d.id} value={d.id}>{d.nameBn} — {d.designationBn}</option>)}
        </select>
      </div>

      {/* Clinical History */}
      <Section title="Chief Complaint & History" defaultOpen={false}>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Chief Complaint</label>
            <textarea rows={2} value={chiefComplaint} onChange={e => setChiefComplaint(e.target.value)}
              placeholder="চোখে ব্যথা, ঝাপসা দেখা, চোখ লাল..." className={`${inp} resize-none`} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">History</label>
            <textarea rows={2} value={history} onChange={e => setHistory(e.target.value)}
              placeholder="রোগের ইতিহাস..." className={`${inp} resize-none`} />
          </div>
        </div>
      </Section>

      {/* Eye Examination */}
      <Section title="Eye Examination" defaultOpen={true}>
        <div className="space-y-4">
          {/* VA & IOP */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Visual Acuity & IOP</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="font-semibold text-gray-500 text-center"></div>
              <div className="font-semibold text-gray-600 text-center bg-gray-50 rounded py-1">VA</div>
              <div className="font-semibold text-gray-600 text-center bg-gray-50 rounded py-1">IOP</div>
              <div className="font-semibold text-blue-700 self-center">OD (Right)</div>
              <input value={vaRE} onChange={e => setVaRE(e.target.value)} placeholder="6/6" className={smallInp} />
              <input value={iopRE} onChange={e => setIopRE(e.target.value)} placeholder="14 mmHg" className={smallInp} />
              <div className="font-semibold text-blue-700 self-center">OS (Left)</div>
              <input value={vaLE} onChange={e => setVaLE(e.target.value)} placeholder="6/6" className={smallInp} />
              <input value={iopLE} onChange={e => setIopLE(e.target.value)} placeholder="14 mmHg" className={smallInp} />
            </div>
          </div>

          {/* Refraction */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Refraction</p>
            <div className="grid grid-cols-5 gap-1 text-xs">
              {["", "SPH", "CYL", "AXIS", "ADD"].map(h => (
                <div key={h} className="text-center font-semibold text-gray-500 bg-gray-50 rounded py-1">{h}</div>
              ))}
              <div className="font-semibold text-blue-700 self-center text-xs">OD</div>
              {(["sph", "cyl", "axis", "add"] as const).map(k => (
                <input key={k} value={reRE[k]} onChange={e => setReRE(r => ({ ...r, [k]: e.target.value }))} placeholder="—" className={smallInp} />
              ))}
              <div className="font-semibold text-blue-700 self-center text-xs">OS</div>
              {(["sph", "cyl", "axis", "add"] as const).map(k => (
                <input key={k} value={reLE[k]} onChange={e => setReLE(r => ({ ...r, [k]: e.target.value }))} placeholder="—" className={smallInp} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Examination Notes</label>
            <textarea rows={2} value={examNotes} onChange={e => setExamNotes(e.target.value)}
              placeholder="Anterior segment, posterior segment..." className={`${inp} resize-none`} />
          </div>
        </div>
      </Section>

      {/* Diagnosis */}
      <Section title="Diagnosis & Investigation" defaultOpen={true}>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Diagnosis *</label>
            <textarea rows={2} value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
              placeholder="ছানি (Cataract), গ্লুকোমা, রেটিনা সমস্যা..." className={`${inp} resize-none`} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Investigation</label>
            <textarea rows={2} value={investigations} onChange={e => setInvestigations(e.target.value)}
              placeholder="B-scan, OCT, FFA..." className={`${inp} resize-none`} />
          </div>
        </div>
      </Section>

      {/* Medicines */}
      <Section title="℞ Medicines" defaultOpen={true}>
        <div className="space-y-2">
          {medicines.map((med, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">ওষুধের নাম *</label>
                  <input value={med.medicineName} onChange={e => updateMed(i, "medicineName", e.target.value)}
                    placeholder="যেমন: Timolol 0.5% Eye Drop" className={inp} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">মাত্রা / Dose</label>
                  <input value={med.dose} onChange={e => updateMed(i, "dose", e.target.value)}
                    placeholder="১ ফোঁটা / 1 drop" className={inp} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">সময় / Frequency</label>
                  <select value={med.frequency} onChange={e => updateMed(i, "frequency", e.target.value)} className={inp}>
                    <option value="">নির্বাচন করুন</option>
                    {FREQ_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">মেয়াদ / Duration</label>
                  <select value={med.duration} onChange={e => updateMed(i, "duration", e.target.value)} className={inp}>
                    <option value="">নির্বাচন করুন</option>
                    {DUR_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">নির্দেশনা</label>
                  <input value={med.instructions} onChange={e => updateMed(i, "instructions", e.target.value)}
                    placeholder="খাবার পরে / ঘুমানোর আগে" className={inp} />
                </div>
              </div>
              {medicines.length > 1 && (
                <button type="button" onClick={() => removeMed(i)}
                  className="mt-2 text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
                  <Trash2 size={11} /> বাদ দিন
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addMed}
            className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
            <Plus size={14} /> ওষুধ যোগ করুন
          </button>
        </div>
      </Section>

      {/* Advice */}
      <Section title="Advice & Instructions" defaultOpen={false}>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Advice</label>
            <textarea rows={3} value={advice} onChange={e => setAdvice(e.target.value)}
              placeholder="চোখ ডলবেন না&#10;রোদ থেকে দূরে থাকুন&#10;পরিষ্কার পানি দিয়ে চোখ ধুবেন না" className={`${inp} resize-none`} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">General Instructions</label>
            <textarea rows={2} value={instructions} onChange={e => setInstructions(e.target.value)}
              placeholder="ওষুধ নিয়মিত ব্যবহার করুন..." className={`${inp} resize-none`} />
          </div>
        </div>
      </Section>

      {/* Follow-up */}
      <Section title="Follow-up" defaultOpen={true}>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {FOLLOWUP_PRESETS.map(p => (
              <button key={p.days} type="button" onClick={() => setFollowUpPreset(p.days)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                {p.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Follow-up Date</label>
              <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className={inp} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Follow-up Note</label>
              <input value={followUpNote} onChange={e => setFollowUpNote(e.target.value)}
                placeholder="পরবর্তী পরীক্ষার জন্য..." className={inp} />
            </div>
          </div>
        </div>
      </Section>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 sticky bottom-0 bg-white pb-1">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" loading={saving} className="flex items-center gap-2">
          <Printer size={15} /> সংরক্ষণ ও প্রিন্ট
        </Button>
      </div>
    </form>
  );
}
