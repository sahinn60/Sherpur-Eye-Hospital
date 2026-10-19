"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LangContext";

const FEATURES = [
  { bn: "অভিজ্ঞ চিকিৎসক দল", en: "Experienced Medical Team" },
  { bn: "আধুনিক ডায়াগনস্টিক যন্ত্রপাতি", en: "Modern Diagnostic Equipment" },
  { bn: "সাশ্রয়ী মূল্যে সেবা", en: "Affordable Services" },
  { bn: "রোগীবান্ধব পরিবেশ", en: "Patient-Friendly Environment" },
];

export function IntroSection() {
  const { t } = useLang();

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Visual */}
          <div className="relative order-2 lg:order-1">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 flex items-center justify-center min-h-72 shadow-xl shadow-blue-200">
              <div className="text-center text-white">
                <div className="text-7xl mb-4">🏥</div>
                <p className="font-bold text-xl">{t("শেরপুর আধুনিক চক্ষু হাসপাতাল", "Sherpur Adhunik Eye Hospital")}</p>
                <p className="text-blue-200 text-sm mt-1">{t("ও ফ্যাকো সেন্টার", "& Phaco Center")}</p>
              </div>
            </div>
            {/* Accent */}
            <div className="absolute -bottom-5 -right-5 bg-white border border-blue-100 rounded-2xl p-4 shadow-lg hidden md:block">
              <p className="text-2xl font-extrabold text-blue-700">{t("বিশ্বস্ত", "Trusted")}</p>
              <p className="text-gray-400 text-xs">{t("চক্ষু সেবা কেন্দ্র", "Eye Care Center")}</p>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="text-blue-600 text-xs font-semibold uppercase tracking-widest">
              {t("আমাদের সম্পর্কে", "About Us")}
            </span>
            <h2 className="font-extrabold text-gray-900 mt-2 mb-4 leading-tight" style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}>
              {t("শেরপুরের বিশ্বস্ত চক্ষু সেবা কেন্দ্র", "Sherpur's Trusted Eye Care Center")}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-4">
              {t(
                "শেরপুর আধুনিক চক্ষু হাসপাতাল ও ফ্যাকো সেন্টার শেরপুর জেলার মানুষের চোখের সেবায় নিবেদিত একটি বিশেষায়িত চিকিৎসা প্রতিষ্ঠান। আমরা সর্বাধুনিক প্রযুক্তি ও অভিজ্ঞ চিকিৎসক দলের মাধ্যমে রোগীদের সর্বোত্তম চক্ষু সেবা প্রদান করে আসছি।",
                "Sherpur Adhunik Eye Hospital & Phaco Center is a specialized medical institution dedicated to eye care for the people of Sherpur district."
              )}
            </p>

            <ul className="space-y-2.5 mb-7">
              {FEATURES.map((f) => (
                <li key={f.en} className="flex items-center gap-2.5 text-gray-700 text-sm">
                  <CheckCircle2 size={17} className="text-blue-500 flex-shrink-0" />
                  {t(f.bn, f.en)}
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              {t("আরও জানুন", "Learn More")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
