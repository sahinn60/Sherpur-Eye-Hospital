"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, TrendingUp, TrendingDown, DollarSign, BarChart2, RefreshCw } from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { Button } from "@/components/ui";
import { FinanceBarChart } from "@/components/finance";
import { fetchFinanceSummary, fetchDailyReport, fetchMonthlyReport } from "@/lib/services/financeService";
import {
  exportToExcel, exportToPDF,
  buildDailyFinanceExcelRows, buildMonthlyFinanceExcelRows,
  buildDailyFinancePDFRows, buildMonthlyFinancePDFRows,
} from "@/lib/exportUtils";
import {
  FinanceSummary, DailyRow, MonthlyRow,
  INCOME_CATEGORY_BN, EXPENSE_CATEGORY_BN,
} from "@/types/finance";

type ReportTab = "daily" | "monthly";

const MONTHS_BN = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];

function thisMonthRange() {
  const now   = new Date();
  const from  = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const to    = now.toISOString().split("T")[0];
  return { from, to };
}

export default function ReportsPage() {
  const { from: defaultFrom, to: defaultTo } = thisMonthRange();
  const currentYear = new Date().getFullYear();

  const [tab,      setTab]      = useState<ReportTab>("daily");
  const [dateFrom, setDateFrom] = useState(defaultFrom);
  const [dateTo,   setDateTo]   = useState(defaultTo);
  const [year,     setYear]     = useState(currentYear);
  const [summary,  setSummary]  = useState<FinanceSummary | null>(null);
  const [daily,    setDaily]    = useState<DailyRow[]>([]);
  const [monthly,  setMonthly]  = useState<MonthlyRow[]>([]);
  const [loading,  setLoading]  = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sum, d, m] = await Promise.all([
        fetchFinanceSummary(dateFrom, dateTo),
        fetchDailyReport(dateFrom, dateTo),
        fetchMonthlyReport(year),
      ]);
      setSummary(sum);
      setDaily(d);
      setMonthly(m);
    } finally { setLoading(false); }
  }, [dateFrom, dateTo, year]);

  useEffect(() => { load(); }, [load]);

  // Export daily
  async function exportDailyExcel() { exportToExcel(buildDailyFinanceExcelRows(daily), `daily-finance-${dateFrom}-${dateTo}`, "দৈনিক"); }
  async function exportDailyPDF() {
    await exportToPDF("দৈনিক আর্থিক রিপোর্ট", `${dateFrom} থেকে ${dateTo}`,
      ["তারিখ","আয় (৳)","ব্যয় (৳)","নিট (৳)"],
      buildDailyFinancePDFRows(daily), `daily-finance-${dateFrom}`);
  }
  // Export monthly
  async function exportMonthlyExcel() { exportToExcel(buildMonthlyFinanceExcelRows(monthly, year), `monthly-finance-${year}`, "মাসিক"); }
  async function exportMonthlyPDF() {
    await exportToPDF("মাসিক আর্থিক রিপোর্ট", `সাল: ${year}`,
      ["মাস","আয় (৳)","ব্যয় (৳)","নিট (৳)"],
      buildMonthlyFinancePDFRows(monthly), `monthly-finance-${year}`);
  }

  const summaryCards = summary ? [
    { label: "মোট আয়",   value: summary.totalIncome,   cls: "text-emerald-600", bg: "bg-emerald-50", icon: <TrendingUp size={18}/> },
    { label: "মোট ব্যয়", value: summary.totalExpense,  cls: "text-red-600",     bg: "bg-red-50",     icon: <TrendingDown size={18}/> },
    { label: "নিট পরিমাণ",value: summary.netAmount,     cls: summary.netAmount >= 0 ? "text-blue-600" : "text-red-700", bg: summary.netAmount >= 0 ? "bg-blue-50" : "bg-red-50", icon: <DollarSign size={18}/> },
  ] : [];

  const dailyChartData = daily.map((r) => ({ label: r.date.slice(5), income: r.income, expense: r.expense }));
  const monthlyChartData = monthly.map((r) => ({ label: MONTHS_BN[r.month-1].slice(0,3), income: r.income, expense: r.expense }));

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN","ADMIN","ACCOUNTANT"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">আর্থিক রিপোর্ট</h1>
            <p className="text-sm text-gray-500 mt-0.5">আয়-ব্যয়ের সারসংক্ষেপ</p>
          </div>
          <Button size="sm" variant="secondary" onClick={load} className="flex items-center gap-1.5">
            <RefreshCw size={14}/> রিফ্রেশ
          </Button>
        </div>

        {/* Date filter for summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
          <span className="text-xs font-medium text-gray-500">সারসংক্ষেপ ফিল্টার:</span>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"/>
          <span className="text-gray-400 text-xs">থেকে</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"/>
        </div>

        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {summaryCards.map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-5 border border-white`}>
                <div className={`${s.cls} mb-2`}>{s.icon}</div>
                <p className={`text-2xl font-bold ${s.cls}`}>৳{s.value.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Category breakdown */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Income by category */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">আয়ের ক্যাটাগরি</p>
              <div className="space-y-2">
                {summary.incomeByCategory.length === 0 ? (
                  <p className="text-xs text-gray-400">কোনো ডেটা নেই</p>
                ) : summary.incomeByCategory.map((c) => {
                  const pct = summary.totalIncome > 0 ? (c.amount / summary.totalIncome) * 100 : 0;
                  return (
                    <div key={c.category}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-gray-600">{INCOME_CATEGORY_BN[c.category as keyof typeof INCOME_CATEGORY_BN] || c.category}</span>
                        <span className="font-medium text-emerald-700">৳{c.amount.toFixed(0)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Expense by category */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">ব্যয়ের ক্যাটাগরি</p>
              <div className="space-y-2">
                {summary.expenseByCategory.length === 0 ? (
                  <p className="text-xs text-gray-400">কোনো ডেটা নেই</p>
                ) : summary.expenseByCategory.map((c) => {
                  const pct = summary.totalExpense > 0 ? (c.amount / summary.totalExpense) * 100 : 0;
                  return (
                    <div key={c.category}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-gray-600">{EXPENSE_CATEGORY_BN[c.category as keyof typeof EXPENSE_CATEGORY_BN] || c.category}</span>
                        <span className="font-medium text-red-600">৳{c.amount.toFixed(0)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${pct}%` }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Report tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-200 px-4 bg-gray-50">
            {([
              { key: "daily",   label: "দৈনিক রিপোর্ট",  icon: <BarChart2 size={14}/> },
              { key: "monthly", label: "মাসিক রিপোর্ট",  icon: <BarChart2 size={14}/> },
            ] as const).map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                  tab === t.key ? "border-primary-600 text-primary-700" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {/* ── Daily ── */}
            {tab === "daily" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm font-semibold text-gray-700">দৈনিক আয়-ব্যয় ({dateFrom} — {dateTo})</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={exportDailyExcel} className="flex items-center gap-1.5"><Download size={13}/> Excel</Button>
                    <Button size="sm" variant="secondary" onClick={exportDailyPDF}   className="flex items-center gap-1.5"><Download size={13}/> PDF</Button>
                  </div>
                </div>

                {loading ? <div className="h-48 bg-gray-100 rounded-xl animate-pulse"/> : (
                  <>
                    <FinanceBarChart data={dailyChartData}/>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            {["তারিখ","আয় (৳)","ব্যয় (৳)","নিট (৳)"].map((h) => (
                              <th key={h} className={`px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase ${h==="তারিখ"?"text-left":"text-right"}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {daily.length === 0 ? (
                            <tr><td colSpan={4} className="py-8 text-center text-gray-400 text-sm">কোনো ডেটা নেই</td></tr>
                          ) : daily.map((r) => (
                            <tr key={r.date} className="hover:bg-gray-50">
                              <td className="px-4 py-2.5 text-gray-700">{r.date}</td>
                              <td className="px-4 py-2.5 text-right text-emerald-600 font-medium">৳{r.income.toFixed(2)}</td>
                              <td className="px-4 py-2.5 text-right text-red-600 font-medium">৳{r.expense.toFixed(2)}</td>
                              <td className={`px-4 py-2.5 text-right font-bold ${r.net >= 0 ? "text-blue-700" : "text-red-700"}`}>
                                {r.net >= 0 ? "+" : ""}৳{r.net.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        {daily.length > 0 && (
                          <tfoot>
                            <tr className="bg-gray-50 border-t-2 border-gray-300 font-bold">
                              <td className="px-4 py-2.5 text-gray-700">মোট</td>
                              <td className="px-4 py-2.5 text-right text-emerald-700">৳{daily.reduce((s,r)=>s+r.income,0).toFixed(2)}</td>
                              <td className="px-4 py-2.5 text-right text-red-700">৳{daily.reduce((s,r)=>s+r.expense,0).toFixed(2)}</td>
                              <td className={`px-4 py-2.5 text-right ${daily.reduce((s,r)=>s+r.net,0)>=0?"text-blue-700":"text-red-700"}`}>
                                ৳{daily.reduce((s,r)=>s+r.net,0).toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Monthly ── */}
            {tab === "monthly" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-gray-700">মাসিক রিপোর্ট</p>
                    <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500">
                      {[currentYear, currentYear-1, currentYear-2].map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={exportMonthlyExcel} className="flex items-center gap-1.5"><Download size={13}/> Excel</Button>
                    <Button size="sm" variant="secondary" onClick={exportMonthlyPDF}   className="flex items-center gap-1.5"><Download size={13}/> PDF</Button>
                  </div>
                </div>

                {loading ? <div className="h-48 bg-gray-100 rounded-xl animate-pulse"/> : (
                  <>
                    <FinanceBarChart data={monthlyChartData}/>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            {["মাস","আয় (৳)","ব্যয় (৳)","নিট (৳)"].map((h) => (
                              <th key={h} className={`px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase ${h==="মাস"?"text-left":"text-right"}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {monthly.map((r) => (
                            <tr key={r.month} className={`hover:bg-gray-50 ${r.income===0&&r.expense===0?"opacity-40":""}`}>
                              <td className="px-4 py-2.5 text-gray-700 font-medium">{MONTHS_BN[r.month-1]}</td>
                              <td className="px-4 py-2.5 text-right text-emerald-600 font-medium">৳{r.income.toFixed(2)}</td>
                              <td className="px-4 py-2.5 text-right text-red-600 font-medium">৳{r.expense.toFixed(2)}</td>
                              <td className={`px-4 py-2.5 text-right font-bold ${r.net >= 0 ? "text-blue-700" : "text-red-700"}`}>
                                {r.net >= 0 ? "+" : ""}৳{r.net.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-50 border-t-2 border-gray-300 font-bold">
                            <td className="px-4 py-2.5 text-gray-700">বার্ষিক মোট</td>
                            <td className="px-4 py-2.5 text-right text-emerald-700">৳{monthly.reduce((s,r)=>s+r.income,0).toFixed(2)}</td>
                            <td className="px-4 py-2.5 text-right text-red-700">৳{monthly.reduce((s,r)=>s+r.expense,0).toFixed(2)}</td>
                            <td className={`px-4 py-2.5 text-right ${monthly.reduce((s,r)=>s+r.net,0)>=0?"text-blue-700":"text-red-700"}`}>
                              ৳{monthly.reduce((s,r)=>s+r.net,0).toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
