"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, FileText, Plus, UserRound, Eye } from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { Button, Modal } from "@/components/ui";
import { fetchRxList, Prescription } from "@/lib/services/prescriptionService";
import { fetchPatients } from "@/lib/services/patientService";
import { Patient } from "@/types/patient";
import { useRouter } from "next/navigation";

function fmt(d: string) {
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

export default function PrescriptionsPage() {
  const router = useRouter();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [total,         setTotal]         = useState(0);
  const [totalPages,    setTotalPages]    = useState(1);
  const [page,          setPage]          = useState(1);
  const [loading,       setLoading]       = useState(true);

  // new prescription — patient search
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [patientQuery,      setPatientQuery]      = useState("");
  const [patients,          setPatients]          = useState<Patient[]>([]);
  const [patientLoading,    setPatientLoading]    = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchRxList({ page, limit: 20 });
      setPrescriptions(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  // patient search with debounce
  useEffect(() => {
    if (!patientQuery.trim()) { setPatients([]); return; }
    const t = setTimeout(async () => {
      setPatientLoading(true);
      try {
        const res = await fetchPatients({ search: patientQuery.trim(), limit: 10 });
        setPatients(res.items);
      } catch { setPatients([]); }
      finally { setPatientLoading(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [patientQuery]);

  function openNewRx() {
    setPatientQuery("");
    setPatients([]);
    setShowPatientSearch(true);
  }

  function selectPatient(p: Patient) {
    setShowPatientSearch(false);
    router.push(`/dashboard/patients/${p.id}/prescription/new`);
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
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${rx.status === "FINALIZED" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                    {rx.status === "FINALIZED" ? "চূড়ান্ত" : "ড্রাফট"}
                  </span>
                </div>
                {rx.diagnosis && <p className="text-xs text-gray-600 mb-1 truncate">{rx.diagnosis}</p>}
                <div className="flex flex-wrap gap-1">
                  {rx.items.slice(0, 4).map((item, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
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
              <button
                onClick={() => router.push(`/dashboard/prescriptions/${rx.id}/preview`)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shrink-0"
              >
                <Eye size={13} /> দেখুন
              </button>
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
                placeholder="নাম, ফোন নম্বর বা রোগী আইডি (PAT-...) দিয়ে খুঁজুন"
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {patientLoading && (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            )}

            {!patientLoading && patientQuery.trim() && patients.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">কোনো রোগী পাওয়া যায়নি</p>
            )}

            {!patientLoading && !patientQuery.trim() && (
              <p className="text-sm text-gray-400 text-center py-6">রোগীর নাম, ফোন বা আইডি টাইপ করুন</p>
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
    </RouteGuard>
  );
}
