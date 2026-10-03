"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { fetchAllAttendances, fetchTodaySummary } from "@/lib/services/attendanceService";
import { AttendanceRecord, TodaySummary } from "@/types/attendance";
import { Button } from "@/components/ui";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  PRESENT: { label: "উপস্থিত",   cls: "bg-emerald-50 text-emerald-700" },
  LATE:    { label: "দেরিতে",    cls: "bg-amber-50 text-amber-700" },
  ABSENT:  { label: "অনুপস্থিত", cls: "bg-red-50 text-red-700" },
  LEAVE:   { label: "ছুটি",      cls: "bg-blue-50 text-blue-700" },
  HOLIDAY: { label: "ছুটির দিন", cls: "bg-purple-50 text-purple-700" },
};

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit", hour12: true });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("bn-BD", { day: "numeric", month: "short" });
}
function fmtMins(mins: number) {
  if (!mins) return "—";
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? `${h}ঘ ${m}মি` : `${m}মি`;
}

export function AdminAttendanceView() {
  const [items, setItems]         = useState<AttendanceRecord[]>([]);
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [summary, setSummary]     = useState<TodaySummary | null>(null);

  const [dateFrom, setDateFrom]   = useState(() => new Date().toISOString().split("T")[0]);
  const [dateTo, setDateTo]       = useState(() => new Date().toISOString().split("T")[0]);
  const [status, setStatus]       = useState("");
  const [search, setSearch]       = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllAttendances({ dateFrom, dateTo, status: status || undefined, page, limit: 20 });
      setItems(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally { setLoading(false); }
  }, [dateFrom, dateTo, status, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetchTodaySummary().then(setSummary).catch(() => {}); }, []);

  const filtered = search
    ? items.filter((r) =>
        r.user.name.toLowerCase().includes(search.toLowerCase()) ||
        r.user.employee?.nameBn.includes(search) ||
        r.user.employee?.employeeId.toLowerCase().includes(search.toLowerCase())
      )
    : items;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "উপস্থিত",   value: summary.present, cls: "text-emerald-600" },
            { label: "দেরিতে",    value: summary.late,    cls: "text-amber-600" },
            { label: "অনুপস্থিত", value: summary.absent,  cls: "text-red-600" },
            { label: "ছুটি",      value: summary.leave,   cls: "text-blue-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
              <p className={`text-2xl font-bold ${s.cls}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="নাম বা আইডি..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
          <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500" />
          <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500" />
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
            <option value="">সব অবস্থা</option>
            <option value="PRESENT">উপস্থিত</option>
            <option value="LATE">দেরিতে</option>
            <option value="ABSENT">অনুপস্থিত</option>
            <option value="LEAVE">ছুটি</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-2">
            {[1,2,3,4,5].map((i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">কোনো রেকর্ড পাওয়া যায়নি</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">কর্মী</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">তারিখ</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">চেক-ইন</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">চেক-আউট</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden lg:table-cell">কাজের সময়</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">অবস্থা</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const s = STATUS_LABEL[r.status] ?? STATUS_LABEL.ABSENT;
                  const name = r.user.employee?.nameBn || r.user.doctor?.nameBn || r.user.name;
                  const empId = r.user.employee?.employeeId;
                  return (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{name}</p>
                        {empId && <p className="text-xs text-gray-400 font-mono">{empId}</p>}
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{fmtDate(r.date)}</td>
                      <td className="px-4 py-3">
                        <span className="text-gray-800">{fmt(r.checkIn)}</span>
                        {r.checkInLatitude && <MapPin size={10} className="inline ml-1 text-gray-400" />}
                        {r.lateMinutes > 0 && (
                          <p className="text-xs text-amber-600">{fmtMins(r.lateMinutes)} দেরি</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{fmt(r.checkOut)}</td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{fmtMins(r.workingMinutes)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">মোট {total} রেকর্ড</p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={14} />
              </Button>
              <span className="text-xs text-gray-500 self-center">{page}/{totalPages}</span>
              <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
