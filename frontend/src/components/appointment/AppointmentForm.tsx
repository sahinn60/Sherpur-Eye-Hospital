"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { CalendarCheck, CheckCircle } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useDoctors } from "@/hooks/useDoctors";
import { useServices } from "@/hooks/useServices";
import { submitAppointment } from "@/lib/services/appointmentService";
import { Appointment } from "@/types/appointment";
import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";

// ── Validation schema ────────────────────────────────────────────────────────
const schema = z.object({
  patientName: z.string().min(2, "নাম কমপক্ষে ২ অক্ষর হতে হবে / Name must be at least 2 characters"),
  phone: z.string().min(10, "সঠিক ফোন নম্বর দিন / Enter a valid phone number"),
  email: z.string().email("সঠিক ইমেইল দিন / Invalid email").optional().or(z.literal("")),
  age: z.coerce.number({ invalid_type_error: "বয়স দিন / Enter age" }).int().min(1).max(120),
  gender: z.string().min(1, "লিঙ্গ নির্বাচন করুন / Select gender"),
  doctorId: z.string().optional(),
  serviceId: z.string().optional(),
  preferredDate: z.string().min(1, "তারিখ নির্বাচন করুন / Select a date"),
  preferredTime: z.string().min(1, "সময় নির্বাচন করুন / Select a time"),
  reason: z.string().min(3, "সমস্যার বিবরণ দিন / Describe your problem"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
];

// ── Success card ─────────────────────────────────────────────────────────────
function SuccessCard({ appointment, onNew, t }: {
  appointment: Appointment;
  onNew: () => void;
  t: (bn: string, en: string) => string;
}) {
  return (
    <div className="text-center py-10 px-4">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle size={40} className="text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {t("অ্যাপয়েন্টমেন্ট অনুরোধ সফল!", "Appointment Request Submitted!")}
      </h2>
      <p className="text-gray-500 mb-6">
        {t(
          "আপনার অনুরোধ পাওয়া গেছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
          "Your request has been received. We will contact you shortly."
        )}
      </p>

      {/* Request ID */}
      <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 max-w-sm mx-auto mb-6">
        <p className="text-xs text-primary-500 font-semibold uppercase tracking-wider mb-1">
          {t("অনুরোধ আইডি", "Request ID")}
        </p>
        <p className="text-3xl font-bold text-primary-700 tracking-wider">
          {appointment.requestId}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {t("এই আইডি সংরক্ষণ করুন", "Save this ID for tracking")}
        </p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-2xl p-5 max-w-sm mx-auto text-left space-y-2 mb-6 text-sm">
        <SummaryRow label={t("রোগীর নাম", "Patient")} value={appointment.patientName} />
        <SummaryRow label={t("ফোন", "Phone")} value={appointment.phone} />
        <SummaryRow
          label={t("পছন্দের তারিখ", "Preferred Date")}
          value={new Date(appointment.preferredDate).toLocaleDateString("bn-BD")}
        />
        <SummaryRow label={t("পছন্দের সময়", "Preferred Time")} value={appointment.preferredTime} />
        <SummaryRow
          label={t("অবস্থা", "Status")}
          value={t("অপেক্ষমাণ", "Pending")}
          valueClass="text-amber-600 font-bold"
        />
      </div>

      <button
        onClick={onNew}
        className="text-primary-600 hover:text-primary-800 font-semibold text-sm transition-colors"
      >
        {t("নতুন অ্যাপয়েন্টমেন্ট নিন →", "Book another appointment →")}
      </button>
    </div>
  );
}

function SummaryRow({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium text-gray-800 text-right ${valueClass}`}>{value}</span>
    </div>
  );
}

// ── Select wrapper ───────────────────────────────────────────────────────────
function FormSelect({
  label, error, children, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        className={cn(
          "rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm bg-white",
          "focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500"
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function FormTextarea({
  label, error, ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        rows={4}
        className={cn(
          "rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm resize-none",
          "focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500"
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ── Main form ────────────────────────────────────────────────────────────────
export function AppointmentForm() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState<Appointment | null>(null);
  const [serverError, setServerError] = useState("");

  const { data: doctors } = useDoctors();
  const { data: services } = useServices();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Pre-fill doctor/service from URL params
  useEffect(() => {
    const doctorId = searchParams.get("doctor");
    const serviceId = searchParams.get("service");
    if (doctorId) setValue("doctorId", doctorId);
    if (serviceId) setValue("serviceId", serviceId);
  }, [searchParams, setValue]);

  // Min date = today
  const today = new Date().toISOString().split("T")[0];

  async function onSubmit(data: FormData) {
    setServerError("");
    try {
      const result = await submitAppointment({
        ...data,
        email: data.email || undefined,
        doctorId: data.doctorId || undefined,
        serviceId: data.serviceId || undefined,
        message: data.message || undefined,
      });
      setSubmitted(result);
    } catch (err: any) {
      setServerError(
        err?.response?.data?.message ||
        t("অ্যাপয়েন্টমেন্ট জমা দিতে ব্যর্থ হয়েছে।", "Failed to submit appointment.")
      );
    }
  }

  if (submitted) {
    return (
      <SuccessCard
        appointment={submitted}
        t={t}
        onNew={() => { setSubmitted(null); reset(); }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section: Patient Info */}
      <div>
        <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          {t("রোগীর তথ্য", "Patient Information")}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            id="patientName"
            label={t("রোগীর নাম *", "Patient Name *")}
            placeholder={t("পূর্ণ নাম লিখুন", "Enter full name")}
            error={errors.patientName?.message}
            {...register("patientName")}
          />
          <Input
            id="phone"
            type="tel"
            label={t("ফোন নম্বর *", "Phone Number *")}
            placeholder="01XXXXXXXXX"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            id="email"
            type="email"
            label={t("ইমেইল (ঐচ্ছিক)", "Email (Optional)")}
            placeholder="example@email.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="age"
            type="number"
            label={t("বয়স *", "Age *")}
            placeholder={t("বয়স লিখুন", "Enter age")}
            min={1}
            max={120}
            error={errors.age?.message}
            {...register("age")}
          />
          <FormSelect
            label={t("লিঙ্গ *", "Gender *")}
            error={errors.gender?.message}
            {...register("gender")}
          >
            <option value="">{t("নির্বাচন করুন", "Select")}</option>
            <option value="MALE">{t("পুরুষ", "Male")}</option>
            <option value="FEMALE">{t("মহিলা", "Female")}</option>
            <option value="OTHER">{t("অন্যান্য", "Other")}</option>
          </FormSelect>
        </div>
      </div>

      {/* Section: Appointment Details */}
      <div>
        <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          {t("অ্যাপয়েন্টমেন্টের তথ্য", "Appointment Details")}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormSelect
            label={t("চিকিৎসক (ঐচ্ছিক)", "Doctor (Optional)")}
            {...register("doctorId")}
          >
            <option value="">{t("চিকিৎসক নির্বাচন করুন", "Select a doctor")}</option>
            {doctors?.map((d) => (
              <option key={d.id} value={d.id}>
                {t(d.nameBn, d.nameEn)} — {t(d.specialtyBn, d.specialtyEn)}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            label={t("সেবা (ঐচ্ছিক)", "Service (Optional)")}
            {...register("serviceId")}
          >
            <option value="">{t("সেবা নির্বাচন করুন", "Select a service")}</option>
            {services?.map((s) => (
              <option key={s.id} value={s.id}>
                {t(s.nameBn, s.nameEn)}
              </option>
            ))}
          </FormSelect>

          <Input
            id="preferredDate"
            type="date"
            label={t("পছন্দের তারিখ *", "Preferred Date *")}
            min={today}
            error={errors.preferredDate?.message}
            {...register("preferredDate")}
          />

          <FormSelect
            label={t("পছন্দের সময় *", "Preferred Time *")}
            error={errors.preferredTime?.message}
            {...register("preferredTime")}
          >
            <option value="">{t("সময় নির্বাচন করুন", "Select time")}</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </FormSelect>
        </div>
      </div>

      {/* Section: Problem */}
      <div>
        <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          {t("সমস্যার বিবরণ", "Problem Description")}
        </h3>
        <div className="space-y-4">
          <FormTextarea
            label={t("চোখের সমস্যা / কারণ *", "Eye Problem / Reason *")}
            placeholder={t(
              "আপনার চোখের সমস্যা সংক্ষেপে বর্ণনা করুন...",
              "Briefly describe your eye problem..."
            )}
            error={errors.reason?.message}
            {...register("reason")}
          />
          <FormTextarea
            label={t("অতিরিক্ত বার্তা (ঐচ্ছিক)", "Additional Message (Optional)")}
            placeholder={t(
              "কোনো অতিরিক্ত তথ্য থাকলে লিখুন...",
              "Write any additional information..."
            )}
            rows={3}
            {...register("message")}
          />
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          ⚠️ {serverError}
        </div>
      )}

      {/* Notice */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
        💡 {t(
          "অ্যাপয়েন্টমেন্ট নিশ্চিত করতে আমরা আপনার সাথে ফোনে যোগাযোগ করব। অনুরোধ জমা দেওয়া মানে অ্যাপয়েন্টমেন্ট নিশ্চিত নয়।",
          "We will contact you by phone to confirm the appointment. Submitting a request does not confirm the appointment."
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {t("জমা দেওয়া হচ্ছে...", "Submitting...")}
          </>
        ) : (
          <>
            <CalendarCheck size={20} />
            {t("অ্যাপয়েন্টমেন্ট অনুরোধ জমা দিন", "Submit Appointment Request")}
          </>
        )}
      </button>
    </form>
  );
}
