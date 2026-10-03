"use client";

import { AlertTriangle, Clock, XCircle } from "lucide-react";
import { InventoryAlerts, InventoryItem } from "@/types/inventory";

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

function AlertCard({ item, type }: { item: InventoryItem; type: "low" | "soon" | "expired" }) {
  const cfg = {
    low:     { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    label: `স্টক: ${item.stockQty}/${item.minStock}` },
    soon:    { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  label: `মেয়াদ: ${fmtDate(item.expiryDate)}` },
    expired: { bg: "bg-rose-50",   border: "border-rose-200",   text: "text-rose-700",   label: `মেয়াদ শেষ: ${fmtDate(item.expiryDate)}` },
  }[type];

  return (
    <div className={`${cfg.bg} ${cfg.border} border rounded-xl p-3 flex items-start gap-2.5`}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{item.nameBn}</p>
        <p className="text-xs text-gray-500">{item.sku}</p>
        <p className={`text-xs font-medium mt-0.5 ${cfg.text}`}>{cfg.label}</p>
      </div>
    </div>
  );
}

interface Props {
  alerts: InventoryAlerts;
}

export function InventoryAlertPanel({ alerts }: Props) {
  const total = alerts.lowStock.length + alerts.expiringSoon.length + alerts.expired.length;
  if (total === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <AlertTriangle size={16} className="text-amber-500" />
        <h3 className="text-sm font-semibold text-gray-800">সতর্কতা</h3>
        <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{total}টি</span>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Low Stock */}
        {alerts.lowStock.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle size={13} className="text-red-500" />
              <p className="text-xs font-semibold text-red-700">কম স্টক ({alerts.lowStock.length})</p>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {alerts.lowStock.map((item) => <AlertCard key={item.id} item={item} type="low" />)}
            </div>
          </div>
        )}

        {/* Expiring Soon */}
        {alerts.expiringSoon.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Clock size={13} className="text-amber-500" />
              <p className="text-xs font-semibold text-amber-700">মেয়াদ শেষ হচ্ছে ({alerts.expiringSoon.length})</p>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {alerts.expiringSoon.map((item) => <AlertCard key={item.id} item={item} type="soon" />)}
            </div>
          </div>
        )}

        {/* Expired */}
        {alerts.expired.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <XCircle size={13} className="text-rose-600" />
              <p className="text-xs font-semibold text-rose-700">মেয়াদোত্তীর্ণ ({alerts.expired.length})</p>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {alerts.expired.map((item) => <AlertCard key={item.id} item={item} type="expired" />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
