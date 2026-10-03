"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button } from "@/components/ui";
import { Department, Shift, Employee } from "@/types/employee";

const schema = z.object({
  nameBn:        z.string().min(2, "বাংলা নাম দিন"),
  nameEn:        z.string().min(2, "English name required"),
  phone:         z.string().min(10, "সঠিক ফোন নম্বর দিন"),
  email:         z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  gender:        z.enum(["MALE", "FEMALE", "OTHER"]),
  dateOfBirth:   z.string().optional(),
  departmentId:  z.string().optional(),
  designationBn: z.string().min(2, "পদবি দিন"),
  designationEn: z.string().min(2, "Designation required"),
  shiftId:       z.string().optional(),
  joiningDate:   z.string().optional(),
  address:       z.string().optional(),
  basicSalary:   z.coerce.number().min(0),
  allowances:    z.coerce.number().min(0),
  deductions:    z.coerce.number().min(0),
  photo:         z.string().url().optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

interface EmployeeFormProps {
  employee?: Employee | null;
  departments: Department[];
  shifts: Shift[];
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export function EmployeeForm({ employee, departments, shifts, onSubmit, onCancel }: EmployeeFormProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameBn: "", nameEn: "", phone: "", email: "", gender: "OTHER",
      designationBn: "", designationEn: "",
      basicSalary: 0, allowances: 0, deductions: 0,
    },
  });

  useEffect(() => {
    if (employee) {
      reset({
        nameBn:        employee.nameBn,
        nameEn:        employee.nameEn,
        phone:         employee.phone,
        email:         employee.email || "",
        gender:        employee.gender,
        dateOfBirth:   employee.dateOfBirth ? employee.dateOfBirth.split("T")[0] : "",
        departmentId:  employee.department?.id || "",
        designationBn: employee.designationBn,
        designationEn: employee.designationEn,
        shiftId:       employee.shift?.id || "",
        joiningDate:   employee.joiningDate ? employee.joiningDate.split("T")[0] : "",
        address:       employee.address || "",
        basicSalary:   employee.basicSalary,
        allowances:    employee.allowances,
        deductions:    employee.deductions,
        photo:         employee.photo || "",
      });
    }
  }, [employee, reset]);

  const field = (label: string, name: keyof FormData, type = "text", placeholder = "") => (
    <Input id={name} type={type} label={label} placeholder={placeholder}
      error={errors[name]?.message as string} {...register(name)} />
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("নাম (বাংলা)", "nameBn", "text", "মোহাম্মদ রহিম")}
        {field("Name (English)", "nameEn", "text", "Mohammad Rahim")}
        {field("ফোন নম্বর", "phone", "tel", "01XXXXXXXXX")}
        {field("ইমেইল", "email", "email", "example@email.com")}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">লিঙ্গ</label>
          <select className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" {...register("gender")}>
            <option value="MALE">পুরুষ</option>
            <option value="FEMALE">মহিলা</option>
            <option value="OTHER">অন্যান্য</option>
          </select>
        </div>
        {field("জন্ম তারিখ", "dateOfBirth", "date")}
        {field("যোগদানের তারিখ", "joiningDate", "date")}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("পদবি (বাংলা)", "designationBn", "text", "অফিস সহকারী")}
        {field("Designation (English)", "designationEn", "text", "Office Assistant")}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">বিভাগ</label>
          <select className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" {...register("departmentId")}>
            <option value="">— বিভাগ নির্বাচন করুন —</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">শিফট</label>
          <select className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" {...register("shiftId")}>
            <option value="">— শিফট নির্বাচন করুন —</option>
            {shifts.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.startTime}–{s.endTime})</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {field("মূল বেতন (৳)", "basicSalary", "number")}
        {field("ভাতা (৳)", "allowances", "number")}
        {field("কর্তন (৳)", "deductions", "number")}
      </div>

      {field("ঠিকানা", "address", "text", "গ্রাম, উপজেলা, জেলা")}
      {field("ছবির URL (Cloudinary)", "photo", "url", "https://res.cloudinary.com/...")}

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" loading={isSubmitting}>
          {employee ? "আপডেট করুন" : "যোগ করুন"}
        </Button>
      </div>
    </form>
  );
}
