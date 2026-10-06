"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Save, Upload, Trash2, CheckCircle, Building2, UserCog, PenLine, AlertCircle, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { Button } from "@/components/ui";
import {
  fetchHospitalRxSettings, saveHospitalRxSettings, uploadHospitalLogo,
  fetchDoctorsWithSettings, saveDoctorRxSettings,
  uploadDoctorSignatureAdmin, removeDoctorSignatureAdmin,
  type HospitalRxSettings, type DoctorWithSettings,
} from "@/lib/services/adminPrescriptionService";
import { DoctorPrescriptionSettings } from "@/lib/services/prescriptionService";

type Tab = "hospital" | "doctors";

const inp = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white transition-colors";
const lbl = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide";

const EMPTY_HOSPITAL: HospitalRxSettings = {
  rx_hospital_logo: "", rx_hospital_name_bn: "", rx_hospital_name_en: "",
  rx_hospital_address: "", rx_hospital_phone: "", rx_hospital_emergency: "",
  rx_hospital_email: "", rx_hospital_website: "",
  rx_header_text: "", rx_footer_text: "",
  rx_show_logo: "true", rx_layout: "standard",
};

const EMPTY_DOC_SETTINGS: DoctorPrescriptionSettings = {
  nameBn: "", nameEn: "", qualificationBn: "", qualificationEn: "",
  designationBn: "", designationEn: "", specialtyBn: "", specialtyEn: "",
  bmdcNo: "", chamberName: "", chamberAddress: "", chamberPhone: "",
  signatureUrl: null, signatureMode: "handwritten",
  preferredLang: "bn", showHeader: true, showFooter: true,
};

export default function AdminPrescriptionSettingsPage() {
  const [tab, setTab] = useState<Tab>("hospital");

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="space-y-5 max-w-5xl">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Prescription Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Configure hospital info and per-doctor prescription settings</p>
        </div>

        <div className="flex bg-gray-100 rounded-xl p-1 gap-1 w-fit">
          {([
            { key: "hospital", label: "Hospital Info", icon: <Building2 size={14} /> },
            { key: "doctors",  label: "Doctor Settings", icon: <UserCog size={14} /> },
          ] as { key: Tab; label: string; icon: React.ReactNode }[]).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium transition-colors ${
                tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === "hospital" && <HospitalTab />}
        {tab === "doctors"  && <DoctorsTab />}
      </div>
    </RouteGuard>
  );
}

// ─── Hospital Tab ─────────────────────────────────────────────────────────────

