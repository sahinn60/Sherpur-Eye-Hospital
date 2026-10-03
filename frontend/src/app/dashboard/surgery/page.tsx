"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Filter, Scissors, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RouteGuard } from "@/components/auth";
import { Button, Modal } from "@/components/ui";
import {
  fetchSurgeries, createSurgery, updateSurgery, deleteSurgery,
  Surgery, SurgeryStatus, SURGERY_STATUS_BN, SURGERY_STATUS_CLS,
} from "@/lib/services/surgeryService";
import { fetchDoctorsAdmin } from "@/lib/services/doctorService";
import { fetchPatients } from "@/lib/services/patientService";
import { DoctorAdmin } from "@/types/doctor";
import { Patient } from "@/types/patient";

const STATUSES = Object.keys(SURGERY_STATUS_BN) as SurgeryStatus[];
const EYE_OPTIONS = ["Right", "Left", "Both"];
const ANAESTHESIA_OPTIONS = ["Local", "General", "Topical"];

function fmt(d: string) {
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

function SurgeryForm({ surgery, doctors, patients, onSubmit, onCancel, error }: {
  surgery?: Surgery | null;
  doctors: DoctorAdmin[];
  patients: Patient[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  error: string;
}) {
  const [form, setForm] = useState({
    patientId:   surgery?.patient?.id || "",
    doctorId:    surgery?.doctor?.id  || "",
    surgeryType: surgery?.surgeryType || "",
    otDate:      surgery?.otDate?.split("T")[0] || "",
    otTime:      surgery?.otTime || "",
    status:      surgery?.status || "SCHEDULED",
    anaesthesia: surgery?.anaesthesia || "",
    eye:         surgery?.eye || "",
    preOpNotes:  surgery?.preOpNotes || "",
    postOpNotes: surgery?.postOpNotes || "",
    notes:       surgery?.notes || "",
    followUpDate:surgery?.followUpDate?.split("T")[0] || "",
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try { await onSubmit(form); } finally { setSubmitting(false); }
  }

  const inp = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">রোগী *</label>
          <select value={form.patientId} onChange={(e) => set("patientId", e.target.value)} required className={inp}>
            <option value="">রোগী নির্বাচন করুন</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.nameBn} — {p.patientId}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">চিকিৎসক *</label>
          <select value={form.doctorId} onChange={(e) => set("doctorId", e.target.value)} required className={inp}>
            <option value="">চিকিৎসক নির্বাচন করুন</option>
            {doctors.map((d) => <option key={d.id} value={d.id}>{d.nameBn}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">সার্জারির ধরন *</label>
          <input value={form.surgeryType} onChange={(e) => set("surgeryType", e.target.value)} required placeholder="যেমন: ফ্যাকো, ছানি অপারেশন" className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">স্ট্যাটাস</label>
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inp}>
            {STATUSES.map((s) => <option key={s} value={s}>{SURGERY_STATUS_BN[s]}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">OT তারিখ *</label>
          <input type="date" value={form.otDate} onChange={(e) => set("otDate", e.target.value)} required className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">OT সময় *</label>
          <input type="time" value={form.otTime} onChange={(e) => set("otTime", e.target.value)} required className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">অ্যানেস্থেশিয়া</label>
          <select value={form.anaesthesia} onChange={(e) => set("anaesthesia", e.target.value)} className={inp}>
            <option value="">নির্বাচন করুন</option>
            {ANAESTHESIA_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">চোখ</label>
          <select value={form.eye} onChange={(e) => set("eye", e.target.value)} className={inp}>
            <option value="">নির্বাচন করুন</option>
            {EYE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">ফলো-আপ তারিখ</label>
          <input type="date" value={form.followUpDate} onChange={(e) => set("followUpDate", e.target.value)} className={inp} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">প্রি-অপ নোট</label>
        <textarea value={form.preOpNotes} onChange={(e) => set("preOpNotes", e.target.value)} rows={2} className={inp} />
      </div>
      {surgery && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">পোস্ট-অপ নোট</label>
          <textarea value={form.postOpNotes} onChange={(e) => set("postOpNotes", e.target.value)} rows={2} className={inp} />
        </div>
      )}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">নোট</label>
        <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2} className={inp} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</Button>
      </div>
    </form>
  );
}

export default function SurgeryPage() {
  const { isAdmin, hasRole } = useAuth();
  const canWrite = isAdmin || hasRole("DOCTOR");

  const [surgeries,  setSurgeries]  = useState<Surgery[]>([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [doctors,    setDoctors]    = useState<DoctorAdmin[]>([]);
  const [patients,   setPatients]   = useState<Patient[]>([]);

  const [showForm,   setShowForm]   = useState(false);
  const [editTarget, setEditTarget] = useState<Surgery | null>(null);
  const [formError,  setFormError]  = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchSurgeries({ status: statusFilter || undefined, search: search || undefined, page, limit: 20 });
      setSurgeries(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally { setLoading(false); }
  }, [statusFilter, search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  useEffect(() => {
    fetchDoctorsAdmin({ limit: 100 }).then((r) => setDoctors(r.items)).catch(() => {});
    fetchPatients({ limit: 200 }).then((r) => setPatients(r.items)).catch(() => {});
  }, []);

  async function handleCreate(data: any) {
    setFormError("");
    try { await createSurgery(data); setShowForm(false); load(); }
    catch (e: any) { setFormError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleUpdate(data: any) {
    if (!editTarget) return;
    setFormError("");
    try { await updateSurgery(editTarget.id, data); setEditTarget(null); load(); }
    catch (e: any) { setFormError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleDelete(s: Surgery) {
    if (!confirm(`সার্জারি ${s.surgeryNo} মুছে ফেলতে চান?`)) return;
    try { await deleteSurgery(s.id); load(); }
    catch (e: any) { alert(e?.response?.data?.message || "মুছতে পারেনি"); }
  }

  async function quickStatus(s: Surgery, status: SurgeryStatus) {
    try { await updateSurgery(s.id, { status }); load(); }
    catch (e: any) { alert(e?.response?.data?.message || "সমস্যা হয়েছে"); }
  }

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DOCTOR"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">সার্জারি / OT ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-500 mt-0.5">মোট {total}টি সার্জারি</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={load} className="flex items-center gap-1.5">
              <RefreshCw size={14} /> রিফ্রেশ
            </Button>
            {canWrite && (
              <Button size="sm" onClick={() => { setEditTarget(null); setFormError(""); setShowForm(true); }}
                className="flex items-center gap-2">
                <Plus size={15} /> নতুন সার্জারি
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="রোগীর নাম, ফোন বা সার্জারি নং..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option value="">সব স্ট্যাটাস</option>
              {STATUSES.map((s) => <option key={s} value={s}>{SURGERY_STATUS_BN[s]}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["সার্জারি নং", "রোগী", "চিকিৎসক", "ধরন", "OT তারিখ", "চোখ", "স্ট্যাটাস", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}</tr>
                  ))
                ) : surgeries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <Scissors size={40} className="mx-auto text-gray-200 mb-3" />
                      <p className="text-gray-400 text-sm">কোনো সার্জারি পাওয়া যায়নি</p>
                      {canWrite && (
                        <Button size="sm" className="mt-4" onClick={() => setShowForm(true)}>
                          <Plus size={14} className="mr-1" /> প্রথম সার্জারি যোগ করুন
                        </Button>
                      )}
                    </td>
                  </tr>
                ) : surgeries.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded">{s.surgeryNo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{s.patient.nameBn}</p>
                      <p className="text-xs text-gray-400">{s.patient.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.doctor.nameBn}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.surgeryType}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700">{fmt(s.otDate)}</p>
                      <p className="text-xs text-gray-400">{s.otTime}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.eye || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SURGERY_STATUS_CLS[s.status]}`}>
                        {SURGERY_STATUS_BN[s.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {s.status === "SCHEDULED" && (
                          <button onClick={() => quickStatus(s, "CONFIRMED")}
                            className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">নিশ্চিত</button>
                        )}
                        {s.status === "CONFIRMED" && (
                          <button onClick={() => quickStatus(s, "COMPLETED")}
                            className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">সম্পন্ন</button>
                        )}
                        {canWrite && (
                          <button onClick={() => { setEditTarget(s); setFormError(""); setShowForm(true); }}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">সম্পাদনা</button>
                        )}
                        {isAdmin && (
                          <button onClick={() => handleDelete(s)}
                            className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">মুছুন</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">মোট {total}টি</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</Button>
                <span className="text-xs text-gray-500 self-center">{page}/{totalPages}</span>
                <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <Modal open onClose={() => { setShowForm(false); setEditTarget(null); setFormError(""); }}
          title={editTarget ? "সার্জারি সম্পাদনা" : "নতুন সার্জারি"} size="xl">
          <SurgeryForm
            surgery={editTarget}
            doctors={doctors}
            patients={patients}
            onSubmit={editTarget ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditTarget(null); setFormError(""); }}
            error={formError}
          />
        </Modal>
      )}
    </RouteGuard>
  );
}
