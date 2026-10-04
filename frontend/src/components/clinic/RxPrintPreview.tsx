"use client";

import { useRef, useEffect, useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui";
import type { Prescription, DoctorPrescriptionSettings } from "@/lib/services/prescriptionService";
import { fetchHospitalRxSettings, HospitalRxSettings } from "@/lib/services/adminPrescriptionService";
import { buildRxHTML } from "./rxPrintBuilder";

interface Props {
  rx: Partial<Prescription>;
  settings: Partial<DoctorPrescriptionSettings> | null;
  isFinalized?: boolean;
  onClose?: () => void;
}

export function RxPrintPreview({ rx, settings, isFinalized, onClose }: Props) {
  const previewRef = useRef<HTMLIFrameElement>(null);
  const [hospital, setHospital] = useState<HospitalRxSettings>({});
  const [loading,  setLoading]  = useState(true);

  const effectiveSettings: Partial<DoctorPrescriptionSettings> =
    (isFinalized && rx.doctorSnapshot) ? rx.doctorSnapshot : (settings || {});

  useEffect(() => {
    fetchHospitalRxSettings()
      .then(setHospital)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const html = loading ? "" : buildRxHTML(rx, effectiveSettings, hospital, isFinalized);

  useEffect(() => {
    if (!html || !previewRef.current) return;
    const doc = previewRef.current.contentDocument;
    if (!doc) return;
    doc.open(); doc.write(html); doc.close();
  }, [html]);

  function handlePrint() {
    if (!html) return;
    const win = window.open("", "_blank", "width=900,height=1200");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 600);
  }

  return (
    <div className="flex flex-col gap-3" style={{ height: "82vh" }}>
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {rx.status === "DRAFT" && (
            <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">DRAFT</span>
          )}
          {rx.status === "FINALIZED" && (
            <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Finalized</span>
          )}
          {rx.rxNo && <span className="text-xs font-mono text-gray-400">{rx.rxNo}</span>}
        </div>
        <Button onClick={handlePrint} disabled={loading} className="flex items-center gap-2">
          <Printer size={14} /> Print / Save PDF
        </Button>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <iframe ref={previewRef} title="Rx Preview" className="w-full h-full border-0 bg-white" />
        )}
      </div>

      <p className="text-xs text-gray-400 text-center shrink-0">
        Click "Print / Save PDF" → choose "Save as PDF" in the print dialog.
      </p>
    </div>
  );
}
