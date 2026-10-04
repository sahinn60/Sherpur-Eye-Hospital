"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STATUS_CONFIG: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  PENDING:   { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b", label: "অপেক্ষমাণ" },
  CONFIRMED: { bg: "#ecfdf5", color: "#059669", dot: "#10b981", label: "নিশ্চিত" },
  COMPLETED: { bg: "#eff6ff", color: "#2563eb", dot: "#3b82f6", label: "সম্পন্ন" },
  CANCELLED: { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444", label: "বাতিল" },
  NO_SHOW:   { bg: "#f5f3ff", color: "#7c3aed", dot: "#8b5cf6", label: "অনুপস্থিত" },
};

interface Appointment {
  id: string;
  requestId: string;
  patientName: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  doctor: { nameBn: string; nameEn: string } | null;
}

export function RecentAppointments({ data, loading }: { data: Appointment[]; loading?: boolean }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #f1f5f9" }}>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>সাম্প্রতিক অ্যাপয়েন্টমেন্ট</p>
          <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>সর্বশেষ আসা অ্যাপয়েন্টমেন্টগুলো</p>
        </div>
        <Link href="/dashboard/appointments"
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: "#eff6ff", color: "#2563eb" }}>
          সব দেখুন <ArrowRight size={12} />
        </Link>
      </div>

      {loading ? (
        <div className="p-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: "#f8fafc" }} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm" style={{ color: "#94a3b8" }}>কোনো অ্যাপয়েন্টমেন্ট নেই</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["আইডি", "রোগী", "চিকিৎসক", "তারিখ ও সময়", "অবস্থা"].map((h, i) => (
                  <th key={h} className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide ${i >= 2 ? "hidden md:table-cell" : ""} ${i === 3 ? "hidden sm:table-cell" : ""}`}
                    style={{ color: "#64748b" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((apt, idx) => {
                const cfg = STATUS_CONFIG[apt.status] || { bg: "#f8fafc", color: "#64748b", dot: "#94a3b8", label: apt.status };
                return (
                  <tr key={apt.id}
                    style={{ borderTop: "1px solid #f1f5f9" }}
                    className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-3.5">
                      <span className="text-xs font-mono font-medium px-2 py-1 rounded-lg"
                        style={{ background: "#f1f5f9", color: "#475569" }}>
                        {apt.requestId}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{apt.patientName}</p>
                    </td>
                    <td className="px-6 py-3.5 hidden md:table-cell">
                      <p className="text-sm" style={{ color: "#475569" }}>{apt.doctor?.nameBn || "—"}</p>
                    </td>
                    <td className="px-6 py-3.5 hidden sm:table-cell">
                      <p className="text-xs font-medium" style={{ color: "#475569" }}>
                        {new Date(apt.preferredDate).toLocaleDateString("bn-BD")}
                      </p>
                      <p className="text-xs" style={{ color: "#94a3b8" }}>{apt.preferredTime}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: cfg.bg, color: cfg.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
