"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, CalendarDays, CheckCircle, XCircle, Clock, FileText, UserPlus, X } from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { Button, Modal } from "@/components/ui";
import { PatientForm } from "@/components/patients";
import api from "@/lib/api";
import { Appointment, AppointmentStatus } from "@/types/appointment";
import { fetchPatients, createPatient } from "@/lib/services/patientService";

const STATUS_BN: Record<AppointmentStatus, string> = {
  PENDING: "অপেক্ষমাণ", CONFIRMED: "নিশ্চিত", CANCELLED: "বাতিল",
  COMPLETED: "সম্পন্ন", NO_SHOW: "অনুপস্থিত",
};
const STATUS_CLS: Record<AppointmentStatus, string> = {
  PENDING:   "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  NO_SHOW:   "bg-gray-100 text-gray-500 border-gray-200",
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search,       setSearch]       = useState("");
  const [actionId,     setActionId]     = useState<string | null>(null);
  const [rxLoading,    setRxLoading]    = useState<string | null>(null);
  const [registerAppt, setRegisterAppt] = useState<Appointment | null>(null);
  const [formError,    setFormError]    = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get("/appointments", { params });
      let items: Appointment[] = res.data.data || [];
      if (search) {
        const q = search.toLowerCase();
        items = items.filter((a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.phone.includes(q) ||
          a.requestId.toLowerCase().includes(q)
        );
      }
      setAppointments(items);
      setTotal(items.length);
    } finally { setLoading(false); }
  }, [statusFilter, search]);

  useEffect(() => { load(); }, [load]);

  async function changeStatus(id: string, status: AppointmentStatus, note?: string) {
    setActionId(id);
    try {
      await api.patch(`/appointments/${id}/status`, { status, adminNote: note });
      load();
    } catch (e: any) {
      alert(e?.response?.data?.message || "সমস্যা হয়েছে");
    } finally { setActionId(null); }
  }

  async function goToPrescription(a: Appointment) {
    setRxLoading(a.id);
    try {
      const res = await fetchPatients({ search: a.phone, limit: 5 });
      const match = res.items.find((p) => p.phone === a.phone);
      if (match) {
        router.push(`/dashboard/patients/${match.id}/prescription/new`);
      } else {
        setRegisterAppt(a);
        setFormError("");
      }
    } catch {
      setRegisterAppt(a);
      setFormError("");
    } finally { setRxLoading(null); }
  }

  async function handleRegisterAndPrescribe(data: any) {
    setFormError("");
    try {
      const patient = await createPatient(data);
      setRegisterAppt(null);
      router.push(`/dashboard/patients/${patient.id}/prescription/new`);
    } catch (e: any) {
      setFormError(e?.response?.data?.message || "রেজিস্ট্রেশন হয়নি");
      throw e;
    }
  }

  const statCounts = {
    PENDING:   appointments.filter((a) => a.status === "PENDING").length,
    CONFIRMED: appointments.filter((a) => a.status === "CONFIRMED").length,
    COMPLETED: appointments.filter((a) => a.status === "COMPLETED").length,
  };

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "RECEPTION", "DOCTOR"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">অ্যাপয়েন্টমেন্ট ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-500 mt-0.5">মোট {total}টি অ্যাপয়েন্টমেন্ট</p>
          </div>
          <Button size="sm" variant="secondary" onClick={load}>রিফ্রেশ</Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "অপেক্ষমাণ",  value: statCounts.PENDING,   cls: "text-amber-600",   bg: "bg-amber-50",   icon: <Clock size={18}/> },
            { label: "নিশ্চিত",    value: statCounts.CONFIRMED, cls: "text-blue-600",    bg: "bg-blue-50",    icon: <CheckCircle size={18}/> },
            { label: "সম্পন্ন",    value: statCounts.COMPLETED, cls: "text-emerald-600", bg: "bg-emerald-50", icon: <CalendarDays size={18}/> },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-white`}>
              <div className={`${s.cls} mb-2`}>{s.icon}</div>
              <p className={`text-2xl font-bold ${s.cls}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="নাম, ফোন বা রিকোয়েস্ট আইডি..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option value="">সব স্ট্যাটাস</option>
              {(Object.keys(STATUS_BN) as AppointmentStatus[]).map((s) => (
                <option key={s} value={s}>{STATUS_BN[s]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["রিকোয়েস্ট আইডি", "রোগী", "চিকিৎসক", "তারিখ / সময়", "স্ট্যাটাস", "কার্যক্রম", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}</tr>
                  ))
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <CalendarDays size={40} className="mx-auto text-gray-200 mb-3" />
                      <p className="text-gray-400 text-sm">কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি</p>
                    </td>
                  </tr>
                ) : appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{a.requestId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{a.patientName}</p>
                      <p className="text-xs text-gray-400">{a.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.doctor?.nameBn || "—"}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700">{fmt(a.preferredDate)}</p>
                      <p className="text-xs text-gray-400">{a.preferredTime}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${STATUS_CLS[a.status]}`}>
                        {STATUS_BN[a.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {a.status === "PENDING" && (
                          <>
                            <button
                              disabled={actionId === a.id}
                              onClick={() => changeStatus(a.id, "CONFIRMED")}
                              className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50"
                            >নিশ্চিত</button>
                            <button
                              disabled={actionId === a.id}
                              onClick={() => changeStatus(a.id, "CANCELLED")}
                              className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                            >বাতিল</button>
                          </>
                        )}
                        {a.status === "CONFIRMED" && (
                          <>
                            <button
                              disabled={actionId === a.id}
                              onClick={() => changeStatus(a.id, "COMPLETED")}
                              className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 disabled:opacity-50"
                            >সম্পন্ন</button>
                            <button
                              disabled={actionId === a.id}
                              onClick={() => changeStatus(a.id, "NO_SHOW")}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                            >অনুপস্থিত</button>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        disabled={rxLoading === a.id}
                        onClick={() => goToPrescription(a)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold whitespace-nowrap"
                      >
                        {rxLoading === a.id
                          ? <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                          : <FileText size={12} />}
                        প্রেসক্রিপশন
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {registerAppt && (
        <Modal open onClose={() => setRegisterAppt(null)}
          title="রোগী নিবন্ধন করুন" size="lg">
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
            <p className="font-semibold mb-1">⚠️ এই ফোন নম্বরে কোনো রোগী পাওয়া যায়নি</p>
            <p className="text-xs">অ্যাপয়েন্টমেন্ট: <span className="font-mono">{registerAppt.patientName}</span> — {registerAppt.phone}</p>
          </div>
          <PatientForm
            patient={null}
            initialData={{
              nameBn: registerAppt.patientName,
              phone: registerAppt.phone,
              age: registerAppt.age,
              gender: registerAppt.gender,
            }}
            onSubmit={handleRegisterAndPrescribe}
            onCancel={() => setRegisterAppt(null)}
            error={formError}
          />
        </Modal>
      )}
    </RouteGuard>
  );
}
