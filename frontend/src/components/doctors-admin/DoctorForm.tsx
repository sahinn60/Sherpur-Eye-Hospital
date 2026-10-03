"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { DoctorAdmin } from "@/types/doctor";

const DAYS_EN = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAYS_BN: Record<string, string> = {
  Saturday: "শনিবার", Sunday: "রবিবার", Monday: "সোমবার",
  Tuesday: "মঙ্গলবার", Wednesday: "বুধবার", Thursday: "বৃহস্পতিবার", Friday: "শুক্রবার",
};

const schema = z.object({
  nameBn:          z.string().min(2, "বাংলা নাম দিন"),
  nameEn:          z.string().min(2, "English name required"),
  photo:           z.string().url("সঠিক URL দিন").optional().or(z.literal("")),
  phone:           z.string().optional(),
  email:           z.string().email("সঠিক ইমেইল").optional().or(z.literal("")),
  gender:          z.enum(["MALE", "FEMALE", "OTHER"]).default("MALE"),
  dateOfBirth:     z.string().optional(),
  joiningDate:     z.string().optional(),
  designationBn:   z.string().min(2, "পদবি দিন"),
  designationEn:   z.string().min(2, "Designation required"),
  qualificationBn: z.string().min(2, "যোগ্যতা দিন"),
  qualificationEn: z.string().min(2, "Qualification required"),
  specialtyBn:     z.string().min(2, "বিশেষত্ব দিন"),
  specialtyEn:     z.string().min(2, "Specialty required"),
  experienceBn:    z.string().min(1, "অভিজ্ঞতা দিন"),
  experienceEn:    z.string().min(1, "Experience required"),
  biographyBn:     z.string().optional(),
  biographyEn:     z.string().optional(),
  consultationFee: z.coerce.number().min(0).default(0),
  chamberSchedule: z.string().optional(),
  sortOrder:       z.coerce.number().int().default(0),
});

type FormData = z.infer<typeof schema>;

interface Props {
  doctor?:   DoctorAdmin | null;
  onSubmit:  (data: any) => Promise<void>;
  onCancel:  () => void;
}

