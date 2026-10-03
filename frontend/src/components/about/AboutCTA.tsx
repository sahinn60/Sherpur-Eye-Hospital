"use client";

import Link from "next/link";
import { CalendarCheck, Phone } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { HOSPITAL_INFO } from "@/lib/config/siteConfig";

export function AboutCTA() {
  const { t } = useLang();

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary-700 to-primary-900 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="text-5xl mb-5">👁️</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t(
            "আজই আপনার চোখের যত্ন নিন",
            "Take Care of Your Eyes Today"
          )}
        </h2>
        <p className="text-primary-200 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          {t(
            "চোখের সমস্যায় দেরি করবেন না। আমাদের অভিজ্ঞ বিশেষজ্ঞ দল আপনার সেবায় সর্বদা প্রস্তুত।",
            "Don't delay with eye problems. Our experienced specialist team is always ready to serve you."
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/appointment"
            className="flex items-center justify-center gap-2 bg-white text-primary-800 font-bold px-8 py-4 rounded-xl hover:bg-primary-50 transition-colors shadow-lg text-lg"
          >
            <CalendarCheck size={20} />
            {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
          </Link>
          <a
            href={`tel:${HOSPITAL_INFO.phone}`}
            className="flex items-center justify-center gap-2 border-2 border-white/60 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-lg"
          >
            <Phone size={20} />
            {t("কল করুন", "Call Us")}
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-primary-200 text-sm">
          <span>📍 {t(HOSPITAL_INFO.addressBn, HOSPITAL_INFO.addressEn)}</span>
          <span>🕐 {t(HOSPITAL_INFO.hoursBn, HOSPITAL_INFO.hoursEn)}</span>
          <span>📞 {HOSPITAL_INFO.phone}</span>
        </div>
      </div>
    </section>
  );
}
