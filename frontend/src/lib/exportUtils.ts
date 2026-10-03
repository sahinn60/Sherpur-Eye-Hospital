import * as XLSX from "xlsx";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB");
}

function fmtMins(mins: number): string {
  if (!mins) return "0";
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const STATUS_EN: Record<string, string> = {
  PRESENT: "Present", LATE: "Late", ABSENT: "Absent", LEAVE: "Leave", HOLIDAY: "Holiday",
};

// ─── Excel export ─────────────────────────────────────────────────────────────

export function exportToExcel(rows: any[], filename: string, sheetName = "Report") {
  const ws   = XLSX.utils.aoa_to_sheet(rows);
  const wb   = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function buildAttendanceExcelRows(records: any[]): any[][] {
  const header = ["#", "Employee ID", "Name", "Department", "Date", "Status",
                  "Check-In", "Check-Out", "Working Hours", "Late (min)", "Early Out (min)"];
  const data = records.map((r, i) => {
    const name  = r.user?.employee?.nameBn || r.user?.doctor?.nameBn || r.user?.name || "—";
    const empId = r.user?.employee?.employeeId || "—";
    const dept  = r.user?.employee?.department?.name || "—";
    return [
      i + 1, empId, name, dept,
      fmtDate(r.date),
      STATUS_EN[r.status] || r.status,
      fmtTime(r.checkIn),
      fmtTime(r.checkOut),
      fmtMins(r.workingMinutes),
      r.lateMinutes || 0,
      r.earlyCheckoutMinutes || 0,
    ];
  });
  return [header, ...data];
}

export function buildEmployeeExcelRows(employees: any[]): any[][] {
  const header = ["#", "Employee ID", "Name", "Department", "Designation",
                  "Present", "Late", "Absent", "Leave", "Total Days",
                  "Total Late (min)", "Total Working Hours"];
  const data = employees.map((e, i) => [
    i + 1, e.empId, e.name, e.dept, e.desig,
    e.summary.present, e.summary.late, e.summary.absent, e.summary.leave,
    e.summary.totalDays,
    e.summary.totalLateMinutes,
    fmtMins(e.summary.totalWorkingMinutes),
  ]);
  return [header, ...data];
}

export function buildDeptExcelRows(departments: any[]): any[][] {
  const header = ["#", "Department", "Employees", "Present", "Late", "Absent", "Leave",
                  "Total Late (min)", "Total Working Hours"];
  const data = departments.map((d, i) => [
    i + 1, d.name, d.employeeCount,
    d.summary.present, d.summary.late, d.summary.absent, d.summary.leave,
    d.summary.totalLateMinutes,
    fmtMins(d.summary.totalWorkingMinutes),
  ]);
  return [header, ...data];
}

// ─── PDF export ───────────────────────────────────────────────────────────────

export async function exportToPDF(
  title: string,
  subtitle: string,
  headers: string[],
  rows: (string | number)[][],
  filename: string,
) {
  // Dynamic import to avoid SSR issues
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: rows[0]?.length > 8 ? "landscape" : "portrait" });

  // Header
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(subtitle, 14, 26);
  doc.text(`Generated: ${new Date().toLocaleString("en-GB")}`, 14, 32);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 38,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  doc.save(`${filename}.pdf`);
}

export function buildAttendancePDFRows(records: any[]): (string | number)[][] {
  return records.map((r, i) => {
    const name  = r.user?.employee?.nameBn || r.user?.doctor?.nameBn || r.user?.name || "—";
    const empId = r.user?.employee?.employeeId || "—";
    const dept  = r.user?.employee?.department?.name || "—";
    return [
      i + 1, empId, name, dept,
      fmtDate(r.date),
      STATUS_EN[r.status] || r.status,
      fmtTime(r.checkIn),
      fmtTime(r.checkOut),
      fmtMins(r.workingMinutes),
      r.lateMinutes || 0,
    ];
  });
}

export function buildEmployeePDFRows(employees: any[]): (string | number)[][] {
  return employees.map((e, i) => [
    i + 1, e.empId, e.name, e.dept,
    e.summary.present, e.summary.late, e.summary.absent, e.summary.leave,
    e.summary.totalDays, e.summary.totalLateMinutes,
    fmtMins(e.summary.totalWorkingMinutes),
  ]);
}

