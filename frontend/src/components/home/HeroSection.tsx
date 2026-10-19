"use client";

import Link from "next/link";
import { CalendarCheck, Phone, ArrowRight, Eye, Shield, Clock, Star, List } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function HeroSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();
  const heroImg: string = (s as any).hero_image || "";
  const phone: string = (s as any).contact_phone || "01781836581";
  const bgImage: string   = s.hero_bg_image    || "";
  const bgEnabled: boolean = s.hero_bg_enabled === "true";
  const bgOpacity: number  = Math.min(100, Math.max(0, Number(s.hero_bg_opacity  ?? 15)))  / 100;
  const bgOverlay: number  = Math.min(100, Math.max(0, Number(s.hero_bg_overlay  ?? 50)))  / 100;
  const bgPosition: string = s.hero_bg_position || "center";

  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)" }}>

      {/* Hero background image layer — decorative, pointer-events-none */}
      {bgEnabled && bgImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none select-none"
            style={{ objectFit: "cover", objectPosition: bgPosition, opacity: bgOpacity }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: `rgba(15,23,42,${bgOverlay})` }}
          />
        </>
      )}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
        {/* Grid dots */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── LEFT: Text content ── */}
          <div className="order-2 lg:order-1">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-blue-200 text-xs font-semibold tracking-wide">
                {t("শেরপুরের আধুনিক চক্ষু সেবা কেন্দ্র", "Modern Eye Care Center — Sherpur")}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-extrabold text-white leading-tight mb-5 tracking-tight"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", lineHeight: 1.15 }}>
              {t("আপনার চোখের", "Expert Care")}
              <br />
              <span style={{ background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {t("বিশেষজ্ঞ সেবা", "For Your Eyes")}
              </span>
              <br />
              <span className="text-white">{t("আমাদের কাছে", "We're Here")}</span>
            </h1>

            {/* Description */}
            <p className="text-blue-100/80 leading-relaxed mb-8"
              style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)", maxWidth: "480px" }}>
              {t(
                "বিশ্বাস, যত্ন ও আধুনিক প্রযুক্তির সমন্বয়ে শেরপুর আধুনিক চক্ষু হাসপাতাল আপনার চোখের সুস্থতায় সর্বদা পাশে আছে।",
                "Combining trust, care and modern technology — Sherpur Eye Hospital stands by your eye health every step of the way."
              )}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/appointment"
                className="inline-flex items-center gap-2.5 font-bold px-7 py-3.5 rounded-2xl text-sm transition-all shadow-xl"
                style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white", boxShadow: "0 8px 32px rgba(37,99,235,0.4)" }}>
                <CalendarCheck size={17} />
                {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
              </Link>
              <a href={`tel:${phone}`}
                className="inline-flex items-center gap-2.5 font-bold px-7 py-3.5 rounded-2xl text-sm transition-all border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                <Phone size={17} />
                {t("কল করুন", "Call Now")}
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-5">
              {[
                { icon: Shield, bn: "বিশ্বস্ত সেবা", en: "Trusted Care" },
                { icon: Clock, bn: "দ্রুত সেবা", en: "Fast Service" },
                { icon: Star, bn: "অভিজ্ঞ দল", en: "Expert Team" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.en} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/20 flex items-center justify-center">
                      <Icon size={14} className="text-blue-300" />
                    </div>
                    <span className="text-blue-200 text-xs font-medium">{t(item.bn, item.en)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: Visual ── */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-none">

              {/* Main image card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                style={{ aspectRatio: "4/3" }}>
                {heroImg ? (
                  <img src={heroImg}
                    alt={t("শেরপুর আধুনিক চক্ষু হাসপাতাল", "Sherpur Eye Hospital")}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4"
                    style={{ background: "linear-gradient(135deg, #1e3a5f, #1e40af)" }}>
                    <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center">
                      <Eye size={44} className="text-blue-300" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold text-lg">{t("শেরপুর আধুনিক চক্ষু হাসপাতাল", "Sherpur Eye Hospital")}</p>
                      <p className="text-blue-300 text-sm mt-1">{t("ও ফ্যাকো সেন্টার", "& Phaco Center")}</p>
                    </div>
                    <p className="text-blue-400/60 text-xs text-center px-8">
                      {t("CMS থেকে হিরো ছবি আপলোড করুন", "Upload hero image from CMS")}
                    </p>
                  </div>
                )}

                {/* Overlay gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(15,23,42,0.6), transparent)" }} />
              </div>

              {/* Floating card — top left */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white rounded-2xl px-4 py-3 shadow-2xl border border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Eye size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-extrabold text-sm leading-none">{t("আধুনিক", "Modern")}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{t("চক্ষু সেবা", "Eye Care")}</p>
                  </div>
                </div>
              </div>

              {/* Floating card — bottom right (links to live serial section) */}
              <Link
                href="/live-serial"
                className="absolute -bottom-4 -right-4 sm:-right-6 bg-white rounded-2xl px-4 py-3 shadow-2xl border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <List size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-extrabold text-sm leading-none">{t("সরাসরি", "Live")}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{t("লাইভ সিরিয়াল", "Serial")}</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
