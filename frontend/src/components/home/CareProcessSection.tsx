"use client";

import Link from "next/link";
import { CalendarCheck, CheckCircle2, MapPin } from "lucide-react";
import { useLang } from "@/context/LangContext";

const STEPS = [
  { icon: <CalendarCheck size={24} />, bn: "অ্যাপয়েন্টমেন্ট অনুরোধ", en: "Request Appointment", descBn: "অনলাইনে বা ফোনে সহজেই অ্যাপয়েন্টমেন্ট নিন।", descEn: "Book easily online or by phone." },
  { icon: <CheckCircle2 size={24} />, bn: "নিশ্চিতকরণ", en: "Confirmation", descBn: "আমাদের টিম আপনাকে কল করে সময় নিশ্চিত করবে।", descEn: "Our team will call to confirm your time." },
  { icon: <MapPin size={24} />, bn: "হাসপাতালে আসুন", en: "Visit Hospital", descBn: "নির্ধারিত সময়ে হাসপাতালে এসে বিশেষজ্ঞ সেবা নিন।", descEn: "Visit at your scheduled time for specialist care." },
];

export function CareProcessSection() {
  const { t } = useLang();

  return (
    <section className="py-14 sm:py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-blue-200 text-xs font-semibold uppercase tracking-widest">
            {t("চিকিৎসা প্রক্রিয়া", "Care Process")}
          </span>
          <h2 className="font-extrabold text-white mt-2 mb-3" style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}>
            {t("কীভাবে সেবা নেবেন", "How to Get Care")}
          </h2>
          <p className="text-blue-100 text-sm sm:text-base">
            {t("মাত্র ৩টি সহজ ধাপে আমাদের বিশেষজ্ঞ সেবা গ্রহণ করুন।", "Get our specialist care in just 3 simple steps.")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Connector */}
          <div className="hidden sm:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-white/20 z-0" />

          {STEPS.map((step, i) => (
            <div key={step.en} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 text-white flex items-center justify-center mb-4 shadow-lg">
                {step.icon}
              </div>
              <div className="w-6 h-6 rounded-full bg-white text-blue-600 text-xs font-extrabold flex items-center justify-center mb-3 -mt-1">
                {i + 1}
              </div>
              <h3 className="font-bold text-white mb-2 text-base">{t(step.bn, step.en)}</h3>
              <p className="text-blue-100 text-sm leading-relaxed">{t(step.descBn, step.descEn)}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/appointment" className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-7 py-3.5 rounded-xl transition-colors text-sm shadow-lg">
            <CalendarCheck size={18} />
            {t("এখনই অ্যাপয়েন্টমেন্ট নিন", "Book Appointment Now")}
          </Link>
        </div>
      </div>
    </section>
  );
}
