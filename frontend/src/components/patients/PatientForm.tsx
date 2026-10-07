"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button } from "@/components/ui";
import { Patient } from "@/types/patient";

const schema = z.object({
  nameBn:           z.string().min(2, "বাংলা নাম দিন"),
  nameEn:           z.string().min(2, "English name required"),
  phone:            z.string().min(11, "সঠিক ফোন নম্বর দিন"),
  email:            z.string().email("সঠিক ইমেইল").optional().or(z.literal("")),
  age:              z.coerce.number().int().min(0).max(150).optional().or(z.literal("")),
  gender:           z.enum(["MALE", "FEMALE", "OTHER"]).default("OTHER"),
  address:          z.string().optional(),
  emergencyContact: z.string().optional(),
  medicalHistory:   z.string().optional(),
  notes:            z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  patient?:     Patient | null;
  initialData?: { nameBn?: string; phone?: string; age?: number; gender?: string };
  onSubmit:     (data: any) => Promise<void>;
  onCancel:     () => void;
  error?:       string;
}

export function PatientForm({ patient, initialData, onSubmit, onCancel, error }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: patient ? {
      nameBn:           patient.nameBn,
      nameEn:           patient.nameEn,
      phone:            patient.phone,
      email:            patient.email || "",
      age:              patient.age ?? undefined,
      gender:           patient.gender,
      address:          patient.address || "",
      emergencyContact: patient.emergencyContact || "",
      medicalHistory:   patient.medicalHistory || "",
      notes:            patient.notes || "",
    } : {
      gender:  (initialData?.gender as any) || "OTHER",
      nameBn:  initialData?.nameBn || "",
      phone:   initialData?.phone  || "",
      age:     initialData?.age    ?? undefined,
    },
  });

  const f = (label: string, name: keyof FormData, type = "text", placeholder = "") => (
    <Input id={name} type={type} label={label} placeholder={placeholder}
      error={errors[name]?.message as string} {...register(name)} />
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>
      )}

      <section>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">ব্যক্তিগত তথ্য</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {f("নাম (বাংলা)", "nameBn", "text", "মোহাম্মদ রহিম")}
          {f("Name (English)", "nameEn", "text", "Mohammad Rahim")}
          {f("ফোন নম্বর", "phone", "tel", "01XXXXXXXXX")}
          {f("ইমেইল", "email", "email", "patient@example.com")}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {f("বয়স", "age", "number", "35")}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">লিঙ্গ</label>
            <select className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              {...register("gender")}>
              <option value="MALE">পুরুষ</option>
              <option value="FEMALE">মহিলা</option>
              <option value="OTHER">অন্যান্য</option>
            </select>
          </div>
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">যোগাযোগ ও ঠিকানা</p>
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">ঠিকানা</label>
          <textarea rows={2} placeholder="গ্রাম, উপজেলা, জেলা..."
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
            {...register("address")} />
        </div>
        {f("জরুরি যোগাযোগ", "emergencyContact", "text", "নাম - 01XXXXXXXXX")}
      </section>

      <section>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">চিকিৎসা তথ্য</p>
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">পূর্ববর্তী রোগের ইতিহাস</label>
          <textarea rows={3} placeholder="ডায়াবেটিস, উচ্চ রক্তচাপ, ছানি..."
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
            {...register("medicalHistory")} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">নোট</label>
          <textarea rows={2} placeholder="অতিরিক্ত তথ্য..."
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
            {...register("notes")} />
        </div>
      </section>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" loading={isSubmitting}>
          {patient ? "আপডেট করুন" : "নিবন্ধন করুন"}
        </Button>
      </div>
    </form>
  );
}
