"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Printer } from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { fetchRx } from "@/lib/services/prescriptionService";
import type { Prescription } from "@/lib/services/prescriptionService";

export default function PrescriptionViewEditor({ rxId }: { rxId?: string }) {
  const router = useRouter();
  const [rx, setRx] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rxId) return;
    fetchRx(rxId)
      .then(setRx)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [rxId]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!rx) return (
    <div className="text-center py-20 text-gray-400">প্রেসক্রিপশন পাওয়া যায়নি</div>
  );

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTION"]}>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft size={16} /> ফিরে যান
          </button>
          <div className="flex items-center gap-2 ml-auto">
            {rx.status === "DRAFT" && (
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">DRAFT</span>
            )}
            {rx.status === "FINALIZED" && (
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">✓ Finalized</span>
            )}
            <button
              onClick={() => router.push(`/dashboard/prescriptions/${rxId}/preview`)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
            >
              <Printer size={14} /> Preview &amp; Print
            </button>
          </div>
        </div>

        {/* Summary card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">{rx.patient?.nameBn}</p>
              <p className="text-sm text-gray-500">{rx.patient?.patientId} · {rx.patient?.phone}</p>
            </div>
            <div className="text-right text-xs text-gray-400">
              <p>{new Date(rx.createdAt).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })}</p>
              {rx.rxNo && <p className="font-mono">Rx# {rx.rxNo}</p>}
            </div>
          </div>

          {rx.doctor && (
            <p className="text-sm text-gray-600">চিকিৎসক: <span className="font-medium">{rx.doctor.nameBn}</span> — {rx.doctor.designationBn}</p>
          )}

          {rx.diagnosis && (
            <div className="bg-blue-50 rounded-lg px-4 py-2">
              <p className="text-xs text-blue-500 font-semibold uppercase mb-0.5">Diagnosis</p>
              <p className="text-sm text-blue-900 font-medium">{rx.diagnosis}</p>
            </div>
          )}

          {rx.items.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">ওষুধ ({rx.items.length}টি)</p>
              <div className="space-y-1.5">
                {rx.items.map((item, i) => (
                  <div key={item.id} className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400 font-mono w-5 shrink-0">{i + 1}.</span>
                    <div>
                      <span className="font-semibold text-gray-900">{item.medicineName}</span>
                      {item.strength && <span className="text-gray-500 ml-1 text-xs">{item.strength}</span>}
                      {item.dose && <span className="text-gray-500 ml-1">{item.dose}</span>}
                      {(item.frequency || item.duration) && (
                        <span className="text-gray-400 ml-2 text-xs">{item.frequency}{item.duration ? ` × ${item.duration}` : ""}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rx.followUpDate && (
            <p className="text-sm text-emerald-600">
              ফলো-আপ: {new Date(rx.followUpDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              {rx.followUpNote && ` — ${rx.followUpNote}`}
            </p>
          )}

          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => router.push(`/dashboard/prescriptions/${rxId}/preview`)}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <Eye size={14} /> Full Preview / Print / Download PDF
            </button>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
