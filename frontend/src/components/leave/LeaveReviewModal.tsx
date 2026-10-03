"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Modal, Button } from "@/components/ui";
import { LeaveRequest, LEAVE_TYPE_BN, LEAVE_STATUS_CONFIG } from "@/types/leave";

interface Props {
  leave:     LeaveRequest;
  onReview:  (id: string, status: "APPROVED" | "REJECTED", note: string) => Promise<void>;
  onClose:   () => void;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
}

export function LeaveReviewModal({ leave, onReview, onClose }: Props) {
  const [note,    setNote]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const name = leave.user.employee?.nameBn || leave.user.doctor?.nameBn || leave.user.name;

  async function handle(status: "APPROVED" | "REJECTED") {
    setLoading(true); setError("");
    try {
      await onReview(leave.id, status, note);
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || "সমস্যা হয়েছে");
    } finally { setLoading(false); }
  }

  return (
    <Modal open onClose={onClose} title="ছুটির আবেদন পর্যালোচনা" size="md">
      <div className="space-y-4">
        {/* Applicant info */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-900">{name}</p>
              <p className="text-xs text-gray-500">{leave.user.employee?.designationBn || leave.user.doctor?.designationBn}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEAVE_STATUS_CONFIG[leave.status].bg} ${LEAVE_STATUS_CONFIG[leave.status].text}`}>
              {LEAVE_STATUS_CONFIG[leave.status].label}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
            <div>
              <p className="text-xs text-gray-400">ছুটির ধরন</p>
              <p className="font-medium text-gray-800">{LEAVE_TYPE_BN[leave.leaveType]}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">মোট দিন</p>
              <p className="font-medium text-gray-800">{leave.totalDays} দিন</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">শুরু</p>
              <p className="font-medium text-gray-800">{fmtDate(leave.startDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">শেষ</p>
              <p className="font-medium text-gray-800">{fmtDate(leave.endDate)}</p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-400 mb-1">কারণ</p>
            <p className="text-sm text-gray-700 bg-white rounded-lg px-3 py-2 border border-gray-100">{leave.reason}</p>
          </div>
          {leave.attachment && (
            <a href={leave.attachment} target="_blank" rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              📎 সংযুক্তি দেখুন
            </a>
          )}
        </div>

        {/* Review note */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">মন্তব্য (ঐচ্ছিক)</label>
          <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="অনুমোদন বা প্রত্যাখ্যানের কারণ লিখুন..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <Button variant="secondary" onClick={onClose} className="flex-1">বাতিল</Button>
          <Button variant="danger" loading={loading} onClick={() => handle("REJECTED")}
            className="flex-1 flex items-center justify-center gap-1.5">
            <XCircle size={15} /> প্রত্যাখ্যান
          </Button>
          <Button loading={loading} onClick={() => handle("APPROVED")}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle size={15} /> অনুমোদন
          </Button>
        </div>
      </div>
    </Modal>
  );
}
