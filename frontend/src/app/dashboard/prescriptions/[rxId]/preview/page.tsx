"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Printer, Download, X } from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { fetchRx, Prescription } from "@/lib/services/prescriptionService";
import { fetchHospitalRxSettings, HospitalRxSettings } from "@/lib/services/adminPrescriptionService";
import { buildRxHTML } from "@/components/clinic/rxPrintBuilder";

export default function RxPreviewPage() {
  const { rxId } = useParams<{ rxId: string }>();
  const router = useRouter();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [rx,       setRx]       = useState<Prescription | null>(null);
  const [hospital, setHospital] = useState<HospitalRxSettings>({});
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    Promise.all([fetchRx(rxId), fetchHospitalRxSettings()])
      .then(([rxData, hosp]) => {
        setRx(rxData);
        setHospital(hosp);
      })
      .catch(() => setError("Failed to load prescription."))
      .finally(() => setLoading(false));
  }, [rxId]);

  const isFinalized = rx?.status === "FINALIZED";
  const effectiveSettings =
    isFinalized && rx?.doctorSnapshot ? rx.doctorSnapshot : (rx?.doctor?.prescriptionSettings ?? {});

  const html = !loading && rx ? buildRxHTML(rx, effectiveSettings, hospital, isFinalized) : "";

  // Inject into iframe
  useEffect(() => {
    if (!html || !iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
  }, [html]);

  function openPrintWindow() {
    if (!html) return;
    const win = window.open("", "_blank", "width=900,height=1200");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 600);
  }

  function downloadPDF() {
    // Opens print dialog in a new window — user selects "Save as PDF"
    openPrintWindow();
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !rx) return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
      <p className="text-red-500 text-sm">{error || "Prescription not found."}</p>
      <button onClick={() => router.back()} className="text-sm text-blue-600 hover:underline">Go back</button>
    </div>
  );

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTION"]}>
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 mb-4 flex-wrap no-print">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {/* Status badge */}
          {rx.status === "DRAFT" && (
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
              DRAFT
            </span>
          )}
          {rx.status === "FINALIZED" && (
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
              ✓ Finalized
            </span>
          )}
          {rx.rxNo && (
            <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
              Rx# {rx.rxNo}
            </span>
          )}

          {/* Edit */}
          <button
            onClick={() => router.push(`/dashboard/prescriptions/${rxId}`)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <Pencil size={14} /> Edit
          </button>

          {/* Print */}
          <button
            onClick={openPrintWindow}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <Printer size={14} /> Print
          </button>

          {/* Download PDF */}
          <button
            onClick={downloadPDF}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
          >
            <Download size={14} /> Download PDF
          </button>

          {/* Close — goes to prescriptions list */}
          <button
            onClick={() => router.push("/dashboard/prescriptions")}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-700 transition-all shadow-sm"
          >
            <X size={14} /> Close
          </button>
        </div>
      </div>

      {/* ── Preview frame ── */}
      <div
        className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-gray-100 no-print"
        style={{ height: "calc(100vh - 140px)" }}
      >
        <iframe
          ref={iframeRef}
          title="Prescription Preview"
          className="w-full h-full border-0 bg-white"
        />
      </div>

      {/* ── Print hint ── */}
      <p className="text-xs text-gray-400 text-center mt-3 no-print">
        Click <strong>Download PDF</strong> → in the print dialog, choose <em>Save as PDF</em> as the destination.
      </p>
    </RouteGuard>
  );
}
