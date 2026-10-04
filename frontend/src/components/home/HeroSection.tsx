"use client";

import Link from "next/link";
import { Phone, CalendarCheck } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function HeroSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  return (
    <section
      className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden"
      style={s.hero_image_url ? {
        backgroundImage: `url(${s.hero_image_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      } : undefined}
    >
      {/* Dark overlay when image is set */}
      {s.hero_image_url && (
        <div className="absolute inset-0 bg-primary-900/70" />
      )}
      {/* Background blobs — hidden on mobile for performance */}
      <div className="absolute inset-0 opacity-10 hidden sm:block">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-300 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            {/* Badge */}
            <span className="inline-block bg-primary-600/60 border border-primary-400/40 text-primary-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              {t(s.hero_badge_bn, s.hero_badge_en)}
            </span>

            {/* Headline — responsive clamp */}
            <h1
              className="font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(1.75rem, 5vw, 3.75rem)", lineHeight: 1.2 }}
            >
              {t(s.hero_title_bn, s.hero_title_en)}
            </h1>

            {/* Description */}
            <p className="text-primary-100 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg">
              {t(s.hero_desc_bn, s.hero_desc_en)}
            </p>

            {/* CTA Buttons — stack on mobile, row on sm+ */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/appointment"
                className="flex items-center justify-center gap-2 bg-white text-primary-800 font-bold px-6 py-3.5 rounded-xl hover:bg-primary-50 transition-colors shadow-lg text-sm sm:text-base"
              >
                <CalendarCheck size={18} />
                {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
              </Link>
              <a
                href={`tel:${s.phone}`}
                className="flex items-center justify-center gap-2 border-2 border-white/60 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm sm:text-base"
              >
                <Phone size={18} />
                {t("এখনই কল করুন", "Call Now")}
              </a>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 sm:gap-6 mt-8 pt-6 sm:pt-8 border-t border-white/20">
              {[
                { bn: "অভিজ্ঞ চিকিৎসক দল", en: "Expert Medical Team" },
                { bn: "আধুনিক যন্ত্রপাতি", en: "Modern Equipment" },
                { bn: "সাশ্রয়ী মূল্যে সেবা", en: "Affordable Care" },
              ].map((item) => (
                <div key={item.en} className="flex items-center gap-2 text-primary-100 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-300 flex-shrink-0" />
                  {t(item.bn, item.en)}
                </div>
              ))}
            </div>
          </div>

          {/* Decorative visual — desktop only */}
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

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 40L1440 40L1440 14C1200 40 960 0 720 14C480 28 240 0 0 14L0 40Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
