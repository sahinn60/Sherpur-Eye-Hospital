"use client";

import { useRef } from "react";
import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui";
import type { Prescription, DoctorPrescriptionSettings, SpectacleData } from "@/lib/services/prescriptionService";

const GENDER_BN: Record<string, string> = { MALE: "পুরুষ", FEMALE: "মহিলা", OTHER: "অন্যান্য" };

function fmtDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
}

interface Props {
  rx: Partial<Prescription>;
  settings: Partial<DoctorPrescriptionSettings> | null;
  isFinalized?: boolean;
  onClose?: () => void;
}

export function RxPrintPreview({ rx, settings, isFinalized, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const effectiveSettings: Partial<DoctorPrescriptionSettings> =
    (isFinalized && rx.doctorSnapshot) ? rx.doctorSnapshot : (settings || {});

  const showSig = isFinalized && effectiveSettings.signatureMode === "uploaded" && effectiveSettings.signatureUrl;
  const showSigLine = effectiveSettings.signatureMode === "handwritten" || !isFinalized;

  function handlePrint() {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank", "width=900,height=1100");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8"/>
      <title>প্রেসক্রিপশন ${rx.rxNo || ""}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Arial,sans-serif;font-size:12px;color:#111;background:#fff}
        .page{width:210mm;min-height:297mm;padding:12mm 14mm 18mm;margin:0 auto;position:relative}
        .header{border-bottom:2.5px solid #1d4ed8;padding-bottom:10px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:flex-start}
        .hosp-name{font-size:17px;font-weight:700;color:#1d4ed8}
        .hosp-sub{font-size:10px;color:#555;margin-top:2px}
        .dr-name{font-size:13px;font-weight:700;color:#111;text-align:right}
        .dr-sub{font-size:10px;color:#555;text-align:right}
        .patient-bar{background:#eff6ff;border:1px solid #bfdbfe;border-radius:5px;padding:7px 12px;margin-bottom:12px;display:flex;gap:20px;flex-wrap:wrap}
        .patient-bar span{font-size:11px;color:#1e40af}
        .patient-bar strong{color:#111}
        .draft-stamp{position:absolute;top:40mm;left:50%;transform:translateX(-50%) rotate(-30deg);font-size:60px;font-weight:900;color:rgba(239,68,68,0.12);pointer-events:none;white-space:nowrap;z-index:0}
        .sec-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin-bottom:5px;margin-top:12px}
        .diag-box{background:#fefce8;border-left:3px solid #eab308;padding:7px 10px;border-radius:3px;font-size:12px}
        .rx-sym{font-size:26px;font-weight:900;color:#1d4ed8;float:left;margin-right:8px;line-height:1}
        table{width:100%;border-collapse:collapse;margin-top:5px}
        th{background:#1d4ed8;color:#fff;font-size:10px;padding:5px 8px;text-align:left}
        td{padding:6px 8px;font-size:11px;border-bottom:1px solid #e5e7eb;vertical-align:top}
        tr:nth-child(even) td{background:#f9fafb}
        .spec-table th{background:#0f766e}
        .advice-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:3px;padding:7px 10px;font-size:11px;margin-top:5px}
        .followup{margin-top:12px;font-size:11px;color:#059669;font-weight:600}
        .footer{margin-top:24px;border-top:1px solid #e5e7eb;padding-top:10px;display:flex;justify-content:space-between;align-items:flex-end}
        .sig-block{text-align:center}
        .sig-line{border-top:1px solid #111;width:150px;padding-top:3px;font-size:10px;color:#555;margin:0 auto}
        .page-num{font-size:9px;color:#9ca3af;text-align:center;margin-top:8px}
        @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
      </style>
    </head><body><div class="page">${content}</div></body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  }

  const spectacle = rx.spectacleData as SpectacleData | null | undefined;

  return (
    <div className="flex flex-col h-full">
      {onClose !== undefined && (
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            {rx.status === "DRAFT" && (
              <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">DRAFT</span>
            )}
            {rx.status === "FINALIZED" && (
              <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">চূড়ান্ত</span>
            )}
            <span className="text-xs text-gray-500">{rx.rxNo}</span>
          </div>
          <Button size="sm" onClick={handlePrint} className="flex items-center gap-1.5">
            <Printer size={13} /> প্রিন্ট
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-auto border border-gray-200 rounded-xl bg-white">
        <div ref={printRef} className="p-6 text-xs font-sans" style={{ minWidth: 500 }}>

          {/* Draft watermark */}
          {rx.status !== "FINALIZED" && (
            <div className="draft-stamp" style={{
              position: "absolute", top: "40%", left: "50%",
              transform: "translateX(-50%) rotate(-30deg)",
              fontSize: 60, fontWeight: 900, color: "rgba(239,68,68,0.10)",
              pointerEvents: "none", whiteSpace: "nowrap", zIndex: 0,
            }}>DRAFT</div>
          )}

          {/* Header */}
          {effectiveSettings.showHeader !== false && (
            <div className="flex justify-between items-start border-b-2 border-blue-700 pb-3 mb-4">
              <div>
                <p className="text-base font-bold text-blue-700">{effectiveSettings.chamberName || "হাসপাতালের নাম"}</p>
                {effectiveSettings.chamberAddress && <p className="text-[10px] text-gray-500">{effectiveSettings.chamberAddress}</p>}
                {effectiveSettings.chamberPhone && <p className="text-[10px] text-gray-500">📞 {effectiveSettings.chamberPhone}</p>}
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-sm">{effectiveSettings.nameBn || "ডা. [নাম]"}</p>
                {effectiveSettings.qualificationBn && <p className="text-[10px] text-gray-500">{effectiveSettings.qualificationBn}</p>}
                {effectiveSettings.designationBn && <p className="text-[10px] text-gray-500">{effectiveSettings.designationBn}</p>}
                {effectiveSettings.bmdcNo && <p className="text-[10px] text-gray-400">BMDC: {effectiveSettings.bmdcNo}</p>}
                <p className="text-[10px] text-gray-400">তারিখ: {fmtDate(rx.createdAt || new Date().toISOString())}</p>
                {rx.rxNo && <p className="text-[10px] text-gray-400">Rx: {rx.rxNo}</p>}
              </div>
            </div>
          )}

          {/* Patient bar */}
          {rx.patient && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-4 flex flex-wrap gap-3 text-[11px]">
              <span><strong>রোগী:</strong> {rx.patient.nameBn}</span>
              <span><strong>আইডি:</strong> {rx.patient.patientId}</span>
              {rx.patient.age && <span><strong>বয়স:</strong> {rx.patient.age} বছর</span>}
              <span><strong>লিঙ্গ:</strong> {GENDER_BN[rx.patient.gender] || rx.patient.gender}</span>
              <span><strong>ফোন:</strong> {rx.patient.phone}</span>
              {rx.visit?.visitDate && <span><strong>ভিজিট:</strong> {fmtDate(rx.visit.visitDate)}</span>}
            </div>
          )}

          {/* Clinical sections */}
          {rx.rxType !== "spectacle" && (
            <>
              {rx.chiefComplaint && (
                <><p className="sec-title text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 mt-3">প্রধান অভিযোগ</p>
                <p className="text-gray-700">{rx.chiefComplaint}</p></>
              )}
              {rx.history && (
                <><p className="sec-title text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 mt-3">ইতিহাস</p>
                <p className="text-gray-700">{rx.history}</p></>
              )}
              {rx.allergies && (
                <><p className="sec-title text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 mt-3">অ্যালার্জি</p>
                <p className="text-red-700 font-medium">{rx.allergies}</p></>
              )}

              {/* Eye Examination */}
              {(rx.vaRightEye || rx.vaLeftEye || rx.iopRightEye || rx.iopLeftEye || rx.refractionRE || rx.refractionLE || rx.examNotes) && (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 mt-3">চোখের পরীক্ষা</p>
                  <table className="w-full border-collapse text-[11px] mb-2">
                    <thead>
                      <tr className="bg-blue-700 text-white">
                        <th className="px-2 py-1 text-left">পরীক্ষা</th>
                        <th className="px-2 py-1 text-left">ডান চোখ (RE)</th>
                        <th className="px-2 py-1 text-left">বাম চোখ (LE)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(rx.vaRightEye || rx.vaLeftEye) && (
                        <tr><td className="px-2 py-1 text-gray-600">দৃষ্টিশক্তি (VA)</td>
                          <td className="px-2 py-1">{rx.vaRightEye || "—"}</td>
                          <td className="px-2 py-1">{rx.vaLeftEye || "—"}</td></tr>
                      )}
                      {(rx.refractionRE || rx.refractionLE) && (
                        <tr className="bg-gray-50"><td className="px-2 py-1 text-gray-600">রিফ্র্যাকশন</td>
                          <td className="px-2 py-1">{rx.refractionRE || "—"}</td>
                          <td className="px-2 py-1">{rx.refractionLE || "—"}</td></tr>
                      )}
                      {(rx.iopRightEye || rx.iopLeftEye) && (
                        <tr><td className="px-2 py-1 text-gray-600">চোখের চাপ (IOP)</td>
                          <td className="px-2 py-1">{rx.iopRightEye || "—"}</td>
                          <td className="px-2 py-1">{rx.iopLeftEye || "—"}</td></tr>
                      )}
                    </tbody>
                  </table>
                  {rx.examNotes && <p className="text-gray-600 text-[11px]">{rx.examNotes}</p>}
                </>
              )}

              {/* Diagnosis */}
              {rx.diagnosis && (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 mt-3">রোগ নির্ণয়</p>
                  <div className="bg-yellow-50 border-l-3 border-yellow-400 px-3 py-2 rounded text-sm font-medium" style={{ borderLeft: "3px solid #eab308" }}>
                    {rx.diagnosis}
                  </div>
                </>
              )}

              {rx.investigations && (
                <><p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 mt-3">পরীক্ষা-নিরীক্ষা</p>
                <p className="text-gray-700">{rx.investigations}</p></>
              )}

              {/* Medicines */}
              {rx.items && rx.items.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mt-3 mb-1">
                    <span className="text-2xl font-black text-blue-700 leading-none">℞</span>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">ওষুধ</p>
                  </div>
                  <table className="w-full border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-blue-700 text-white">
                        {["#","ওষুধ","শক্তি","চোখ","মাত্রা","সময়","মেয়াদ","নির্দেশনা"].map((h) => (
                          <th key={h} className="px-2 py-1.5 text-left font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rx.items.map((item, i) => (
                        <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                          <td className="px-2 py-1.5 text-gray-400">{i + 1}</td>
                          <td className="px-2 py-1.5 font-semibold text-gray-900">{item.medicineName}</td>
                          <td className="px-2 py-1.5 text-gray-600">{item.strength || "—"}</td>
                          <td className="px-2 py-1.5 text-gray-600">{item.eye || "—"}</td>
                          <td className="px-2 py-1.5 text-gray-600">{item.dose || "—"}</td>
                          <td className="px-2 py-1.5 text-gray-600">{item.frequency || "—"}</td>
                          <td className="px-2 py-1.5 text-gray-600">{item.duration || "—"}</td>
                          <td className="px-2 py-1.5 text-gray-500">{item.instructions || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {rx.advice && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <p className="font-semibold text-green-700 text-[10px] mb-1">পরামর্শ</p>
                  <p className="text-gray-700 whitespace-pre-line">{rx.advice}</p>
                </div>
              )}
              {rx.instructions && (
                <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <p className="font-semibold text-blue-700 text-[10px] mb-1">সাধারণ নির্দেশনা</p>
                  <p className="text-gray-700 whitespace-pre-line">{rx.instructions}</p>
                </div>
              )}
            </>
          )}

          {/* Spectacle prescription */}
          {rx.rxType === "spectacle" && spectacle && (
            <>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 mt-3">চশমার প্রেসক্রিপশন</p>
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr style={{ background: "#0f766e", color: "#fff" }}>
                    {["চোখ","SPH","CYL","AXIS","ADD","PD"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 font-semibold">ডান চোখ (RE)</td>
                    <td className="px-3 py-2">{spectacle.RE?.sph || "—"}</td>
                    <td className="px-3 py-2">{spectacle.RE?.cyl || "—"}</td>
                    <td className="px-3 py-2">{spectacle.RE?.axis || "—"}</td>
                    <td className="px-3 py-2">{spectacle.RE?.add || "—"}</td>
                    <td className="px-3 py-2">{spectacle.RE?.pd || "—"}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-3 py-2 font-semibold">বাম চোখ (LE)</td>
                    <td className="px-3 py-2">{spectacle.LE?.sph || "—"}</td>
                    <td className="px-3 py-2">{spectacle.LE?.cyl || "—"}</td>
                    <td className="px-3 py-2">{spectacle.LE?.axis || "—"}</td>
                    <td className="px-3 py-2">{spectacle.LE?.add || "—"}</td>
                    <td className="px-3 py-2">{spectacle.LE?.pd || "—"}</td>
                  </tr>
                </tbody>
              </table>
              {spectacle.lensAdvice && <p className="mt-2 text-gray-700"><strong>লেন্স পরামর্শ:</strong> {spectacle.lensAdvice}</p>}
              {spectacle.notes && <p className="mt-1 text-gray-600">{spectacle.notes}</p>}
            </>
          )}

          {/* Follow-up */}
          {rx.followUpDate && (
            <p className="mt-3 text-sm font-semibold text-emerald-700">
              📅 পরবর্তী ভিজিট: {fmtDate(rx.followUpDate)}
              {rx.followUpNote && <span className="font-normal text-gray-600 ml-2">— {rx.followUpNote}</span>}
            </p>
          )}

          {/* Footer */}
          {effectiveSettings.showFooter !== false && (
            <div className="mt-8 pt-3 border-t border-gray-200 flex justify-between items-end">
              <p className="text-[10px] text-gray-400">তারিখ: {fmtDate(rx.createdAt || new Date().toISOString())}</p>
              <div className="text-center">
                {showSig && effectiveSettings.signatureUrl && (
                  <div className="mb-1 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={effectiveSettings.signatureUrl} alt="স্বাক্ষর"
                      style={{ maxWidth: 130, maxHeight: 55, objectFit: "contain" }} />
                  </div>
                )}
                {showSigLine && !showSig && (
                  <div className="border-t border-gray-800 w-40 mb-1 mx-auto" />
                )}
                <p className="text-xs font-semibold">{effectiveSettings.nameBn || "ডা. [নাম]"}</p>
                {effectiveSettings.qualificationBn && <p className="text-[10px] text-gray-500">{effectiveSettings.qualificationBn}</p>}
                {effectiveSettings.specialtyBn && <p className="text-[10px] text-gray-500">{effectiveSettings.specialtyBn}</p>}
                {effectiveSettings.bmdcNo && <p className="text-[10px] text-gray-400">BMDC: {effectiveSettings.bmdcNo}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
