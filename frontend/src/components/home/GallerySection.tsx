"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";

const GALLERY_PLACEHOLDERS = [
  { label: { bn: "অপারেশন থিয়েটার", en: "Operation Theatre" }, emoji: "🏥" },
  { label: { bn: "ডায়াগনস্টিক রুম", en: "Diagnostic Room" }, emoji: "🔬" },
  { label: { bn: "ওয়েটিং এরিয়া", en: "Waiting Area" }, emoji: "🛋️" },
  { label: { bn: "কনসালটেশন রুম", en: "Consultation Room" }, emoji: "👨‍⚕️" },
  { label: { bn: "ফার্মেসি", en: "Pharmacy" }, emoji: "💊" },
  { label: { bn: "রিসেপশন", en: "Reception" }, emoji: "🏨" },
];

export function GallerySection() {
  const { t } = useLang();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 sm:mb-12">
          <div>
            <span className="text-primary-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              {t("গ্যালারি", "Gallery")}
            </span>
            <h2
              className="font-bold text-gray-900 mt-2"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
            >
              {t("আমাদের হাসপাতাল", "Our Hospital")}
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-primary-600 hover:text-primary-800 font-semibold text-sm flex-shrink-0 transition-colors"
          >
            {t("সব দেখুন →", "View All →")}
          </Link>
        </div>

        {/* 2 col on all sizes, aspect-video maintained */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {GALLERY_PLACEHOLDERS.map((item, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-primary-50 to-gray-50 rounded-xl sm:rounded-2xl aspect-video flex flex-col items-center justify-center border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all cursor-pointer group"
            >
              <span className="text-2xl sm:text-4xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                {item.emoji}
              </span>
              <p className="text-gray-500 text-[10px] sm:text-xs font-medium text-center px-1">
                {t(item.label.bn, item.label.en)}
              </p>
              <p className="text-gray-300 text-[9px] sm:text-xs mt-0.5 hidden sm:block">
                {t("ছবি শীঘ্রই আসছে", "Photo coming soon")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
