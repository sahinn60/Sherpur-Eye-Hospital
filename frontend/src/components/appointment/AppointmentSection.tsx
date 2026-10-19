"use client";

import { useState } from "react";
import { Suspense } from "react";
import { AppointmentForm } from "./AppointmentForm";
import { useLang } from "@/context/LangContext";
import { trackAppointmentByRequestId } from "@/lib/services/appointmentService";
import { Appointment } from "@/types/appointment";
import { Search, CalendarCheck, Clock, CheckCircle2, XCircle, AlertCircle, UserCheck } from "lucide-react";

const STATUS_MAP: Record<string, { bn: string; en: string; color: string; bg: string; border: string; Icon: any }> = {
  PENDING:   { bn: "অপেক্ষমাণ",    en: "Pending",   color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200", Icon: Clock },
  CONFIRMED: { bn: "নিশ্চিত হয়েছে", en: "Confirmed", color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200", Icon: CheckCircle2 },
  CANCELLED: { bn: "বাতিল হয়েছে",  en: "Cancelled", color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",   Icon: XCircle },
  COMPLETED: { bn: "সম্পন্ন হয়েছে", en: "Completed", color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",  Icon: UserCheck },
  NO_SHOW:   { bn: "অনুপস্থিত",     en: "No Show",   color: "text-gray-600",   bg: "bg-gray-50",   border: "border-gray-200",  Icon: AlertCircle },
};

function fmtDate(d: string, lang: string) {
  return new Date(d).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function TrackResult({ appt, t, lang }: { appt: Appointment; t: (bn: string, en: string) => string; lang: string }) {
  const s = STATUS_MAP[appt.status] ?? STATUS_MAP.PENDING;
  const Icon = s.Icon;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Status header */}
      <div className={`px-5 py-4 flex items-center gap-3 ${s.bg} border-b ${s.border}`}>
        <Icon size={20} className={s.color} />
        <div>
          <p className={`font-bold text-sm ${s.color}`}>{t(s.bn, s.en)}</p>
          <p className="text-xs text-gray-500 font-mono">{appt.requestId}</p>
        </div>
      </div>
      {/* Details */}
      <div className="p-5 space-y-2.5 text-sm">
        <Row label={t("রোগীর নাম", "Patient")} value={appt.patientName} />
        <Row label={t("পছন্দের তারিখ", "Preferred Date")} value={fmtDate(appt.preferredDate, lang)} />
        <Row label={t("পছন্দের সময়", "Preferred Time")} value={appt.preferredTime} />
        {appt.doctor && <Row label={t("চিকিৎসক", "Doctor")} value={t(appt.doctor.nameBn, appt.doctor.nameEn)} />}
        {appt.service && <Row label={t("সেবা", "Service")} value={t(appt.service.nameBn, appt.service.nameEn)} />}
        {appt.adminNote && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-0.5">{t("হাসপাতালের নোট", "Hospital Note")}</p>
            <p className="text-gray-700 text-sm">{appt.adminNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}

function TrackSection() {
  const { t, lang } = useLang();
  const [query,   setQuery]   = useState("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<Appointment | null>(null);
  const [error,   setError]   = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const id = query.trim().toUpperCase();
    if (!id) return;
    setLoading(true); setError(""); setResult(null); setSearched(false);
    try {
      const appt = await trackAppointmentByRequestId(id);
      setResult(appt);
      setSearched(true);
    } catch {
      setError(t("কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি। আইডিটি সঠিকভাবে লিখুন।", "No appointment found. Please check the ID and try again."));
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 md:p-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t("অ্যাপয়েন্টমেন্ট ট্র্যাক করুন", "Track Appointment")}</h2>
        <p className="text-gray-500 text-sm mt-1">
          {t("অ্যাপয়েন্টমেন্ট আইডি দিয়ে আপনার অনুরোধের অবস্থা দেখুন।", "Enter your appointment request ID to check its status.")}
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setError(""); setResult(null); setSearched(false); }}
            placeholder={t("যেমন: APT-2025-0001", "e.g. APT-2025-0001")}
            className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors shrink-0 flex items-center gap-2"
        >
          {loading
            ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
            : <Search size={15} />}
          {t("খুঁজুন", "Search")}
        </button>
      </form>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {result && <TrackResult appt={result} t={t} lang={lang} />}

      {!searched && !loading && (
        <div className="text-center py-8">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <CalendarCheck size={26} className="text-blue-400" />
          </div>
          <p className="text-gray-400 text-sm">{t("অ্যাপয়েন্টমেন্ট আইডি লিখুন", "Enter your appointment ID above")}</p>
        </div>
      )}
    </div>
  );
}

export function AppointmentSection() {
  const { t } = useLang();

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-gray-50 min-h-[60vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">

        {/* Booking form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("অ্যাপয়েন্টমেন্ট অনুরোধ", "Appointment Request")}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {t(
                "ফর্মটি পূরণ করুন। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
                "Fill out the form. We will contact you shortly."
              )}
            </p>
          </div>
          <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-xl" />}>
            <AppointmentForm />
          </Suspense>
        </div>

        {/* Track section */}
        <TrackSection />

      </div>
    </section>
  );
}
