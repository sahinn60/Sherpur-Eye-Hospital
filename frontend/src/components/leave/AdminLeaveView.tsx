"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { fetchAllLeaves, reviewLeave } from "@/lib/services/leaveService";
import { LeaveRequest, LEAVE_TYPE_BN, LEAVE_STATUS_CONFIG } from "@/types/leave";
import { Button } from "@/components/ui";
import { LeaveReviewModal } from "./LeaveReviewModal";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("bn-BD", { day: "numeric", month: "short" });
}

export function AdminLeaveView() {
  const [items, setItems]         = useState<LeaveRequest[]>([]);
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState<LeaveRequest | null>(null);

  const [status,   setStatus]   = useState("PENDING");
  const [search,   setSearch]   = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllLeaves({
        status: status || undefined,
        dateFrom: dateFrom || undefined,
        dateTo:   dateTo   || undefined,
        page, limit: 20,
      });
      setItems(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally { setLoading(false); }
  }, [status, dateFrom, dateTo, page]);

  useEffect(() => { load(); }, [load]);

  const filtered = search
    ? items.filter((r) => {
        const name = r.user.employee?.nameBn || r.user.doctor?.nameBn || r.user.name;
        return name.includes(search) ||
          r.user.employee?.employeeId?.toLowerCase().includes(search.toLowerCase());
      })
    : items;

  async function handleReview(id: string, status: "APPROVED" | "REJECTED", note: string) {
    await reviewLeave(id, { status, reviewNote: note });
    setSelected(null);
    load();
  }

  // Status counts
  const counts = { PENDING: 0, APPROVED: 0, REJECTED: 0, CANCELLED: 0 };
  items.forEach((r) => { if (r.status in counts) counts[r.status as keyof typeof counts]++; });

  return (
    <div className="space-y-4">
      {/* Quick status filter pills */}
      <div className="flex flex-wrap gap-2">
        {(["", "PENDING", "APPROVED", "REJECTED", "CANCELLED"] as const).map((s) => {
          const cfg = s ? LEAVE_STATUS_CONFIG[s] : null;
          return (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                status === s
                  ? (cfg ? `${cfg.bg} ${cfg.text} ${cfg.border}` : "bg-gray-800 text-white border-gray-800")
                  : "bg-white text-gray-500 border-gray-300 hover:border-gray-400"
              }`}>
              {s ? LEAVE_STATUS_CONFIG[s].label : "সব"}
            </button>
          );
        })}
      </div>

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
          {(dateFrom || dateTo || search) && (
            <Button size="sm" variant="ghost" onClick={() => { setDateFrom(""); setDateTo(""); setSearch(""); }}>
              মুছুন
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-2">
            {[1,2,3,4].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">কোনো আবেদন পাওয়া যায়নি</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["কর্মী","ছুটির ধরন","তারিখ","দিন","অবস্থা","কার্যক্রম"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const cfg  = LEAVE_STATUS_CONFIG[r.status];
                  const name = r.user.employee?.nameBn || r.user.doctor?.nameBn || r.user.name;
                  return (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{name}</p>
                        <p className="text-xs text-gray-400">{r.user.employee?.employeeId || r.user.role}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {LEAVE_TYPE_BN[r.leaveType] || r.leaveType}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                        {fmtDate(r.startDate)} – {fmtDate(r.endDate)}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{r.totalDays}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(r)}
                          className="p-1.5 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition-colors"
                          title="বিবরণ / পর্যালোচনা">
                          <Eye size={15} />
                        </button>
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
            <p className="text-xs text-gray-400">মোট {total} আবেদন</p>
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

      {selected && (
        <LeaveReviewModal
          leave={selected}
          onReview={handleReview}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
