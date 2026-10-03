"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { fetchMyHistory } from "@/lib/services/attendanceService";
import { AttendanceRecord } from "@/types/attendance";

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
  return new Date(iso).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

function fmtMins(mins: number) {
  if (!mins) return "—";
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? `${h}ঘ ${m}মি` : `${m}মি`;
}

export function AttendanceHistory() {
  const [items, setItems]       = useState<AttendanceRecord[]>([]);
  const [total, setTotal]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMyHistory(page, 15)
      .then((r) => { setItems(r.items); setTotal(r.total); setTotalPages(r.totalPages); })
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return (
    <div className="space-y-2 mt-4">
      {[1,2,3].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  );

  if (!items.length) return (
    <div className="text-center py-10 text-gray-400 text-sm">কোনো রেকর্ড নেই</div>
  );

  return (
    <div className="mt-2">
      <div className="space-y-2">
        {items.map((r) => {
          const s = STATUS_LABEL[r.status] ?? STATUS_LABEL.ABSENT;
          return (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-800">{fmtDate(r.date)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>{s.label}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                <div>
                  <p className="text-gray-400">চেক-ইন</p>
                  <p className="font-medium text-gray-700">{fmt(r.checkIn)}</p>
                  {r.checkInLatitude && <MapPin size={9} className="inline text-gray-400 mr-0.5" />}
                </div>
                <div>
                  <p className="text-gray-400">চেক-আউট</p>
                  <p className="font-medium text-gray-700">{fmt(r.checkOut)}</p>
                </div>
                <div>
                  <p className="text-gray-400">কাজের সময়</p>
                  <p className="font-medium text-gray-700">{fmtMins(r.workingMinutes)}</p>
                </div>
              </div>
              {r.lateMinutes > 0 && (
                <p className="text-xs text-amber-600 mt-1.5">⚠ {fmtMins(r.lateMinutes)} দেরিতে এসেছেন</p>
              )}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-400">মোট {total} রেকর্ড</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
              <ChevronLeft size={15} />
            </button>
            <span className="text-xs text-gray-500 self-center">{page}/{totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
