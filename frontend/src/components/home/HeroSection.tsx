"use client";

import Link from "next/link";
import { Phone, CalendarCheck } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function HeroSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  return (
    <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-300 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-primary-600/60 border border-primary-400/40 text-primary-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              {t(s.hero_badge_bn, s.hero_badge_en)}
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              {t(s.hero_title_bn, s.hero_title_en)}
            </h1>

            <p className="text-primary-100 text-lg leading-relaxed mb-8 max-w-lg">
              {t(s.hero_desc_bn, s.hero_desc_en)}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/appointment"
                className="flex items-center gap-2 bg-white text-primary-800 font-bold px-6 py-3.5 rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
              >
                <CalendarCheck size={18} />
                {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
              </Link>
              <a
                href={`tel:${s.phone}`}
                className="flex items-center gap-2 border-2 border-white/60 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Phone size={18} />
                {t("এখনই কল করুন", "Call Now")}
              </a>
            </div>

            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/20">
              {[
                { bn: "অভিজ্ঞ চিকিৎসক দল", en: "Expert Medical Team" },
                { bn: "আধুনিক যন্ত্রপাতি", en: "Modern Equipment" },
                { bn: "সাশ্রয়ী মূল্যে সেবা", en: "Affordable Care" },
              ].map((item) => (
                <div key={item.en} className="flex items-center gap-2 text-primary-100 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-300" />
                  {t(item.bn, item.en)}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse" />
              <div className="absolute inset-8 rounded-full border border-white/30" />
              <div className="absolute inset-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl mb-2">👁️</div>
                  <p className="text-white/80 text-xs font-medium">{t("চক্ষু সেবা", "Eye Care")}</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white text-primary-800 rounded-xl px-3 py-2 shadow-lg text-xs font-bold">
                {t("ফ্যাকো সার্জারি", "Phaco Surgery")} ✓
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary-500 text-white rounded-xl px-3 py-2 shadow-lg text-xs font-bold">
                {t("জরুরি সেবা ২৪/৭", "24/7 Emergency")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
