"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCheck, CheckCircle } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useDoctors } from "@/hooks/useDoctors";
import { useServices } from "@/hooks/useServices";
import { submitAppointment } from "@/lib/services/appointmentService";
import { Appointment } from "@/types/appointment";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
];

function SearchParamsReader({ onRead }: { onRead: (doctorId: string, serviceId: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onRead(searchParams.get("doctor") || "", searchParams.get("service") || "");
  }, [searchParams, onRead]);
  return null;
}

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
        {t("আপনার অনুরোধ পাওয়া গেছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।", "Your request has been received. We will contact you shortly.")}
      </p>
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
      <div className="bg-gray-50 rounded-2xl p-5 max-w-sm mx-auto text-left space-y-2 mb-6 text-sm">
        <div className="flex justify-between gap-4"><span className="text-gray-500">{t("রোগীর নাম", "Patient")}</span><span className="font-medium text-gray-800">{appointment.patientName}</span></div>
        <div className="flex justify-between gap-4"><span className="text-gray-500">{t("ফোন", "Phone")}</span><span className="font-medium text-gray-800">{appointment.phone}</span></div>
        <div className="flex justify-between gap-4"><span className="text-gray-500">{t("পছন্দের সময়", "Time")}</span><span className="font-medium text-gray-800">{appointment.preferredTime}</span></div>
        <div className="flex justify-between gap-4"><span className="text-gray-500">{t("অবস্থা", "Status")}</span><span className="font-medium text-amber-600">{t("অপেক্ষমাণ", "Pending")}</span></div>
      </div>
      <button onClick={onNew} className="text-primary-600 hover:text-primary-800 font-semibold text-sm transition-colors">
        {t("নতুন অ্যাপয়েন্টমেন্ট নিন →", "Book another appointment →")}
      </button>
    </div>
  );
}

