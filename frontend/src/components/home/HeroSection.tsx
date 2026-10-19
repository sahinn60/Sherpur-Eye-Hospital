"use client";

import Link from "next/link";
import { CalendarCheck, ListOrdered, Users, ArrowRight, Phone } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function HeroSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();
  const heroImg: string = (s as any).hero_image || "";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF3FF] to-white">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-100 opacity-50 blur-3xl" />
      <div className="pointer-events-none absolute top-10 -right-20 w-72 h-72 rounded-full bg-blue-200 opacity-30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-0 sm:pt-16 lg:pt-20">

        {/* ── Top text ── */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white/70 inline-block animate-pulse" />
            {t("শেরপুরের আধুনিক চক্ষু সেবা কেন্দ্র", "Modern Eye Care Center in Sherpur")}
          </span>

          <h1 className="font-extrabold text-gray-900 leading-tight mb-5 tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}>
            {t("চোখের সেরা যত্ন", "The Best Care")}
            <br />
            <span className="text-blue-600">{t("এখন আপনার দোরগোড়ায়", "For Your Eyes")}</span>
          </h1>

          <p className="text-gray-500 leading-relaxed mb-8 mx-auto"
            style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)", maxWidth: "540px" }}>
            {t(
              "বিশ্বাস, যত্ন ও আধুনিক প্রযুক্তির সমন্বয়ে শেরপুর আধুনিক চক্ষু হাসপাতাল আপনার চোখের সুস্থতায় সর্বদা পাশে।",
              "Combining trust, care and modern technology — Sherpur Eye Hospital is always by your side."
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Link href="/appointment"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-200 text-sm">
              <CalendarCheck size={17} />
              {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
            </Link>
            <a href={`tel:${(s as any).contact_phone || "01781836581"}`}
              className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-700 font-bold px-7 py-3.5 rounded-2xl transition-all text-sm">
              <Phone size={17} />
              {t("কল করুন", "Call Us")}
            </a>
          </div>
        </div>

        {/* ── Hero image ── */}
        <div className="relative mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-t-3xl shadow-2xl shadow-blue-100"
            style={{ height: "clamp(220px, 32vw, 420px)" }}>
            {heroImg ? (
              <img src={heroImg} alt={t("শেরপুর আধুনিক চক্ষু হাসপাতাল", "Sherpur Eye Hospital")}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-700 via-blue-600 to-blue-900 flex flex-col items-center justify-center gap-3">
                <span className="text-7xl sm:text-8xl">🏥</span>
                <p className="text-white/80 text-sm text-center px-6">
                  {t("Admin CMS থেকে হিরো ছবি আপলোড করুন", "Upload hero image from Admin CMS")}
                </p>
              </div>
            )}
          </div>

          {/* ── Quick cards overlapping image bottom ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 -mt-6 sm:-mt-8 px-3 sm:px-0 pb-6 sm:pb-8">
            {[
              { icon: <CalendarCheck size={20} className="text-blue-600" />, titleBn: "অ্যাপয়েন্টমেন্ট", titleEn: "Appointment", descBn: "সহজেই সময় নির্ধারণ করুন", descEn: "Schedule your visit easily", href: "/appointment", color: "blue" },
              { icon: <ListOrdered size={20} className="text-emerald-600" />, titleBn: "লাইভ সিরিয়াল", titleEn: "Live Serial", descBn: "বর্তমান সিরিয়াল দেখুন", descEn: "Check current serial", href: "#live-serial", color: "emerald" },
              { icon: <Users size={20} className="text-violet-600" />, titleBn: "আমাদের চিকিৎসক", titleEn: "Our Doctors", descBn: "অভিজ্ঞ বিশেষজ্ঞ দল", descEn: "Experienced specialists", href: "/doctors", color: "violet" },
            ].map((card) => (
              <Link key={card.titleEn} href={card.href}
                className="flex items-center gap-3 bg-white rounded-2xl px-4 py-4 shadow-xl border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all group">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  card.color === "blue" ? "bg-blue-50" : card.color === "emerald" ? "bg-emerald-50" : "bg-violet-50"
                }`}>
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{t(card.titleBn, card.titleEn)}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{t(card.descBn, card.descEn)}</p>
                </div>
                <ArrowRight size={15} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
