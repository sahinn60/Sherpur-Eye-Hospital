"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { InventoryItem } from "@/types/inventory";
import { StockHistoryType, STOCK_HISTORY_TYPE_BN } from "@/types/inventory";

const IN_TYPES:  StockHistoryType[] = ["PURCHASE", "ADJUSTMENT", "RETURNED"];
const OUT_TYPES: StockHistoryType[] = ["DISPENSED", "EXPIRED", "DAMAGED", "ADJUSTMENT"];

interface Props {
  item: InventoryItem;
  mode: "in" | "out";
  onSubmit: (data: { type: string; quantity: number; unitCost?: number; note?: string }) => Promise<void>;
  onCancel: () => void;
  error: string;
}

export function StockAdjustModal({ item, mode, onSubmit, onCancel, error }: Props) {
  const types = mode === "in" ? IN_TYPES : OUT_TYPES;
  const [form, setForm] = useState({
    type:     types[0] as StockHistoryType,
    quantity: 1,
    unitCost: item.purchasePrice || 0,
    note:     "",
  });
  const [submitting, setSubmitting] = useState(false);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const inp = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        type:     form.type,
        quantity: Number(form.quantity),
        unitCost: mode === "in" ? Number(form.unitCost) : undefined,
        note:     form.note || undefined,
      });
    } finally { setSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      {/* Item info */}
      <div className={`rounded-xl p-3 ${mode === "in" ? "bg-emerald-50" : "bg-amber-50"}`}>
        <p className="text-sm font-semibold text-gray-800">{item.nameBn}</p>
        <p className="text-xs text-gray-500">{item.sku} — বর্তমান স্টক: <strong>{item.stockQty} {item.unit}</strong></p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">ধরন *</label>
        <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inp}>
          {types.map((t) => <option key={t} value={t}>{STOCK_HISTORY_TYPE_BN[t]}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">পরিমাণ ({item.unit}) *</label>
        <input type="number" min="1" value={form.quantity}
          onChange={(e) => set("quantity", e.target.value)} required className={inp} />
        {mode === "out" && (
          <p className="text-xs text-gray-400 mt-1">সর্বোচ্চ: {item.stockQty} {item.unit}</p>
        )}
      </div>

      {mode === "in" && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">একক ক্রয় মূল্য (৳)</label>
          <input type="number" min="0" step="0.01" value={form.unitCost}
            onChange={(e) => set("unitCost", e.target.value)} className={inp} />
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">নোট</label>
        <textarea value={form.note} onChange={(e) => set("note", e.target.value)}
          rows={2} placeholder="ঐচ্ছিক..." className={inp} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" disabled={submitting}
          className={mode === "in" ? "" : "bg-amber-600 hover:bg-amber-700"}>
          {submitting ? "সংরক্ষণ হচ্ছে..." : mode === "in" ? "স্টক যোগ করুন" : "স্টক কমান"}
        </Button>
      </div>
    </form>
  );
}
