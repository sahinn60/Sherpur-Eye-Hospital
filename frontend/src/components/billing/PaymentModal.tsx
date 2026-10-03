"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import { PAYMENT_METHOD_BN, PaymentMethod } from "@/types/billing";

const METHODS = Object.keys(PAYMENT_METHOD_BN) as PaymentMethod[];

const schema = z.object({
  amount:        z.coerce.number().positive("পরিমাণ দিন"),
  method:        z.enum(["CASH","CARD","BKASH","NAGAD","ROCKET","BANK_TRANSFER","OTHER"]).default("CASH"),
  transactionId: z.string().optional(),
  note:          z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  dueAmount: number;
  invoiceNo: string;
  onSubmit:  (data: FormData) => Promise<void>;
  onCancel:  () => void;
  error?:    string;
}

export function PaymentModal({ dueAmount, invoiceNo, onSubmit, onCancel, error }: Props) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { amount: dueAmount, method: "CASH" },
  });

  const method = watch("method");
  const needsTxId = method !== "CASH";

  async function onFormSubmit(data: FormData) {
    setSaving(true);
    try { await onSubmit(data); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>}

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <p className="text-xs text-blue-600">ইনভয়েস: <span className="font-mono font-bold">{invoiceNo}</span></p>
        <p className="text-lg font-bold text-blue-800 mt-0.5">বকেয়া: ৳{dueAmount.toFixed(2)}</p>
      </div>

      <Input label="পরিমাণ (৳) *" type="number" step="0.01" min={0.01} max={dueAmount}
        error={errors.amount?.message} {...register("amount")} />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">পেমেন্ট পদ্ধতি *</label>
        <div className="grid grid-cols-3 gap-2">
          {METHODS.map((m) => (
            <button key={m} type="button"
              onClick={() => setValue("method", m)}
              className={`text-xs px-3 py-2 rounded-lg border font-medium transition-colors ${
                method === m
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-primary-400"
              }`}>
              {PAYMENT_METHOD_BN[m]}
            </button>
          ))}
        </div>
      </div>

      {needsTxId && (
        <Input label="ট্রানজেকশন আইডি" placeholder="TXN123456" {...register("transactionId")} />
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">নোট</label>
        <input className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          {...register("note")} />
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" loading={saving}>পেমেন্ট নিশ্চিত করুন</Button>
      </div>
    </form>
  );
}
