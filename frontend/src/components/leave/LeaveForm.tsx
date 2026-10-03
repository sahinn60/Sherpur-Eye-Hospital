"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui";
import { LEAVE_TYPE_BN, LeaveType } from "@/types/leave";

const schema = z.object({
  leaveType:  z.enum(["CASUAL","SICK","ANNUAL","MATERNITY","PATERNITY","UNPAID","EMERGENCY","OTHER"]),
  startDate:  z.string().min(1, "শুরুর তারিখ দিন"),
  endDate:    z.string().min(1, "শেষ তারিখ দিন"),
  reason:     z.string().min(5, "কারণ লিখুন (কমপক্ষে ৫ অক্ষর)"),
  attachment: z.string().url("সঠিক URL দিন").optional().or(z.literal("")),
}).refine((d) => new Date(d.endDate) >= new Date(d.startDate), {
  message: "শেষ তারিখ শুরুর তারিখের আগে হতে পারে না",
  path: ["endDate"],
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSubmit:  (data: FormData) => Promise<void>;
  onCancel:  () => void;
  error?:    string;
}

export function LeaveForm({ onSubmit, onCancel, error }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { leaveType: "CASUAL", startDate: today, endDate: today },
  });

  const start = watch("startDate");
  const end   = watch("endDate");
  const days  = start && end
    ? Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1)
    : 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>}

      {/* Leave type */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">ছুটির ধরন <span className="text-red-500">*</span></label>
        <select {...register("leaveType")}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500">
          {(Object.entries(LEAVE_TYPE_BN) as [LeaveType, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        {errors.leaveType && <p className="text-xs text-red-500">{errors.leaveType.message}</p>}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">শুরুর তারিখ <span className="text-red-500">*</span></label>
          <input type="date" {...register("startDate")}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
          {errors.startDate && <p className="text-xs text-red-500">{errors.startDate.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">শেষ তারিখ <span className="text-red-500">*</span></label>
          <input type="date" {...register("endDate")} min={start}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
          {errors.endDate && <p className="text-xs text-red-500">{errors.endDate.message}</p>}
        </div>
      </div>

      {days > 0 && (
        <div className="bg-primary-50 border border-primary-100 rounded-lg px-3 py-2 text-sm text-primary-700">
          মোট <span className="font-bold">{days}</span> দিনের ছুটির আবেদন
        </div>
      )}

      {/* Reason */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">কারণ <span className="text-red-500">*</span></label>
        <textarea rows={3} {...register("reason")} placeholder="ছুটির কারণ বিস্তারিত লিখুন..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none" />
        {errors.reason && <p className="text-xs text-red-500">{errors.reason.message}</p>}
      </div>

      {/* Attachment */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">সংযুক্তি (URL)</label>
        <input type="url" {...register("attachment")} placeholder="https://... (ঐচ্ছিক)"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
        {errors.attachment && <p className="text-xs text-red-500">{errors.attachment.message}</p>}
        <p className="text-xs text-gray-400">মেডিকেল সার্টিফিকেট বা অন্য ডকুমেন্টের লিংক দিন</p>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" loading={isSubmitting}>আবেদন জমা দিন</Button>
      </div>
    </form>
  );
}
