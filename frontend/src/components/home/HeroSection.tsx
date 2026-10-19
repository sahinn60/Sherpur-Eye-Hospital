"use client";

import Link from "next/link";
import { CalendarCheck, Eye, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function HeroSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  return (
    <section className="relative bg-gradient-to-br from-sky-50 via-blue-50 to-white overflow-hidden">
      {/* Subtle background circles */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-100/40 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-sky-100/30 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — Text */}
          <div>
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <Eye size={13} />
              {t("শেরপুরের আধুনিক চক্ষু সেবা কেন্দ্র", "Modern Eye Care Center in Sherpur")}
            </span>

            <h1 className="font-extrabold text-gray-900 leading-tight mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              {t("চোখের যত্ন", "Eye Care")}{" "}
              <span className="text-blue-600">{t("এখন আরও সহজ।", "Made Easier.")}</span>
            </h1>

            <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              {t(
                "বিশ্বাস, যত্ন এবং আধুনিক চিকিৎসা প্রযুক্তির সমন্বয়ে আপনার চোখের সুস্থতার জন্য আমরা আছি পাশে।",
                "We combine trust, care, and modern medical technology to stand by your eye health."
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/appointment"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-md shadow-blue-200 text-sm sm:text-base"
              >
                <CalendarCheck size={18} />
                {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
              </Link>
              <Link
                href="/my-prescription"
                className="inline-flex items-center justify-center gap-2 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-bold px-7 py-3.5 rounded-xl transition-colors text-sm sm:text-base"
              >
                {t("প্রেসক্রিপশন দেখুন", "View Prescription")}
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-100">
              {[
                { val: s.stat1_value_bn || "১০+", valEn: s.stat1_value_en || "10+", lbn: s.stat1_label_bn || "বছরের অভিজ্ঞতা", len: s.stat1_label_en || "Years Experience" },
                { val: s.stat2_value_bn || "৫+",  valEn: s.stat2_value_en || "5+",  lbn: s.stat2_label_bn || "বিশেষজ্ঞ চিকিৎসক", len: s.stat2_label_en || "Specialist Doctors" },
                { val: s.stat4_value_bn || "১০,০০০+", valEn: s.stat4_value_en || "10,000+", lbn: s.stat4_label_bn || "সন্তুষ্ট রোগী", len: s.stat4_label_en || "Happy Patients" },
              ].map((st) => (
                <div key={st.len}>
                  <p className="text-xl font-extrabold text-blue-700">{t(st.val, st.valEn)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t(st.lbn, st.len)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Visual card */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Main card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-blue-100 overflow-hidden border border-blue-50">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 h-56 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-8xl mb-3">👁️</div>
                    <p className="font-bold text-lg">{t("চক্ষু পরীক্ষা", "Eye Examination")}</p>
                    <p className="text-blue-200 text-sm">{t("আধুনিক প্রযুক্তিতে", "With Modern Technology")}</p>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-3 gap-3">
                  {[
                    { icon: "🔬", bn: "ফ্যাকো সার্জারি", en: "Phaco Surgery" },
                    { icon: "👓", bn: "চশমার পাওয়ার", en: "Spectacle Power" },
                    { icon: "💧", bn: "গ্লুকোমা", en: "Glaucoma" },
                  ].map((item) => (
                    <div key={item.en} className="text-center p-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <p className="text-xs text-gray-600 font-medium leading-tight">{t(item.bn, item.en)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-2xl px-4 py-2 shadow-lg text-xs font-bold">
                ✓ {t("জরুরি সেবা ২৪/৭", "24/7 Emergency")}
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white rounded-2xl px-4 py-2 shadow-lg text-xs font-bold">
                📍 {t("শেরপুর সদর", "Sherpur Sadar")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 32L1440 32L1440 10C1200 32 960 0 720 10C480 20 240 0 0 10L0 32Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
