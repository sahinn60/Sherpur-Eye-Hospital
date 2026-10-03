"use client";

import { Calendar, Clock, FileText, ExternalLink, X } from "lucide-react";
import { LeaveRequest, LEAVE_TYPE_BN, LEAVE_STATUS_CONFIG } from "@/types/leave";

interface Props {
  leave:    LeaveRequest;
  onCancel: (leave: LeaveRequest) => void;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
}

export function LeaveCard({ leave, onCancel }: Props) {
  const cfg  = LEAVE_STATUS_CONFIG[leave.status];
  const name = LEAVE_TYPE_BN[leave.leaveType] || leave.leaveType;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900 text-sm">{name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {fmtDate(leave.startDate)} — {fmtDate(leave.endDate)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {cfg.label}
          </span>
          {leave.status === "PENDING" && (
            <button onClick={() => onCancel(leave)}
              className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              title="বাতিল করুন">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {leave.totalDays} দিন
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {new Date(leave.createdAt).toLocaleDateString("bn-BD")}
        </span>
        {leave.attachment && (
          <a href={leave.attachment} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary-600 hover:underline">
            <ExternalLink size={12} /> সংযুক্তি
          </a>
        )}
      </div>

      {/* Reason */}
      <p className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 flex items-start gap-1.5">
        <FileText size={12} className="shrink-0 mt-0.5 text-gray-400" />
        {leave.reason}
      </p>

      {/* Review note */}
      {leave.reviewNote && (
        <div className={`text-xs px-3 py-2 rounded-lg border ${cfg.bg} ${cfg.border}`}>
          <span className={`font-medium ${cfg.text}`}>মন্তব্য: </span>
          <span className="text-gray-700">{leave.reviewNote}</span>
        </div>
      )}

      {/* Reviewer */}
      {leave.reviewer && (
        <p className="text-xs text-gray-400">
          পর্যালোচনা করেছেন: <span className="font-medium text-gray-600">{leave.reviewer.name}</span>
          {leave.reviewedAt && ` · ${new Date(leave.reviewedAt).toLocaleDateString("bn-BD")}`}
        </p>
      )}
    </div>
  );
}
