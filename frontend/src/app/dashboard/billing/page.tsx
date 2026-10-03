"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Filter, Receipt, TrendingUp, AlertCircle, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RouteGuard } from "@/components/auth";
import { Modal, Button } from "@/components/ui";
import { InvoiceForm, InvoiceRow, InvoicePrint, PaymentModal } from "@/components/billing";
import {
  fetchInvoices, fetchInvoice, createInvoice, addPayment, fetchDueSummary,
} from "@/lib/services/billingService";
import { Invoice, DueSummary, INVOICE_STATUS_CONFIG, InvoiceStatus } from "@/types/billing";

const STATUSES = Object.keys(INVOICE_STATUS_CONFIG) as InvoiceStatus[];

export default function BillingPage() {
  const { isAdmin, hasRole } = useAuth();
  const canWrite = isAdmin || hasRole("ACCOUNTANT", "RECEPTION");
  const canPay   = isAdmin || hasRole("ACCOUNTANT");

  const [invoices,   setInvoices]   = useState<Invoice[]>([]);
  const [summary,    setSummary]    = useState<DueSummary | null>(null);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom,   setDateFrom]   = useState("");
  const [dateTo,     setDateTo]     = useState("");

  const [showCreate,  setShowCreate]  = useState(false);
  const [createError, setCreateError] = useState("");
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [printInvoice,setPrintInvoice]= useState<Invoice | null>(null);
  const [payInvoice,  setPayInvoice]  = useState<Invoice | null>(null);
  const [payError,    setPayError]    = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [res, sum] = await Promise.all([
        fetchInvoices({ search: search || undefined, status: statusFilter || undefined,
          dateFrom: dateFrom || undefined, dateTo: dateTo || undefined, page, limit: 20 }),
        fetchDueSummary(),
      ]);
      setInvoices(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setSummary(sum);
    } finally { setLoading(false); }
  }, [search, statusFilter, dateFrom, dateTo, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, statusFilter, dateFrom, dateTo]);

  async function handleCreate(data: any) {
    setCreateError("");
    try {
      await createInvoice(data);
      setShowCreate(false);
      load();
    } catch (e: any) {
      setCreateError(e?.response?.data?.message || "সমস্যা হয়েছে");
      throw e;
    }
  }

  async function handlePay(data: any) {
    if (!payInvoice) return;
    setPayError("");
    try {
      const updated = await addPayment(payInvoice.id, data);
      setPayInvoice(null);
      // refresh view if open
      if (viewInvoice?.id === payInvoice.id) setViewInvoice(updated);
      load();
    } catch (e: any) {
      setPayError(e?.response?.data?.message || "সমস্যা হয়েছে");
      throw e;
    }
  }

  async function handleViewFull(inv: Invoice) {
    try {
      const full = await fetchInvoice(inv.id);
      setViewInvoice(full);
    } catch { setViewInvoice(inv); }
  }

  async function handlePrintFull(inv: Invoice) {
    try {
      const full = await fetchInvoice(inv.id);
      setPrintInvoice(full);
    } catch { setPrintInvoice(inv); }
  }

  const summaryCards = summary ? [
    { label: "মোট ইনভয়েস",  value: `৳${summary.totalInvoiced.toFixed(0)}`, icon: <Receipt size={18} />,      cls: "text-blue-600",    bg: "bg-blue-50" },
    { label: "মোট পরিশোধ",  value: `৳${summary.totalPaid.toFixed(0)}`,     icon: <TrendingUp size={18} />,   cls: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "মোট বকেয়া",   value: `৳${summary.totalDue.toFixed(0)}`,      icon: <AlertCircle size={18} />,  cls: "text-red-600",     bg: "bg-red-50" },
    { label: "বকেয়া ইনভয়েস",value: `${summary.overdueCount}টি`,            icon: <Clock size={18} />,        cls: "text-amber-600",   bg: "bg-amber-50" },
  ] : [];

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN","ADMIN","ACCOUNTANT","RECEPTION","DOCTOR"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">বিলিং ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-500 mt-0.5">মোট {total}টি ইনভয়েস</p>
          </div>
          {canWrite && (
            <Button size="sm" onClick={() => { setCreateError(""); setShowCreate(true); }}
              className="flex items-center gap-2">
              <Plus size={15} /> নতুন ইনভয়েস
            </Button>
          )}
        </div>

        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {summaryCards.map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
                <div className={`${s.cls} mb-2`}>{s.icon}</div>
                <p className={`text-xl font-bold ${s.cls}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="ইনভয়েস নং, নাম বা ফোন..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-gray-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option value="">সব স্ট্যাটাস</option>
              {STATUSES.map((s) => <option key={s} value={s}>{INVOICE_STATUS_CONFIG[s].label}</option>)}
            </select>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            <span className="text-gray-400 text-xs">থেকে</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["ইনভয়েস নং","রোগী","মোট","পরিশোধ","বকেয়া","স্ট্যাটাস",""].map((h) => (
                    <th key={h} className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                      ["মোট","পরিশোধ","বকেয়া"].includes(h) ? "text-right" : "text-left"
                    }`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}</tr>
                  ))
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <Receipt size={40} className="mx-auto text-gray-200 mb-3" />
                      <p className="text-gray-400 text-sm">কোনো ইনভয়েস পাওয়া যায়নি</p>
                      {canWrite && (
                        <Button size="sm" className="mt-4" onClick={() => setShowCreate(true)}>
                          <Plus size={14} className="mr-1" /> প্রথম ইনভয়েস তৈরি করুন
                        </Button>
                      )}
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <InvoiceRow key={inv.id} invoice={inv}
                      onView={handleViewFull}
                      onPrint={handlePrintFull}
                      onPay={(i) => { setPayError(""); setPayInvoice(i); }}
                      canPay={canPay} />
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">মোট {total}টি ইনভয়েস</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</Button>
                <span className="text-xs text-gray-500 self-center">{page}/{totalPages}</span>
                <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreate && (
        <Modal open onClose={() => setShowCreate(false)} title="নতুন ইনভয়েস তৈরি" size="xl">
          <InvoiceForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} error={createError} />
        </Modal>
      )}

      {/* View Invoice Modal */}
      {viewInvoice && (
        <Modal open onClose={() => setViewInvoice(null)} title={`ইনভয়েস — ${viewInvoice.invoiceNo}`} size="xl">
          <InvoicePrint invoice={viewInvoice} onClose={() => setViewInvoice(null)} />
          {canPay && viewInvoice.dueAmount > 0 && viewInvoice.status !== "CANCELLED" && (
            <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
              <Button size="sm" onClick={() => { setViewInvoice(null); setPayError(""); setPayInvoice(viewInvoice); }}
                className="flex items-center gap-2">
                পেমেন্ট নিন
              </Button>
            </div>
          )}
        </Modal>
      )}

      {/* Print Modal */}
      {printInvoice && (
        <Modal open onClose={() => setPrintInvoice(null)} title="ইনভয়েস প্রিন্ট" size="xl">
          <InvoicePrint invoice={printInvoice} onClose={() => setPrintInvoice(null)} />
        </Modal>
      )}

      {/* Payment Modal */}
      {payInvoice && (
        <Modal open onClose={() => setPayInvoice(null)} title="পেমেন্ট গ্রহণ" size="sm">
          <PaymentModal
            dueAmount={payInvoice.dueAmount}
            invoiceNo={payInvoice.invoiceNo}
            onSubmit={handlePay}
            onCancel={() => setPayInvoice(null)}
            error={payError}
          />
        </Modal>
      )}
    </RouteGuard>
  );
}
