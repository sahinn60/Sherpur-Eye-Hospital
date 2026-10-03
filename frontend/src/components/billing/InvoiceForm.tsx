"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button } from "@/components/ui";
import { ITEM_TYPE_BN, InvoiceItemType } from "@/types/billing";

const ITEM_TYPES = Object.keys(ITEM_TYPE_BN) as InvoiceItemType[];

const schema = z.object({
  patientName:   z.string().min(1, "রোগীর নাম দিন"),
  patientPhone:  z.string().min(1, "ফোন নম্বর দিন"),
  patientAge:    z.coerce.number().int().optional().or(z.literal("")),
  doctorId:      z.string().optional(),
  discountType:  z.enum(["FLAT","PERCENT"]).default("FLAT"),
  discountValue: z.coerce.number().min(0).default(0),
  notes:         z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface ItemRow { type: InvoiceItemType; description: string; quantity: number; unitPrice: number; }

interface Props {
  patientName?:  string;
  patientPhone?: string;
  patientId?:    string;
  visitId?:      string;
  appointmentId?: string;
  doctorId?:     string;
  onSubmit:      (data: any) => Promise<void>;
  onCancel:      () => void;
  error?:        string;
}

const DEFAULT_ITEMS: ItemRow[] = [
  { type: "CONSULTATION", description: "পরামর্শ ফি", quantity: 1, unitPrice: 0 },
];

export function InvoiceForm({ patientName, patientPhone, patientId, visitId, appointmentId, doctorId, onSubmit, onCancel, error }: Props) {
  const [items, setItems] = useState<ItemRow[]>(DEFAULT_ITEMS);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { patientName: patientName || "", patientPhone: patientPhone || "", discountType: "FLAT", discountValue: 0 },
  });

  const discountType  = watch("discountType");
  const discountValue = watch("discountValue") || 0;

  const subtotal    = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const discountAmt = discountType === "PERCENT" ? (subtotal * discountValue) / 100 : Math.min(discountValue, subtotal);
  const total       = Math.max(0, subtotal - discountAmt);

  function addItem() { setItems((p) => [...p, { type: "OTHER", description: "", quantity: 1, unitPrice: 0 }]); }
  function removeItem(i: number) { setItems((p) => p.filter((_, idx) => idx !== i)); }
  function updateItem(i: number, key: keyof ItemRow, val: any) {
    setItems((p) => p.map((item, idx) => idx === i ? { ...item, [key]: val } : item));
  }

  async function onFormSubmit(data: FormData) {
    const validItems = items.filter((i) => i.description.trim() && i.unitPrice > 0);
    if (!validItems.length) return;
    setSaving(true);
    try {
      await onSubmit({
        patientId, visitId, appointmentId,
        doctorId:      doctorId || data.doctorId || undefined,
        patientName:   data.patientName,
        patientPhone:  data.patientPhone,
        patientAge:    data.patientAge || undefined,
        discountType:  data.discountType,
        discountValue: data.discountValue,
        notes:         data.notes,
        items:         validItems.map((item, i) => ({ ...item, sortOrder: i })),
      });
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>}

      {/* Patient info */}
      <section>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">রোগীর তথ্য</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="রোগীর নাম *" placeholder="মোহাম্মদ রহিম" error={errors.patientName?.message} {...register("patientName")} />
          <Input label="ফোন নম্বর *" placeholder="01XXXXXXXXX" error={errors.patientPhone?.message} {...register("patientPhone")} />
          <Input label="বয়স" type="number" placeholder="35" {...register("patientAge")} />
        </div>
      </section>

      {/* Items */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">সেবা / আইটেম</p>
          <button type="button" onClick={addItem}
            className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium">
            <Plus size={13} /> আইটেম যোগ
          </button>
        </div>
        <div className="space-y-2">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-1">
            <span className="col-span-3">ধরন</span>
            <span className="col-span-4">বিবরণ</span>
            <span className="col-span-2 text-center">পরিমাণ</span>
            <span className="col-span-2 text-right">একক মূল্য (৳)</span>
            <span className="col-span-1"></span>
          </div>
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-xl p-2 border border-gray-200">
              <div className="col-span-12 sm:col-span-3">
                <select value={item.type} onChange={(e) => updateItem(i, "type", e.target.value as InvoiceItemType)}
                  className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500">
                  {ITEM_TYPES.map((t) => <option key={t} value={t}>{ITEM_TYPE_BN[t]}</option>)}
                </select>
              </div>
              <div className="col-span-12 sm:col-span-4">
                <input value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)}
                  placeholder="বিবরণ লিখুন"
                  className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(i, "quantity", parseInt(e.target.value) || 1)}
                  className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <input type="number" min={0} step="0.01" value={item.unitPrice} onChange={(e) => updateItem(i, "unitPrice", parseFloat(e.target.value) || 0)}
                  className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 text-right focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
              <div className="col-span-2 sm:col-span-1 flex justify-end">
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="col-span-12 text-right text-xs text-gray-500 pr-1">
                মোট: ৳{(item.quantity * item.unitPrice).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Discount & totals */}
      <section className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">ছাড়ের ধরন</label>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              {...register("discountType")}>
              <option value="FLAT">নির্দিষ্ট পরিমাণ (৳)</option>
              <option value="PERCENT">শতাংশ (%)</option>
            </select>
          </div>
          <Input label={`ছাড় (${discountType === "PERCENT" ? "%" : "৳"})`} type="number" min={0} step="0.01"
            className="w-32" {...register("discountValue")} />
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>সাবটোটাল</span>
            <span className="font-medium">৳{subtotal.toFixed(2)}</span>
          </div>
          {discountAmt > 0 && (
            <div className="flex justify-between text-red-600">
              <span>ছাড়</span>
              <span>- ৳{discountAmt.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-900 font-bold text-base border-t border-gray-300 pt-2 mt-2">
            <span>মোট</span>
            <span>৳{total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      {/* Notes */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">নোট</label>
        <textarea rows={2} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
          {...register("notes")} />
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" loading={saving}>ইনভয়েস তৈরি করুন</Button>
      </div>
    </form>
  );
}