const inp = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";
const inpErr = "border-red-500 focus:border-red-500 focus:ring-red-500";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function AppointmentForm() {
  const { t } = useLang();
  const [submitted, setSubmitted] = useState<Appointment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: doctors } = useDoctors();
  const { data: services } = useServices();

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    patientName: "", phone: "", email: "", age: "",
    gender: "", doctorId: "", serviceId: "",
    preferredDate: "", preferredTime: "", reason: "", message: "",
  });

  const handleSearchParams = (doctorId: string, serviceId: string) => {
    if (doctorId) setForm(f => ({ ...f, doctorId }));
    if (serviceId) setForm(f => ({ ...f, serviceId }));
  };

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  function validate() {
    const e: Record<string, string> = {};
    if (form.patientName.trim().length < 2) e.patientName = t("নাম কমপক্ষে ২ অক্ষর হতে হবে", "Name must be at least 2 characters");
    if (form.phone.trim().length < 10) e.phone = t("সঠিক ফোন নম্বর দিন", "Enter a valid phone number");
    if (!form.age || isNaN(Number(form.age))) e.age = t("বয়স দিন", "Enter age");
    if (!form.gender) e.gender = t("লিঙ্গ নির্বাচন করুন", "Select gender");
    if (!form.preferredDate) e.preferredDate = t("তারিখ নির্বাচন করুন", "Select a date");
    if (!form.preferredTime) e.preferredTime = t("সময় নির্বাচন করুন", "Select a time");
    if (!form.reason.trim()) e.reason = t("সমস্যার বিবরণ দিন", "Describe your problem");
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setServerError("");
    try {
      const result = await submitAppointment({
        patientName: form.patientName,
        phone: form.phone,
        email: form.email || undefined,
        age: Number(form.age),
        gender: form.gender as any,
        doctorId: form.doctorId || undefined,
        serviceId: form.serviceId || undefined,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        reason: form.reason,
        message: form.message || undefined,
      });
      setSubmitted(result);
    } catch (err: any) {
      setServerError(err?.response?.data?.message || t("অ্যাপয়েন্টমেন্ট জমা দিতে ব্যর্থ হয়েছে।", "Failed to submit appointment."));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <SuccessCard appointment={submitted} t={t} onNew={() => { setSubmitted(null); setForm({ patientName: "", phone: "", email: "", age: "", gender: "", doctorId: "", serviceId: "", preferredDate: "", preferredTime: "", reason: "", message: "" }); }} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Suspense fallback={null}>
        <SearchParamsReader onRead={handleSearchParams} />
      </Suspense>
      {/* Patient Info */}
      <div>
        <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          {t("রোগীর তথ্য", "Patient Information")}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t("রোগীর নাম *", "Patient Name *")} error={errors.patientName}>
            <input value={form.patientName} onChange={e => set("patientName", e.target.value)} placeholder={t("পূর্ণ নাম লিখুন", "Enter full name")} className={cn(inp, errors.patientName && inpErr)} />
          </Field>
          <Field label={t("ফোন নম্বর *", "Phone Number *")} error={errors.phone}>
            <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="01XXXXXXXXX" className={cn(inp, errors.phone && inpErr)} />
          </Field>
          <Field label={t("ইমেইল (ঐচ্ছিক)", "Email (Optional)")} error={errors.email}>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="example@email.com" className={cn(inp, errors.email && inpErr)} />
          </Field>
          <Field label={t("বয়স *", "Age *")} error={errors.age}>
            <input type="number" value={form.age} onChange={e => set("age", e.target.value)} placeholder={t("বয়স লিখুন", "Enter age")} min={1} max={120} className={cn(inp, errors.age && inpErr)} />
          </Field>
          <Field label={t("লিঙ্গ *", "Gender *")} error={errors.gender}>
            <select value={form.gender} onChange={e => set("gender", e.target.value)} className={cn(inp, "bg-white", errors.gender && inpErr)}>
              <option value="">{t("নির্বাচন করুন", "Select")}</option>
              <option value="MALE">{t("পুরুষ", "Male")}</option>
              <option value="FEMALE">{t("মহিলা", "Female")}</option>
              <option value="OTHER">{t("অন্যান্য", "Other")}</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Appointment Details */}
      <div>
        <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          {t("অ্যাপয়েন্টমেন্টের তথ্য", "Appointment Details")}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t("চিকিৎসক (ঐচ্ছিক)", "Doctor (Optional)")}>
            <select value={form.doctorId} onChange={e => set("doctorId", e.target.value)} className={cn(inp, "bg-white")}>
              <option value="">{t("চিকিৎসক নির্বাচন করুন", "Select a doctor")}</option>
              {doctors?.map(d => <option key={d.id} value={d.id}>{t(d.nameBn, d.nameEn)} — {t(d.specialtyBn, d.specialtyEn)}</option>)}
            </select>
          </Field>
          <Field label={t("সেবা (ঐচ্ছিক)", "Service (Optional)")}>
            <select value={form.serviceId} onChange={e => set("serviceId", e.target.value)} className={cn(inp, "bg-white")}>
              <option value="">{t("সেবা নির্বাচন করুন", "Select a service")}</option>
              {services?.map(s => <option key={s.id} value={s.id}>{t(s.nameBn, s.nameEn)}</option>)}
            </select>
          </Field>
          <Field label={t("পছন্দের তারিখ *", "Preferred Date *")} error={errors.preferredDate}>
            <input type="date" value={form.preferredDate} onChange={e => set("preferredDate", e.target.value)} min={today} className={cn(inp, errors.preferredDate && inpErr)} />
          </Field>
          <Field label={t("পছন্দের সময় *", "Preferred Time *")} error={errors.preferredTime}>
            <select value={form.preferredTime} onChange={e => set("preferredTime", e.target.value)} className={cn(inp, "bg-white", errors.preferredTime && inpErr)}>
              <option value="">{t("সময় নির্বাচন করুন", "Select time")}</option>
              {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
            </select>
          </Field>
        </div>
      </div>

      {/* Problem */}
      <div>
        <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          {t("সমস্যার বিবরণ", "Problem Description")}
        </h3>
        <div className="space-y-4">
          <Field label={t("চোখের সমস্যা / কারণ *", "Eye Problem / Reason *")} error={errors.reason}>
            <textarea rows={4} value={form.reason} onChange={e => set("reason", e.target.value)} placeholder={t("আপনার চোখের সমস্যা সংক্ষেপে বর্ণনা করুন...", "Briefly describe your eye problem...")} className={cn(inp, "resize-none", errors.reason && inpErr)} />
          </Field>
          <Field label={t("অতিরিক্ত বার্তা (ঐচ্ছিক)", "Additional Message (Optional)")}>
            <textarea rows={3} value={form.message} onChange={e => set("message", e.target.value)} placeholder={t("কোনো অতিরিক্ত তথ্য থাকলে লিখুন...", "Write any additional information...")} className={cn(inp, "resize-none")} />
          </Field>
        </div>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">⚠️ {serverError}</div>
      )}

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
        💡 {t("অ্যাপয়েন্টমেন্ট নিশ্চিত করতে আমরা আপনার সাথে ফোনে যোগাযোগ করব। অনুরোধ জমা দেওয়া মানে অ্যাপয়েন্টমেন্ট নিশ্চিত নয়।", "We will contact you by phone to confirm the appointment. Submitting a request does not confirm the appointment.")}
      </div>

      <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg">
        {submitting ? (
          <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>{t("জমা দেওয়া হচ্ছে...", "Submitting...")}</>
        ) : (
          <><CalendarCheck size={20} />{t("অ্যাপয়েন্টমেন্ট অনুরোধ জমা দিন", "Submit Appointment Request")}</>
        )}
      </button>
    </form>
  );
}
