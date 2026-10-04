"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, FileText, Printer, Plus, X, UserRound } from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { Button, Modal } from "@/components/ui";
import { PrescriptionEditor, PrescriptionPrint } from "@/components/clinic";
import {
  fetchClinicPrescriptions, fetchClinicPrescription,
  createClinicPrescription,
} from "@/lib/services/clinicService";
import { fetchPatients } from "@/lib/services/patientService";
import { ClinicPrescription } from "@/types/clinic";
import { Patient } from "@/types/patient";

function fmt(d: string) {
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<ClinicPrescription[]>([]);
  const [total,         setTotal]         = useState(0);
  const [totalPages,    setTotalPages]    = useState(1);
  const [page,          setPage]          = useState(1);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [printRx,       setPrintRx]       = useState<ClinicPrescription | null>(null);

  // new prescription flow
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [patientQuery,      setPatientQuery]      = useState("");
  const [patients,          setPatients]          = useState<Patient[]>([]);
  const [patientLoading,    setPatientLoading]    = useState(false);
  const [selectedPatient,   setSelectedPatient]   = useState<Patient | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchClinicPrescriptions({ page, limit: 20 });
      let items = res.items || [];
      if (search) {
        const q = search.toLowerCase();
        items = items.filter((rx) =>
          rx.patient?.nameBn?.toLowerCase().includes(q) ||
          rx.patient?.patientId?.toLowerCase().includes(q)
        );
      }
      setPrescriptions(items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  // patient search
  useEffect(() => {
    if (!patientQuery.trim()) { setPatients([]); return; }
    const t = setTimeout(async () => {
      setPatientLoading(true);
      try {
        const res = await fetchPatients({ search: patientQuery, limit: 10 });
        setPatients(res.items);
      } finally { setPatientLoading(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [patientQuery]);

  async function handlePrint(rx: ClinicPrescription) {
    try {
      const full = await fetchClinicPrescription(rx.id);
      setPrintRx(full);
    } catch { setPrintRx(rx); }
  }

  function openNewRx() {
    setPatientQuery("");
    setPatients([]);
    setSelectedPatient(null);
    setShowPatientSearch(true);
  }

  function selectPatient(p: Patient) {
    setSelectedPatient(p);
    setShowPatientSearch(false);
  }

  async function handleSaveRx(data: any) {
    if (!selectedPatient) throw new Error("রোগী নির্বাচন করুন");
    return createClinicPrescription(selectedPatient.id, data);
  }

  function handleRxSaved(rx: ClinicPrescription) {
    setSelectedPatient(null);
    setPrintRx(rx);
    load();
  }

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTION"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">প্রেসক্রিপশন তালিকা</h1>
            <p className="text-sm text-gray-500 mt-0.5">মোট {total}টি প্রেসক্রিপশন</p>
          </div>
          <Button onClick={openNewRx} className="flex items-center gap-2">
            <Plus size={15} /> নতুন প্রেসক্রিপশন
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="relative max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="রোগীর নাম বা আইডি..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            ))
          ) : prescriptions.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
              <FileText size={40} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">কোনো প্রেসক্রিপশন পাওয়া যায়নি</p>
              <button onClick={openNewRx} className="mt-3 text-sm text-blue-600 hover:underline">
                নতুন প্রেসক্রিপশন লিখুন
              </button>
            </div>
          ) : prescriptions.map((rx) => (
            <div key={rx.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-semibold text-gray-900">{rx.patient?.nameBn || "—"}</p>
                  {rx.patient?.patientId && (
                    <span className="text-xs font-mono bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{rx.patient.patientId}</span>
                  )}
                  <span className="text-xs text-gray-400">{fmt(rx.createdAt)}</span>
                  {rx.doctor && (
                    <span className="text-xs text-gray-500">— ডা. {rx.doctor.nameBn}</span>
                  )}
                </div>
                {rx.diagnosis && <p className="text-xs text-gray-600 mb-1">{rx.diagnosis}</p>}
                <div className="flex flex-wrap gap-1">
                  {rx.items.slice(0, 4).map((item) => (
                    <span key={item.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {item.medicineName}
                    </span>
                  ))}
                  {rx.items.length > 4 && (
                    <span className="text-xs text-gray-400">+{rx.items.length - 4} আরো</span>
                  )}
                </div>
                {rx.followUpDate && (
                  <p className="text-xs text-emerald-600 mt-1">ফলো-আপ: {fmt(rx.followUpDate)}</p>
                )}
              </div>
              <Button size="sm" variant="secondary" onClick={() => handlePrint(rx)}
                className="flex items-center gap-1.5 flex-shrink-0">
                <Printer size={13} /> প্রিন্ট
              </Button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">মোট {total}টি</p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</Button>
              <span className="text-xs text-gray-500 self-center">{page}/{totalPages}</span>
              <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</Button>
            </div>
          </div>
        )}
      </div>

      {/* Patient search modal */}
      {showPatientSearch && (
        <Modal open onClose={() => setShowPatientSearch(false)} title="রোগী নির্বাচন করুন" size="md">
          <div className="space-y-4">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="নাম, ফোন বা আইডি দিয়ে খুঁজুন..."
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            {patientLoading && (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            )}

            {!patientLoading && patients.length === 0 && patientQuery.trim() && (
              <p className="text-sm text-gray-400 text-center py-6">কোনো রোগী পাওয়া যায়নি</p>
            )}

            {!patientLoading && patients.length === 0 && !patientQuery.trim() && (
              <p className="text-sm text-gray-400 text-center py-6">রোগীর নাম বা আইডি টাইপ করুন</p>
            )}

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectPatient(p)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <UserRound size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{p.nameBn}</p>
                    <p className="text-xs text-gray-500">{p.patientId} · {p.phone}</p>
                  </div>
                  {p.age && <span className="text-xs text-gray-400 shrink-0">{p.age} বছর</span>}
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {selectedPatient && (
        <Modal open onClose={() => setSelectedPatient(null)} title="নতুন প্রেসক্রিপশন" size="xl">
          <PrescriptionEditor
            patientId={selectedPatient.id}
            patientName={selectedPatient.nameBn}
            patientAge={selectedPatient.age}
            onSave={handleSaveRx}
            onPrint={handleRxSaved}
            onCancel={() => setSelectedPatient(null)}
          />
        </Modal>
      )}

      {/* Print modal */}
      {printRx && (
        <Modal open onClose={() => setPrintRx(null)} title="প্রেসক্রিপশন প্রিন্ট" size="xl">
          <PrescriptionPrint rx={printRx} onClose={() => setPrintRx(null)} />
        </Modal>
      )}
    </RouteGuard>
  );
}
