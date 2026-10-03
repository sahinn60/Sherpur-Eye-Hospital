"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Users, FileText, Clock, Search, Printer, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RouteGuard } from "@/components/auth";
import { Button, Modal } from "@/components/ui";
import { TodayQueue, ConsultationModal, PrescriptionPrint } from "@/components/clinic";
import {
  fetchClinicStats, fetchTodayQueue, fetchClinicAppointments,
  fetchClinicPatients, fetchClinicPrescriptions, fetchClinicPrescription,
} from "@/lib/services/clinicService";
import { DoctorStats, QueueItem, ClinicAppointment, ClinicPrescription } from "@/types/clinic";
import { Patient } from "@/types/patient";

type Tab = "today" | "appointments" | "patients" | "prescriptions";

const APPT_STATUS_BN: Record<string, string> = {
  PENDING: "অপেক্ষমাণ", CONFIRMED: "নিশ্চিত", CANCELLED: "বাতিল",
  COMPLETED: "সম্পন্ন", NO_SHOW: "অনুপস্থিত",
};
const APPT_STATUS_CLS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700", CONFIRMED: "bg-blue-50 text-blue-700",
  CANCELLED: "bg-red-50 text-red-700", COMPLETED: "bg-emerald-50 text-emerald-700",
  NO_SHOW: "bg-gray-100 text-gray-500",
};

