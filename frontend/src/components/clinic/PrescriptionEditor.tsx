"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Printer, Eye } from "lucide-react";
import { Button } from "@/components/ui";
import { ClinicPrescription } from "@/types/clinic";
import { fetchDoctors } from "@/lib/services/doctorService";
import { Doctor } from "@/types/doctor";

const schema = z.object({
  doctorId:     z.string().min(1, "চিকিৎসক নির্বাচন করুন"),
  diagnosis:    z.string().optional(),
  instructions: z.string().optional(),
  doctorNotes:  z.string().optional(),
  followUpDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
interface MedRow { medicineName: string; dose: string; frequency: string; duration: string; instructions: string; }

interface Props {
  patientId:   string;
  visitId?:    string;
  patientName: string;
  patientAge?: number | null;
  onSave:      (data: any) => Promise<ClinicPrescription>;
  onPrint:     (rx: ClinicPrescription) => void;
  onCancel:    () => void;
}

const FREQ_OPTIONS = ["দিনে ১ বার", "দিনে ২ বার", "দিনে ৩ বার", "সকাল-রাত", "প্রয়োজনে", "সাপ্তাহিক"];
const DUR_OPTIONS  = ["৩ দিন", "৫ দিন", "৭ দিন", "১০ দিন", "১৪ দিন", "১ মাস", "চলমান"];

function fmt(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
}

export function PrescriptionEditor({ patientId, visitId, patientName, patientAge, onSave, onPrint, onCancel }: Props) {
  const [medicines, setMedicines] = useState<MedRow[]>([
    { medicineName: "", dose: "", frequency: "", duration: "", instructions: "" },
  ]);
  const [doctors,  setDoctors]  = useState<Doctor[]>([]);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [showPreview, setShowPreview] = useState(true);

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const watchedDoctorId    = useWatch({ control, name: "doctorId" });
  const watchedDiagnosis   = useWatch({ control, name: "diagnosis" });
  const watchedInstructions = useWatch({ control, name: "instructions" });
  const watchedFollowUp    = useWatch({ control, name: "followUpDate" });

  const selectedDoctor = doctors.find((d) => d.id === watchedDoctorId);

  useEffect(() => {
    fetchDoctors().then(setDoctors).catch(() => {});
  }, []);

  function addMed() {
    setMedicines((m) => [...m, { medicineName: "", dose: "", frequency: "", duration: "", instructions: "" }]);
  }
  function removeMed(i: number) { setMedicines((m) => m.filter((_, idx) => idx !== i)); }
  function updateMed(i: number, key: keyof MedRow, val: string) {
    setMedicines((m) => m.map((med, idx) => idx === i ? { ...med, [key]: val } : med));
  }

  async function onSubmit(data: FormData) {
    const validMeds = medicines.filter((m) => m.medicineName.trim());
    if (validMeds.length === 0) { setError("কমপক্ষে একটি ওষুধ যোগ করুন।"); return; }
    setError(""); setSaving(true);
    try {
      const rx = await onSave({
        visitId,
        doctorId:     data.doctorId,
        diagnosis:    data.diagnosis,
        instructions: data.instructions,
        doctorNotes:  data.doctorNotes,
        followUpDate: data.followUpDate,
        items: validMeds.map((m, i) => ({ ...m, sortOrder: i })),
      });
      onPrint(rx);
    } catch (e: any) {
      setError(e?.response?.data?.message || "সমস্যা হয়েছে");
    } finally { setSaving(false); }
  }

  const validMeds = medicines.filter((m) => m.medicineName.trim());

  return (
    <div className="flex gap-5 min-h-0">

      {/* ── Left: Form ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 min-w-0 space-y-4 overflow-y-auto max-h-[75vh] pr-1">

        {/* Patient banner */}
        <div className="bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
          <p className="text-sm font-semibold text-blue-800">{patientName}</p>
          {patientAge && <p className="text-xs text-blue-600">বয়স: {patientAge} বছর</p>}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>
        )}

        {/* Doctor select */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">চিকিৎসক *</label>
          <select {...register("doctorId")}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
            <option value="">— চিকিৎসক নির্বাচন করুন —</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>{d.nameBn} — {d.designationBn}</option>
            ))}
          </select>
          {errors.doctorId && <p className="text-xs text-red-500">{errors.doctorId.message}</p>}
        </div>

        {/* Diagnosis */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">রোগ নির্ণয় (Diagnosis)</label>
          <textarea rows={2} placeholder="ছানি, গ্লুকোমা, রেটিনা সমস্যা..."
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
            {...register("diagnosis")} />
        </div>

        {/* Medicines */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">ওষুধ সমূহ</label>
            <button type="button" onClick={addMed}
              className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium">
              <Plus size={13} /> ওষুধ যোগ
            </button>
          </div>
          <div className="space-y-2">
            {medicines.map((med, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-xs text-gray-500">ওষুধের নাম *</label>
                    <input value={med.medicineName}
                      onChange={(e) => updateMed(i, "medicineName", e.target.value)}
                      placeholder="যেমন: Timolol 0.5% Eye Drop"
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">মাত্রা</label>
                    <input value={med.dose} onChange={(e) => updateMed(i, "dose", e.target.value)}
                      placeholder="১ ফোঁটা"
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">সময়</label>
                    <select value={med.frequency} onChange={(e) => updateMed(i, "frequency", e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
                      <option value="">নির্বাচন করুন</option>
                      {FREQ_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">মেয়াদ</label>
                    <select value={med.duration} onChange={(e) => updateMed(i, "duration", e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
                      <option value="">নির্বাচন করুন</option>
                      {DUR_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-xs text-gray-500">নির্দেশনা</label>
                    <input value={med.instructions} onChange={(e) => updateMed(i, "instructions", e.target.value)}
                      placeholder="খাবার পরে / ঘুমানোর আগে"
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                  </div>
                </div>
                {medicines.length > 1 && (
                  <button type="button" onClick={() => removeMed(i)}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
                    <Trash2 size={12} /> বাদ দিন
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">সাধারণ নির্দেশনা</label>
          <textarea rows={2} placeholder="চোখ ডলবেন না, রোদ থেকে দূরে থাকুন..."
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
            {...register("instructions")} />
        </div>

        {/* Doctor notes */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">চিকিৎসকের নোট (অভ্যন্তরীণ)</label>
          <textarea rows={2} placeholder="পরবর্তী ভিজিটে পরীক্ষা করতে হবে..."
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
            {...register("doctorNotes")} />
        </div>

        {/* Follow-up */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">ফলো-আপ তারিখ</label>
          <input type="date"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-48"
            {...register("followUpDate")} />
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
          <Button type="button" variant="secondary" onClick={() => setShowPreview((v) => !v)}
            className="flex items-center gap-1.5">
            <Eye size={14} /> {showPreview ? "প্রিভিউ লুকান" : "প্রিভিউ দেখুন"}
          </Button>
          <Button type="submit" loading={saving} className="flex items-center gap-2">
            <Printer size={15} /> সংরক্ষণ ও প্রিন্ট
          </Button>
        </div>
      </form>

      {/* ── Right: Live Preview ── */}
      {showPreview && (
        <div className="w-96 shrink-0 overflow-y-auto max-h-[75vh]">
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-sm" style={{ fontFamily: "serif" }}>

            {/* Header */}
            <div className="border-b-2 border-blue-700 pb-3 mb-3 flex justify-between items-start">
              <div>
                <p className="text-base font-bold text-blue-700">শেরপুর আধুনিক চক্ষু হাসপাতাল</p>
                <p className="text-xs text-gray-500">ও ফ্যাকো সেন্টার, শেরপুর</p>
              </div>
              {selectedDoctor ? (
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-xs">{selectedDoctor.nameBn}</p>
                  <p className="text-xs text-gray-500">{selectedDoctor.qualificationBn}</p>
                  <p className="text-xs text-gray-500">{selectedDoctor.designationBn}</p>
                </div>
              ) : (
                <div className="text-right">
                  <p className="text-xs text-gray-300 italic">চিকিৎসক নির্বাচন করুন</p>
                </div>
              )}
            </div>

            {/* Patient bar */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-3 text-xs flex flex-wrap gap-3">
              <span><strong>রোগী:</strong> {patientName}</span>
              {patientAge && <span><strong>বয়স:</strong> {patientAge} বছর</span>}
              <span><strong>তারিখ:</strong> {new Date().toLocaleDateString("bn-BD")}</span>
            </div>

            {/* Diagnosis */}
            {watchedDiagnosis && (
              <div className="mb-3">
                <p className="text-xs font-bold uppercase text-gray-400 mb-1">রোগ নির্ণয়</p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 px-3 py-2 rounded text-xs">
                  {watchedDiagnosis}
                </div>
              </div>
            )}

            {/* Medicines */}
            {validMeds.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-black text-blue-700 leading-none">℞</span>
                  <p className="text-xs font-bold uppercase text-gray-400">ওষুধ</p>
                </div>
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-blue-700 text-white">
                      {["#", "ওষুধ", "মাত্রা", "সময়", "মেয়াদ"].map((h) => (
                        <th key={h} className="px-2 py-1 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {validMeds.map((med, i) => (
                      <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                        <td className="px-2 py-1 text-gray-400">{i + 1}</td>
                        <td className="px-2 py-1 font-semibold">{med.medicineName}</td>
                        <td className="px-2 py-1 text-gray-600">{med.dose || "—"}</td>
                        <td className="px-2 py-1 text-gray-600">{med.frequency || "—"}</td>
                        <td className="px-2 py-1 text-gray-600">{med.duration || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Instructions */}
            {watchedInstructions && (
              <div className="mb-3 bg-green-50 border border-green-200 rounded px-3 py-2 text-xs">
                <p className="font-semibold text-green-700 mb-0.5">নির্দেশনা</p>
                <p className="text-gray-700">{watchedInstructions}</p>
              </div>
            )}

            {/* Follow-up */}
            {watchedFollowUp && (
              <p className="text-xs font-semibold text-emerald-700 mb-3">
                📅 পরবর্তী ভিজিট: {fmt(watchedFollowUp)}
              </p>
            )}

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
              <div className="text-center">
                <div className="border-t border-gray-800 w-32 pt-1">
                  <p className="text-xs text-gray-500">চিকিৎসকের স্বাক্ষর</p>
                  {selectedDoctor && <p className="text-xs font-semibold">{selectedDoctor.nameBn}</p>}
                </div>
              </div>
            </div>

            {validMeds.length === 0 && !watchedDiagnosis && (
              <p className="text-center text-gray-300 text-xs py-4 italic">ফর্ম পূরণ করলে এখানে প্রিভিউ দেখাবে</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