export function buildDeptPDFRows(departments: any[]): (string | number)[][] {
  return departments.map((d, i) => [
    i + 1, d.name, d.employeeCount,
    d.summary.present, d.summary.late, d.summary.absent, d.summary.leave,
    d.summary.totalLateMinutes, fmtMins(d.summary.totalWorkingMinutes),
  ]);
}

// ─── Finance exports ──────────────────────────────────────────────────────────

const MONTHS_BN = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];

export function buildIncomeExcelRows(items: any[]): any[][] {
  const header = ["#","তারিখ","ক্যাটাগরি","বিবরণ","পরিমাণ (৳)","নোট"];
  return [header, ...items.map((r,i) => [i+1, fmtDate(r.date), r.category, r.description, r.amount, r.note||""])];
}

export function buildExpenseExcelRows(items: any[]): any[][] {
  const header = ["#","তারিখ","ক্যাটাগরি","বিবরণ","পরিমাণ (৳)","নোট"];
  return [header, ...items.map((r,i) => [i+1, fmtDate(r.date), r.category, r.description, r.amount, r.note||""])];
}

export function buildDailyFinanceExcelRows(rows: any[]): any[][] {
  const header = ["তারিখ","আয় (৳)","ব্যয় (৳)","নিট (৳)"];
  return [header, ...rows.map((r) => [r.date, r.income.toFixed(2), r.expense.toFixed(2), r.net.toFixed(2)])];
}

export function buildMonthlyFinanceExcelRows(rows: any[], year: number): any[][] {
  const header = ["মাস","আয় (৳)","ব্যয় (৳)","নিট (৳)"];
  return [header, ...rows.map((r) => [MONTHS_BN[r.month-1], r.income.toFixed(2), r.expense.toFixed(2), r.net.toFixed(2)])];
}

export function buildIncomePDFRows(items: any[]): (string|number)[][] {
  return items.map((r,i) => [i+1, fmtDate(r.date), r.category, r.description, `${r.amount.toFixed(2)}`, r.note||""]);
}
export function buildExpensePDFRows(items: any[]): (string|number)[][] {
  return items.map((r,i) => [i+1, fmtDate(r.date), r.category, r.description, `${r.amount.toFixed(2)}`, r.note||""]);
}
export function buildDailyFinancePDFRows(rows: any[]): (string|number)[][] {
  return rows.map((r) => [r.date, r.income.toFixed(2), r.expense.toFixed(2), r.net.toFixed(2)]);
}
export function buildMonthlyFinancePDFRows(rows: any[]): (string|number)[][] {
  return rows.map((r) => [MONTHS_BN[r.month-1], r.income.toFixed(2), r.expense.toFixed(2), r.net.toFixed(2)]);
}

// ─── Inventory exports ────────────────────────────────────────────────────────

export function buildInventoryExcelRows(items: any[]): any[][] {
  const header = ["#","SKU","নাম","ক্যাটাগরি","সাপ্লায়ার","একক","স্টক","ন্যূনতম","ক্রয় মূল্য","বিক্রয় মূল্য","মেয়াদ","স্ট্যাটাস"];
  return [header, ...items.map((r, i) => [
    i + 1, r.sku, r.nameBn, r.category, r.supplier?.name || "—",
    r.unit, r.stockQty, r.minStock,
    r.purchasePrice.toFixed(2), r.sellingPrice.toFixed(2),
    r.expiryDate ? fmtDate(r.expiryDate) : "—",
    r.isActive ? "সক্রিয়" : "নিষ্ক্রিয়",
  ])];
}

export function buildInventoryPDFRows(items: any[]): (string | number)[][] {
  return items.map((r, i) => [
    i + 1, r.sku, r.nameBn, r.category,
    r.supplier?.name || "—", r.unit,
    r.stockQty, r.minStock,
    `৳${r.purchasePrice.toFixed(0)}`,
    r.expiryDate ? fmtDate(r.expiryDate) : "—",
  ]);
}

export function buildStockHistoryExcelRows(item: any, history: any[]): any[][] {
  const header = ["#","ধরন","পরিমাণ","আগে","পরে","একক মূল্য","নোট","তারিখ"];
  return [header, ...history.map((h, i) => [
    i + 1, h.type, h.quantity, h.qtyBefore, h.qtyAfter,
    h.unitCost ? `৳${h.unitCost.toFixed(2)}` : "—",
    h.note || "—",
    fmtDate(h.createdAt),
  ])];
}
