"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button } from "@/components/ui";

const schema = z.object({
  category:    z.string().min(1),
  description: z.string().min(1, "বিবরণ দিন"),
  amount:      z.coerce.number().positive("পরিমাণ দিন"),
  date:        z.string().min(1, "তারিখ দিন"),
  note:        z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  type:       "income" | "expense";
  categories: Record<string, string>;
  onSubmit:   (data: FormData) => Promise<void>;
  onCancel:   () => void;
  error?:     string;
}

export function EntryForm({ type, categories, onSubmit, onCancel, error }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { date: today, category: Object.keys(categories)[0] },
  });

  const isIncome = type === "income";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">ক্যাটাগরি *</label>
          <select className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            {...register("category")}>
            {Object.entries(categories).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <Input label="তারিখ *" type="date" error={errors.date?.message} {...register("date")} />
      </div>

      <Input label="বিবরণ *" placeholder={isIncome ? "পরামর্শ ফি — ডা. রহিম" : "বিদ্যুৎ বিল — জুলাই ২০২৬"}
        error={errors.description?.message} {...register("description")} />

      <Input label="পরিমাণ (৳) *" type="number" step="0.01" min={0.01}
        placeholder="0.00" error={errors.amount?.message} {...register("amount")} />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">নোট</label>
        <textarea rows={2} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
          {...register("note")} />
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" loading={isSubmitting}>
          {isIncome ? "আয় যোগ করুন" : "ব্যয় যোগ করুন"}
        </Button>
      </div>
    </form>
  );
}
