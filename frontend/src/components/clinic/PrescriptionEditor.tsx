"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Printer } from "lucide-react";
import { Button } from "@/components/ui";
import { ClinicPrescription } from "@/types/clinic";

const itemSchema = z.object({
  medicineName: z.string().min(1, "ওষুধের নাম দিন"),
  dose:         z.string().optional(),
  frequency:    z.string().optional(),
  duration:     z.string().optional(),
  instructions: z.string().optional(),
});

const schema = z.object({
  diagnosis:    z.string().optional(),
  instructions: z.string().optional(),
  doctorNotes:  z.string().optional(),
  followUpDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface MedRow { medicineName: string; dose: string; frequency: string; duration: string; instructions: string; }

interface Props {
  patientId:    string;
  visitId?:     string;
  patientName:  string;
  patientAge?:  number | null;
  onSave:       (data: any) => Promise<ClinicPrescription>;
  onPrint:      (rx: ClinicPrescription) => void;
  onCancel:     () => void;
}

const FREQ_OPTIONS = ["দিনে ১ বার", "দিনে ২ বার", "দিনে ৩ বার", "সকাল-রাত", "প্রয়োজনে", "সাপ্তাহিক"];
const DUR_OPTIONS  = ["৩ দিন", "৫ দিন", "৭ দিন", "১০ দিন", "১৪ দিন", "১ মাস", "চলমান"];

export function PrescriptionEditor({ patientId, visitId, patientName, patientAge, onSave, onPrint, onCancel }: Props) {
  const [medicines, setMedicines] = useState<MedRow[]>([
    { medicineName: "", dose: "", frequency: "", duration: "", instructions: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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

  const ta = (label: string, name: keyof FormData, rows = 2, placeholder = "") => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <textarea rows={rows} placeholder={placeholder}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
        {...register(name)} />
      {errors[name] && <p className="text-xs text-red-500">{errors[name]?.message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Patient info banner */}
      <div className="bg-primary-50 rounded-xl px-4 py-3 border border-primary-100">
        <p className="text-sm font-semibold text-primary-800">{patientName}</p>
        {patientAge && <p className="text-xs text-primary-600">বয়স: {patientAge} বছর</p>}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>
      )}

      {/* Diagnosis */}
      {ta("রোগ নির্ণয় (Diagnosis)", "diagnosis", 2, "ছানি, গ্লুকোমা, রেটিনা সমস্যা...")}

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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs text-gray-500">ওষুধের নাম *</label>
                  <input value={med.medicineName}
                    onChange={(e) => updateMed(i, "medicineName", e.target.value)}
                    placeholder="যেমন: Timolol 0.5% Eye Drop"
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">মাত্রা (Dose)</label>
                  <input value={med.dose}
                    onChange={(e) => updateMed(i, "dose", e.target.value)}
                    placeholder="১ ফোঁটা / ১ ট্যাবলেট"
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">সময় (Frequency)</label>
                  <select value={med.frequency} onChange={(e) => updateMed(i, "frequency", e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
                    <option value="">নির্বাচন করুন</option>
                    {FREQ_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">মেয়াদ (Duration)</label>
                  <select value={med.duration} onChange={(e) => updateMed(i, "duration", e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
                    <option value="">নির্বাচন করুন</option>
                    {DUR_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs text-gray-500">নির্দেশনা</label>
                  <input value={med.instructions}
                    onChange={(e) => updateMed(i, "instructions", e.target.value)}
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

      {/* Instructions & notes */}
      {ta("সাধারণ নির্দেশনা", "instructions", 2, "চোখ ডলবেন না, রোদ থেকে দূরে থাকুন...")}
      {ta("চিকিৎসকের নোট (অভ্যন্তরীণ)", "doctorNotes", 2, "পরবর্তী ভিজিটে পরীক্ষা করতে হবে...")}

      {/* Follow-up */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">ফলো-আপ তারিখ</label>
        <input type="date"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-48"
          {...register("followUpDate")} />
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" loading={saving} className="flex items-center gap-2">
          <Printer size={15} /> সংরক্ষণ ও প্রিন্ট
        </Button>
      </div>
    </form>
  );
}
