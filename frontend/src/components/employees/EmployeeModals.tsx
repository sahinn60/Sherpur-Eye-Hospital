"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Button, Input } from "@/components/ui";
import { Shift, Employee } from "@/types/employee";

// ── Assign Shift ──────────────────────────────────────────────────────────────
interface AssignShiftProps {
  employee: Employee;
  shifts: Shift[];
  onConfirm: (shiftId: string) => Promise<void>;
  onClose: () => void;
}

export function AssignShiftModal({ employee, shifts, onConfirm, onClose }: AssignShiftProps) {
  const [shiftId, setShiftId] = useState(employee.shift?.id || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!shiftId) return;
    setLoading(true);
    try { await onConfirm(shiftId); onClose(); }
    finally { setLoading(false); }
  }

  return (
    <Modal open onClose={onClose} title="শিফট নির্ধারণ করুন" size="sm">
      <p className="text-sm text-gray-500 mb-4">{employee.nameBn} ({employee.employeeId})</p>
      <div className="flex flex-col gap-1 mb-5">
        <label className="text-sm font-medium text-gray-700">শিফট নির্বাচন করুন</label>
        <select
          value={shiftId}
          onChange={(e) => setShiftId(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">— শিফট নির্বাচন করুন —</option>
          {shifts.map((s) => (
            <option key={s.id} value={s.id}>{s.name} ({s.startTime}–{s.endTime})</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>বাতিল</Button>
        <Button onClick={handleSubmit} loading={loading} disabled={!shiftId}>নির্ধারণ করুন</Button>
      </div>
    </Modal>
  );
}

// ── Assign Account ────────────────────────────────────────────────────────────
const accountSchema = z.object({
  email:    z.string().email("সঠিক ইমেইল দিন"),
  password: z.string().min(8, "কমপক্ষে ৮ অক্ষর"),
  role:     z.enum(["DOCTOR","RECEPTION","ACCOUNTANT","HR","EMPLOYEE"]),
});
type AccountForm = z.infer<typeof accountSchema>;

interface AssignAccountProps {
  employee: Employee;
  onConfirm: (data: AccountForm) => Promise<void>;
  onClose: () => void;
}

export function AssignAccountModal({ employee, onConfirm, onClose }: AssignAccountProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
    defaultValues: { email: employee.email || "", role: "EMPLOYEE" },
  });

  return (
    <Modal open onClose={onClose} title="লগইন অ্যাকাউন্ট তৈরি করুন" size="sm">
      <p className="text-sm text-gray-500 mb-4">{employee.nameBn} ({employee.employeeId})</p>
      <form onSubmit={handleSubmit(onConfirm)} className="space-y-4">
        <Input id="acc-email" type="email" label="ইমেইল" error={errors.email?.message} {...register("email")} />
        <Input id="acc-pass"  type="password" label="পাসওয়ার্ড" placeholder="কমপক্ষে ৮ অক্ষর" error={errors.password?.message} {...register("password")} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">ভূমিকা</label>
          <select className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" {...register("role")}>
            <option value="EMPLOYEE">কর্মচারী</option>
            <option value="RECEPTION">রিসেপশন</option>
            <option value="ACCOUNTANT">হিসাবরক্ষক</option>
            <option value="HR">এইচআর</option>
            <option value="DOCTOR">চিকিৎসক</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>বাতিল</Button>
          <Button type="submit" loading={isSubmitting}>অ্যাকাউন্ট তৈরি করুন</Button>
        </div>
      </form>
    </Modal>
  );
}
