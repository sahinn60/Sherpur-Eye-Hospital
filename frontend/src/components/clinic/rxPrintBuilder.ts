import type { Prescription, DoctorPrescriptionSettings } from "@/lib/services/prescriptionService";
import type { HospitalRxSettings } from "@/lib/services/adminPrescriptionService";

function fmtEn(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export const PRINT_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
@page{size:A4 portrait;margin:10mm 12mm 12mm}
html,body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Times New Roman',Times,serif;font-size:11.5px;color:#1a1a1a;line-height:1.4}

.rx-header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:7px;border-bottom:2px solid #1a3a6b;margin-bottom:8px;page-break-inside:avoid}
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

.patient-bar{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;border:1px solid #b8cce4;border-radius:2px;margin-bottom:9px;overflow:hidden;font-size:10px;page-break-inside:avoid}
.pb-cell{padding:4px 7px;border-right:1px solid #b8cce4}
.pb-cell:last-child{border-right:none}
.pb-label{font-size:8.5px;text-transform:uppercase;letter-spacing:0.04em;color:#777;display:block;margin-bottom:1px}
.pb-value{font-weight:700;color:#1a1a1a;font-size:10.5px}

.rx-body{display:grid;grid-template-columns:82mm 1px 1fr;gap:0}
.col-left{padding-right:9px;padding-top:2px}
.col-divider{background:#c8d8ee;margin:0 5px}
.col-right{padding-left:11px;padding-top:2px;display:flex;flex-direction:column;min-height:180mm}

.sec-head{font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.09em;color:#1a3a6b;border-bottom:1px solid #c8d8ee;padding-bottom:2px;margin-bottom:5px;margin-top:11px;page-break-after:avoid}
.sec-head:first-child{margin-top:0}
.clinical-text{font-size:10.5px;color:#222;line-height:1.65;white-space:pre-line}

.eye-tbl{width:100%;border-collapse:collapse;font-size:9.5px;margin-bottom:3px;page-break-inside:avoid}
.eye-tbl th{background:#e8f0fb;color:#1a3a6b;padding:3px 5px;border:1px solid #b8cce4;font-size:8.5px;font-weight:700;text-align:center}
.eye-tbl th.left{text-align:left}
.eye-tbl td{padding:3px 5px;border:1px solid #d4e2f0;text-align:center;font-size:9.5px}
.eye-tbl td.eye-lbl{font-weight:700;text-align:left;background:#f4f8fd;font-size:9px;color:#1a3a6b}

.ref-tbl{width:100%;border-collapse:collapse;font-size:9px;margin-bottom:3px;page-break-inside:avoid}
.ref-tbl th{background:#e8f0fb;color:#1a3a6b;padding:2px 4px;border:1px solid #b8cce4;font-size:8px;font-weight:700;text-align:center}
.ref-tbl td{padding:2px 4px;border:1px solid #d4e2f0;text-align:center;font-size:9px}
.ref-tbl td.lbl{font-weight:700;text-align:left;background:#f4f8fd;color:#1a3a6b;padding-left:5px}

.diag-text{font-size:11px;font-weight:700;color:#1a1a1a;line-height:1.55;padding:3px 0}

.rx-sym-row{display:flex;align-items:flex-start;gap:5px;margin-bottom:7px;page-break-after:avoid}
.rx-sym{font-size:36px;font-weight:900;color:#1a3a6b;line-height:0.85;font-family:'Times New Roman',serif;flex-shrink:0;margin-top:2px}
.rx-label{font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.09em;color:#1a3a6b;padding-top:10px}

.med-list{list-style:none}
.med-item{padding:6px 0;border-bottom:1px dashed #dde8f5;page-break-inside:avoid}
.med-item:last-child{border-bottom:none}
.med-num{font-size:10.5px;font-weight:700;color:#1a3a6b;margin-right:3px}
.med-name{font-size:12px;font-weight:700;color:#1a1a1a}
.med-detail{font-size:10px;color:#444;margin-top:2px;padding-left:16px;line-height:1.6}
.med-detail .dot{margin:0 5px;color:#bbb}

.advice-text{font-size:10px;color:#222;line-height:1.75;white-space:pre-line}

.followup-box{border:1px solid #b8cce4;border-radius:2px;padding:5px 8px;margin-top:10px;display:inline-flex;align-items:center;gap:7px;page-break-inside:avoid}
.fu-label{font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#1a3a6b}
.fu-date{font-size:11px;font-weight:700;color:#1a1a1a}
.fu-note{font-size:9.5px;color:#555}

.sig-area{margin-top:auto;padding-top:20px;display:flex;justify-content:flex-end;page-break-inside:avoid}
.sig-block{text-align:center;min-width:150px}
.sig-img{height:44px;max-width:140px;object-fit:contain;display:block;margin:0 auto 5px}
.sig-line{border-top:1px solid #333;padding-top:4px;margin-top:2px}
.sig-name{font-size:11px;font-weight:700;color:#1a1a1a}
.sig-qual{font-size:9px;color:#555;line-height:1.5;margin-top:1px}
.sig-bmdc{font-size:8.5px;color:#777;margin-top:1px}

.rx-footer{border-top:1px solid #c8d8ee;margin-top:8px;padding-top:5px;display:flex;justify-content:space-between;align-items:center;page-break-inside:avoid}
.footer-left{font-size:8.5px;color:#888;line-height:1.6}
.footer-right{font-size:8.5px;color:#aaa;font-family:monospace;text-align:right}

.draft-stamp{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-size:72px;font-weight:900;color:rgba(239,68,68,0.08);pointer-events:none;white-space:nowrap;z-index:0;letter-spacing:0.1em}

@media print{
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
  .rx-header,.patient-bar{page-break-inside:avoid}
  .med-item{page-break-inside:avoid}
  .sig-area{page-break-inside:avoid}
  .rx-footer{page-break-inside:avoid}
  .rx-body{page-break-inside:auto}
  .col-left,.col-right{page-break-inside:auto}
}
`;

export function buildRxHTML(
  rx: Partial<Prescription>,
  settings: Partial<DoctorPrescriptionSettings>,
  hospital: HospitalRxSettings,
  isFinalized?: boolean
): string {
  const patient = rx.patient;

  let reRE: Record<string, string> | null = null;
  let reLE: Record<string, string> | null = null;
  try { if (rx.refractionRE) reRE = JSON.parse(rx.refractionRE); } catch {}
  try { if (rx.refractionLE) reLE = JSON.parse(rx.refractionLE); } catch {}

  const hasVA  = rx.vaRightEye || rx.vaLeftEye;
  const hasIOP = rx.iopRightEye || rx.iopLeftEye;
  const hasRef = reRE || reLE;

  const hospNameBn = hospital.rx_hospital_name_bn || "শেরপুর আধুনিক চক্ষু হাসপাতাল ও ফ্যাকো সেন্টার";
  const hospNameEn = hospital.rx_hospital_name_en || "Sherpur Adhunik Eye Hospital & Phaco Center";
  const hospAddr   = hospital.rx_hospital_address  || "";
  const hospPhone  = hospital.rx_hospital_phone    || "";
  const hospEmerg  = hospital.rx_hospital_emergency || "";
  const hospEmail  = hospital.rx_hospital_email    || "";
  const hospWeb    = hospital.rx_hospital_website  || "";
  const hospLogo   = hospital.rx_hospital_logo     || "";
  const showLogo   = hospital.rx_show_logo !== "false";
  const footerText = hospital.rx_footer_text       || "";

  const drName  = settings.nameBn          || "";
  const drQual  = settings.qualificationBn  || "";
  const drDesg  = settings.designationBn   || "";
  const drSpec  = settings.specialtyBn     || "";
  const drBmdc  = settings.bmdcNo          || "";
  const drPhone = settings.chamberPhone    || "";
  const sigUrl  = settings.signatureUrl    || null;
  const sigMode = settings.signatureMode   || "handwritten";

  const rxNo = rx.rxNo || (rx.id ? rx.id.slice(-8).toUpperCase() : "—");

  const contactParts: string[] = [];
  if (hospAddr)  contactParts.push(`<span>${hospAddr}</span>`);
  if (hospPhone) contactParts.push(`<span>☎ ${hospPhone}</span>`);
  if (hospEmerg) contactParts.push(`<span>🚨 ${hospEmerg}</span>`);
  if (hospEmail) contactParts.push(`<span>✉ ${hospEmail}</span>`);
  if (hospWeb)   contactParts.push(`<span>🌐 ${hospWeb}</span>`);

  const footerParts: string[] = [];
  if (hospNameBn) footerParts.push(hospNameBn);
  if (hospAddr)   footerParts.push(hospAddr);
  if (hospPhone)  footerParts.push(`☎ ${hospPhone}`);
  if (hospEmerg)  footerParts.push(`Emergency: ${hospEmerg}`);
  if (hospWeb)    footerParts.push(hospWeb);

  const items = rx.items || [];
  const medRows = items.map((item, i) => {
    const parts: string[] = [];
    if (item.dose)         parts.push(item.dose);
    if (item.frequency)    parts.push(item.frequency);
    if (item.duration)     parts.push(`× ${item.duration}`);
    if (item.instructions) parts.push(`(${item.instructions})`);
    // Build display name: medicineName + strength (stored separately)
    const dispName = item.medicineName;
    const strength = (item as any).strength || "";
    return `
      <li class="med-item">
        <div>
          <span class="med-num">${i + 1}.</span>
          <span class="med-name">${dispName}</span>
          ${strength ? `<span style="font-size:10px;color:#555;margin-left:4px;font-weight:600">${strength}</span>` : ""}
        </div>
        ${parts.length ? `<div class="med-detail">${parts.join('<span class="dot">·</span>')}</div>` : ""}
      </li>`;
  }).join("");

  const adviceText = rx.advice || rx.instructions || "";

  let sigHTML = "";
  if (sigMode === "uploaded" && sigUrl) {
    sigHTML = `<img src="${sigUrl}" alt="signature" class="sig-img"/>`;
  } else if (sigMode === "handwritten") {
    sigHTML = `<div style="height:40px"></div>`;
  }

  const genderChar = patient?.gender === "MALE" ? "M" : patient?.gender === "FEMALE" ? "F" : "O";

  return `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8"/>
<title>Prescription — ${patient?.nameBn || ""} — ${fmtEn(rx.createdAt)}</title>
<style>${PRINT_CSS}</style>
</head>
<body>
<div style="width:186mm;min-height:277mm;margin:0 auto;position:relative;background:#fff">

${!isFinalized ? `<div class="draft-stamp">DRAFT</div>` : ""}

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

${patient ? `
<div class="patient-bar">
  <div class="pb-cell"><span class="pb-label">Patient</span><span class="pb-value">${patient.nameBn}</span></div>
  <div class="pb-cell"><span class="pb-label">Patient ID</span><span class="pb-value">${patient.patientId}</span></div>
  <div class="pb-cell"><span class="pb-label">Age / Sex</span><span class="pb-value">${patient.age ? `${patient.age}y` : "—"} / ${genderChar}</span></div>
  <div class="pb-cell"><span class="pb-label">Date</span><span class="pb-value">${fmtEn(rx.createdAt)}</span></div>
  <div class="pb-cell"><span class="pb-label">Rx No.</span><span class="pb-value" style="font-family:monospace;font-size:9.5px">${rxNo}</span></div>
</div>` : ""}

<div class="rx-body">
  <div class="col-left">
    ${rx.chiefComplaint ? `<div class="sec-head">Chief Complaint</div><p class="clinical-text">${rx.chiefComplaint}</p>` : ""}
    ${rx.history ? `<div class="sec-head">History</div><p class="clinical-text">${rx.history}</p>` : ""}

    ${(hasVA || hasIOP) ? `
    <div class="sec-head">Eye Examination</div>
    <table class="eye-tbl">
      <thead><tr>
        <th class="left" style="width:30%">Eye</th>
        ${hasVA  ? `<th>VA</th>` : ""}
        ${hasIOP ? `<th>IOP</th>` : ""}
      </tr></thead>
      <tbody>
        <tr>
          <td class="eye-lbl">OD (Right)</td>
          ${hasVA  ? `<td>${rx.vaRightEye  || "—"}</td>` : ""}
          ${hasIOP ? `<td>${rx.iopRightEye || "—"}</td>` : ""}
        </tr>
        <tr>
          <td class="eye-lbl">OS (Left)</td>
          ${hasVA  ? `<td>${rx.vaLeftEye  || "—"}</td>` : ""}
          ${hasIOP ? `<td>${rx.iopLeftEye || "—"}</td>` : ""}
        </tr>
      </tbody>
    </table>` : ""}

    ${hasRef ? `
    <div class="sec-head" style="margin-top:8px">Refraction</div>
    <table class="ref-tbl">
      <thead><tr>
        <th style="text-align:left;padding-left:5px">Eye</th>
        <th>SPH</th><th>CYL</th><th>AXIS</th><th>ADD</th>
      </tr></thead>
      <tbody>
        <tr>
          <td class="lbl">OD</td>
          <td>${reRE?.sph||"—"}</td><td>${reRE?.cyl||"—"}</td><td>${reRE?.axis||"—"}</td><td>${reRE?.add||"—"}</td>
        </tr>
        <tr>
          <td class="lbl">OS</td>
          <td>${reLE?.sph||"—"}</td><td>${reLE?.cyl||"—"}</td><td>${reLE?.axis||"—"}</td><td>${reLE?.add||"—"}</td>
        </tr>
      </tbody>
    </table>` : ""}

    ${rx.diagnosis ? `<div class="sec-head">Diagnosis</div><p class="diag-text">${rx.diagnosis}</p>` : ""}
    ${rx.investigations ? `<div class="sec-head">Investigation</div><p class="clinical-text">${rx.investigations}</p>` : ""}
    ${rx.examNotes ? `<div class="sec-head">Examination Notes</div><p class="clinical-text" style="font-size:9.5px;color:#444">${rx.examNotes}</p>` : ""}
  </div>

  <div class="col-divider"></div>

  <div class="col-right">
    ${items.length > 0 ? `
    <div class="rx-sym-row">
      <span class="rx-sym">&#8478;</span>
      <span class="rx-label">Medicines</span>
    </div>
    <ul class="med-list">${medRows}</ul>` : ""}

    ${adviceText ? `<div class="sec-head" style="margin-top:16px">Advice</div><p class="advice-text">${adviceText.replace(/\n/g,"<br/>")}</p>` : ""}

    ${rx.followUpDate ? `
    <div style="margin-top:14px">
      <div class="sec-head">Follow-up</div>
      <div class="followup-box">
        <span class="fu-label">Next Visit:</span>
        <span class="fu-date">${fmtEn(rx.followUpDate)}</span>
        ${rx.followUpNote ? `<span class="fu-note">— ${rx.followUpNote}</span>` : ""}
      </div>
    </div>` : ""}

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

<div class="rx-footer">
  <div class="footer-left">
    ${footerParts.join(" &nbsp;|&nbsp; ")}
    ${footerText ? `<br/>${footerText}` : ""}
  </div>
  <div class="footer-right">Rx# ${rxNo}<br/>${fmtEn(rx.createdAt)}</div>
</div>

</div>
</body>
</html>`;
}
