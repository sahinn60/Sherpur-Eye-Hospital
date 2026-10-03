"use client";

import { useState, useEffect, useCallback } from "react";
import { X, User, Phone, MapPin, FileText, Stethoscope, Plus, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { QueueItem, ClinicPrescription } from "@/types/clinic";
import { PatientDetail, GENDER_BN } from "@/types/patient";
import { fetchPatient } from "@/lib/services/patientService";
import { createClinicVisit, createClinicPrescription } from "@/lib/services/clinicService";
import { Button, Modal } from "@/components/ui";
import { PrescriptionEditor } from "./PrescriptionEditor";
import { PrescriptionPrint } from "./PrescriptionPrint";

type Step = "patient" | "visit" | "prescription" | "print";

interface Props {
  item:    QueueItem;
  onClose: () => void;
  onDone:  () => void;
}

function fmt(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

export function ConsultationModal({ item, onClose, onDone }: Props) {
  const [step,        setStep]        = useState<Step>("patient");
  const [patient,     setPatient]     = useState<PatientDetail | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [visitId,     setVisitId]     = useState<string | null>(item.visit?.id || null);
  const [printRx,     setPrintRx]     = useState<ClinicPrescription | null>(null);
  const [visitSaving, setVisitSaving] = useState(false);
  const [visitForm,   setVisitForm]   = useState({
    chiefComplaint: "", diagnosis: "", treatment: "", followUpDate: "", notes: "",
  });

  const load = useCallback(async () => {
    if (!item.patient?.id) { setLoading(false); return; }
    setLoading(true);
    try {
      const p = await fetchPatient(item.patient.id);
      setPatient(p);
    } finally { setLoading(false); }
  }, [item.patient?.id]);

  useEffect(() => { load(); }, [load]);

  async function handleCreateVisit() {
    if (!item.patient?.id) return;
    setVisitSaving(true);
    try {
      const v = await createClinicVisit(item.patient.id, {
        appointmentId:  item.id,
        chiefComplaint: visitForm.chiefComplaint,
        diagnosis:      visitForm.diagnosis,
        treatment:      visitForm.treatment,
        followUpDate:   visitForm.followUpDate,
        notes:          visitForm.notes,
      });
      setVisitId(v.id);
      setStep("prescription");
      load();
    } finally { setVisitSaving(false); }
  }

  async function handleSavePrescription(data: any): Promise<ClinicPrescription> {
    if (!item.patient?.id) throw new Error("No patient");
    return createClinicPrescription(item.patient.id, { ...data, visitId: visitId || undefined });
  }

  function handlePrint(rx: ClinicPrescription) {
    setPrintRx(rx);
    setStep("print");
    onDone();
  }

  const ta = (label: string, key: keyof typeof visitForm, rows = 2, placeholder = "") => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <textarea rows={rows} placeholder={placeholder}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
        value={visitForm[key]} onChange={(e) => setVisitForm((f) => ({ ...f, [key]: e.target.value }))} />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-3xl bg-white shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white shrink-0">
          <div>
            <h2 className="font-bold text-gray-900">
              {item.patient?.nameBn || item.patientName}
            </h2>
            <p className="text-xs text-gray-500">
              {item.patient?.patientId && <span className="font-mono text-blue-600 mr-2">{item.patient.patientId}</span>}
              {item.requestId} · {item.preferredTime}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        {/* Step tabs */}
        <div className="flex border-b border-gray-200 px-4 bg-white shrink-0">
          {([
            { key: "patient",      label: "রোগীর তথ্য",    icon: <User size={13} /> },
            { key: "visit",        label: "ভিজিট",          icon: <Stethoscope size={13} /> },
            { key: "prescription", label: "প্রেসক্রিপশন",  icon: <FileText size={13} /> },
          ] as const).map((t) => (
            <button key={t.key} onClick={() => setStep(t.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                step === t.key
                  ? "border-primary-600 text-primary-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── Patient tab ── */}
          {step === "patient" && (
            loading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
              </div>
            ) : !patient ? (
              <div className="text-center py-10">
                <User size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm mb-1">এই রোগীর কোনো প্রোফাইল নেই</p>
                <p className="text-xs text-gray-400">ফোন: {item.phone}</p>
                <Button size="sm" className="mt-4" onClick={() => setStep("visit")}>
                  ভিজিট শুরু করুন →
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "ফোন",    value: patient.phone,                icon: <Phone size={13} /> },
                    { label: "বয়স",    value: patient.age ? `${patient.age} বছর` : "—", icon: <User size={13} /> },
                    { label: "লিঙ্গ",  value: GENDER_BN[patient.gender],   icon: <User size={13} /> },
                    { label: "নিবন্ধন", value: fmt(patient.createdAt),      icon: <Clock size={13} /> },
                  ].map((f) => (
                    <div key={f.label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5">{f.icon} {f.label}</p>
                      <p className="text-sm font-medium text-gray-800">{f.value}</p>
                    </div>
                  ))}
                </div>
                {patient.address && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5"><MapPin size={13} /> ঠিকানা</p>
                    <p className="text-sm text-gray-800">{patient.address}</p>
                  </div>
                )}
                {patient.emergencyContact && (
                  <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                    <p className="text-xs text-red-400 mb-0.5">জরুরি যোগাযোগ</p>
                    <p className="text-sm font-medium text-red-700">{patient.emergencyContact}</p>
                  </div>
                )}
                {patient.medicalHistory && (
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                    <p className="text-xs text-amber-600 font-medium mb-1">রোগের ইতিহাস</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{patient.medicalHistory}</p>
                  </div>
                )}
                {/* Previous visits */}
                {patient.visits.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">পূর্ববর্তী ভিজিট</p>
                    <div className="space-y-2">
                      {patient.visits.slice(0, 3).map((v) => (
                        <div key={v.id} className="bg-gray-50 rounded-lg px-3 py-2 text-xs">
                          <p className="font-medium text-gray-700">{fmt(v.visitDate)} · {v.doctor?.nameBn || "—"}</p>
                          {v.diagnosis && <p className="text-gray-500 mt-0.5">{v.diagnosis}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-end">
                  <Button size="sm" onClick={() => setStep("visit")}>ভিজিট শুরু করুন →</Button>
                </div>
              </div>
            )
          )}

          {/* ── Visit tab ── */}
          {step === "visit" && (
            visitId ? (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 font-medium">
                  ✅ ভিজিট তৈরি হয়েছে
                </div>
                <Button size="sm" onClick={() => setStep("prescription")}>
                  প্রেসক্রিপশন লিখুন →
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {!item.patient?.id && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
                    ⚠️ এই রোগীর কোনো প্রোফাইল নেই। ভিজিট তৈরি করতে আগে রোগী নিবন্ধন করুন।
                  </div>
                )}
                {ta("প্রধান অভিযোগ", "chiefComplaint", 2, "চোখে ব্যথা, ঝাপসা দেখা...")}
                {ta("রোগ নির্ণয়", "diagnosis", 2, "ছানি, গ্লুকোমা...")}
                {ta("চিকিৎসা", "treatment", 2, "ওষুধ, অপারেশন...")}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">ফলো-আপ তারিখ</label>
                  <input type="date"
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-48"
                    value={visitForm.followUpDate}
                    onChange={(e) => setVisitForm((f) => ({ ...f, followUpDate: e.target.value }))} />
                </div>
                {ta("নোট", "notes", 2)}
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={() => setStep("patient")}>← পেছনে</Button>
                  <Button
                    onClick={handleCreateVisit}
                    loading={visitSaving}
                    disabled={!item.patient?.id}>
                    ভিজিট সংরক্ষণ করুন
                  </Button>
                </div>
              </div>
            )
          )}

          {/* ── Prescription tab ── */}
          {step === "prescription" && (
            step === "prescription" && printRx ? (
              <PrescriptionPrint rx={printRx} onClose={onClose} />
            ) : (
              <PrescriptionEditor
                patientId={item.patient?.id || ""}
                visitId={visitId || undefined}
                patientName={item.patient?.nameBn || item.patientName}
                patientAge={patient?.age}
                onSave={handleSavePrescription}
                onPrint={handlePrint}
                onCancel={() => setStep("visit")}
              />
            )
          )}

          {/* ── Print tab ── */}
          {step === "print" && printRx && (
            <PrescriptionPrint rx={printRx} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}
