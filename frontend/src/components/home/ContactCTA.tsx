"use client";

import Link from "next/link";
import { Phone, CalendarCheck } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { HOSPITAL_INFO } from "@/lib/config/siteConfig";

export function ContactCTA() {
  const { t } = useLang();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary-700 to-primary-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2
          className="font-bold mb-3 sm:mb-4"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
        >
          {t("আজই আমাদের সাথে যোগাযোগ করুন", "Contact Us Today")}
        </h2>
        <p className="text-primary-200 text-sm sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
          {t(
            "চোখের যেকোনো সমস্যায় দেরি না করে আজই বিশেষজ্ঞ পরামর্শ নিন।",
            "Don't delay — consult our specialists today for any eye problem."
          )}
        </p>

        {/* Stacked on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/appointment"
            className="flex items-center justify-center gap-2 bg-white text-primary-800 font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl hover:bg-primary-50 transition-colors shadow-lg text-base sm:text-lg"
          >
            <CalendarCheck size={20} />
            {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
          </Link>
          <a
            href={`tel:${HOSPITAL_INFO.phone}`}
            className="flex items-center justify-center gap-2 border-2 border-white/60 text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl hover:bg-white/10 transition-colors text-base sm:text-lg"
          >
            <Phone size={20} />
            {HOSPITAL_INFO.phone}
          </a>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-6 text-primary-200 text-xs sm:text-sm">
          <span>📍 {t(HOSPITAL_INFO.addressBn, HOSPITAL_INFO.addressEn)}</span>
          <span>🕐 {t(HOSPITAL_INFO.hoursBn, HOSPITAL_INFO.hoursEn)}</span>
        </div>
      </div>
    </section>
  );
}