function fmt(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

export default function ClinicPage() {
  const { user } = useAuth();

  const [tab,           setTab]           = useState<Tab>("today");
  const [stats,         setStats]         = useState<DoctorStats | null>(null);
  const [queue,         setQueue]         = useState<QueueItem[]>([]);
  const [appointments,  setAppointments]  = useState<ClinicAppointment[]>([]);
  const [patients,      setPatients]      = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<ClinicPrescription[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [apptStatus,    setApptStatus]    = useState("");
  const [page,          setPage]          = useState(1);
  const [totalPages,    setTotalPages]    = useState(1);

  const [activeItem,    setActiveItem]    = useState<QueueItem | null>(null);
  const [printRx,       setPrintRx]       = useState<ClinicPrescription | null>(null);

  const loadStats = useCallback(async () => {
    try { setStats(await fetchClinicStats()); } catch {}
  }, []);

  const loadQueue = useCallback(async () => {
    setLoading(true);
    try { setQueue(await fetchTodayQueue()); } finally { setLoading(false); }
  }, []);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchClinicAppointments({ status: apptStatus || undefined, page, limit: 15 });
      setAppointments(res.items);
      setTotalPages(res.totalPages);
    } finally { setLoading(false); }
  }, [apptStatus, page]);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchClinicPatients({ search: search || undefined, page, limit: 15 });
      setPatients(res.items);
      setTotalPages(res.totalPages);
    } finally { setLoading(false); }
  }, [search, page]);

  const loadPrescriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchClinicPrescriptions({ page, limit: 15 });
      setPrescriptions(res.items);
      setTotalPages(res.totalPages);
    } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { loadStats(); }, [loadStats]);

  useEffect(() => {
    setPage(1);
    if (tab === "today")         loadQueue();
    if (tab === "appointments")  loadAppointments();
    if (tab === "patients")      loadPatients();
    if (tab === "prescriptions") loadPrescriptions();
  }, [tab]);

  useEffect(() => {
    if (tab === "appointments")  loadAppointments();
    if (tab === "patients")      loadPatients();
    if (tab === "prescriptions") loadPrescriptions();
  }, [page, apptStatus, search]);

  async function handlePrintRx(rxId: string) {
    try {
      const rx = await fetchClinicPrescription(rxId);
      setPrintRx(rx);
    } catch {}
  }

  const statCards = stats ? [
    { label: "আজকের রোগী",    value: stats.todayAppts,         icon: <Calendar size={18} />,  cls: "text-blue-600",    bg: "bg-blue-50" },
    { label: "মোট রোগী",      value: stats.totalPatients,      icon: <Users size={18} />,     cls: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "প্রেসক্রিপশন",  value: stats.totalPrescriptions, icon: <FileText size={18} />,  cls: "text-purple-600",  bg: "bg-purple-50" },
    { label: "অপেক্ষমাণ",     value: stats.pendingAppts,       icon: <Clock size={18} />,     cls: "text-amber-600",   bg: "bg-amber-50" },
  ] : [];

  return (
    <RouteGuard allowedRoles={["DOCTOR", "SUPER_ADMIN", "ADMIN"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">ক্লিনিক ড্যাশবোর্ড</h1>
            <p className="text-sm text-gray-500 mt-0.5">স্বাগতম, {user?.name}</p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => { loadStats(); loadQueue(); }}
            className="flex items-center gap-1.5">
            <RefreshCw size={14} /> রিফ্রেশ
          </Button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statCards.map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-white`}>
                <div className={`${s.cls} mb-2`}>{s.icon}</div>
                <p className={`text-2xl font-bold ${s.cls}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1 w-fit flex-wrap">
          {([
            { key: "today",         label: "আজকের রোগী" },
            { key: "appointments",  label: "অ্যাপয়েন্টমেন্ট" },
            { key: "patients",      label: "আমার রোগী" },
            { key: "prescriptions", label: "প্রেসক্রিপশন" },
          ] as const).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${
                tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Today's Queue ── */}
        {tab === "today" && (
          <TodayQueue queue={queue} loading={loading} onSelect={setActiveItem} />
        )}

        {/* ── Appointments ── */}
        {tab === "appointments" && (
          <div className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              <select value={apptStatus} onChange={(e) => { setApptStatus(e.target.value); setPage(1); }}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
                <option value="">সব স্ট্যাটাস</option>
                {Object.entries(APPT_STATUS_BN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {["রোগী", "তারিখ", "সময়", "সেবা", "স্ট্যাটাস", "ভিজিট"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                      ))}</tr>
                    ))
                  ) : appointments.length === 0 ? (
                    <tr><td colSpan={6} className="py-10 text-center text-gray-400 text-sm">কোনো অ্যাপয়েন্টমেন্ট নেই</td></tr>
                  ) : appointments.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{a.patient?.nameBn || a.patientName}</p>
                        <p className="text-xs text-gray-400">{a.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fmt(a.preferredDate)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{a.preferredTime}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{a.service?.nameBn || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${APPT_STATUS_CLS[a.status] || "bg-gray-100 text-gray-500"}`}>
                          {APPT_STATUS_BN[a.status] || a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {a.visit ? (
                          <span className="text-xs text-emerald-600 font-medium">✅ হয়েছে</span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100">
                  <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</Button>
                  <span className="text-xs text-gray-500">{page}/{totalPages}</span>
                  <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── My Patients ── */}
        {tab === "patients" && (
          <div className="space-y-4">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="নাম, ফোন বা আইডি..." value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {["রোগী", "আইডি", "ফোন", "বয়স", "ভিজিট", "Rx"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                      ))}</tr>
                    ))
                  ) : patients.length === 0 ? (
                    <tr><td colSpan={6} className="py-10 text-center text-gray-400 text-sm">কোনো রোগী নেই</td></tr>
                  ) : patients.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">{p.nameBn}</p>
                        <p className="text-xs text-gray-400">{p.nameEn}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{p.patientId}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.age ? `${p.age} বছর` : "—"}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">{p._count.visits}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">{p._count.prescriptions}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100">
                  <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</Button>
                  <span className="text-xs text-gray-500">{page}/{totalPages}</span>
                  <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Prescriptions ── */}
        {tab === "prescriptions" && (
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)
            ) : prescriptions.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 py-14 text-center">
                <FileText size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm">কোনো প্রেসক্রিপশন নেই</p>
              </div>
            ) : (
              prescriptions.map((rx) => (
                <div key={rx.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-semibold text-gray-900">{rx.patient?.nameBn || "—"}</p>
                      {rx.patient?.patientId && (
                        <span className="text-xs font-mono bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{rx.patient.patientId}</span>
                      )}
                      <span className="text-xs text-gray-400">{fmt(rx.createdAt)}</span>
                    </div>
                    {rx.diagnosis && <p className="text-xs text-gray-600 mb-1">{rx.diagnosis}</p>}
                    <div className="flex flex-wrap gap-1">
                      {rx.items.slice(0, 3).map((item) => (
                        <span key={item.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {item.medicineName}
                        </span>
                      ))}
                      {rx.items.length > 3 && (
                        <span className="text-xs text-gray-400">+{rx.items.length - 3} আরো</span>
                      )}
                    </div>
                    {rx.followUpDate && (
                      <p className="text-xs text-emerald-600 mt-1">ফলো-আপ: {fmt(rx.followUpDate)}</p>
                    )}
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => handlePrintRx(rx.id)}
                    className="flex items-center gap-1.5 flex-shrink-0">
                    <Printer size={13} /> প্রিন্ট
                  </Button>
                </div>
              ))
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-end gap-2">
                <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</Button>
                <span className="text-xs text-gray-500">{page}/{totalPages}</span>
                <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Consultation modal */}
      {activeItem && (
        <ConsultationModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
          onDone={() => { loadQueue(); loadStats(); }}
        />
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
