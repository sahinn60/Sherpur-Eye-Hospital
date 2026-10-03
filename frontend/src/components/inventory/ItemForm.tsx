"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import {
  InventoryItem, InventorySupplier, InventoryCategory,
  INVENTORY_CATEGORY_BN,
} from "@/types/inventory";
import { generateSku } from "@/lib/services/inventoryService";

const CATEGORIES = Object.keys(INVENTORY_CATEGORY_BN) as InventoryCategory[];
const UNITS = ["pcs", "box", "strip", "bottle", "vial", "tube", "pair", "set", "kg", "ltr", "ml"];

interface Props {
  item?: InventoryItem | null;
  suppliers: InventorySupplier[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  error: string;
}

export function ItemForm({ item, suppliers, onSubmit, onCancel, error }: Props) {
  const [form, setForm] = useState({
    sku:           item?.sku           || "",
    name:          item?.name          || "",
    nameBn:        item?.nameBn        || "",
    category:      item?.category      || "MEDICINE" as InventoryCategory,
    supplierId:    item?.supplier?.id  || "",
    unit:          item?.unit          || "pcs",
    purchasePrice: item?.purchasePrice ?? 0,
    sellingPrice:  item?.sellingPrice  ?? 0,
    stockQty:      item?.stockQty      ?? 0,
    minStock:      item?.minStock      ?? 5,
    expiryDate:    item?.expiryDate    ? item.expiryDate.split("T")[0] : "",
    description:   item?.description   || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [skuLoading, setSkuLoading] = useState(false);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  async function handleGenerateSku() {
    setSkuLoading(true);
    try { set("sku", await generateSku(form.category)); } finally { setSkuLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        purchasePrice: Number(form.purchasePrice),
        sellingPrice:  Number(form.sellingPrice),
        stockQty:      Number(form.stockQty),
        minStock:      Number(form.minStock),
        supplierId:    form.supplierId || undefined,
        expiryDate:    form.expiryDate || undefined,
        description:   form.description || undefined,
      });
    } finally { setSubmitting(false); }
  }

  const inp = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      {/* Basic Info */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">মূল তথ্য</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">নাম (English) *</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} required className={inp} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">নাম (বাংলা) *</label>
            <input value={form.nameBn} onChange={(e) => set("nameBn", e.target.value)} required className={inp} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">ক্যাটাগরি *</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inp}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{INVENTORY_CATEGORY_BN[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">SKU *</label>
            <div className="flex gap-2">
              <input value={form.sku} onChange={(e) => set("sku", e.target.value)} required
                readOnly={!!item} className={`${inp} flex-1 ${item ? "bg-gray-50" : ""}`} />
              {!item && (
                <button type="button" onClick={handleGenerateSku} disabled={skuLoading}
                  className="text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 whitespace-nowrap disabled:opacity-50">
                  {skuLoading ? "..." : "তৈরি করুন"}
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">সাপ্লায়ার</label>
            <select value={form.supplierId} onChange={(e) => set("supplierId", e.target.value)} className={inp}>
              <option value="">নির্বাচন করুন</option>
              {suppliers.filter((s) => s.isActive).map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">একক (Unit)</label>
            <select value={form.unit} onChange={(e) => set("unit", e.target.value)} className={inp}>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">মূল্য ও স্টক</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">ক্রয় মূল্য (৳)</label>
            <input type="number" min="0" step="0.01" value={form.purchasePrice}
              onChange={(e) => set("purchasePrice", e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">বিক্রয় মূল্য (৳)</label>
            <input type="number" min="0" step="0.01" value={form.sellingPrice}
              onChange={(e) => set("sellingPrice", e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {item ? "বর্তমান স্টক" : "প্রাথমিক স্টক"}
            </label>
            <input type="number" min="0" value={form.stockQty}
              onChange={(e) => set("stockQty", e.target.value)}
              readOnly={!!item} className={`${inp} ${item ? "bg-gray-50" : ""}`} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">ন্যূনতম স্টক</label>
            <input type="number" min="0" value={form.minStock}
              onChange={(e) => set("minStock", e.target.value)} className={inp} />
          </div>
        </div>
      </div>

      {/* Expiry & Notes */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">মেয়াদ ও বিবরণ</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">মেয়াদ উত্তীর্ণের তারিখ</label>
            <input type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} className={inp} />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">বিবরণ</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
              rows={2} className={inp} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "সংরক্ষণ হচ্ছে..." : item ? "আপডেট করুন" : "আইটেম তৈরি করুন"}
        </Button>
      </div>
    </form>
  );
}
