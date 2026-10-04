"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Phone, MapPin, User, Calendar, Stethoscope, FileText, Clock, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { PatientDetail, Visit, Prescription, PatientAppointment, GENDER_BN } from "@/types/patient";
import {
  fetchPatient, fetchPatientVisits, fetchPatientPrescriptions,
  fetchPatientAppointments, createVisit, createPrescription,
} from "@/lib/services/patientService";
import { Button } from "@/components/ui";

type Tab = "profile" | "visits" | "prescriptions" | "appointments";

interface Props {
  patientId: string;
  onClose:   () => void;
  canWrite:  boolean;
}

const APPT_STATUS_BN: Record<string, string> = {
  PENDING: "অপেক্ষমাণ", CONFIRMED: "নিশ্চিত", CANCELLED: "বাতিল",
  COMPLETED: "সম্পন্ন", NO_SHOW: "অনুপস্থিত",
};
const APPT_STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700", CONFIRMED: "bg-blue-50 text-blue-700",
  CANCELLED: "bg-red-50 text-red-700", COMPLETED: "bg-emerald-50 text-emerald-700",
  NO_SHOW: "bg-gray-100 text-gray-500",
};

function fmt(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Visit Form ───────────────────────────────────────────────────────────────

function VisitForm({ patientId, onDone }: { patientId: string; onDone: () => void }) {
  const [form, setForm] = useState({ chiefComplaint: "", diagnosis: "", treatment: "", followUpDate: "", notes: "" });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createVisit(patientId, form);
      onDone();
    } finally { setSaving(false); }
  }

  const ta = (label: string, key: keyof typeof form, rows = 2, placeholder = "") => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <textarea rows={rows} placeholder={placeholder}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
        value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
      <p className="text-sm font-semibold text-gray-700">নতুন ভিজিট</p>
      {ta("প্রধান অভিযোগ", "chiefComplaint", 2, "চোখে ব্যথা, ঝাপসা দেখা...")}
      {ta("রোগ নির্ণয়", "diagnosis", 2, "ছানি, গ্লুকোমা...")}
      {ta("চিকিৎসা", "treatment", 2, "ওষুধ, অপারেশন...")}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">ফলো-আপ তারিখ</label>
        <input type="date" className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          value={form.followUpDate} onChange={(e) => setForm((f) => ({ ...f, followUpDate: e.target.value }))} />
      </div>
      {ta("নোট", "notes", 2)}
      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={onDone}>বাতিল</Button>
        <Button type="submit" size="sm" loading={saving}>সংরক্ষণ</Button>
      </div>
    </form>
  );
}

// ─── Prescription Form ────────────────────────────────────────────────────────