function HospitalTab() {
  const [form, setForm]       = useState<HospitalRxSettings>(EMPTY_HOSPITAL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchHospitalRxSettings()
      .then((d) => setForm({ ...EMPTY_HOSPITAL, ...d }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k: keyof HospitalRxSettings, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    setSaving(true); setError("");
    try {
      const updated = await saveHospitalRxSettings(form);
      setForm({ ...EMPTY_HOSPITAL, ...updated });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to save");
    } finally { setSaving(false); }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const res = await uploadHospitalLogo(file);
      set("rx_hospital_logo", res.logoUrl);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Logo upload failed");
    } finally {
      setLogoUploading(false);
      if (logoRef.current) logoRef.current.value = "";
    }
  }

  if (loading) return <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />;

  return (
    <div className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Hospital Logo */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 lg:col-span-2">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Hospital Logo</h2>
          <div className="flex items-start gap-6 flex-wrap">
            <div className="flex flex-col items-center justify-center w-40 h-28 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden">
              {form.rx_hospital_logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.rx_hospital_logo} alt="Hospital Logo"
                  className="max-w-full max-h-full object-contain p-2" />
              ) : (
                <p className="text-xs text-gray-400 text-center px-2">No logo uploaded</p>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-xs text-gray-500">
                Transparent PNG preferred. Max 2MB.<br />
                Appears on prescription header.
              </p>
              <div className="flex gap-2 flex-wrap">
                <input ref={logoRef} type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handleLogoUpload} />
                <Button size="sm" variant="secondary" onClick={() => logoRef.current?.click()} disabled={logoUploading}
                  className="flex items-center gap-2">
                  <Upload size={13} /> {logoUploading ? "Uploading..." : form.rx_hospital_logo ? "Replace Logo" : "Upload Logo"}
                </Button>
                {form.rx_hospital_logo && (
                  <Button size="sm" variant="secondary" onClick={() => set("rx_hospital_logo", "")}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700">
                    <Trash2 size={13} /> Remove
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="show_logo" checked={form.rx_show_logo === "true"}
                  onChange={(e) => set("rx_show_logo", e.target.checked ? "true" : "false")}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                <label htmlFor="show_logo" className="text-sm text-gray-700 cursor-pointer">Show logo on prescriptions</label>
              </div>
            </div>
          </div>
        </div>

        {/* Hospital Identity */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Hospital Identity</h2>
          <div className="space-y-3">
            <div>
              <label className={lbl}>Hospital Name (Bengali)</label>
              <input value={form.rx_hospital_name_bn || ""} onChange={(e) => set("rx_hospital_name_bn", e.target.value)}
                placeholder="শেরপুর আধুনিক চক্ষু হাসপাতাল" className={inp} />
            </div>
            <div>
              <label className={lbl}>Hospital Name (English)</label>
              <input value={form.rx_hospital_name_en || ""} onChange={(e) => set("rx_hospital_name_en", e.target.value)}
                placeholder="Sherpur Modern Eye Hospital" className={inp} />
            </div>
            <div>
              <label className={lbl}>Address</label>
              <textarea rows={2} value={form.rx_hospital_address || ""} onChange={(e) => set("rx_hospital_address", e.target.value)}
                placeholder="Sherpur Sadar, Sherpur-2100" className={`${inp} resize-none`} />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div>
              <label className={lbl}>Phone</label>
              <input value={form.rx_hospital_phone || ""} onChange={(e) => set("rx_hospital_phone", e.target.value)}
                placeholder="+880 1700-000000" className={inp} />
            </div>
            <div>
              <label className={lbl}>Emergency Number</label>
              <input value={form.rx_hospital_emergency || ""} onChange={(e) => set("rx_hospital_emergency", e.target.value)}
                placeholder="+880 1800-000000" className={inp} />
            </div>
            <div>
              <label className={lbl}>Email</label>
              <input type="email" value={form.rx_hospital_email || ""} onChange={(e) => set("rx_hospital_email", e.target.value)}
                placeholder="info@sherpureye.com" className={inp} />
            </div>
            <div>
              <label className={lbl}>Website</label>
              <input value={form.rx_hospital_website || ""} onChange={(e) => set("rx_hospital_website", e.target.value)}
                placeholder="www.sherpureye.com" className={inp} />
            </div>
          </div>
        </div>

        {/* Header / Footer text */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 lg:col-span-2">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Prescription Header & Footer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Header Text (optional)</label>
              <textarea rows={3} value={form.rx_header_text || ""} onChange={(e) => set("rx_header_text", e.target.value)}
                placeholder="Additional text shown in prescription header..." className={`${inp} resize-none`} />
            </div>
            <div>
              <label className={lbl}>Footer Text (optional)</label>
              <textarea rows={3} value={form.rx_footer_text || ""} onChange={(e) => set("rx_footer_text", e.target.value)}
                placeholder="e.g. This prescription is valid for 30 days..." className={`${inp} resize-none`} />
            </div>
            <div>
              <label className={lbl}>Layout</label>
              <select value={form.rx_layout || "standard"} onChange={(e) => set("rx_layout", e.target.value)} className={inp}>
                <option value="standard">Standard</option>
                <option value="compact">Compact</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            <CheckCircle size={14} /> Saved
          </span>
        )}
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          <Save size={14} /> {saving ? "Saving..." : "Save Hospital Settings"}
        </Button>
      </div>
    </div>
  );
}

// ─── Doctors Tab ──────────────────────────────────────────────────────────────

function DoctorsTab() {
  const [doctors, setDoctors]   = useState<DoctorWithSettings[]>([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError]       = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDoctorsWithSettings();
      setDoctors(data);
    } catch { setError("Failed to load doctors"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  );

  if (error) return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
      <AlertCircle size={15} /> {error}
    </div>
  );

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
        Each doctor has their own prescription settings and signature. When a doctor creates a prescription, only their own information and signature is used — never mixed with other doctors.
      </p>
      {doctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
          <UserCog size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">No active doctors found</p>
        </div>
      ) : doctors.map((doc) => (
        <DoctorSettingsCard
          key={doc.id}
          doctor={doc}
          isExpanded={expanded === doc.id}
          onToggle={() => setExpanded(expanded === doc.id ? null : doc.id)}
          onSaved={load}
        />
      ))}
    </div>
  );
}