export function DoctorForm({ doctor, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: doctor ? {
      nameBn:          doctor.nameBn,
      nameEn:          doctor.nameEn,
      photo:           doctor.photo || "",
      phone:           doctor.phone || "",
      email:           doctor.email || "",
      gender:          doctor.gender,
      dateOfBirth:     doctor.dateOfBirth ? doctor.dateOfBirth.split("T")[0] : "",
      joiningDate:     doctor.joiningDate ? doctor.joiningDate.split("T")[0] : "",
      designationBn:   doctor.designationBn,
      designationEn:   doctor.designationEn,
      qualificationBn: doctor.qualificationBn,
      qualificationEn: doctor.qualificationEn,
      specialtyBn:     doctor.specialtyBn,
      specialtyEn:     doctor.specialtyEn,
      experienceBn:    doctor.experienceBn,
      experienceEn:    doctor.experienceEn,
      biographyBn:     doctor.biographyBn || "",
      biographyEn:     doctor.biographyEn || "",
      consultationFee: doctor.consultationFee,
      chamberSchedule: doctor.chamberSchedule || "",
      sortOrder:       doctor.sortOrder,
    } : {
      gender: "MALE", consultationFee: 0, sortOrder: 0,
    },
  });

  // Available days (checkboxes)
  const [selectedDays, setSelectedDays] = useState<string[]>(doctor?.availableDays ?? []);
  // Specializations (tags)
  const [specs, setSpecs] = useState<string[]>(doctor?.specializations ?? []);
  const [specInput, setSpecInput] = useState("");
  // Schedule slots
  const [slots, setSlots] = useState(
    doctor?.schedule ?? []
  );

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function addSpec() {
    const v = specInput.trim();
    if (v && !specs.includes(v)) { setSpecs((s) => [...s, v]); }
    setSpecInput("");
  }

  function addSlot() {
    setSlots((s) => [...s, { dayBn: "", dayEn: "", timeBn: "", timeEn: "" }]);
  }

  function updateSlot(i: number, key: string, val: string) {
    setSlots((s) => s.map((sl, idx) => idx === i ? { ...sl, [key]: val } : sl));
  }

  function removeSlot(i: number) {
    setSlots((s) => s.filter((_, idx) => idx !== i));
  }

  async function handleFormSubmit(data: FormData) {
    await onSubmit({
      ...data,
      availableDays:   selectedDays,
      specializations: specs,
      schedule:        slots,
    });
  }

  const f = (label: string, name: keyof FormData, type = "text", placeholder = "") => (
    <Input id={name} type={type} label={label} placeholder={placeholder}
      error={errors[name]?.message as string} {...register(name)} />
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">

      {/* Identity */}
      <section>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">পরিচয়</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {f("নাম (বাংলা)", "nameBn", "text", "ডা. মোহাম্মদ রহিম")}
          {f("Name (English)", "nameEn", "text", "Dr. Mohammad Rahim")}
          {f("ফোন", "phone", "tel", "01XXXXXXXXX")}
          {f("ইমেইল", "email", "email", "doctor@example.com")}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">লিঙ্গ</label>
            <select className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" {...register("gender")}>
              <option value="MALE">পুরুষ</option>
              <option value="FEMALE">মহিলা</option>
              <option value="OTHER">অন্যান্য</option>
            </select>
          </div>
          {f("জন্ম তারিখ", "dateOfBirth", "date")}
          {f("যোগদানের তারিখ", "joiningDate", "date")}
        </div>
        <div className="mt-4">
          {f("ছবির URL (Cloudinary)", "photo", "url", "https://res.cloudinary.com/...")}
        </div>
      </section>

      {/* Professional */}
      <section>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">পেশাদার তথ্য</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {f("পদবি (বাংলা)", "designationBn", "text", "চক্ষু বিশেষজ্ঞ")}
          {f("Designation (English)", "designationEn", "text", "Eye Specialist")}
          {f("যোগ্যতা (বাংলা)", "qualificationBn", "text", "এমবিবিএস, এফসিপিএস")}
          {f("Qualification (English)", "qualificationEn", "text", "MBBS, FCPS")}
          {f("বিশেষত্ব (বাংলা)", "specialtyBn", "text", "ছানি ও ফ্যাকো সার্জারি")}
          {f("Specialty (English)", "specialtyEn", "text", "Cataract & Phaco Surgery")}
          {f("অভিজ্ঞতা (বাংলা)", "experienceBn", "text", "১৫ বছর")}
          {f("Experience (English)", "experienceEn", "text", "15 Years")}
        </div>

        {/* Specializations tags */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700 block mb-1">বিশেষজ্ঞতা (ট্যাগ)</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {specs.map((s) => (
              <span key={s} className="flex items-center gap-1 bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full">
                {s}
                <button type="button" onClick={() => setSpecs((p) => p.filter((x) => x !== s))} className="hover:text-red-500">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={specInput} onChange={(e) => setSpecInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSpec(); } }}
              placeholder="যেমন: Glaucoma, Retina..."
              className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            <Button type="button" size="sm" variant="secondary" onClick={addSpec}>যোগ</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">জীবনী (বাংলা)</label>
            <textarea rows={3} placeholder="সংক্ষিপ্ত জীবনী..."
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
              {...register("biographyBn")} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Biography (English)</label>
            <textarea rows={3} placeholder="Short biography..."
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
              {...register("biographyEn")} />
          </div>
        </div>
      </section>

      {/* Consultation */}
      <section>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">পরামর্শ ও সময়সূচি</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {f("পরামর্শ ফি (৳)", "consultationFee", "number")}
          {f("চেম্বার সময়সূচি", "chamberSchedule", "text", "শনি–বৃহ সকাল ৯টা–দুপুর ১টা")}
        </div>

        {/* Available days */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700 block mb-2">উপলব্ধ দিন</label>
          <div className="flex flex-wrap gap-2">
            {DAYS_EN.map((day) => (
              <button key={day} type="button"
                onClick={() => toggleDay(day)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  selectedDays.includes(day)
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-primary-400"
                }`}>
                {DAYS_BN[day]}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule slots */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">সময়সূচি স্লট</label>
            <Button type="button" size="sm" variant="secondary" onClick={addSlot}>
              <Plus size={13} className="mr-1" /> স্লট যোগ
            </Button>
          </div>
          <div className="space-y-2">
            {slots.map((slot, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-center bg-gray-50 rounded-lg p-2">
                {(["dayBn", "dayEn", "timeBn", "timeEn"] as const).map((key) => (
                  <input key={key} value={(slot as any)[key]}
                    onChange={(e) => updateSlot(i, key, e.target.value)}
                    placeholder={key === "dayBn" ? "শনিবার" : key === "dayEn" ? "Saturday" : key === "timeBn" ? "সকাল ৯টা" : "9:00 AM"}
                    className="text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                ))}
                <button type="button" onClick={() => removeSlot(i)} className="text-red-400 hover:text-red-600 col-span-4 flex justify-end">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {f("সর্ট অর্ডার", "sortOrder", "number")}
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" loading={isSubmitting}>
          {doctor ? "আপডেট করুন" : "যোগ করুন"}
        </Button>
      </div>
    </form>
  );
}