function PrescriptionForm({ patientId, onDone }: { patientId: string; onDone: () => void }) {
  const [items, setItems] = useState([{ medicineName: "", dose: "", frequency: "", duration: "" }]);
  const [instructions, setInstructions] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [saving, setSaving] = useState(false);

  function addItem() { setItems((m) => [...m, { medicineName: "", dose: "", frequency: "", duration: "" }]); }
  function removeItem(i: number) { setItems((m) => m.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, key: string, val: string) {
    setItems((m) => m.map((item, idx) => idx === i ? { ...item, [key]: val } : item));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createPrescription(patientId, {
        items: items.filter((m) => m.medicineName.trim()),
        instructions, followUpDate,
      });
      onDone();
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
      <p className="text-sm font-semibold text-gray-700">নতুন প্রেসক্রিপশন</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 items-center">
            {(["medicineName", "dose", "frequency", "duration"] as const).map((k) => (
              <input key={k} value={item[k]}
                onChange={(e) => updateItem(i, k, e.target.value)}
                placeholder={k === "medicineName" ? "ওষুধের নাম" : k === "dose" ? "মাত্রা" : k === "frequency" ? "সময়" : "মেয়াদ"}
                className="text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            ))}
            {items.length > 1 && (
              <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-xs col-span-4 text-right">বাদ দিন</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addItem} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
          <Plus size={12} /> ওষুধ যোগ
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">নির্দেশনা</label>
        <textarea rows={2} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
          value={instructions} onChange={(e) => setInstructions(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">ফলো-আপ তারিখ</label>
        <input type="date" className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={onDone}>বাতিল</Button>
        <Button type="submit" size="sm" loading={saving}>সংরক্ষণ</Button>
      </div>
    </form>
  );
}

// ─── Main Drawer ──────────────────────────────────────────────────────────────

export function PatientProfileDrawer({ patientId, onClose, canWrite }: Props) {
  const [patient,       setPatient]       = useState<PatientDetail | null>(null);
  const [visits,        setVisits]        = useState<Visit[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments,  setAppointments]  = useState<PatientAppointment[]>([]);
  const [tab,           setTab]           = useState<Tab>("profile");
  const [loading,       setLoading]       = useState(true);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [showRxForm,    setShowRxForm]    = useState(false);
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = await fetchPatient(patientId);
      setPatient(p);
      setVisits(p.visits);
      setPrescriptions(p.prescriptions);
    } finally { setLoading(false); }
  }, [patientId]);

  useEffect(() => { load(); }, [load]);

  async function loadVisits() {
    const res = await fetchPatientVisits(patientId);
    setVisits(res.items);
    setShowVisitForm(false);
  }

  async function loadPrescriptions() {
    const res = await fetchPatientPrescriptions(patientId);
    setPrescriptions(res.items);
    setShowRxForm(false);
  }

  async function loadAppointments() {
    if (appointments.length > 0) return;
    const res = await fetchPatientAppointments(patientId);
    setAppointments(res.items);
  }

  useEffect(() => {
    if (tab === "appointments") loadAppointments();
  }, [tab]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "profile",       label: "প্রোফাইল",      icon: <User size={14} /> },
    { key: "visits",        label: `ভিজিট (${patient?._count.visits ?? 0})`, icon: <Stethoscope size={14} /> },
    { key: "prescriptions", label: `Rx (${patient?._count.prescriptions ?? 0})`, icon: <FileText size={14} /> },
    { key: "appointments",  label: "অ্যাপয়েন্টমেন্ট", icon: <Calendar size={14} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
          {loading ? (
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          ) : patient ? (
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                  {patient.nameBn.slice(0, 2)}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{patient.nameBn}</h2>
                  <p className="text-xs text-gray-500">{patient.nameEn} · <span className="font-mono text-blue-600">{patient.patientId}</span></p>
                </div>
              </div>
            </div>
          ) : null}
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-4 bg-white">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-primary-600 text-primary-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : !patient ? (
            <p className="text-center text-gray-400 py-10">রোগী পাওয়া যায়নি</p>
          ) : (

            // ── Profile Tab ──────────────────────────────────────────────────
            tab === "profile" ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "ফোন",    value: patient.phone,                icon: <Phone size={14} /> },
                    { label: "বয়স",    value: patient.age ? `${patient.age} বছর` : "—", icon: <User size={14} /> },
                    { label: "লিঙ্গ",  value: GENDER_BN[patient.gender],   icon: <User size={14} /> },
                    { label: "নিবন্ধন", value: fmt(patient.createdAt),      icon: <Calendar size={14} /> },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">{item.icon} {item.label}</p>
                      <p className="text-sm font-medium text-gray-800">{item.value}</p>
                    </div>
                  ))}
                </div>

                {patient.address && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><MapPin size={14} /> ঠিকানা</p>
                    <p className="text-sm text-gray-800">{patient.address}</p>
                  </div>
                )}

                {patient.emergencyContact && (
                  <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                    <p className="text-xs text-red-400 flex items-center gap-1 mb-1"><Phone size={14} /> জরুরি যোগাযোগ</p>
                    <p className="text-sm font-medium text-red-700">{patient.emergencyContact}</p>
                  </div>
                )}

                {patient.medicalHistory && (
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                    <p className="text-xs text-amber-600 font-medium mb-1">রোগের ইতিহাস</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{patient.medicalHistory}</p>
                  </div>
                )}

                {patient.notes && (
                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium mb-1">নোট</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{patient.notes}</p>
                  </div>
                )}
              </div>

            // ── Visits Tab ───────────────────────────────────────────────────
            ) : tab === "visits" ? (
              <div className="space-y-4">
                {canWrite && !showVisitForm && (
                  <Button size="sm" onClick={() => setShowVisitForm(true)} className="flex items-center gap-1.5">
                    <Plus size={14} /> নতুন ভিজিট
                  </Button>
                )}
                {showVisitForm && <VisitForm patientId={patientId} onDone={loadVisits} />}

                {visits.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <Stethoscope size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">কোনো ভিজিট নেই</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visits.map((v) => (
                      <div key={v.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                          onClick={() => setExpandedVisit(expandedVisit === v.id ? null : v.id)}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                              <Stethoscope size={14} />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-800">{fmt(v.visitDate)}</p>
                              <p className="text-xs text-gray-400">{v.chiefComplaint || "কোনো অভিযোগ নেই"}</p>
                            </div>
                          </div>
                          {expandedVisit === v.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </button>
                        {expandedVisit === v.id && (
                          <div className="px-4 py-3 space-y-2 text-sm">
                            {v.doctor && <p className="text-xs text-gray-500">চিকিৎসক: <span className="font-medium text-gray-700">{v.doctor.nameBn}</span></p>}
                            {v.diagnosis  && <p><span className="text-xs text-gray-400">রোগ নির্ণয়: </span>{v.diagnosis}</p>}
                            {v.treatment  && <p><span className="text-xs text-gray-400">চিকিৎসা: </span>{v.treatment}</p>}
                            {v.followUpDate && (
                              <p className="flex items-center gap-1 text-xs text-emerald-600">
                                <Clock size={12} /> ফলো-আপ: {fmt(v.followUpDate)}
                              </p>
                            )}
                            {v.notes && <p className="text-xs text-gray-500 italic">{v.notes}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            // ── Prescriptions Tab ────────────────────────────────────────────
            ) : tab === "prescriptions" ? (
              <div className="space-y-4">
                {canWrite && !showRxForm && (
                  <Button size="sm" onClick={() => setShowRxForm(true)} className="flex items-center gap-1.5">
                    <Plus size={14} /> নতুন প্রেসক্রিপশন
                  </Button>
                )}
                {showRxForm && <PrescriptionForm patientId={patientId} onDone={loadPrescriptions} />}

                {prescriptions.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <FileText size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">কোনো প্রেসক্রিপশন নেই</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {prescriptions.map((rx) => (
                      <div key={rx.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{fmt(rx.createdAt)}</p>
                            {rx.doctor && <p className="text-xs text-gray-400">{rx.doctor.nameBn}</p>}
                          </div>
                          {rx.followUpDate && (
                            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded flex items-center gap-1">
                              <Clock size={11} /> {fmt(rx.followUpDate)}
                            </span>
                          )}
                        </div>
                        {(rx.items || []).length > 0 && (
                          <div className="bg-gray-50 rounded-lg overflow-hidden">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-gray-100">
                                  {["ওষুধ", "মাত্রা", "সময়", "মেয়াদ"].map((h) => (
                                    <th key={h} className="px-3 py-1.5 text-left text-gray-500 font-medium">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(rx.items || []).map((item, i) => (
                                  <tr key={item.id || i} className="border-t border-gray-100">
                                    <td className="px-3 py-1.5 font-medium text-gray-800">{item.medicineName}</td>
                                    <td className="px-3 py-1.5 text-gray-600">{item.dose || "—"}</td>
                                    <td className="px-3 py-1.5 text-gray-600">{item.frequency || "—"}</td>
                                    <td className="px-3 py-1.5 text-gray-600">{item.duration || "—"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        {rx.instructions && (
                          <p className="text-xs text-gray-500 mt-2 italic">{rx.instructions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            // ── Appointments Tab ─────────────────────────────────────────────
            ) : (
              <div className="space-y-3">
                {appointments.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">কোনো অ্যাপয়েন্টমেন্ট নেই</p>
                  </div>
                ) : (
                  appointments.map((a) => (
                    <div key={a.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-mono text-blue-600 mb-1">{a.requestId}</p>
                          <p className="text-sm font-medium text-gray-800">{fmt(a.preferredDate)} · {a.preferredTime}</p>
                          {a.doctor && <p className="text-xs text-gray-500 mt-0.5">{a.doctor.nameBn}</p>}
                          {a.service && <p className="text-xs text-gray-400">{a.service.nameBn}</p>}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${APPT_STATUS_COLOR[a.status] || "bg-gray-100 text-gray-500"}`}>
                          {APPT_STATUS_BN[a.status] || a.status}
                        </span>
                      </div>
                      {a.reason && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{a.reason}</p>}
                    </div>
                  ))
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
