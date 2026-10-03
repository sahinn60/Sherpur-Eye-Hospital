"use client";

import { Eye, Printer, CreditCard } from "lucide-react";
import { Invoice, INVOICE_STATUS_CONFIG } from "@/types/billing";

interface Props {
  invoice:  Invoice;
  onView:   (inv: Invoice) => void;
  onPrint:  (inv: Invoice) => void;
  onPay:    (inv: Invoice) => void;
  canPay:   boolean;
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

export function InvoiceRow({ invoice, onView, onPrint, onPay, canPay }: Props) {
  const cfg = INVOICE_STATUS_CONFIG[invoice.status];
  const hasDue = invoice.dueAmount > 0 && invoice.status !== "CANCELLED";

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-mono font-semibold text-blue-700">{invoice.invoiceNo}</p>
        <p className="text-xs text-gray-400">{fmt(invoice.issuedAt)}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900">{invoice.patientName}</p>
        <p className="text-xs text-gray-400">{invoice.patientPhone}</p>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 text-right font-medium">
        ৳{invoice.totalAmount.toFixed(2)}
      </td>
      <td className="px-4 py-3 text-sm text-emerald-600 text-right font-medium">
        ৳{invoice.paidAmount.toFixed(2)}
      </td>
      <td className="px-4 py-3 text-right">
        <span className={`text-sm font-bold ${hasDue ? "text-red-600" : "text-gray-400"}`}>
          ৳{invoice.dueAmount.toFixed(2)}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
          {cfg.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button onClick={() => onView(invoice)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors" title="দেখুন">
            <Eye size={15} />
          </button>
          <button onClick={() => onPrint(invoice)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="প্রিন্ট">
            <Printer size={15} />
          </button>
          {canPay && hasDue && (
            <button onClick={() => onPay(invoice)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="পেমেন্ট">
              <CreditCard size={15} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
