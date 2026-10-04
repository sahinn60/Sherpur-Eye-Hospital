"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText, Printer, Copy, Eye, Download, AlertCircle,
  ChevronLeft, ChevronRight, Clock, User,
  Pill, Stethoscope,
} from "lucide-react";
import { Prescription } from "@/types/patient";
import {
  fetchPatientPrescriptions,
} from "@/lib/services/patientService";
import { createRx } from "@/lib/services/prescriptionService";
import { Button, Modal } from "@/components/ui";
import { useRouter } from "next/navigation";

interface Props {
  patientId: string;
  patientName: string;
  patientIdCode: string;
  age: number | null;
  gender: string;
  phone: string;
  canWrite: boolean;
  initialCount?: number;
}

function fmt(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}
function fmtEn(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Prescription Detail Modal ────────────────────────────────────────────────

function RxDetailModal({ rx, onClose, onPrint }: {
  rx: Prescription;
  onClose: () => void;
  onPrint: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
              {(rx as any).rxNo ? `Rx# ${(rx as any).rxNo}` : `#${rx.id.slice(-8).toUpperCase()}`}
            </span>
            <span className="text-xs text-gray-400">{fmtEn(rx.createdAt)}</span>
          </div>
          {rx.doctor && (
            <p className="text-sm text-gray-600 mt-1">
              ডা. <span className="font-medium text-gray-800">{rx.doctor.nameBn}</span>
              {rx.doctor.designationBn && <span className="text-gray-400"> — {rx.doctor.designationBn}</span>}
            </p>
          )}
        </div>
        <Button size="sm" onClick={onPrint} className="flex items-center gap-1.5 shrink-0">
          <Printer size={13} /> প্রিন্ট
        </Button>
      </div>

      {/* Diagnosis */}
      {rx.diagnosis && (
        <div className="bg-blue-50 rounded-lg px-4 py-2.5">
          <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-0.5">Diagnosis</p>
          <p className="text-sm font-medium text-blue-900">{rx.diagnosis}</p>
        </div>
      )}

      {/* Eye exam */}
      {((rx as any).vaRightEye || (rx as any).vaLeftEye || (rx as any).iopRightEye || (rx as any).iopLeftEye) && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Eye Examination</p>
          <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left text-gray-500 font-medium">Eye</th>
                <th className="px-3 py-2 text-center text-gray-500 font-medium">VA</th>
                <th className="px-3 py-2 text-center text-gray-500 font-medium">IOP</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100">
                <td className="px-3 py-2 font-semibold text-gray-700">OD (R)</td>
                <td className="px-3 py-2 text-center text-gray-600">{(rx as any).vaRightEye || "—"}</td>
                <td className="px-3 py-2 text-center text-gray-600">{(rx as any).iopRightEye || "—"}</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="px-3 py-2 font-semibold text-gray-700">OS (L)</td>
                <td className="px-3 py-2 text-center text-gray-600">{(rx as any).vaLeftEye || "—"}</td>
                <td className="px-3 py-2 text-center text-gray-600">{(rx as any).iopLeftEye || "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Medicines */}
      {rx.items.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            ওষুধ ({rx.items.length}টি)
          </p>
          <div className="space-y-2">
            {rx.items.map((item, i) => (
              <div key={item.id || i} className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-400 font-mono w-5 shrink-0 pt-0.5">{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-900">{item.medicineName}</span>
                  {item.dose && <span className="text-xs text-gray-500 ml-1.5">{item.dose}</span>}
                  {(item.frequency || item.duration) && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.frequency}{item.duration ? ` × ${item.duration}` : ""}
                      {item.instructions ? ` (${item.instructions})` : ""}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advice */}
      {((rx as any).advice || rx.instructions) && (
        <div className="bg-amber-50 rounded-lg px-4 py-2.5 border border-amber-100">
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Advice</p>
          <p className="text-sm text-gray-700 whitespace-pre-line">{(rx as any).advice || rx.instructions}</p>
        </div>
      )}

      {/* Follow-up */}
      {rx.followUpDate && (
        <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-4 py-2.5 border border-emerald-100">
          <Clock size={14} className="text-emerald-500 shrink-0" />
          <div>
            <span className="text-xs text-emerald-600 font-semibold">ফলো-আপ: </span>
            <span className="text-sm font-medium text-emerald-800">{fmtEn(rx.followUpDate)}</span>
            {rx.followUpNote && <span className="text-xs text-emerald-600 ml-1">— {rx.followUpNote}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Copy Confirm Modal ───────────────────────────────────────────────────────

function CopyConfirmModal({ rx, patientId, onDone, onClose }: {
  rx: Prescription;
  patientId: string;
  onDone: (newRxId: string) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleCopy() {
    setSaving(true);
    setError("");
    try {
      const saved = await createRx({
        patientId,
        doctorId: rx.doctor?.id || undefined,
        chiefComplaint: (rx as any).chiefComplaint || undefined,
        history: (rx as any).history || undefined,
        vaRightEye: (rx as any).vaRightEye || undefined,
        vaLeftEye: (rx as any).vaLeftEye || undefined,
        iopRightEye: (rx as any).iopRightEye || undefined,
        iopLeftEye: (rx as any).iopLeftEye || undefined,
        refractionRE: (rx as any).refractionRE || undefined,
        refractionLE: (rx as any).refractionLE || undefined,
        diagnosis: rx.diagnosis || undefined,
        investigations: (rx as any).investigations || undefined,
        advice: (rx as any).advice || undefined,
        instructions: rx.instructions || undefined,
        followUpNote: rx.followUpNote || undefined,
        items: rx.items.map((item, i) => ({
          medicineName: item.medicineName,
          strength:     (item as any).strength     || undefined,
          dosageForm:   (item as any).dosageForm   || undefined,
          route:        (item as any).route        || undefined,
          eye:          (item as any).eye          || undefined,
          dose:         item.dose         || undefined,
          frequency:    item.frequency    || undefined,
          duration:     item.duration     || undefined,
          instructions: item.instructions || undefined,
          sortOrder: i,
        })),
      });
      onDone((saved as any).id);
    } catch {
      setError("কপি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-3">
        <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          এই প্রেসক্রিপশনটি <strong>নতুন</strong> হিসেবে কপি হবে। পুরনো প্রেসক্রিপশন অপরিবর্তিত থাকবে।
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
        {rx.diagnosis && <p><span className="text-gray-400">Diagnosis: </span>{rx.diagnosis}</p>}
        <p><span className="text-gray-400">ওষুধ: </span>{rx.items.length}টি</p>
        {rx.doctor && <p><span className="text-gray-400">মূল চিকিৎসক: </span>{rx.doctor.nameBn}</p>}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button size="sm" variant="secondary" onClick={onClose}>বাতিল</Button>
        <Button size="sm" loading={saving} onClick={handleCopy} className="flex items-center gap-1.5">
          <Copy size={13} /> নতুন কপি তৈরি করুন
        </Button>
      </div>
    </div>
  );
}

// ─── Prescription Card ────────────────────────────────────────────────────────

function RxCard({ rx, patientId, patientName, patientIdCode, age, gender, phone, onCopied }: {
  rx: Prescription;
  patientId: string;
  patientName: string;
  patientIdCode: string;
  age: number | null;
  gender: string;
  phone: string;
  onCopied: () => void;
}) {
  const router = useRouter();
  const [modal, setModal] = useState<"view" | "copy" | null>(null);

  const rxLabel = (rx as any).rxNo ? `Rx# ${(rx as any).rxNo}` : `#${rx.id.slice(-8).toUpperCase()}`;

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">
                {rxLabel}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={11} /> {fmt(rx.createdAt)}
              </span>
              {(rx as any).status === "FINALIZED" && (
                <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded">✓ Final</span>
              )}
              {(rx as any).status === "DRAFT" && (
                <span className="text-xs bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded">Draft</span>
              )}
            </div>
            {rx.doctor && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <User size={11} />
                ডা. <span className="font-medium text-gray-700">{rx.doctor.nameBn}</span>
                {rx.doctor.designationBn && <span className="text-gray-400">— {rx.doctor.designationBn}</span>}
              </p>
            )}
          </div>
          {rx.followUpDate && (
            <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
              <Clock size={10} /> {fmtEn(rx.followUpDate)}
            </span>
          )}
        </div>

        {/* Diagnosis */}
        {rx.diagnosis && (
          <div className="bg-blue-50 rounded-lg px-3 py-1.5 mb-3">
            <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-0.5">Diagnosis</p>
            <p className="text-sm font-medium text-blue-900 line-clamp-2">{rx.diagnosis}</p>
          </div>
        )}

        {/* Medicine pills */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Pill size={11} /> {rx.items.length}টি ওষুধ
          </span>
          {rx.items.slice(0, 3).map((item, i) => (
            <span key={item.id || i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {item.medicineName}
            </span>
          ))}
          {rx.items.length > 3 && (
            <span className="text-xs text-gray-400">+{rx.items.length - 3} আরো</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100">
          <button
            onClick={() => setModal("view")}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Eye size={13} /> দেখুন
          </button>
          <button
            onClick={() => router.push(`/dashboard/prescriptions/${rx.id}/preview`)}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-800 font-medium px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Printer size={13} /> প্রিন্ট
          </button>
          <button
            onClick={() => router.push(`/dashboard/prescriptions/${rx.id}/preview`)}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-800 font-medium px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Download size={13} /> PDF
          </button>
          <button
            onClick={() => setModal("copy")}
            className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-800 font-medium px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors ml-auto"
          >
            <Copy size={13} /> নতুন কপি
          </button>
        </div>
      </div>

      {/* View modal */}
      {modal === "view" && (
        <Modal open onClose={() => setModal(null)} title="প্রেসক্রিপশন বিবরণ" size="lg">
          <RxDetailModal
            rx={rx}
            onClose={() => setModal(null)}
            onPrint={() => router.push(`/dashboard/prescriptions/${rx.id}/preview`)}
          />
        </Modal>
      )}

      {/* Copy modal */}
      {modal === "copy" && (
        <Modal open onClose={() => setModal(null)} title="নতুন প্রেসক্রিপশন কপি" size="sm">
          <CopyConfirmModal
            rx={rx}
            patientId={patientId}
            onDone={(newRxId) => { setModal(null); onCopied(); router.push(`/dashboard/prescriptions/${newRxId}/preview`); }}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PatientPrescriptionHistory({
  patientId, patientName, patientIdCode, age, gender, phone, canWrite, initialCount = 0,
}: Props) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [total,         setTotal]         = useState(initialCount);
  const [totalPages,    setTotalPages]    = useState(1);
  const [page,          setPage]          = useState(1);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [copySuccess,   setCopySuccess]   = useState(false);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchPatientPrescriptions(patientId, p, 10);
      setPrescriptions(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setPage(p);
    } catch {
      setError("প্রেসক্রিপশন লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => { load(1); }, [load]);

  function handleCopied() {
    setCopySuccess(true);
    load(1);
    setTimeout(() => setCopySuccess(false), 3000);
  }

  // ── Loading skeleton
  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  // ── Error state
  if (error) return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <AlertCircle size={32} className="text-red-300" />
      <p className="text-sm text-red-500">{error}</p>
      <Button size="sm" variant="secondary" onClick={() => load(1)}>আবার চেষ্টা করুন</Button>
    </div>
  );

  // ── Empty state
  if (prescriptions.length === 0) return (
    <div className="flex flex-col items-center justify-center py-14 gap-3 text-gray-400">
      <FileText size={36} className="opacity-30" />
      <p className="text-sm">কোনো প্রেসক্রিপশন নেই</p>
      <p className="text-xs text-gray-300">এই রোগীর জন্য এখনো কোনো প্রেসক্রিপশন লেখা হয়নি</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <Stethoscope size={13} />
          মোট <span className="font-semibold text-gray-700">{total}টি</span> প্রেসক্রিপশন
        </p>
        {copySuccess && (
          <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
            ✓ নতুন প্রেসক্রিপশন তৈরি হয়েছে
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {prescriptions.map((rx) => (
          <RxCard
            key={rx.id}
            rx={rx}
            patientId={patientId}
            patientName={patientName}
            patientIdCode={patientIdCode}
            age={age}
            gender={gender}
            phone={phone}
            onCopied={handleCopied}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-400">{page}/{totalPages} পাতা</p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => load(page - 1)}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} className="text-gray-600" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => load(page + 1)}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
