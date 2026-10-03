"use client";

import { useRef } from "react";
import { Printer, X } from "lucide-react";
import { Invoice, ITEM_TYPE_BN, PAYMENT_METHOD_BN, INVOICE_STATUS_CONFIG } from "@/types/billing";
import { Button } from "@/components/ui";

interface Props { invoice: Invoice; onClose: () => void; }

function fmt(d: string) {
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
}
function fmtTime(d: string) {
  return new Date(d).toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" });
}

export function InvoicePrint({ invoice, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const content = ref.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank", "width=820,height=1000");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
      <title>ইনভয়েস ${invoice.invoiceNo}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Arial,sans-serif;font-size:13px;color:#111;background:#fff}
        .page{width:210mm;min-height:297mm;padding:12mm 14mm 16mm;margin:0 auto}
        .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #1d4ed8;padding-bottom:10px;margin-bottom:12px}
        .hospital-name{font-size:17px;font-weight:700;color:#1d4ed8}
        .hospital-sub{font-size:10px;color:#555;margin-top:2px}
        .inv-meta{text-align:right}
        .inv-no{font-size:15px;font-weight:700;color:#111}
        .inv-date{font-size:11px;color:#555}
        .patient-box{background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:8px 12px;margin-bottom:12px;display:flex;gap:20px;flex-wrap:wrap}
        .patient-box span{font-size:12px;color:#1e40af}
        .patient-box strong{color:#111}
        table{width:100%;border-collapse:collapse;margin-bottom:12px}
        th{background:#1d4ed8;color:#fff;font-size:11px;padding:6px 10px;text-align:left}
        td{padding:7px 10px;font-size:12px;border-bottom:1px solid #e5e7eb;vertical-align:top}
        tr:nth-child(even) td{background:#f9fafb}
        .totals{margin-left:auto;width:240px}
        .totals tr td{border:none;padding:4px 8px}
        .totals .total-row td{font-weight:700;font-size:14px;border-top:2px solid #111;padding-top:6px}
        .status-badge{display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600}
        .payments-section{margin-top:12px}
        .payments-section h3{font-size:12px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
        .footer{margin-top:24px;border-top:1px solid #e5e7eb;padding-top:10px;display:flex;justify-content:space-between;align-items:flex-end}
        .sig-line{border-top:1px solid #111;width:150px;text-align:center;padding-top:4px;font-size:11px;color:#555}
        @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
      </style></head><body><div class="page">${content}</div></body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  }

  const cfg = INVOICE_STATUS_CONFIG[invoice.status];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">ইনভয়েস প্রিভিউ</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={handlePrint} className="flex items-center gap-2"><Printer size={14} /> প্রিন্ট</Button>
          <Button size="sm" variant="secondary" onClick={onClose}><X size={14} /></Button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div ref={ref} className="p-6 text-sm">

          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-blue-700 pb-3 mb-4">
            <div>
              <p className="text-lg font-bold text-blue-700">শেরপুর আধুনিক চক্ষু হাসপাতাল</p>
              <p className="text-xs text-gray-500">ও ফ্যাকো সেন্টার, শেরপুর</p>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-gray-900 font-mono">{invoice.invoiceNo}</p>
              <p className="text-xs text-gray-500">{fmt(invoice.issuedAt)}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
            </div>
          </div>

          {/* Patient */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-4 flex flex-wrap gap-4 text-xs">
            <span><strong>রোগী:</strong> {invoice.patientName}</span>
            {invoice.patient?.patientId && <span><strong>আইডি:</strong> {invoice.patient.patientId}</span>}
            <span><strong>ফোন:</strong> {invoice.patientPhone}</span>
            {invoice.patientAge && <span><strong>বয়স:</strong> {invoice.patientAge} বছর</span>}
            {invoice.doctor && <span><strong>চিকিৎসক:</strong> {invoice.doctor.nameBn}</span>}
          </div>

          {/* Items */}
          <table className="w-full border-collapse text-xs mb-4">
            <thead>
              <tr className="bg-blue-700 text-white">
                {["#","ধরন","বিবরণ","পরিমাণ","একক মূল্য","মোট"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={item.id} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                  <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-2 text-gray-600">{ITEM_TYPE_BN[item.type]}</td>
                  <td className="px-3 py-2 font-medium text-gray-900">{item.description}</td>
                  <td className="px-3 py-2 text-center text-gray-700">{item.quantity}</td>
                  <td className="px-3 py-2 text-right text-gray-700">৳{item.unitPrice.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right font-semibold text-gray-900">৳{item.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-4">
            <table className="w-56 text-sm">
              <tbody>
                <tr><td className="py-1 text-gray-600">সাবটোটাল</td><td className="py-1 text-right font-medium">৳{invoice.subtotal.toFixed(2)}</td></tr>
                {invoice.discountAmt > 0 && (
                  <tr><td className="py-1 text-red-600">ছাড় ({invoice.discountType === "PERCENT" ? `${invoice.discountValue}%` : `৳${invoice.discountValue}`})</td>
                    <td className="py-1 text-right text-red-600">- ৳{invoice.discountAmt.toFixed(2)}</td></tr>
                )}
                <tr className="border-t-2 border-gray-800">
                  <td className="pt-2 font-bold text-base">মোট</td>
                  <td className="pt-2 text-right font-bold text-base">৳{invoice.totalAmount.toFixed(2)}</td>
                </tr>
                <tr><td className="py-1 text-emerald-600">পরিশোধিত</td><td className="py-1 text-right text-emerald-600 font-medium">৳{invoice.paidAmount.toFixed(2)}</td></tr>
                <tr><td className="py-1 font-bold text-red-700">বকেয়া</td><td className="py-1 text-right font-bold text-red-700">৳{invoice.dueAmount.toFixed(2)}</td></tr>
              </tbody>
            </table>
          </div>

          {/* Payments */}
          {invoice.payments.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">পেমেন্ট ইতিহাস</p>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    {["তারিখ","পদ্ধতি","ট্রানজেকশন","পরিমাণ"].map((h) => (
                      <th key={h} className="px-3 py-1.5 text-left text-gray-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoice.payments.map((p) => (
                    <tr key={p.id} className="border-t border-gray-100">
                      <td className="px-3 py-1.5 text-gray-600">{fmt(p.paidAt)} {fmtTime(p.paidAt)}</td>
                      <td className="px-3 py-1.5 text-gray-700 font-medium">{PAYMENT_METHOD_BN[p.method]}</td>
                      <td className="px-3 py-1.5 text-gray-500 font-mono">{p.transactionId || "—"}</td>
                      <td className="px-3 py-1.5 text-right font-semibold text-emerald-700">৳{p.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {invoice.notes && (
            <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 mb-4">
              <strong>নোট:</strong> {invoice.notes}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-3 border-t border-gray-200 flex justify-between items-end">
            <p className="text-xs text-gray-400">ধন্যবাদ আপনার সেবা গ্রহণের জন্য</p>
            <div className="text-center">
              <div className="border-t border-gray-800 w-40 pt-1">
                <p className="text-xs text-gray-500">অনুমোদিত স্বাক্ষর</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
