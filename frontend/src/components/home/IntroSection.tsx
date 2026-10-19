"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LangContext";

const FEATURES = [
  { bn: "অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক দল", en: "Experienced specialist doctors" },
  { bn: "আধুনিক ডায়াগনস্টিক যন্ত্রপাতি", en: "Modern diagnostic equipment" },
  { bn: "সাশ্রয়ী মূল্যে উন্নত সেবা", en: "Quality care at affordable cost" },
  { bn: "রোগীবান্ধব পরিবেশ", en: "Patient-friendly environment" },
];

export function IntroSection() {
  const { t } = useLang();

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Visual */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-100">
              <div className="bg-gradient-to-br from-blue-600 to-blue-900 aspect-[4/3] flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="text-8xl mb-5">🏥</div>
                  <p className="font-bold text-2xl">{t("শেরপুর আধুনিক চক্ষু হাসপাতাল", "Sherpur Adhunik Eye Hospital")}</p>
                  <p className="text-blue-200 mt-2">{t("ও ফ্যাকো সেন্টার", "& Phaco Center")}</p>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white border border-blue-100 rounded-2xl px-5 py-4 shadow-xl">
              <p className="text-2xl font-extrabold text-blue-700">{t("বিশ্বস্ত", "Trusted")}</p>
              <p className="text-gray-400 text-xs mt-0.5">{t("চক্ষু সেবা কেন্দ্র", "Eye Care Center")}</p>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
              {t("আমাদের সম্পর্কে", "About Us")}
            </span>
            <h2 className="font-extrabold text-gray-900 leading-tight mb-5"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
              {t("শেরপুরের বিশ্বস্ত", "Sherpur's Trusted")}
              <br />
              <span className="text-blue-600">{t("চক্ষু সেবা কেন্দ্র", "Eye Care Center")}</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-7" style={{ fontSize: "clamp(0.9rem, 1.5vw, 1rem)" }}>
              {t(
                "শেরপুর আধুনিক চক্ষু হাসপাতাল ও ফ্যাকো সেন্টার শেরপুর জেলার মানুষের চোখের সেবায় নিবেদিত একটি বিশেষায়িত চিকিৎসা প্রতিষ্ঠান। আমরা সর্বাধুনিক প্রযুক্তি ও অভিজ্ঞ চিকিৎসক দলের মাধ্যমে রোগীদের সর্বোত্তম চক্ষু সেবা প্রদান করে আসছি।",
                "Sherpur Adhunik Eye Hospital & Phaco Center is a specialized medical institution dedicated to eye care for the people of Sherpur district, providing the best care through modern technology and experienced doctors."
              )}
            </p>

            <ul className="space-y-3 mb-8">
              {FEATURES.map((f) => (
                <li key={f.en} className="flex items-center gap-3 text-gray-700 text-sm">
                  <CheckCircle2 size={18} className="text-blue-500 flex-shrink-0" />
                  {t(f.bn, f.en)}
                </li>
              ))}
            </ul>

            <Link href="/about"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-100 text-sm">
              {t("আরও জানুন", "Learn More")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
