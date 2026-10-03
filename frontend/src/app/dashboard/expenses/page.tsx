"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Download, Filter, TrendingDown } from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { Modal, Button } from "@/components/ui";
import { EntryForm } from "@/components/finance";
import { fetchExpenses, addExpense, removeExpense } from "@/lib/services/financeService";
import { exportToExcel, exportToPDF, buildExpenseExcelRows, buildExpensePDFRows } from "@/lib/exportUtils";
import { ExpenseEntry, EXPENSE_CATEGORY_BN, EXPENSE_CATEGORY_COLOR, ExpenseCategory } from "@/types/finance";

const CATS = Object.keys(EXPENSE_CATEGORY_BN) as ExpenseCategory[];

function fmt(d: string) { return new Date(d).toLocaleDateString("bn-BD", { day:"numeric", month:"short", year:"numeric" }); }

export default function ExpensesPage() {
  const [entries,    setEntries]    = useState<ExpenseEntry[]>([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [catFilter,  setCatFilter]  = useState("");
  const [dateFrom,   setDateFrom]   = useState("");
  const [dateTo,     setDateTo]     = useState("");
  const [showForm,   setShowForm]   = useState(false);
  const [formError,  setFormError]  = useState("");
  const [totalAmt,   setTotalAmt]   = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchExpenses({ category: catFilter||undefined, dateFrom: dateFrom||undefined, dateTo: dateTo||undefined, page, limit: 30 });
      setEntries(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setTotalAmt(res.items.reduce((s, r) => s + r.amount, 0));
    } finally { setLoading(false); }
  }, [catFilter, dateFrom, dateTo, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [catFilter, dateFrom, dateTo]);

  async function handleAdd(data: any) {
    setFormError("");
    try { await addExpense(data); setShowForm(false); load(); }
    catch (e: any) { setFormError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleDelete(id: string) {
    if (!confirm("এই এন্ট্রি মুছে ফেলতে চান?")) return;
    try { await removeExpense(id); load(); }
    catch (e: any) { alert(e?.response?.data?.message || "মুছতে পারেনি"); }
  }

  async function handleExportExcel() {
    const all = await fetchExpenses({ category: catFilter||undefined, dateFrom: dateFrom||undefined, dateTo: dateTo||undefined, limit: 9999, page: 1 });
    exportToExcel(buildExpenseExcelRows(all.items), `expenses-${Date.now()}`, "ব্যয়");
  }

  async function handleExportPDF() {
    const all = await fetchExpenses({ category: catFilter||undefined, dateFrom: dateFrom||undefined, dateTo: dateTo||undefined, limit: 9999, page: 1 });
    await exportToPDF("ব্যয় রিপোর্ট", `মোট: ৳${all.items.reduce((s,r)=>s+r.amount,0).toFixed(2)}`,
      ["#","তারিখ","ক্যাটাগরি","বিবরণ","পরিমাণ (৳)","নোট"],
      buildExpensePDFRows(all.items), `expenses-${Date.now()}`);
  }

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN","ADMIN","ACCOUNTANT"]}>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">ব্যয় ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-500 mt-0.5">মোট {total}টি এন্ট্রি</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={handleExportExcel} className="flex items-center gap-1.5"><Download size={14}/> Excel</Button>
            <Button size="sm" variant="secondary" onClick={handleExportPDF}   className="flex items-center gap-1.5"><Download size={14}/> PDF</Button>
            <Button size="sm" onClick={() => { setFormError(""); setShowForm(true); }} className="flex items-center gap-2"><Plus size={15}/> ব্যয় যোগ</Button>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600"><TrendingDown size={20}/></div>
          <div>
            <p className="text-xs text-red-600">এই পেজের মোট ব্যয়</p>
            <p className="text-2xl font-bold text-red-700">৳{totalAmt.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
          <Filter size={14} className="text-gray-400"/>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
            <option value="">সব ক্যাটাগরি</option>
            {CATS.map((c) => <option key={c} value={c}>{EXPENSE_CATEGORY_BN[c]}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"/>
          <span className="text-gray-400 text-xs">থেকে</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"/>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["তারিখ","ক্যাটাগরি","বিবরণ","পরিমাণ","নোট",""].map((h) => (
                    <th key={h} className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${h==="পরিমাণ"?"text-right":"text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? Array.from({length:5}).map((_,i) => (
                  <tr key={i}>{Array.from({length:6}).map((_,j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse"/></td>)}</tr>
                )) : entries.length === 0 ? (
                  <tr><td colSpan={6} className="py-14 text-center text-gray-400 text-sm">কোনো ব্যয়ের এন্ট্রি নেই</td></tr>
                ) : entries.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{fmt(e.date)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EXPENSE_CATEGORY_COLOR[e.category]}`}>
                        {EXPENSE_CATEGORY_BN[e.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{e.description}</td>
                    <td className="px-4 py-3 text-sm font-bold text-red-600 text-right">৳{e.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-[160px] truncate">{e.note||"—"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(e.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={14}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {entries.length > 0 && (
                <tfoot>
                  <tr className="bg-red-50 border-t-2 border-red-200">
                    <td colSpan={3} className="px-4 py-2 text-sm font-bold text-red-700">মোট</td>
                    <td className="px-4 py-2 text-sm font-bold text-red-700 text-right">৳{totalAmt.toFixed(2)}</td>
                    <td colSpan={2}/>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">মোট {total}টি</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={page<=1} onClick={() => setPage(p=>p-1)}>←</Button>
                <span className="text-xs text-gray-500 self-center">{page}/{totalPages}</span>
                <Button size="sm" variant="secondary" disabled={page>=totalPages} onClick={() => setPage(p=>p+1)}>→</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <Modal open onClose={() => setShowForm(false)} title="নতুন ব্যয় যোগ" size="md">
          <EntryForm type="expense" categories={EXPENSE_CATEGORY_BN} onSubmit={handleAdd} onCancel={() => setShowForm(false)} error={formError}/>
        </Modal>
      )}
    </RouteGuard>
  );
}
