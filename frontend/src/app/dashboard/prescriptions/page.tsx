"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, FileText, Plus, UserRound, Eye, CalendarDays } from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { Button, Modal } from "@/components/ui";
import { fetchRxList, Prescription } from "@/lib/services/prescriptionService";
import { fetchPatients, createPatient } from "@/lib/services/patientService";
import { fetchAppointments } from "@/lib/services/appointmentService";
import { Patient } from "@/types/patient";
import { Appointment } from "@/types/appointment";
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
  const [search,        setSearch]        = useState("");
  const [searchInput,   setSearchInput]   = useState("");

  // new prescription — patient search
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [tab,               setTab]               = useState<"patients" | "appointments">("patients");
  const [patientQuery,      setPatientQuery]      = useState("");
  const [patients,          setPatients]          = useState<Patient[]>([]);
  const [patientLoading,    setPatientLoading]    = useState(false);
  const [apptQuery,         setApptQuery]         = useState("");
  const [appointments,      setAppointments]      = useState<Appointment[]>([]);
  const [apptLoading,       setApptLoading]       = useState(false);
  const [apptRxLoading,     setApptRxLoading]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchRxList({ page, limit: 20, search: search || undefined });
      setPrescriptions(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

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

  // appointment search with debounce
  useEffect(() => {
    if (tab !== "appointments") return;
    const t = setTimeout(async () => {
      setApptLoading(true);
      try {
        const items = await fetchAppointments();
        const q = apptQuery.trim().toLowerCase();
        setAppointments(q
          ? items.filter((a) =>
              a.patientName.toLowerCase().includes(q) ||
              a.phone.includes(q) ||
              a.requestId.toLowerCase().includes(q)
            )
          : items.slice(0, 20)
        );
      } catch { setAppointments([]); }
      finally { setApptLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [apptQuery, tab]);

  async function goToRxFromAppt(a: Appointment) {
    setApptRxLoading(a.id);
    try {
      const res = await fetchPatients({ search: a.phone, limit: 5 });
      const match = res.items.find((p) => p.phone === a.phone);
      if (match) {
        setShowPatientSearch(false);
        router.push(`/dashboard/patients/${match.id}/prescription/new`);
      } else {
        // auto-register then go
        const patient = await createPatient({
          nameBn: a.patientName,
          nameEn: a.patientName,
          phone: a.phone,
          age: a.age,
          gender: a.gender,
        });
        setShowPatientSearch(false);
        router.push(`/dashboard/patients/${patient.id}/prescription/new`);
      }
    } catch { alert("রোগী তৈরি হয়নি"); }
    finally { setApptRxLoading(null); }
  }

  function openNewRx() {
    setPatientQuery("");
    setPatients([]);
    setApptQuery("");
    setAppointments([]);
    setTab("patients");
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

        {/* Search bar */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="রোগীর নাম, ফোন, রোগী আইডি বা RX নম্বর দিয়ে খুঁজুন..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          {searchInput && (
            <button onClick={() => { setSearchInput(""); setSearch(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
          )}
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

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              <button type="button"
                onClick={() => setTab("patients")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  tab === "patients" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}>
                <UserRound size={13} /> নিবন্ধিত রোগী
              </button>
              <button type="button"
                onClick={() => setTab("appointments")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  tab === "appointments" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}>
                <CalendarDays size={13} /> অ্যাপয়েন্টমেন্ট
              </button>
            </div>

            {/* Search input */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              {tab === "patients" ? (
                <input autoFocus type="text"
                  placeholder="নাম, ফোন নম্বর বা রোগী আইডি (PAT-...) দিয়ে খুঁজুন"
                  value={patientQuery} onChange={(e) => setPatientQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              ) : (
                <input autoFocus type="text"
                  placeholder="নাম, ফোন নম্বর বা রিকোয়েস্ট আইডি দিয়ে খুঁজুন"
                  value={apptQuery} onChange={(e) => setApptQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              )}
            </div>

            {/* Results */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {tab === "patients" ? (
                <>
                  {patientLoading && Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                  {!patientLoading && patientQuery.trim() && patients.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-6">কোনো রোগী পাওয়া যায়নি</p>
                  )}
                  {!patientLoading && !patientQuery.trim() && (
                    <p className="text-sm text-gray-400 text-center py-6">রোগীর নাম, ফোন বা আইডি টাইপ করুন</p>
                  )}
                  {patients.map((p) => (
                    <button key={p.id} onClick={() => selectPatient(p)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
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
                </>
              ) : (
                <>
                  {apptLoading && Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                  {!apptLoading && appointments.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-6">কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি</p>
                  )}
                  {appointments.map((a) => (
                    <button key={a.id} onClick={() => goToRxFromAppt(a)}
                      disabled={apptRxLoading === a.id}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-left disabled:opacity-60">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        {apptRxLoading === a.id
                          ? <span className="animate-spin w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full" />
                          : <CalendarDays size={16} className="text-emerald-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{a.patientName}</p>
                        <p className="text-xs text-gray-500">{a.phone} · {a.requestId}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        a.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" :
                        a.status === "PENDING"   ? "bg-amber-100 text-amber-700" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {a.status === "CONFIRMED" ? "নিশ্চিত" : a.status === "PENDING" ? "অপেক্ষমাণ" : a.status}
                      </span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </RouteGuard>
  );
}
