"use client";

import { useState, useCallback } from "react";
import { FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import {
  fetchDailyReport, fetchWeeklyReport, fetchMonthlyReport,
  fetchEmployeeReport, fetchDepartmentReport,
} from "@/lib/services/attendanceService";
import {
  DailyReport, WeeklyReport, MonthlyReport,
  EmployeeReport, DepartmentReport, ReportSummary,
} from "@/types/attendance";
import {
  exportToExcel, exportToPDF,
  buildAttendanceExcelRows, buildEmployeeExcelRows, buildDeptExcelRows,
  buildAttendancePDFRows, buildEmployeePDFRows, buildDeptPDFRows,
} from "@/lib/exportUtils";
import { Button } from "@/components/ui";

type ReportType = "daily" | "weekly" | "monthly" | "employee" | "department";

const STATUS_BN: Record<string, string> = {
  PRESENT:"উপস্থিত", LATE:"দেরিতে", ABSENT:"অনুপস্থিত", LEAVE:"ছুটি", HOLIDAY:"ছুটির দিন",
};
const STATUS_CLS: Record<string, string> = {
  PRESENT:"bg-emerald-50 text-emerald-700", LATE:"bg-amber-50 text-amber-700",
  ABSENT:"bg-red-50 text-red-700", LEAVE:"bg-blue-50 text-blue-700", HOLIDAY:"bg-purple-50 text-purple-700",
};

function fmtTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit", hour12: true });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}
function fmtMins(mins: number) {
  if (!mins) return "—";
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? `${h}ঘ ${m}মি` : `${m}মি`;
}

function SummaryBar({ s }: { s: ReportSummary }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
      {[
        { label: "উপস্থিত",   v: s.present,          cls: "text-emerald-600" },
        { label: "দেরিতে",    v: s.late,              cls: "text-amber-600" },
        { label: "অনুপস্থিত", v: s.absent,            cls: "text-red-600" },
        { label: "ছুটি",      v: s.leave,             cls: "text-blue-600" },
        { label: "মোট দেরি",  v: `${s.totalLateMinutes}মি`, cls: "text-orange-600" },
        { label: "কাজের সময়", v: fmtMins(s.totalWorkingMinutes), cls: "text-primary-600" },
      ].map((c) => (
        <div key={c.label} className="bg-white rounded-xl border border-gray-200 px-3 py-2 text-center">
          <p className={`text-lg font-bold ${c.cls}`}>{c.v}</p>
          <p className="text-xs text-gray-400 mt-0.5">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

function AttendanceTable({ rows }: { rows: any[] }) {
  if (!rows.length) return <p className="text-center text-gray-400 text-sm py-8">কোনো রেকর্ড নেই</p>;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {["কর্মী","বিভাগ","তারিখ","চেক-ইন","চেক-আউট","কাজের সময়","দেরি","অবস্থা"].map((h) => (
              <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const name = r.user?.employee?.nameBn || r.user?.doctor?.nameBn || r.user?.name || "—";
            const dept = r.user?.employee?.department?.name || "—";
            return (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2.5">
                  <p className="font-medium text-gray-800 whitespace-nowrap">{name}</p>
                  <p className="text-xs text-gray-400">{r.user?.employee?.employeeId || ""}</p>
                </td>
                <td className="px-3 py-2.5 text-gray-500 text-xs whitespace-nowrap">{dept}</td>
                <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{fmtDate(r.date)}</td>
                <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{fmtTime(r.checkIn)}</td>
                <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{fmtTime(r.checkOut)}</td>
                <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{fmtMins(r.workingMinutes)}</td>
                <td className="px-3 py-2.5 text-amber-600 text-xs whitespace-nowrap">
                  {r.lateMinutes > 0 ? `${r.lateMinutes}মি` : "—"}
                </td>
                <td className="px-3 py-2.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${STATUS_CLS[r.status] || ""}`}>
                    {STATUS_BN[r.status] || r.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function AttendanceReports() {
  const [type, setType]       = useState<ReportType>("daily");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError]     = useState("");

  // Filters
  const today = new Date().toISOString().split("T")[0];
  const [date,         setDate]         = useState(today);
  const [dateFrom,     setDateFrom]     = useState(() => { const d = new Date(); d.setDate(1); return d.toISOString().split("T")[0]; });
  const [dateTo,       setDateTo]       = useState(today);
  const [year,         setYear]         = useState(new Date().getFullYear());
  const [month,        setMonth]        = useState(new Date().getMonth() + 1);
  const [departmentId, setDepartmentId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Report data
  const [daily,  setDaily]  = useState<DailyReport | null>(null);
  const [weekly, setWeekly] = useState<WeeklyReport | null>(null);
  const [monthly,setMonthly]= useState<MonthlyReport | null>(null);
  const [empRpt, setEmpRpt] = useState<EmployeeReport | null>(null);
  const [deptRpt,setDeptRpt]= useState<DepartmentReport | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      if (type === "daily")      setDaily(await fetchDailyReport({ date, departmentId: departmentId || undefined, status: statusFilter || undefined }));
      if (type === "weekly")     setWeekly(await fetchWeeklyReport({ dateFrom, dateTo, departmentId: departmentId || undefined }));
      if (type === "monthly")    setMonthly(await fetchMonthlyReport({ year, month, departmentId: departmentId || undefined }));
      if (type === "employee")   setEmpRpt(await fetchEmployeeReport({ dateFrom, dateTo, departmentId: departmentId || undefined }));
      if (type === "department") setDeptRpt(await fetchDepartmentReport({ dateFrom, dateTo }));
    } catch (e: any) {
      setError(e?.response?.data?.message || "লোড করতে সমস্যা হয়েছে");
    } finally { setLoading(false); }
  }, [type, date, dateFrom, dateTo, year, month, departmentId, statusFilter]);

  // ── Export helpers ────────────────────────────────────────────────────────

  async function handleExcelExport() {
    setExporting(true);
    try {
      if (type === "daily" && daily) {
        exportToExcel(buildAttendanceExcelRows(daily.rows), `daily-report-${date}`, "Daily");
      } else if (type === "weekly" && weekly) {
        const allRows = weekly.days.flatMap((d) => d.rows);
        exportToExcel(buildAttendanceExcelRows(allRows), `weekly-report-${dateFrom}-${dateTo}`, "Weekly");
      } else if (type === "monthly" && monthly) {
        exportToExcel(buildAttendanceExcelRows(monthly.rows), `monthly-report-${year}-${month}`, "Monthly");
      } else if (type === "employee" && empRpt) {
        exportToExcel(buildEmployeeExcelRows(empRpt.employees), `employee-report-${dateFrom}-${dateTo}`, "Employees");
      } else if (type === "department" && deptRpt) {
        exportToExcel(buildDeptExcelRows(deptRpt.departments), `department-report-${dateFrom}-${dateTo}`, "Departments");
      }
    } finally { setExporting(false); }
  }

  async function handlePDFExport() {
    setExporting(true);
    try {
      const ATTEND_HEADERS = ["#","Emp ID","Name","Dept","Date","Status","In","Out","Hours","Late(m)"];
      const EMP_HEADERS    = ["#","Emp ID","Name","Dept","Present","Late","Absent","Leave","Days","Late(m)","Hours"];
      const DEPT_HEADERS   = ["#","Department","Employees","Present","Late","Absent","Leave","Late(m)","Hours"];

      if (type === "daily" && daily) {
        await exportToPDF("Daily Attendance Report", `Date: ${date}`, ATTEND_HEADERS,
          buildAttendancePDFRows(daily.rows), `daily-report-${date}`);
      } else if (type === "weekly" && weekly) {
        const allRows = weekly.days.flatMap((d) => d.rows);
        await exportToPDF("Weekly Attendance Report", `${dateFrom} to ${dateTo}`, ATTEND_HEADERS,
          buildAttendancePDFRows(allRows), `weekly-report`);
      } else if (type === "monthly" && monthly) {
        await exportToPDF("Monthly Attendance Report", `${year}-${String(month).padStart(2,"0")}`, ATTEND_HEADERS,
          buildAttendancePDFRows(monthly.rows), `monthly-report-${year}-${month}`);
      } else if (type === "employee" && empRpt) {
        await exportToPDF("Employee-wise Report", `${dateFrom} to ${dateTo}`, EMP_HEADERS,
          buildEmployeePDFRows(empRpt.employees), `employee-report`);
      } else if (type === "department" && deptRpt) {
        await exportToPDF("Department-wise Report", `${dateFrom} to ${dateTo}`, DEPT_HEADERS,
          buildDeptPDFRows(deptRpt.departments), `department-report`);
      }
    } finally { setExporting(false); }
  }

  // ── Current report data ───────────────────────────────────────────────────

  const hasData = (type === "daily" && daily) || (type === "weekly" && weekly) ||
                  (type === "monthly" && monthly) || (type === "employee" && empRpt) ||
                  (type === "department" && deptRpt);

  const MONTHS = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন",
                  "জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];

  return (
    <div className="space-y-4">

      {/* Report type tabs */}
      <div className="flex flex-wrap gap-2">
        {([
          ["daily","দৈনিক"],["weekly","সাপ্তাহিক"],["monthly","মাসিক"],
          ["employee","কর্মী-ভিত্তিক"],["department","বিভাগ-ভিত্তিক"],
        ] as [ReportType, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setType(t)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${
              type === t
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-primary-400"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {type === "daily" && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">তারিখ</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
          )}
          {(type === "weekly" || type === "employee" || type === "department") && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">শুরু</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">শেষ</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
            </>
          )}
          {type === "monthly" && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">বছর</label>
                <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 w-24 focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">মাস</label>
                <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
                  {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                </select>
              </div>
            </>
          )}
          {type !== "department" && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">অবস্থা</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
                <option value="">সব</option>
                <option value="PRESENT">উপস্থিত</option>
                <option value="LATE">দেরিতে</option>
                <option value="ABSENT">অনুপস্থিত</option>
                <option value="LEAVE">ছুটি</option>
              </select>
            </div>
          )}
          <Button onClick={load} loading={loading} size="sm" className="flex items-center gap-1.5 self-end">
            <RefreshCw size={13} /> রিপোর্ট দেখুন
          </Button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {/* Export buttons */}
      {hasData && (
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="secondary" onClick={handleExcelExport} loading={exporting}
            className="flex items-center gap-1.5">
            <FileSpreadsheet size={14} className="text-emerald-600" /> Excel
          </Button>
          <Button size="sm" variant="secondary" onClick={handlePDFExport} loading={exporting}
            className="flex items-center gap-1.5">
            <FileText size={14} className="text-red-500" /> PDF
          </Button>
        </div>
      )}

      {/* ── Daily ── */}
      {type === "daily" && daily && (
        <div>
          <SummaryBar s={daily.summary} />
          <AttendanceTable rows={daily.rows} />
        </div>
      )}

      {/* ── Weekly ── */}
      {type === "weekly" && weekly && (
        <div className="space-y-4">
          <SummaryBar s={weekly.summary} />
          {weekly.days.map((day) => (
            <div key={day.date}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-gray-700">{fmtDate(day.date)}</span>
                <span className="text-xs text-gray-400">({day.rows.length} রেকর্ড)</span>
              </div>
              <AttendanceTable rows={day.rows} />
            </div>
          ))}
        </div>
      )}

      {/* ── Monthly ── */}
      {type === "monthly" && monthly && (
        <div>
          <SummaryBar s={monthly.summary} />
          <AttendanceTable rows={monthly.rows} />
        </div>
      )}

      {/* ── Employee-wise ── */}
      {type === "employee" && empRpt && (
        <div className="space-y-4">
          {empRpt.employees.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">কোনো রেকর্ড নেই</p>
          ) : (
            <>
              {/* Summary table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["কর্মী","বিভাগ","উপস্থিত","দেরিতে","অনুপস্থিত","ছুটি","মোট দিন","মোট দেরি","কাজের সময়"].map((h) => (
                        <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {empRpt.employees.map((e) => (
                      <tr key={e.userId} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-3 py-2.5">
                          <p className="font-medium text-gray-800">{e.name}</p>
                          <p className="text-xs text-gray-400 font-mono">{e.empId}</p>
                        </td>
                        <td className="px-3 py-2.5 text-gray-500 text-xs">{e.dept}</td>
                        <td className="px-3 py-2.5 text-emerald-600 font-semibold">{e.summary.present}</td>
                        <td className="px-3 py-2.5 text-amber-600 font-semibold">{e.summary.late}</td>
                        <td className="px-3 py-2.5 text-red-600 font-semibold">{e.summary.absent}</td>
                        <td className="px-3 py-2.5 text-blue-600 font-semibold">{e.summary.leave}</td>
                        <td className="px-3 py-2.5 text-gray-700">{e.summary.totalDays}</td>
                        <td className="px-3 py-2.5 text-orange-600">{e.summary.totalLateMinutes}মি</td>
                        <td className="px-3 py-2.5 text-primary-600">{fmtMins(e.summary.totalWorkingMinutes)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Department-wise ── */}
      {type === "department" && deptRpt && (
        <div>
          <SummaryBar s={deptRpt.summary} />
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["বিভাগ","কর্মী সংখ্যা","উপস্থিত","দেরিতে","অনুপস্থিত","ছুটি","মোট দেরি","কাজের সময়"].map((h) => (
                    <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deptRpt.departments.map((d) => (
                  <tr key={d.deptId} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-800">{d.name}</td>
                    <td className="px-3 py-2.5 text-gray-600">{d.employeeCount}</td>
                    <td className="px-3 py-2.5 text-emerald-600 font-semibold">{d.summary.present}</td>
                    <td className="px-3 py-2.5 text-amber-600 font-semibold">{d.summary.late}</td>
                    <td className="px-3 py-2.5 text-red-600 font-semibold">{d.summary.absent}</td>
                    <td className="px-3 py-2.5 text-blue-600 font-semibold">{d.summary.leave}</td>
                    <td className="px-3 py-2.5 text-orange-600">{d.summary.totalLateMinutes}মি</td>
                    <td className="px-3 py-2.5 text-primary-600">{fmtMins(d.summary.totalWorkingMinutes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!hasData && !loading && (
        <div className="text-center py-12 text-gray-400 text-sm">
          ফিল্টার সেট করে "রিপোর্ট দেখুন" বাটনে ক্লিক করুন
        </div>
      )}
    </div>
  );
}
