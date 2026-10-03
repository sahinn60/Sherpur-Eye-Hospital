"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Package } from "lucide-react";
import { Button } from "@/components/ui";
import { fetchStockHistory } from "@/lib/services/inventoryService";
import {
  InventoryItem, StockHistory,
  STOCK_HISTORY_TYPE_BN, STOCK_HISTORY_TYPE_COLOR,
} from "@/types/inventory";

interface Props {
  item: InventoryItem;
  onClose: () => void;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function StockHistoryDrawer({ item, onClose }: Props) {
  const [history,    setHistory]    = useState<StockHistory[]>([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchStockHistory(item.id, page, 20);
      setHistory(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally { setLoading(false); }
  }, [item.id, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg h-full flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">স্টক ইতিহাস</h2>
            <p className="text-xs text-gray-500 mt-0.5">{item.nameBn} — {item.sku}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Current stock badge */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3 shrink-0">
          <div className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
            item.stockQty <= item.minStock ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
          }`}>
            বর্তমান স্টক: {item.stockQty} {item.unit}
          </div>
          <span className="text-xs text-gray-400">ন্যূনতম: {item.minStock}</span>
          <span className="text-xs text-gray-400 ml-auto">মোট {total}টি লেনদেন</span>
        </div>

        {/* History list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Package size={36} className="text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">কোনো ইতিহাস নেই</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((h) => {
                const isIn = ["PURCHASE", "ADJUSTMENT", "RETURNED"].includes(h.type) && h.quantity > 0;
                return (
                  <div key={h.id} className="bg-white border border-gray-100 rounded-xl p-3.5 flex items-start gap-3">
                    {/* Delta indicator */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isIn ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}>
                      {isIn ? "+" : "−"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STOCK_HISTORY_TYPE_COLOR[h.type]}`}>
                          {STOCK_HISTORY_TYPE_BN[h.type]}
                        </span>
                        <span className={`text-sm font-bold ${isIn ? "text-emerald-700" : "text-red-600"}`}>
                          {isIn ? "+" : "−"}{h.quantity} {item.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>{h.qtyBefore} → {h.qtyAfter}</span>
                        {h.unitCost && <span>৳{h.unitCost.toFixed(2)}/unit</span>}
                      </div>
                      {h.note && <p className="text-xs text-gray-500 mt-0.5 truncate">{h.note}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">{fmtDate(h.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 shrink-0">
            <p className="text-xs text-gray-400">মোট {total}টি</p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</Button>
              <span className="text-xs text-gray-500 self-center">{page}/{totalPages}</span>
              <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