// ─── Doctor Settings Card ─────────────────────────────────────────────────────

function DoctorSettingsCard({ doctor, isExpanded, onToggle, onSaved }: {
  doctor: DoctorWithSettings;
  isExpanded: boolean;
  onToggle: () => void;
  onSaved: () => void;
}) {
  const existing = doctor.prescriptionSettings;
  const [form, setForm]       = useState<DoctorPrescriptionSettings>({ ...EMPTY_DOC_SETTINGS, ...existing });
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");
  const [sigUploading, setSigUploading] = useState(false);
  const [sigError, setSigError]         = useState("");
  const sigRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof DoctorPrescriptionSettings, v: any) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    setSaving(true); setError("");
    try {
      await saveDoctorRxSettings(doctor.id, form);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
      onSaved();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to save");
    } finally { setSaving(false); }
  }

  async function handleSigUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSigUploading(true); setSigError("");
    try {
      const res = await uploadDoctorSignatureAdmin(doctor.id, file);
      set("signatureUrl", res.signatureUrl);
      set("signatureMode", "uploaded");
      onSaved();
    } catch (err: any) {
      setSigError(err?.response?.data?.message || "Upload failed");
    } finally {
      setSigUploading(false);
      if (sigRef.current) sigRef.current.value = "";
    }
  }

  async function handleSigRemove() {
    if (!confirm("Remove this doctor's signature?")) return;
    try {
      await removeDoctorSignatureAdmin(doctor.id);
      set("signatureUrl", null);
      set("signatureMode", "handwritten");
      onSaved();
    } catch {}
  }

  const hasSettings = !!existing;

  return (
    <div className="bg-white rounded-2xl border border-gray-200">
      {/* Card header — always visible */}
      <button type="button" onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-700 shrink-0">
            {doctor.nameBn.slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{doctor.nameBn}</p>
            <p className="text-xs text-gray-400">{doctor.designationBn} · {doctor.qualificationBn}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {hasSettings ? (
            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle size={11} /> Configured
            </span>
          ) : (
            <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Not configured</span>
          )}
          {existing?.signatureUrl && (
            <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              <PenLine size={11} /> Signature
            </span>
          )}
          {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {/* Expanded form */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-5 space-y-5 overflow-x-auto">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Doctor Name (Bengali)</label>
              <input value={form.nameBn} onChange={(e) => set("nameBn", e.target.value)}
                placeholder="ডা. [নাম]" className={inp} />
            </div>
            <div>
              <label className={lbl}>Doctor Name (English)</label>
              <input value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)}
                placeholder="Dr. [Name]" className={inp} />
            </div>
            <div>
              <label className={lbl}>Qualification (Bengali)</label>
              <input value={form.qualificationBn} onChange={(e) => set("qualificationBn", e.target.value)}
                placeholder="এমবিবিএস, ডিও, এমএস (চক্ষু)" className={inp} />
            </div>
            <div>
              <label className={lbl}>Qualification (English)</label>
              <input value={form.qualificationEn} onChange={(e) => set("qualificationEn", e.target.value)}
                placeholder="MBBS, DO, MS (Ophthalmology)" className={inp} />
            </div>
            <div>
              <label className={lbl}>Designation (Bengali)</label>
              <input value={form.designationBn} onChange={(e) => set("designationBn", e.target.value)}
                placeholder="চক্ষু বিশেষজ্ঞ ও সার্জন" className={inp} />
            </div>
            <div>
              <label className={lbl}>Designation (English)</label>
              <input value={form.designationEn} onChange={(e) => set("designationEn", e.target.value)}
                placeholder="Eye Specialist & Surgeon" className={inp} />
            </div>
            <div>
              <label className={lbl}>Specialty (Bengali)</label>
              <input value={form.specialtyBn} onChange={(e) => set("specialtyBn", e.target.value)}
                placeholder="ফ্যাকো ক্যাটারেক্ট সার্জারি" className={inp} />
            </div>
            <div>
              <label className={lbl}>Specialty (English)</label>
              <input value={form.specialtyEn} onChange={(e) => set("specialtyEn", e.target.value)}
                placeholder="Phaco Cataract Surgery" className={inp} />
            </div>
            <div>
              <label className={lbl}>BMDC Registration No.</label>
              <input value={form.bmdcNo} onChange={(e) => set("bmdcNo", e.target.value)}
                placeholder="A-XXXXX" className={inp} />
            </div>
            <div>
              <label className={lbl}>Contact Number</label>
              <input value={form.chamberPhone} onChange={(e) => set("chamberPhone", e.target.value)}
                placeholder="+880 1700-000000" className={inp} />
            </div>
            <div>
              <label className={lbl}>Chamber / Department Name</label>
              <input value={form.chamberName} onChange={(e) => set("chamberName", e.target.value)}
                placeholder="শেরপুর আধুনিক চক্ষু হাসপাতাল" className={inp} />
            </div>
            <div>
              <label className={lbl}>Chamber Address</label>
              <input value={form.chamberAddress} onChange={(e) => set("chamberAddress", e.target.value)}
                placeholder="Sherpur Sadar, Sherpur-2100" className={inp} />
            </div>
          </div>

          {/* Signature section */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <PenLine size={13} /> Doctor Signature
            </h3>
            <div className="flex items-start gap-6 flex-wrap">
              {/* Preview box */}
              <div className="flex flex-col items-center justify-center w-48 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden shrink-0">
                {form.signatureUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.signatureUrl} alt="Signature preview"
                    className="max-w-full max-h-full object-contain p-2" />
                ) : (
                  <p className="text-xs text-gray-400 text-center px-3">No signature uploaded</p>
                )}
              </div>

              <div className="space-y-3 flex-1 min-w-[200px]">
                <p className="text-xs text-gray-500">
                  Transparent PNG preferred for clean printing.<br />
                  Supports PNG and JPG. Max 2MB.<br />
                  Signature appears only on finalized prescriptions.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <input ref={sigRef} type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handleSigUpload} />
                  <Button size="sm" variant="secondary" onClick={() => sigRef.current?.click()} disabled={sigUploading}
                    className="flex items-center gap-2">
                    <Upload size={13} /> {sigUploading ? "Uploading..." : form.signatureUrl ? "Replace Signature" : "Upload Signature"}
                  </Button>
                  {form.signatureUrl && (
                    <Button size="sm" variant="secondary" onClick={handleSigRemove}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700">
                      <Trash2 size={13} /> Remove
                    </Button>
                  )}
                </div>
                {sigError && <p className="text-xs text-red-500">{sigError}</p>}

                <div className="space-y-1.5">
                  {(["uploaded", "handwritten", "none"] as const).map((mode) => (
                    <label key={mode} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name={`sigMode_${doctor.id}`} value={mode}
                        checked={form.signatureMode === mode}
                        onChange={() => set("signatureMode", mode)}
                        className="text-blue-600" />
                      <span className="text-sm text-gray-700">
                        {mode === "uploaded" ? "Use uploaded signature" :
                         mode === "handwritten" ? "Leave space for handwritten signature" : "No signature"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="border-t border-gray-100 pt-4 flex items-center gap-6 flex-wrap">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.showHeader} onChange={(e) => set("showHeader", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                <span className="text-sm text-gray-700">Show header</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.showFooter} onChange={(e) => set("showFooter", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                <span className="text-sm text-gray-700">Show footer</span>
              </label>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                  <CheckCircle size={13} /> Saved
                </span>
              )}
              <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                <Save size={13} /> {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
