"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { InventorySupplier } from "@/types/inventory";

interface Props {
  supplier?: InventorySupplier | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  error: string;
}

export function SupplierForm({ supplier, onSubmit, onCancel, error }: Props) {
  const [form, setForm] = useState({
    name:        supplier?.name        || "",
    contactName: supplier?.contactName || "",
    phone:       supplier?.phone       || "",
    email:       supplier?.email       || "",
    address:     supplier?.address     || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const inp = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try { await onSubmit(form); } finally { setSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">প্রতিষ্ঠানের নাম *</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} required className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">যোগাযোগকারীর নাম</label>
          <input value={form.contactName} onChange={(e) => set("contactName", e.target.value)} className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">ফোন</label>
          <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">ইমেইল</label>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inp} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">ঠিকানা</label>
          <input value={form.address} onChange={(e) => set("address", e.target.value)} className={inp} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "সংরক্ষণ হচ্ছে..." : supplier ? "আপডেট করুন" : "সাপ্লায়ার তৈরি করুন"}
        </Button>
      </div>
    </form>
  );
}
