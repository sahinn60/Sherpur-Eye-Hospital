"use client";

import Link from "next/link";
import { CalendarCheck, CheckCircle2, MapPin } from "lucide-react";
import { useLang } from "@/context/LangContext";

const STEPS = [
  { icon: CalendarCheck, bn: "অ্যাপয়েন্টমেন্ট অনুরোধ", en: "Request Appointment", descBn: "অনলাইনে বা ফোনে সহজেই অ্যাপয়েন্টমেন্ট নিন।", descEn: "Book easily online or by phone." },
  { icon: CheckCircle2, bn: "নিশ্চিতকরণ", en: "Confirmation", descBn: "আমাদের টিম আপনাকে কল করে সময় নিশ্চিত করবে।", descEn: "Our team will call to confirm your time." },
  { icon: MapPin, bn: "হাসপাতালে আসুন", en: "Visit Hospital", descBn: "নির্ধারিত সময়ে হাসপাতালে এসে বিশেষজ্ঞ সেবা নিন।", descEn: "Visit at your scheduled time for specialist care." },
];

export function CareProcessSection() {
  const { t } = useLang();

  return (
    <section className="py-16 sm:py-24 bg-blue-600 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-blue-500 opacity-30 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-700 opacity-30 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block bg-white/10 text-blue-100 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            {t("চিকিৎসা প্রক্রিয়া", "Care Process")}
          </span>
          <h2 className="font-extrabold text-white leading-tight mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
            {t("কীভাবে সেবা নেবেন", "How to Get Care")}
          </h2>
          <p className="text-blue-100 text-sm sm:text-base">
            {t("মাত্র ৩টি সহজ ধাপে আমাদের বিশেষজ্ঞ সেবা গ্রহণ করুন।", "Get our specialist care in just 3 simple steps.")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 relative mb-12">
          {/* Connector line — desktop only */}
          <div className="hidden sm:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-white/20" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.en} className="relative flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-3xl bg-white/15 border border-white/25 text-white flex items-center justify-center shadow-xl backdrop-blur-sm">
                    <Icon size={28} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white text-blue-600 text-xs font-extrabold flex items-center justify-center shadow-md">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-bold text-white text-base mb-2">{t(step.bn, step.en)}</h3>
                <p className="text-blue-100 text-sm leading-relaxed max-w-xs">{t(step.descBn, step.descEn)}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/appointment"
            className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-2xl transition-all shadow-xl text-sm">
            <CalendarCheck size={18} />
            {t("এখনই অ্যাপয়েন্টমেন্ট নিন", "Book Appointment Now")}
          </Link>
        </div>
      </div>
    </section>
  );
}
