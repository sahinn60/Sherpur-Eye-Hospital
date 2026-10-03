"use client";

import { useRef } from "react";
import { Printer, X } from "lucide-react";
import { ClinicPrescription } from "@/types/clinic";
import { GENDER_BN } from "@/types/patient";
import { Button } from "@/components/ui";

interface Props {
  rx:      ClinicPrescription;
  onClose: () => void;
}

function fmt(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
}

export function PrescriptionPrint({ rx, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>প্রেসক্রিপশন - ${rx.patient?.nameBn}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'SolaimanLipi', 'Kalpurush', Arial, sans-serif; font-size: 13px; color: #111; background: #fff; }
          .page { width: 210mm; min-height: 297mm; padding: 15mm 15mm 20mm; margin: 0 auto; }
          .header { border-bottom: 2px solid #1d4ed8; padding-bottom: 12px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: flex-start; }
          .hospital-name { font-size: 18px; font-weight: 700; color: #1d4ed8; }
          .hospital-sub  { font-size: 11px; color: #555; margin-top: 2px; }
          .doctor-info   { text-align: right; }
          .doctor-name   { font-size: 14px; font-weight: 700; color: #111; }
          .doctor-qual   { font-size: 11px; color: #555; }
          .patient-bar   { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 8px 12px; margin-bottom: 14px; display: flex; gap: 24px; flex-wrap: wrap; }
          .patient-bar span { font-size: 12px; color: #1e40af; }
          .patient-bar strong { color: #111; }
          .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 6px; margin-top: 14px; }
          .diagnosis-box { background: #fefce8; border-left: 3px solid #eab308; padding: 8px 12px; border-radius: 4px; font-size: 13px; }
          .rx-symbol { font-size: 28px; font-weight: 900; color: #1d4ed8; float: left; margin-right: 10px; line-height: 1; }
          table { width: 100%; border-collapse: collapse; margin-top: 6px; }
          th { background: #1d4ed8; color: #fff; font-size: 11px; padding: 6px 10px; text-align: left; }
          td { padding: 7px 10px; font-size: 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
          tr:nth-child(even) td { background: #f9fafb; }
          .instructions-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 8px 12px; font-size: 12px; margin-top: 6px; }
          .followup { margin-top: 14px; font-size: 12px; color: #059669; font-weight: 600; }
          .footer { margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 12px; display: flex; justify-content: space-between; align-items: flex-end; }
          .signature-line { border-top: 1px solid #111; width: 160px; text-align: center; padding-top: 4px; font-size: 11px; color: #555; }
          .date-line { font-size: 11px; color: #555; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body><div class="page">${content}</div></body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  }

  const doctor  = rx.doctor;
  const patient = rx.patient;

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">প্রেসক্রিপশন প্রিভিউ</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={handlePrint} className="flex items-center gap-2">
            <Printer size={14} /> প্রিন্ট করুন
          </Button>
          <Button size="sm" variant="secondary" onClick={onClose}>
            <X size={14} />
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div ref={printRef} className="p-6 text-sm font-sans">

          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-blue-700 pb-3 mb-4">
            <div>
              <p className="text-lg font-bold text-blue-700">শেরপুর আধুনিক চক্ষু হাসপাতাল</p>
              <p className="text-xs text-gray-500">ও ফ্যাকো সেন্টার, শেরপুর</p>
            </div>
            {doctor && (
              <div className="text-right">
                <p className="font-bold text-gray-900">{doctor.nameBn}</p>
                <p className="text-xs text-gray-500">{doctor.qualificationBn}</p>
                <p className="text-xs text-gray-500">{doctor.designationBn}</p>
                {doctor.phone && <p className="text-xs text-gray-400">📞 {doctor.phone}</p>}
              </div>
            )}
          </div>

          {/* Patient bar */}
          {patient && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-4 flex flex-wrap gap-4 text-xs">
              <span><strong>রোগী:</strong> {patient.nameBn}</span>
              <span><strong>আইডি:</strong> {patient.patientId}</span>
              {patient.age && <span><strong>বয়স:</strong> {patient.age} বছর</span>}
              <span><strong>লিঙ্গ:</strong> {GENDER_BN[patient.gender]}</span>
              <span><strong>ফোন:</strong> {patient.phone}</span>
              <span><strong>তারিখ:</strong> {fmt(rx.createdAt)}</span>
            </div>
          )}

          {/* Diagnosis */}
          {rx.diagnosis && (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">রোগ নির্ণয়</p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 px-3 py-2 rounded text-sm mb-4">
                {rx.diagnosis}
              </div>
            </>
          )}

          {/* Medicines */}
          {rx.items.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl font-black text-blue-700 leading-none">℞</span>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">ওষুধ</p>
              </div>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    {["#", "ওষুধের নাম", "মাত্রা", "সময়", "মেয়াদ", "নির্দেশনা"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rx.items.map((item, i) => (
                    <tr key={item.id} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                      <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                      <td className="px-3 py-2 font-semibold text-gray-900">{item.medicineName}</td>
                      <td className="px-3 py-2 text-gray-700">{item.dose || "—"}</td>
                      <td className="px-3 py-2 text-gray-700">{item.frequency || "—"}</td>
                      <td className="px-3 py-2 text-gray-700">{item.duration || "—"}</td>
                      <td className="px-3 py-2 text-gray-500">{item.instructions || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Instructions */}
          {rx.instructions && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs">
              <p className="font-semibold text-green-700 mb-1">সাধারণ নির্দেশনা</p>
              <p className="text-gray-700 whitespace-pre-line">{rx.instructions}</p>
            </div>
          )}

          {/* Follow-up */}
          {rx.followUpDate && (
            <p className="mt-4 text-sm font-semibold text-emerald-700">
              📅 পরবর্তী ভিজিট: {fmt(rx.followUpDate)}
            </p>
          )}

          {/* Footer */}
          <div className="mt-8 pt-3 border-t border-gray-200 flex justify-between items-end">
            <p className="text-xs text-gray-400">তারিখ: {fmt(rx.createdAt)}</p>
            <div className="text-center">
              <div className="border-t border-gray-800 w-40 pt-1">
                <p className="text-xs text-gray-500">চিকিৎসকের স্বাক্ষর</p>
                {doctor && <p className="text-xs font-semibold">{doctor.nameBn}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
