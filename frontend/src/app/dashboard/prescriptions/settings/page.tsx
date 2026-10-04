"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, Upload, Trash2, Eye, ArrowLeft, CheckCircle } from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { Button } from "@/components/ui";
import {
  fetchRxSettings, saveRxSettings,
  uploadRxSignature, removeRxSignature,
  type DoctorPrescriptionSettings,
} from "@/lib/services/prescriptionService";

const EMPTY: DoctorPrescriptionSettings = {
  nameBn: "", nameEn: "", qualificationBn: "", qualificationEn: "",
  designationBn: "", designationEn: "", specialtyBn: "", specialtyEn: "",
  bmdcNo: "", chamberName: "", chamberAddress: "", chamberPhone: "",
  signatureUrl: null, signatureMode: "handwritten",
  preferredLang: "bn", showHeader: true, showFooter: true,
};

const inp = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500";

export default function PrescriptionSettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState<DoctorPrescriptionSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sigUploading, setSigUploading] = useState(false);
  const [sigError, setSigError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const sigRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchRxSettings()
      .then((s) => { if (s) setForm({ ...EMPTY, ...s }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k: keyof DoctorPrescriptionSettings, v: any) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await saveRxSettings(form);
      setForm((f) => ({ ...f, ...updated }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  }

  async function handleSigUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSigUploading(true); setSigError("");
    try {
      const res = await uploadRxSignature(file);
      set("signatureUrl", res.signatureUrl);
      set("signatureMode", "uploaded");
    } catch (err: any) {
      setSigError(err?.response?.data?.message || "আপলোড ব্যর্থ হয়েছে");
    } finally {
      setSigUploading(false);
      if (sigRef.current) sigRef.current.value = "";
    }
  }

  async function handleSigRemove() {
    if (!confirm("স্বাক্ষর মুছে ফেলতে চান?")) return;
    try {
      await removeRxSignature();
      set("signatureUrl", null);
      set("signatureMode", "handwritten");
    } catch {}
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <RouteGuard allowedRoles={["DOCTOR", "SUPER_ADMIN", "ADMIN"]}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">প্রেসক্রিপশন সেটিংস</h1>
              <p className="text-sm text-gray-500 mt-0.5">প্রেসক্রিপশনে প্রদর্শিত তথ্য কনফিগার করুন</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                <CheckCircle size={14} /> সংরক্ষিত
              </span>
            )}
            <Button onClick={() => setShowPreview(!showPreview)} variant="secondary" className="flex items-center gap-2">
              <Eye size={14} /> {showPreview ? "এডিটর" : "প্রিভিউ"}
            </Button>
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
              <Save size={14} /> {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </Button>
          </div>
        </div>

        {showPreview ? (
          <SettingsPreview form={form} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Doctor Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">চিকিৎসকের তথ্য</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">নাম (বাংলা)</label>
                  <input value={form.nameBn} onChange={(e) => set("nameBn", e.target.value)} className={inp} placeholder="ডা. [নাম]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name (English)</label>
                  <input value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} className={inp} placeholder="Dr. [Name]" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">যোগ্যতা (বাংলা)</label>
                  <input value={form.qualificationBn} onChange={(e) => set("qualificationBn", e.target.value)} className={inp} placeholder="এমবিবিএস, ডিও, এমএস (চক্ষু)" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Qualification (English)</label>
                  <input value={form.qualificationEn} onChange={(e) => set("qualificationEn", e.target.value)} className={inp} placeholder="MBBS, DO, MS (Ophthalmology)" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">পদবি (বাংলা)</label>
                  <input value={form.designationBn} onChange={(e) => set("designationBn", e.target.value)} className={inp} placeholder="চক্ষু বিশেষজ্ঞ ও সার্জন" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Designation (English)</label>
                  <input value={form.designationEn} onChange={(e) => set("designationEn", e.target.value)} className={inp} placeholder="Eye Specialist & Surgeon" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">বিশেষত্ব (বাংলা)</label>
                  <input value={form.specialtyBn} onChange={(e) => set("specialtyBn", e.target.value)} className={inp} placeholder="ফ্যাকো ক্যাটারেক্ট সার্জারি" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Specialty (English)</label>
                  <input value={form.specialtyEn} onChange={(e) => set("specialtyEn", e.target.value)} className={inp} placeholder="Phaco Cataract Surgery" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">BMDC রেজিস্ট্রেশন নম্বর</label>
                  <input value={form.bmdcNo} onChange={(e) => set("bmdcNo", e.target.value)} className={inp} placeholder="A-XXXXX" />
                  <p className="text-xs text-gray-400 mt-1">আপনার BMDC সার্টিফিকেট থেকে সঠিক নম্বর দিন</p>
                </div>
              </div>
            </div>

            {/* Chamber Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">চেম্বার / হাসপাতাল তথ্য</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">হাসপাতাল / চেম্বারের নাম</label>
                  <input value={form.chamberName} onChange={(e) => set("chamberName", e.target.value)} className={inp} placeholder="শেরপুর আধুনিক চক্ষু হাসপাতাল" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">ঠিকানা</label>
                  <textarea rows={2} value={form.chamberAddress} onChange={(e) => set("chamberAddress", e.target.value)}
                    className={`${inp} resize-none`} placeholder="শেরপুর সদর, শেরপুর-২১০০" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">যোগাযোগ নম্বর</label>
                  <input value={form.chamberPhone} onChange={(e) => set("chamberPhone", e.target.value)} className={inp} placeholder="+880 1700-000000" />
                </div>
              </div>

              {/* Preferences */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">পছন্দ</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">ডিফল্ট ভাষা</label>
                  <select value={form.preferredLang} onChange={(e) => set("preferredLang", e.target.value as any)} className={inp}>
                    <option value="bn">বাংলা</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.showHeader} onChange={(e) => set("showHeader", e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600" />
                    <span className="text-sm text-gray-700">হেডার দেখান</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.showFooter} onChange={(e) => set("showFooter", e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600" />
                    <span className="text-sm text-gray-700">ফুটার দেখান</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:col-span-2">
              <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-4">স্বাক্ষর</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    স্বচ্ছ ব্যাকগ্রাউন্ড সহ PNG ফাইল সুপারিশ করা হয়। সর্বোচ্চ ২ MB।
                    চূড়ান্ত প্রেসক্রিপশনেই স্বাক্ষর দেখাবে, ড্রাফটে নয়।
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <input ref={sigRef} type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handleSigUpload} />
                    <Button size="sm" variant="secondary" onClick={() => sigRef.current?.click()} disabled={sigUploading}
                      className="flex items-center gap-2">
                      <Upload size={13} /> {sigUploading ? "আপলোড হচ্ছে..." : "স্বাক্ষর আপলোড"}
                    </Button>
                    {form.signatureUrl && (
                      <Button size="sm" variant="secondary" onClick={handleSigRemove}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700">
                        <Trash2 size={13} /> মুছুন
                      </Button>
                    )}
                  </div>
                  {sigError && <p className="text-xs text-red-500 mt-2">{sigError}</p>}

                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-medium text-gray-600">স্বাক্ষর মোড:</p>
                    {(["uploaded", "handwritten", "none"] as const).map((mode) => (
                      <label key={mode} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sigMode" value={mode}
                          checked={form.signatureMode === mode}
                          onChange={() => set("signatureMode", mode)}
                          className="text-primary-600" />
                        <span className="text-sm text-gray-700">
                          {mode === "uploaded" ? "আপলোড করা স্বাক্ষর ব্যবহার করুন" :
                           mode === "handwritten" ? "হাতে লেখার জায়গা রাখুন" : "স্বাক্ষর ছাড়া"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-6 min-h-32">
                  {form.signatureUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.signatureUrl} alt="স্বাক্ষর প্রিভিউ"
                        style={{ maxWidth: 200, maxHeight: 80, objectFit: "contain" }} />
                      <p className="text-xs text-green-600 mt-2">✓ স্বাক্ষর আপলোড হয়েছে</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 text-center">স্বাক্ষর আপলোড করলে এখানে প্রিভিউ দেখাবে</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RouteGuard>
  );
}

function SettingsPreview({ form }: { form: DoctorPrescriptionSettings }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
        এটি একটি নমুনা প্রিভিউ। প্রকৃত প্রেসক্রিপশনে রোগীর তথ্য ও ওষুধ যোগ হবে।
      </p>
      <div className="border border-gray-300 rounded-xl overflow-hidden">
        <div className="p-6 font-sans text-sm" style={{ fontFamily: "Arial, sans-serif" }}>
          {/* Header */}
          {form.showHeader && (
            <div className="flex justify-between items-start border-b-2 border-blue-700 pb-3 mb-4">
              <div>
                <p className="text-lg font-bold text-blue-700">{form.chamberName || "হাসপাতালের নাম"}</p>
                <p className="text-xs text-gray-500">{form.chamberAddress || "ঠিকানা"}</p>
                {form.chamberPhone && <p className="text-xs text-gray-500">📞 {form.chamberPhone}</p>}
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{form.nameBn || "ডা. [নাম]"}</p>
                <p className="text-xs text-gray-500">{form.qualificationBn || "যোগ্যতা"}</p>
                <p className="text-xs text-gray-500">{form.designationBn || "পদবি"}</p>
                {form.bmdcNo && <p className="text-xs text-gray-400">BMDC: {form.bmdcNo}</p>}
              </div>
            </div>
          )}
          {/* Patient bar placeholder */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-4 text-xs text-blue-700">
            রোগী: [নাম] | আইডি: PAT-2026-0001 | বয়স: ৪৫ বছর | তারিখ: আজ
          </div>
          {/* Body placeholder */}
          <div className="space-y-3 text-xs text-gray-400">
            <p>রোগ নির্ণয়: [এখানে রোগ নির্ণয় লেখা হবে]</p>
            <p>℞ ওষুধ: [ওষুধের তালিকা]</p>
            <p>নির্দেশনা: [সাধারণ নির্দেশনা]</p>
          </div>
          {/* Footer */}
          {form.showFooter && (
            <div className="mt-8 pt-3 border-t border-gray-200 flex justify-between items-end">
              <p className="text-xs text-gray-400">তারিখ: আজ</p>
              <div className="text-center">
                {form.signatureMode === "uploaded" && form.signatureUrl ? (
                  <div className="mb-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.signatureUrl} alt="স্বাক্ষর" style={{ maxWidth: 120, maxHeight: 50, objectFit: "contain" }} />
                  </div>
                ) : form.signatureMode === "handwritten" ? (
                  <div className="border-t border-gray-800 w-40 mb-1" />
                ) : null}
                <p className="text-xs font-semibold">{form.nameBn || "ডা. [নাম]"}</p>
                <p className="text-xs text-gray-500">{form.qualificationBn}</p>
                {form.bmdcNo && <p className="text-xs text-gray-400">BMDC: {form.bmdcNo}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
