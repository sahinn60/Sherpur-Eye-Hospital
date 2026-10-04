"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, Eye } from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { Button, Modal } from "@/components/ui";
import { PrescriptionPrint } from "@/components/clinic";
import { fetchClinicPrescription } from "@/lib/services/clinicService";
import { ClinicPrescription } from "@/types/clinic";

export default function PrescriptionViewEditor({ rxId }: { rxId?: string }) {
  const router = useRouter();
  const [rx, setRx] = useState<ClinicPrescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPrint, setShowPrint] = useState(false);

  useEffect(() => {
    if (!rxId) return;
    fetchClinicPrescription(rxId)
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
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft size={16} /> ফিরে যান
          </button>
          <button onClick={() => router.push(`/dashboard/prescriptions/${rxId}/preview`)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
            <Eye size={14} /> Preview
          </button>
          <Button onClick={() => setShowPrint(true)} className="flex items-center gap-2">
            <Printer size={14} /> প্রিন্ট করুন
          </Button>
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
              {(rx as any).rxNo && <p className="font-mono">Rx# {(rx as any).rxNo}</p>}
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
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">ওষুধ</p>
              <div className="space-y-1.5">
                {rx.items.map((item, i) => (
                  <div key={item.id} className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400 font-mono w-5 shrink-0">{i + 1}.</span>
                    <div>
                      <span className="font-semibold text-gray-900">{item.medicineName}</span>
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
        </div>
      </div>

      {showPrint && (
        <Modal open onClose={() => setShowPrint(false)} title="প্রেসক্রিপশন প্রিন্ট" size="xl">
          <PrescriptionPrint rx={rx} onClose={() => setShowPrint(false)} />
        </Modal>
      )}
    </RouteGuard>
  );
}
