"use client";

import Link from "next/link";
import { CalendarCheck, Users, ArrowRight, ListOrdered } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

// ── Quick-action cards ────────────────────────────────────────────────────────
const QUICK_CARDS = [
  {
    icon: <CalendarCheck size={22} className="text-blue-600" />,
    titleBn: "অ্যাপয়েন্টমেন্ট",
    titleEn: "Appointment",
    descBn: "আপনার পছন্দের সময় নির্বাচন করুন",
    descEn: "Choose your preferred time",
    href: "/appointment",
    bg: "bg-white",
    border: "border-blue-100",
  },
  {
    icon: <ListOrdered size={22} className="text-green-600" />,
    titleBn: "লাইভ সিরিয়াল",
    titleEn: "Live Serial",
    descBn: "বর্তমান সিরিয়াল ও পরবর্তী সিরিয়াল",
    descEn: "Current and next serial number",
    href: "/appointment",   // live-serial page not yet implemented
    bg: "bg-green-50",
    border: "border-green-100",
  },
  {
    icon: <Users size={22} className="text-blue-600" />,
    titleBn: "চিকিৎসক",
    titleEn: "Doctors",
    descBn: "আমাদের অভিজ্ঞ চিকিৎসক",
    descEn: "Our experienced doctors",
    href: "/doctors",
    bg: "bg-white",
    border: "border-blue-100",
  },
];

export function HeroSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  // Hero image: use CMS-configured image or fallback to a placeholder
  const heroImg: string = (s as any).hero_image || "";

  return (
    <section className="relative bg-[#EEF4FF] overflow-visible pb-0">

      {/* ── Centered text block ─────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20 text-center">

        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
          {t("শেরপুরের আধুনিক চক্ষু সেবা কেন্দ্র", "Modern Eye Care Center in Sherpur")}
        </span>

        {/* Headline */}
        <h1
          className="font-extrabold leading-tight mb-4 tracking-tight"
          style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1.25 }}
        >
          <span className="text-blue-600">{t("চোখের যত্ন", "Eye Care")}</span>
          <span className="text-gray-900"> {t("এখন আরও সহজ।", "Made Easier.")}</span>
        </h1>

        {/* Description */}
        <p
          className="text-gray-500 leading-relaxed mb-8 mx-auto"
          style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)", maxWidth: "520px" }}
        >
          {t(
            "বিশ্বাস, যত্ন এবং আধুনিক চিকিৎসা প্রযুক্তির সমন্বয়ে আপনার চোখের সুস্থতার জন্য আমরা আছি পাশে।",
            "We combine trust, care, and modern medical technology to stand by your eye health."
          )}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Link
            href="/appointment"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md shadow-blue-200 text-sm"
          >
            <CalendarCheck size={17} />
            {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
          </Link>
          <Link
            href="/appointment"
            className="inline-flex items-center gap-2 bg-white border-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <ListOrdered size={17} />
            {t("লাইভ সিরিয়াল দেখুন", "View Live Serial")}
          </Link>
        </div>
      </div>

      {/* ── Photo + curved top mask ──────────────────────────────────────── */}
      <div className="relative mx-4 sm:mx-8 lg:mx-16 xl:mx-24">

        {/* Shallow downward curve at top of image — pale-blue bg bleeds into image */}
        <div
          className="absolute -top-6 left-0 right-0 h-12 bg-[#EEF4FF] z-10 pointer-events-none"
          style={{
            borderRadius: "0 0 50% 50% / 0 0 100% 100%",
            transform: "scaleX(1.05)",
          }}
        />

        {/* Hospital image */}
        <div
          className="relative overflow-hidden z-0"
          style={{ borderRadius: "20px", height: "clamp(200px, 30vw, 360px)" }}
        >
          {heroImg ? (
            <img
              src={heroImg}
              alt={t("শেরপুর আধুনিক চক্ষু হাসপাতাল", "Sherpur Adhunik Eye Hospital")}
              className="w-full h-full object-cover"
            />
          ) : (
            /* Placeholder when no image is configured */
            <div className="w-full h-full bg-gradient-to-br from-blue-700 to-blue-900 flex flex-col items-center justify-center gap-3">
              <span className="text-6xl sm:text-7xl">🏥</span>
              <p className="text-white font-semibold text-sm sm:text-base text-center px-4">
                {t(
                  "Admin CMS → হিরো ব্যাকগ্রাউন্ড ছবি আপলোড করুন",
                  "Upload hero image from Admin CMS → Hero Background Image"
                )}
              </p>
            </div>
          )}
        </div>

        {/* ── Three overlapping quick-action cards ──────────────────────── */}
        <div
          className="relative z-20 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 px-0 sm:px-2"
          style={{ marginTop: "-48px" }}
        >
          {QUICK_CARDS.map((card) => (
            <Link
              key={card.titleEn}
              href={card.href}
              className={`flex items-center gap-3 ${card.bg} border ${card.border} rounded-2xl px-4 py-4 shadow-lg hover:shadow-xl transition-all group`}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
                {card.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm leading-tight">
                  {t(card.titleBn, card.titleEn)}
                </p>
                <p className="text-gray-500 text-xs mt-0.5 leading-snug">
                  {t(card.descBn, card.descEn)}
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight
                size={16}
                className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Space below cards so next section is not covered */}
      <div className="h-16 sm:h-20" />
    </section>
  );
}
