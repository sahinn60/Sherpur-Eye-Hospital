"use client";

import { useRef } from "react";
import { Printer, X, Download } from "lucide-react";
import { ClinicPrescription } from "@/types/clinic";
import { GENDER_BN } from "@/types/patient";
import { Button } from "@/components/ui";

interface Props {
  rx: ClinicPrescription;
  onClose: () => void;
}

function fmt(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
}
function fmtEn(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function PrescriptionPrint({ rx, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank", "width=900,height=1100");
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Rx - ${rx.patient?.nameBn} - ${fmtEn(rx.createdAt)}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
@page{size:A4;margin:12mm 14mm 14mm}
body{font-family:'Times New Roman',Times,serif;font-size:12px;color:#111;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:182mm;min-height:267mm;position:relative}

/* HEADER */
.header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:8px;border-bottom:2.5px solid #1a3a6b;margin-bottom:10px}
.hosp-left{display:flex;align-items:flex-start;gap:10px}
.hosp-logo{width:52px;height:52px;object-fit:contain}
.hosp-name-bn{font-size:17px;font-weight:700;color:#1a3a6b;line-height:1.2}
.hosp-name-en{font-size:11px;color:#1a3a6b;font-weight:600;margin-top:1px}
.hosp-contact{font-size:9.5px;color:#555;margin-top:3px;line-height:1.5}
.doctor-block{text-align:right;min-width:160px}
.dr-name{font-size:14px;font-weight:700;color:#111;font-family:'Times New Roman',serif}
.dr-qual{font-size:10px;color:#333;margin-top:1px;line-height:1.4}
.dr-bmdc{font-size:9.5px;color:#555;margin-top:2px}
.dr-chamber{font-size:9.5px;color:#555;margin-top:1px}

/* PATIENT BAR */
.patient-bar{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;border:1px solid #c8d8f0;border-radius:3px;margin-bottom:10px;overflow:hidden}
.pb-cell{padding:4px 8px;font-size:10.5px;border-right:1px solid #c8d8f0}
.pb-cell:last-child{border-right:none}
.pb-label{color:#666;font-size:9px;text-transform:uppercase;letter-spacing:0.03em;display:block;margin-bottom:1px}
.pb-value{font-weight:600;color:#111}
.pb-full{grid-column:1/-1;border-top:1px solid #c8d8f0;border-right:none}

/* BODY */
.body-grid{display:grid;grid-template-columns:1fr 2px 2fr;gap:0;min-height:180mm}
.left-col{padding-right:10px;padding-top:4px}
.divider{background:#dde6f5;margin:0 6px}
.right-col{padding-left:12px;padding-top:4px}

/* SECTION LABELS */
.sec-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#1a3a6b;border-bottom:1px solid #dde6f5;padding-bottom:2px;margin-bottom:5px;margin-top:10px}
.sec-label:first-child{margin-top:0}

/* EYE EXAM TABLE */
.eye-table{width:100%;border-collapse:collapse;font-size:10px;margin-bottom:4px}
.eye-table th{background:#eef3fb;color:#1a3a6b;font-size:9px;padding:3px 5px;text-align:center;border:1px solid #c8d8f0;font-weight:700}
.eye-table td{padding:3px 5px;border:1px solid #dde6f5;text-align:center;font-size:10px}
.eye-table .eye-label{font-weight:700;text-align:left;background:#f8fafd;font-size:9.5px}

/* REFRACTION */
.refraction-grid{display:grid;grid-template-columns:auto 1fr 1fr 1fr 1fr;gap:0;border:1px solid #dde6f5;border-radius:2px;overflow:hidden;font-size:9.5px;margin-bottom:4px}
.rg-header{background:#eef3fb;color:#1a3a6b;font-weight:700;padding:3px 4px;text-align:center;border-right:1px solid #dde6f5;border-bottom:1px solid #dde6f5;font-size:9px}
.rg-cell{padding:3px 4px;text-align:center;border-right:1px solid #dde6f5;border-bottom:1px solid #dde6f5}
.rg-cell:last-child{border-right:none}
.rg-label{font-weight:700;background:#f8fafd;text-align:left;padding-left:5px}

/* DIAGNOSIS */
.diagnosis-text{font-size:11px;font-weight:600;color:#111;line-height:1.5;padding:4px 0}

/* Rx SECTION */
.rx-symbol{font-size:32px;font-weight:900;color:#1a3a6b;line-height:1;float:left;margin-right:6px;margin-top:-2px;font-family:'Times New Roman',serif}
.rx-header{overflow:hidden;margin-bottom:6px}
.rx-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#1a3a6b;padding-top:6px}

/* MEDICINE LIST */
.med-item{margin-bottom:8px;padding-bottom:8px;border-bottom:1px dashed #e5e7eb}
.med-item:last-child{border-bottom:none;margin-bottom:0}
.med-num{font-size:11px;font-weight:700;color:#1a3a6b;margin-right:4px}
.med-name{font-size:12px;font-weight:700;color:#111}
.med-strength{font-size:10.5px;color:#444;margin-left:4px}
.med-detail{font-size:10.5px;color:#444;margin-top:2px;margin-left:16px;line-height:1.5}
.med-detail span{margin-right:10px}

/* ADVICE */
.advice-text{font-size:10.5px;color:#222;line-height:1.7;white-space:pre-line}

/* FOLLOWUP */
.followup-box{border:1px solid #c8d8f0;border-radius:3px;padding:5px 8px;margin-top:8px;display:flex;align-items:center;gap:6px}
.followup-label{font-size:9px;font-weight:700;text-transform:uppercase;color:#1a3a6b;letter-spacing:0.05em}
.followup-date{font-size:11px;font-weight:700;color:#111}

/* SIGNATURE */
.signature-area{margin-top:auto;padding-top:16px;display:flex;justify-content:flex-end}
.sig-block{text-align:center;min-width:140px}
.sig-img{height:40px;max-width:130px;object-fit:contain;display:block;margin:0 auto 4px}
.sig-line{border-top:1px solid #333;padding-top:4px}
.sig-name{font-size:11px;font-weight:700;color:#111}
.sig-qual{font-size:9.5px;color:#555;line-height:1.4}

/* FOOTER */
.footer{border-top:1px solid #dde6f5;margin-top:10px;padding-top:6px;display:flex;justify-content:space-between;align-items:center}
.footer-text{font-size:9px;color:#888;line-height:1.5}
.rx-no{font-size:9px;color:#aaa;font-family:monospace}

.text-muted{color:#999;font-style:italic;font-size:10px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>
</head>
<body><div class="page">${content}</div></body>
</html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  }

  const doctor = rx.doctor;
  const patient = rx.patient;
  const settings = (rx as any).doctorSettings;

  // Parse refraction if stored
  let refractionRE: any = null;
  let refractionLE: any = null;
  try { if ((rx as any).refractionRE) refractionRE = JSON.parse((rx as any).refractionRE); } catch {}
  try { if ((rx as any).refractionLE) refractionLE = JSON.parse((rx as any).refractionLE); } catch {}

  const hasEyeExam = (rx as any).vaRightEye || (rx as any).vaLeftEye || (rx as any).iopRightEye || (rx as any).iopLeftEye;
  const hasRefraction = refractionRE || refractionLE;

  return (
    <div className="space-y-3">
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

      {/* A4 Preview */}
      <div className="border border-gray-300 rounded-lg overflow-auto bg-gray-100 p-4">
        <div
          ref={printRef}
          className="bg-white mx-auto shadow-sm"
          style={{ width: "182mm", minHeight: "267mm", padding: "10mm 12mm 14mm", fontFamily: "'Times New Roman', Times, serif", fontSize: "12px", color: "#111" }}
        >
          {/* HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "8px", borderBottom: "2.5px solid #1a3a6b", marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div>
                <div style={{ fontSize: "17px", fontWeight: 700, color: "#1a3a6b", lineHeight: 1.2 }}>শেরপুর আধুনিক চক্ষু হাসপাতাল</div>
                <div style={{ fontSize: "11px", color: "#1a3a6b", fontWeight: 600, marginTop: "1px" }}>Sherpur Adhunik Eye Hospital & Phaco Center</div>
                <div style={{ fontSize: "9.5px", color: "#555", marginTop: "3px", lineHeight: 1.5 }}>
                  শেরপুর সদর, শেরপুর &nbsp;|&nbsp; ☎ 01781-836581 &nbsp;|&nbsp; জরুরি: ২৪ ঘণ্টা
                </div>
              </div>
            </div>
            {doctor && (
              <div style={{ textAlign: "right", minWidth: "160px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#111" }}>{doctor.nameBn}</div>
                <div style={{ fontSize: "10px", color: "#333", marginTop: "1px", lineHeight: 1.4 }}>{doctor.qualificationBn}</div>
                <div style={{ fontSize: "10px", color: "#333" }}>{doctor.designationBn}</div>
                {settings?.bmdcNo && <div style={{ fontSize: "9.5px", color: "#555", marginTop: "2px" }}>BMDC Reg. No: {settings.bmdcNo}</div>}
                {doctor.phone && <div style={{ fontSize: "9.5px", color: "#555" }}>☎ {doctor.phone}</div>}
              </div>
            )}
          </div>

          {/* PATIENT BAR */}
          {patient && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", border: "1px solid #c8d8f0", borderRadius: "3px", marginBottom: "10px", overflow: "hidden" }}>
              {[
                { label: "রোগীর নাম", value: patient.nameBn },
                { label: "রোগী আইডি", value: patient.patientId },
                { label: "তারিখ", value: fmtEn(rx.createdAt) },
                { label: "বয়স", value: patient.age ? `${patient.age} বছর` : "—" },
                { label: "লিঙ্গ", value: GENDER_BN[patient.gender] },
                { label: "ফোন", value: patient.phone },
              ].map((cell, i) => (
                <div key={i} style={{ padding: "4px 8px", fontSize: "10.5px", borderRight: i % 3 !== 2 ? "1px solid #c8d8f0" : "none", borderTop: i >= 3 ? "1px solid #c8d8f0" : "none" }}>
                  <span style={{ color: "#666", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.03em", display: "block", marginBottom: "1px" }}>{cell.label}</span>
                  <span style={{ fontWeight: 600, color: "#111" }}>{cell.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* BODY: LEFT + DIVIDER + RIGHT */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2px 2fr", gap: 0, minHeight: "180mm" }}>

            {/* LEFT COLUMN */}
            <div style={{ paddingRight: "10px", paddingTop: "4px" }}>

              {/* Chief Complaint */}
              {(rx as any).chiefComplaint && (
                <>
                  <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a3a6b", borderBottom: "1px solid #dde6f5", paddingBottom: "2px", marginBottom: "5px" }}>Chief Complaint</div>
                  <p style={{ fontSize: "10.5px", color: "#222", lineHeight: 1.6 }}>{(rx as any).chiefComplaint}</p>
                </>
              )}

              {/* Eye Examination */}
              {hasEyeExam && (
                <>
                  <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a3a6b", borderBottom: "1px solid #dde6f5", paddingBottom: "2px", marginBottom: "5px", marginTop: "10px" }}>Visual Acuity</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
                    <thead>
                      <tr>
                        <th style={{ background: "#eef3fb", color: "#1a3a6b", fontSize: "9px", padding: "3px 5px", textAlign: "left", border: "1px solid #c8d8f0" }}>Eye</th>
                        <th style={{ background: "#eef3fb", color: "#1a3a6b", fontSize: "9px", padding: "3px 5px", textAlign: "center", border: "1px solid #c8d8f0" }}>VA</th>
                        <th style={{ background: "#eef3fb", color: "#1a3a6b", fontSize: "9px", padding: "3px 5px", textAlign: "center", border: "1px solid #c8d8f0" }}>IOP</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: "3px 5px", border: "1px solid #dde6f5", fontWeight: 700, fontSize: "9.5px", background: "#f8fafd" }}>OD (R)</td>
                        <td style={{ padding: "3px 5px", border: "1px solid #dde6f5", textAlign: "center" }}>{(rx as any).vaRightEye || "—"}</td>
                        <td style={{ padding: "3px 5px", border: "1px solid #dde6f5", textAlign: "center" }}>{(rx as any).iopRightEye || "—"}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: "3px 5px", border: "1px solid #dde6f5", fontWeight: 700, fontSize: "9.5px", background: "#f8fafd" }}>OS (L)</td>
                        <td style={{ padding: "3px 5px", border: "1px solid #dde6f5", textAlign: "center" }}>{(rx as any).vaLeftEye || "—"}</td>
                        <td style={{ padding: "3px 5px", border: "1px solid #dde6f5", textAlign: "center" }}>{(rx as any).iopLeftEye || "—"}</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}

              {/* Refraction */}
              {hasRefraction && (
                <>
                  <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a3a6b", borderBottom: "1px solid #dde6f5", paddingBottom: "2px", marginBottom: "5px", marginTop: "10px" }}>Refraction</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9.5px" }}>
                    <thead>
                      <tr>
                        {["", "SPH", "CYL", "AXIS", "ADD"].map((h) => (
                          <th key={h} style={{ background: "#eef3fb", color: "#1a3a6b", padding: "2px 3px", textAlign: "center", border: "1px solid #c8d8f0", fontSize: "8.5px" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[{ label: "OD", data: refractionRE }, { label: "OS", data: refractionLE }].map(({ label, data }) => (
                        <tr key={label}>
                          <td style={{ padding: "2px 4px", border: "1px solid #dde6f5", fontWeight: 700, background: "#f8fafd", fontSize: "9px" }}>{label}</td>
                          {["sph", "cyl", "axis", "add"].map((k) => (
                            <td key={k} style={{ padding: "2px 3px", border: "1px solid #dde6f5", textAlign: "center" }}>{data?.[k] || "—"}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Diagnosis */}
              {rx.diagnosis && (
                <>
                  <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a3a6b", borderBottom: "1px solid #dde6f5", paddingBottom: "2px", marginBottom: "5px", marginTop: "10px" }}>Diagnosis</div>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#111", lineHeight: 1.5 }}>{rx.diagnosis}</p>
                </>
              )}

              {/* Investigations */}
              {(rx as any).investigations && (
                <>
                  <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a3a6b", borderBottom: "1px solid #dde6f5", paddingBottom: "2px", marginBottom: "5px", marginTop: "10px" }}>Investigation</div>
                  <p style={{ fontSize: "10.5px", color: "#222", lineHeight: 1.6, whiteSpace: "pre-line" }}>{(rx as any).investigations}</p>
                </>
              )}

              {/* Exam Notes */}
              {(rx as any).examNotes && (
                <>
                  <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a3a6b", borderBottom: "1px solid #dde6f5", paddingBottom: "2px", marginBottom: "5px", marginTop: "10px" }}>Examination Notes</div>
                  <p style={{ fontSize: "10px", color: "#444", lineHeight: 1.6, whiteSpace: "pre-line" }}>{(rx as any).examNotes}</p>
                </>
              )}
            </div>

            {/* DIVIDER */}
            <div style={{ background: "#dde6f5", margin: "0 6px" }} />

            {/* RIGHT COLUMN */}
            <div style={{ paddingLeft: "12px", paddingTop: "4px" }}>

              {/* Rx MEDICINES */}
              {rx.items.length > 0 && (
                <>
                  <div style={{ overflow: "hidden", marginBottom: "8px" }}>
                    <span style={{ fontSize: "34px", fontWeight: 900, color: "#1a3a6b", lineHeight: 1, float: "left", marginRight: "6px", marginTop: "-4px", fontFamily: "'Times New Roman', serif" }}>℞</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#1a3a6b", display: "block", paddingTop: "8px" }}>Medicines</span>
                  </div>
                  <div>
                    {rx.items.map((item, i) => (
                      <div key={item.id} style={{ marginBottom: "9px", paddingBottom: "9px", borderBottom: i < rx.items.length - 1 ? "1px dashed #e5e7eb" : "none" }}>
                        <div>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#1a3a6b", marginRight: "4px" }}>{i + 1}.</span>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "#111" }}>{item.medicineName}</span>
                          {item.dose && <span style={{ fontSize: "10.5px", color: "#444", marginLeft: "4px" }}>{item.dose}</span>}
                        </div>
                        <div style={{ fontSize: "10.5px", color: "#444", marginTop: "2px", marginLeft: "16px", lineHeight: 1.6 }}>
                          {item.frequency && <span style={{ marginRight: "10px" }}>{item.frequency}</span>}
                          {item.duration && <span style={{ marginRight: "10px" }}>× {item.duration}</span>}
                          {item.instructions && <span style={{ color: "#666" }}>({item.instructions})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Advice */}
              {(rx.instructions || (rx as any).advice) && (
                <>
                  <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a3a6b", borderBottom: "1px solid #dde6f5", paddingBottom: "2px", marginBottom: "5px", marginTop: "14px" }}>Advice</div>
                  <p style={{ fontSize: "10.5px", color: "#222", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                    {(rx as any).advice || rx.instructions}
                  </p>
                </>
              )}

              {/* Follow-up */}
              {rx.followUpDate && (
                <div style={{ border: "1px solid #c8d8f0", borderRadius: "3px", padding: "5px 8px", marginTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", color: "#1a3a6b", letterSpacing: "0.05em" }}>Follow-up:</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#111" }}>{fmtEn(rx.followUpDate)}</span>
                  {(rx as any).followUpNote && <span style={{ fontSize: "10px", color: "#555" }}>— {(rx as any).followUpNote}</span>}
                </div>
              )}

              {/* SIGNATURE */}
              <div style={{ marginTop: "auto", paddingTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                <div style={{ textAlign: "center", minWidth: "140px" }}>
                  {settings?.signatureUrl && (
                    <img src={settings.signatureUrl} alt="signature" style={{ height: "40px", maxWidth: "130px", objectFit: "contain", display: "block", margin: "0 auto 4px" }} />
                  )}
                  <div style={{ borderTop: "1px solid #333", paddingTop: "4px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#111" }}>{doctor?.nameBn || "—"}</div>
                    <div style={{ fontSize: "9.5px", color: "#555", lineHeight: 1.4 }}>{doctor?.qualificationBn}</div>
                    <div style={{ fontSize: "9.5px", color: "#555" }}>{doctor?.designationBn}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div style={{ borderTop: "1px solid #dde6f5", marginTop: "10px", paddingTop: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "9px", color: "#888", lineHeight: 1.5 }}>
              শেরপুর আধুনিক চক্ষু হাসপাতাল ও ফ্যাকো সেন্টার &nbsp;|&nbsp; শেরপুর সদর, শেরপুর &nbsp;|&nbsp; ☎ 01781-836581
            </div>
            <div style={{ fontSize: "9px", color: "#aaa", fontFamily: "monospace" }}>
              Rx# {(rx as any).rxNo || rx.id.slice(-8).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
