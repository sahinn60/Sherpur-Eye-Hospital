"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RouteGuard } from "@/components/auth";
import { Modal, Button } from "@/components/ui";
import { LeaveForm, LeaveCard, AdminLeaveView } from "@/components/leave";
import {
  applyLeave, fetchMyLeaves, fetchLeaveSummary, cancelLeave,
} from "@/lib/services/leaveService";
import { LeaveRequest, LeaveSummary, LEAVE_STATUS_CONFIG } from "@/types/leave";

type Tab = "my" | "admin";

export default function LeavePage() {
  const { isAdmin, hasRole } = useAuth();
  const isManager = isAdmin || hasRole("HR");

  const [tab,     setTab]     = useState<Tab>("my");
  const [leaves,  setLeaves]  = useState<LeaveRequest[]>([]);
  const [summary, setSummary] = useState<LeaveSummary | null>(null);
  const [total,   setTotal]   = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [res, sum] = await Promise.all([
        fetchMyLeaves(page, 10),
        fetchLeaveSummary(),
      ]);
      setLeaves(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setSummary(sum);
    } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  async function handleApply(data: any) {
    setFormError("");
    try {
      await applyLeave(data);
      setShowForm(false);
      load();
    } catch (e: any) {
      setFormError(e?.response?.data?.message || "সমস্যা হয়েছে");
      throw e;
    }
  }

  async function handleCancel(leave: LeaveRequest) {
    if (!confirm("এই ছুটির আবেদন বাতিল করতে চান?")) return;
    try { await cancelLeave(leave.id); load(); }
    catch (e: any) { alert(e?.response?.data?.message || "বাতিল করা যায়নি"); }
  }

  return (
    <RouteGuard>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">ছুটি ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-500 mt-0.5">ছুটির আবেদন ও অনুমোদন</p>
          </div>
          <Button size="sm" onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus size={15} /> ছুটির আবেদন
          </Button>
        </div>

        {/* Tabs */}
        {isManager && (
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1 w-fit">
            <button onClick={() => setTab("my")}
              className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${tab === "my" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              আমার আবেদন
            </button>
            <button onClick={() => setTab("admin")}
              className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${tab === "admin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              সব আবেদন
            </button>
          </div>
        )}

        {tab === "my" ? (
          <>
            {/* Summary cards */}
            {summary && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: "অপেক্ষমাণ",    v: summary.pending,           cls: "text-amber-600" },
                  { label: "অনুমোদিত",      v: summary.approved,          cls: "text-emerald-600" },
                  { label: "প্রত্যাখ্যাত",  v: summary.rejected,          cls: "text-red-600" },
                  { label: "বাতিল",          v: summary.cancelled,         cls: "text-gray-500" },
                  { label: "মোট ছুটির দিন", v: `${summary.totalApprovedDays}দ`, cls: "text-primary-600" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
                    <p className={`text-2xl font-bold ${s.cls}`}>{s.v}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Leave list */}
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : leaves.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
                <div className="text-5xl mb-3">🏖️</div>
                <p className="text-gray-500 text-sm">কোনো ছুটির আবেদন নেই</p>
                <Button size="sm" className="mt-4" onClick={() => setShowForm(true)}>
                  <Plus size={14} className="mr-1" /> প্রথম আবেদন করুন
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {leaves.map((l) => (
                  <LeaveCard key={l.id} leave={l} onCancel={handleCancel} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">মোট {total} আবেদন</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</Button>
                  <span className="text-xs text-gray-500 self-center">{page}/{totalPages}</span>
                  <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <AdminLeaveView />
        )}
      </div>

      {/* Apply modal */}
      {showForm && (
        <Modal open onClose={() => { setShowForm(false); setFormError(""); }} title="ছুটির আবেদন" size="md">
          <LeaveForm
            onSubmit={handleApply}
            onCancel={() => { setShowForm(false); setFormError(""); }}
            error={formError}
          />
        </Modal>
      )}
    </RouteGuard>
  );
}
