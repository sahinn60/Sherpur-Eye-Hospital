"use client";

import { useRef, useEffect, useState } from "react";
import { Printer, X } from "lucide-react";
import { ClinicPrescription } from "@/types/clinic";
import { GENDER_BN } from "@/types/patient";
import { Button } from "@/components/ui";
import { fetchHospitalRxSettings, HospitalRxSettings } from "@/lib/services/adminPrescriptionService";

interface Props {
  rx: ClinicPrescription;
  onClose: () => void;
}

function fmtEn(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Print CSS injected into the new window ───────────────────────────────────

const PRINT_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
@page{size:A4 portrait;margin:10mm 12mm 12mm}
html,body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Times New Roman',Times,serif;font-size:11.5px;color:#1a1a1a;line-height:1.4}

/* ── HEADER ── */
.rx-header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:7px;border-bottom:2px solid #1a3a6b;margin-bottom:8px}
.hosp-left{display:flex;align-items:flex-start;gap:9px}
.hosp-logo{width:54px;height:54px;object-fit:contain;flex-shrink:0}
.hosp-name-bn{font-size:16px;font-weight:700;color:#1a3a6b;line-height:1.2;letter-spacing:-0.01em}
.hosp-name-en{font-size:10.5px;color:#2a4a8b;font-weight:600;margin-top:2px}
.hosp-contact{font-size:9px;color:#555;margin-top:4px;line-height:1.6}
.hosp-contact span{margin-right:10px}
.dr-block{text-align:right;min-width:170px;max-width:200px}
.dr-name{font-size:13.5px;font-weight:700;color:#1a1a1a;font-family:'Times New Roman',serif}
.dr-qual{font-size:9.5px;color:#333;margin-top:2px;line-height:1.5}
.dr-spec{font-size:9.5px;color:#1a3a6b;font-weight:600;margin-top:1px}
.dr-bmdc{font-size:9px;color:#666;margin-top:2px}
.dr-chamber{font-size:9px;color:#666;margin-top:1px}

/* ── PATIENT BAR ── */
.patient-bar{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;border:1px solid #b8cce4;border-radius:2px;margin-bottom:9px;overflow:hidden;font-size:10px}
.pb-cell{padding:4px 7px;border-right:1px solid #b8cce4}
.pb-cell:last-child{border-right:none}
.pb-label{font-size:8.5px;text-transform:uppercase;letter-spacing:0.04em;color:#777;display:block;margin-bottom:1px}
.pb-value{font-weight:700;color:#1a1a1a;font-size:10.5px}

/* ── BODY GRID ── */
.rx-body{display:grid;grid-template-columns:82mm 1px 1fr;gap:0;min-height:195mm}
.col-left{padding-right:9px;padding-top:2px}
.col-divider{background:#c8d8ee;margin:0 5px}
.col-right{padding-left:11px;padding-top:2px}

/* ── SECTION HEADING ── */
.sec-head{font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.09em;color:#1a3a6b;border-bottom:1px solid #c8d8ee;padding-bottom:2px;margin-bottom:5px;margin-top:11px}
.sec-head:first-child{margin-top:0}

/* ── CLINICAL TEXT ── */
.clinical-text{font-size:10.5px;color:#222;line-height:1.65;white-space:pre-line}

/* ── EYE EXAM TABLE ── */
.eye-tbl{width:100%;border-collapse:collapse;font-size:9.5px;margin-bottom:3px}
.eye-tbl th{background:#e8f0fb;color:#1a3a6b;padding:3px 5px;border:1px solid #b8cce4;font-size:8.5px;font-weight:700;text-align:center}
.eye-tbl th.left{text-align:left}
.eye-tbl td{padding:3px 5px;border:1px solid #d4e2f0;text-align:center;font-size:9.5px}
.eye-tbl td.eye-lbl{font-weight:700;text-align:left;background:#f4f8fd;font-size:9px;color:#1a3a6b}

/* ── REFRACTION TABLE ── */
.ref-tbl{width:100%;border-collapse:collapse;font-size:9px;margin-bottom:3px}
.ref-tbl th{background:#e8f0fb;color:#1a3a6b;padding:2px 4px;border:1px solid #b8cce4;font-size:8px;font-weight:700;text-align:center}
.ref-tbl td{padding:2px 4px;border:1px solid #d4e2f0;text-align:center;font-size:9px}
.ref-tbl td.lbl{font-weight:700;text-align:left;background:#f4f8fd;color:#1a3a6b;padding-left:5px}

/* ── DIAGNOSIS ── */
.diag-text{font-size:11px;font-weight:700;color:#1a1a1a;line-height:1.55;padding:3px 0}

/* ── Rx SYMBOL + MEDICINES ── */
.rx-sym-row{display:flex;align-items:flex-start;gap:5px;margin-bottom:7px}
.rx-sym{font-size:36px;font-weight:900;color:#1a3a6b;line-height:0.85;font-family:'Times New Roman',serif;flex-shrink:0;margin-top:2px}
.rx-label{font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.09em;color:#1a3a6b;padding-top:10px}

.med-list{list-style:none}
.med-item{padding:6px 0 6px 0;border-bottom:1px dashed #dde8f5}
.med-item:last-child{border-bottom:none}
.med-num{font-size:10.5px;font-weight:700;color:#1a3a6b;margin-right:3px}
.med-name{font-size:12px;font-weight:700;color:#1a1a1a}
.med-strength{font-size:10px;color:#444;margin-left:3px;font-weight:400}
.med-detail{font-size:10px;color:#444;margin-top:2px;padding-left:16px;line-height:1.6}
.med-detail .dot{margin:0 5px;color:#bbb}

/* ── ADVICE ── */
.advice-text{font-size:10px;color:#222;line-height:1.75;white-space:pre-line}

/* ── FOLLOW-UP ── */
.followup-box{border:1px solid #b8cce4;border-radius:2px;padding:5px 8px;margin-top:10px;display:inline-flex;align-items:center;gap:7px;min-width:160px}
.fu-label{font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#1a3a6b}
.fu-date{font-size:11px;font-weight:700;color:#1a1a1a}
.fu-note{font-size:9.5px;color:#555}

/* ── SIGNATURE ── */
.sig-area{margin-top:auto;padding-top:20px;display:flex;justify-content:flex-end}
.sig-block{text-align:center;min-width:150px}
.sig-img{height:44px;max-width:140px;object-fit:contain;display:block;margin:0 auto 5px}
.sig-line{border-top:1px solid #333;padding-top:4px;margin-top:2px}
.sig-name{font-size:11px;font-weight:700;color:#1a1a1a}
.sig-qual{font-size:9px;color:#555;line-height:1.5;margin-top:1px}
.sig-bmdc{font-size:8.5px;color:#777;margin-top:1px}

/* ── FOOTER ── */
.rx-footer{border-top:1px solid #c8d8ee;margin-top:8px;padding-top:5px;display:flex;justify-content:space-between;align-items:center}
.footer-left{font-size:8.5px;color:#888;line-height:1.6}
.footer-right{font-size:8.5px;color:#aaa;font-family:monospace;text-align:right}

@media print{
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
}
`;

// ─── Build the HTML string for the prescription ───────────────────────────────

function buildPrescriptionHTML(
  rx: ClinicPrescription,
  hospital: HospitalRxSettings
): string {
  const doctor   = rx.doctor;
  const patient  = rx.patient;
  const settings = (doctor as any)?.prescriptionSettings ?? {};

  // Parse refraction JSON
  let reRE: Record<string, string> | null = null;
  let reLE: Record<string, string> | null = null;
  try { if ((rx as any).refractionRE) reRE = JSON.parse((rx as any).refractionRE); } catch {}
  try { if ((rx as any).refractionLE) reLE = JSON.parse((rx as any).refractionLE); } catch {}

  const hasVA  = (rx as any).vaRightEye || (rx as any).vaLeftEye;
  const hasIOP = (rx as any).iopRightEye || (rx as any).iopLeftEye;
  const hasRef = reRE || reLE;

  const hospNameBn = hospital.rx_hospital_name_bn || "শেরপুর আধুনিক চক্ষু হাসপাতাল ও ফ্যাকো সেন্টার";
  const hospNameEn = hospital.rx_hospital_name_en || "Sherpur Adhunik Eye Hospital & Phaco Center";
  const hospAddr   = hospital.rx_hospital_address || "";
  const hospPhone  = hospital.rx_hospital_phone   || "";
  const hospEmerg  = hospital.rx_hospital_emergency || "";
  const hospEmail  = hospital.rx_hospital_email   || "";
  const hospWeb    = hospital.rx_hospital_website || "";
  const hospLogo   = hospital.rx_hospital_logo    || "";
  const showLogo   = hospital.rx_show_logo !== "false";
  const footerText = hospital.rx_footer_text || "";

  const drName  = settings.nameBn  || doctor?.nameBn  || "";
  const drQual  = settings.qualificationBn || doctor?.qualificationBn || "";
  const drDesg  = settings.designationBn  || doctor?.designationBn  || "";
  const drSpec  = settings.specialtyBn    || "";
  const drBmdc  = settings.bmdcNo         || "";
  const drPhone = settings.chamberPhone   || doctor?.phone || "";
  const sigUrl  = settings.signatureUrl   || null;
  const sigMode = settings.signatureMode  || "handwritten";

  const rxNo = (rx as any).rxNo || rx.id.slice(-8).toUpperCase();

  // ── Contact line
  const contactParts: string[] = [];
  if (hospAddr)  contactParts.push(`<span>${hospAddr}</span>`);
  if (hospPhone) contactParts.push(`<span>☎ ${hospPhone}</span>`);
  if (hospEmerg) contactParts.push(`<span>🚨 ${hospEmerg}</span>`);
  if (hospEmail) contactParts.push(`<span>✉ ${hospEmail}</span>`);
  if (hospWeb)   contactParts.push(`<span>🌐 ${hospWeb}</span>`);

  // ── Footer contact line
  const footerParts: string[] = [];
  if (hospNameBn) footerParts.push(hospNameBn);
  if (hospAddr)   footerParts.push(hospAddr);
  if (hospPhone)  footerParts.push(`☎ ${hospPhone}`);
  if (hospEmerg)  footerParts.push(`Emergency: ${hospEmerg}`);
  if (hospWeb)    footerParts.push(hospWeb);

  // ── Medicine rows
  const medRows = rx.items.map((item, i) => {
    const detailParts: string[] = [];
    if (item.dose)         detailParts.push(item.dose);
    if (item.frequency)    detailParts.push(item.frequency);
    if (item.duration)     detailParts.push(`× ${item.duration}`);
    if (item.instructions) detailParts.push(`(${item.instructions})`);
    return `
      <li class="med-item">
        <div>
          <span class="med-num">${i + 1}.</span>
          <span class="med-name">${item.medicineName}</span>
        </div>
        ${detailParts.length ? `<div class="med-detail">${detailParts.join('<span class="dot">·</span>')}</div>` : ""}
      </li>`;
  }).join("");

  // ── Advice lines
  const adviceText = (rx as any).advice || rx.instructions || "";

  // ── Signature block
  let sigHTML = "";
  if (sigMode === "uploaded" && sigUrl) {
    sigHTML = `<img src="${sigUrl}" alt="signature" class="sig-img" />`;
  } else if (sigMode === "handwritten") {
    sigHTML = `<div style="height:40px"></div>`;
  }

  return `
<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8"/>
<title>Prescription — ${patient?.nameBn || ""} — ${fmtEn(rx.createdAt)}</title>
<style>${PRINT_CSS}</style>
</head>
<body>
<div style="width:186mm;min-height:277mm;margin:0 auto;position:relative;background:#fff">

  <!-- HEADER -->
  <div class="rx-header">
    <div class="hosp-left">
      ${showLogo && hospLogo ? `<img src="${hospLogo}" alt="logo" class="hosp-logo"/>` : ""}
      <div>
        <div class="hosp-name-bn">${hospNameBn}</div>
        <div class="hosp-name-en">${hospNameEn}</div>
        ${contactParts.length ? `<div class="hosp-contact">${contactParts.join("")}</div>` : ""}
      </div>
    </div>
    <div class="dr-block">
      ${drName  ? `<div class="dr-name">${drName}</div>` : ""}
      ${drQual  ? `<div class="dr-qual">${drQual}</div>` : ""}
      ${drDesg  ? `<div class="dr-qual">${drDesg}</div>` : ""}
      ${drSpec  ? `<div class="dr-spec">${drSpec}</div>` : ""}
      ${drBmdc  ? `<div class="dr-bmdc">BMDC Reg. No: ${drBmdc}</div>` : ""}
      ${drPhone ? `<div class="dr-chamber">☎ ${drPhone}</div>` : ""}
    </div>
  </div>

  <!-- PATIENT BAR -->
  ${patient ? `
  <div class="patient-bar">
    <div class="pb-cell">
      <span class="pb-label">Patient</span>
      <span class="pb-value">${patient.nameBn}</span>
    </div>
    <div class="pb-cell">
      <span class="pb-label">Patient ID</span>
      <span class="pb-value">${patient.patientId}</span>
    </div>
    <div class="pb-cell">
      <span class="pb-label">Age / Sex</span>
      <span class="pb-value">${patient.age ? `${patient.age}y` : "—"} / ${patient.gender === "MALE" ? "M" : patient.gender === "FEMALE" ? "F" : "O"}</span>
    </div>
    <div class="pb-cell">
      <span class="pb-label">Date</span>
      <span class="pb-value">${fmtEn(rx.createdAt)}</span>
    </div>
    <div class="pb-cell">
      <span class="pb-label">Rx No.</span>
      <span class="pb-value" style="font-family:monospace;font-size:9.5px">${rxNo}</span>
    </div>
  </div>` : ""}

  <!-- BODY -->
  <div class="rx-body">

    <!-- LEFT COLUMN -->
    <div class="col-left">

      ${(rx as any).chiefComplaint ? `
        <div class="sec-head">Chief Complaint</div>
        <p class="clinical-text">${(rx as any).chiefComplaint}</p>
      ` : ""}

      ${(rx as any).history ? `
        <div class="sec-head">History</div>
        <p class="clinical-text">${(rx as any).history}</p>
      ` : ""}

      ${(hasVA || hasIOP) ? `
        <div class="sec-head">Eye Examination</div>
        <table class="eye-tbl">
          <thead>
            <tr>
              <th class="left" style="width:28%">Eye</th>
              ${hasVA  ? `<th>VA</th>` : ""}
              ${hasIOP ? `<th>IOP</th>` : ""}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="eye-lbl">OD (Right)</td>
              ${hasVA  ? `<td>${(rx as any).vaRightEye  || "—"}</td>` : ""}
              ${hasIOP ? `<td>${(rx as any).iopRightEye || "—"}</td>` : ""}
            </tr>
            <tr>
              <td class="eye-lbl">OS (Left)</td>
              ${hasVA  ? `<td>${(rx as any).vaLeftEye  || "—"}</td>` : ""}
              ${hasIOP ? `<td>${(rx as any).iopLeftEye || "—"}</td>` : ""}
            </tr>
          </tbody>
        </table>
      ` : ""}

      ${hasRef ? `
        <div class="sec-head" style="margin-top:8px">Refraction</div>
        <table class="ref-tbl">
          <thead>
            <tr>
              <th style="text-align:left;padding-left:5px">Eye</th>
              <th>SPH</th><th>CYL</th><th>AXIS</th><th>ADD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="lbl">OD</td>
              <td>${reRE?.sph || "—"}</td><td>${reRE?.cyl || "—"}</td>
              <td>${reRE?.axis || "—"}</td><td>${reRE?.add || "—"}</td>
            </tr>
            <tr>
              <td class="lbl">OS</td>
              <td>${reLE?.sph || "—"}</td><td>${reLE?.cyl || "—"}</td>
              <td>${reLE?.axis || "—"}</td><td>${reLE?.add || "—"}</td>
            </tr>
          </tbody>
        </table>
      ` : ""}

      ${rx.diagnosis ? `
        <div class="sec-head">Diagnosis</div>
        <p class="diag-text">${rx.diagnosis}</p>
      ` : ""}

      ${(rx as any).investigations ? `
        <div class="sec-head">Investigation</div>
        <p class="clinical-text">${(rx as any).investigations}</p>
      ` : ""}

      ${(rx as any).examNotes ? `
        <div class="sec-head">Examination Notes</div>
        <p class="clinical-text" style="font-size:9.5px;color:#444">${(rx as any).examNotes}</p>
      ` : ""}

    </div>

    <!-- DIVIDER -->
    <div class="col-divider"></div>

    <!-- RIGHT COLUMN -->
    <div class="col-right">

      ${rx.items.length > 0 ? `
        <div class="rx-sym-row">
          <span class="rx-sym">&#8478;</span>
          <span class="rx-label">Medicines</span>
        </div>
        <ul class="med-list">${medRows}</ul>
      ` : ""}

      ${adviceText ? `
        <div class="sec-head" style="margin-top:16px">Advice</div>
        <p class="advice-text">${adviceText.replace(/\n/g, "<br/>")}</p>
      ` : ""}

      ${rx.followUpDate ? `
        <div style="margin-top:14px">
          <div class="sec-head">Follow-up</div>
          <div class="followup-box">
            <span class="fu-label">Next Visit:</span>
            <span class="fu-date">${fmtEn(rx.followUpDate)}</span>
            ${(rx as any).followUpNote ? `<span class="fu-note">— ${(rx as any).followUpNote}</span>` : ""}
          </div>
        </div>
      ` : ""}

      <!-- SIGNATURE -->
      <div class="sig-area">
        <div class="sig-block">
          ${sigHTML}
          <div class="sig-line">
            <div class="sig-name">${drName}</div>
            ${drQual ? `<div class="sig-qual">${drQual}</div>` : ""}
            ${drSpec ? `<div class="sig-qual">${drSpec}</div>` : ""}
            ${drBmdc ? `<div class="sig-bmdc">BMDC Reg. No: ${drBmdc}</div>` : ""}
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- FOOTER -->
  <div class="rx-footer">
    <div class="footer-left">
      ${footerParts.join(" &nbsp;|&nbsp; ")}
      ${footerText ? `<br/>${footerText}` : ""}
    </div>
    <div class="footer-right">
      Rx# ${rxNo}<br/>
      ${fmtEn(rx.createdAt)}
    </div>
  </div>

</div>
</body>
</html>`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PrescriptionPrint({ rx, onClose }: Props) {
  const previewRef = useRef<HTMLIFrameElement>(null);
  const [hospital, setHospital] = useState<HospitalRxSettings>({});
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetchHospitalRxSettings()
      .then(setHospital)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const html = loading ? "" : buildPrescriptionHTML(rx, hospital);

  // Inject HTML into iframe for preview
  useEffect(() => {
    if (!html || !previewRef.current) return;
    const doc = previewRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
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
      {/* Toolbar */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Prescription Preview</span>
          {(rx as any).rxNo && (
            <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
              {(rx as any).rxNo}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrint} disabled={loading} className="flex items-center gap-2">
            <Printer size={14} /> Print / Save PDF
          </Button>
          <button onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <iframe
            ref={previewRef}
            title="Prescription Preview"
            className="w-full h-full border-0 bg-white"
            style={{ minHeight: 0 }}
          />
        )}
      </div>

      <p className="text-xs text-gray-400 text-center shrink-0">
        Click "Print / Save PDF" → In the print dialog, choose "Save as PDF" to download.
      </p>
    </div>
  );
}
