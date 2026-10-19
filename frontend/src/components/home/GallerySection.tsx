"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/context/LangContext";

const PLACEHOLDERS = [
  { bn: "অপারেশন থিয়েটার", en: "Operation Theatre", emoji: "🏥", bg: "from-blue-100 to-blue-50" },
  { bn: "ডায়াগনস্টিক রুম", en: "Diagnostic Room", emoji: "🔬", bg: "from-sky-100 to-sky-50" },
  { bn: "ওয়েটিং এরিয়া", en: "Waiting Area", emoji: "🛋️", bg: "from-indigo-100 to-indigo-50" },
  { bn: "কনসালটেশন রুম", en: "Consultation Room", emoji: "👨‍⚕️", bg: "from-blue-100 to-blue-50" },
  { bn: "ফার্মেসি", en: "Pharmacy", emoji: "💊", bg: "from-sky-100 to-sky-50" },
  { bn: "রিসেপশন", en: "Reception", emoji: "🏨", bg: "from-indigo-100 to-indigo-50" },
];

export function GallerySection() {
  const { t } = useLang();

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
          <div>
            <span className="text-blue-600 text-xs font-semibold uppercase tracking-widest">
              {t("গ্যালারি", "Gallery")}
            </span>
            <h2 className="font-extrabold text-gray-900 mt-2" style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}>
              {t("আমাদের হাসপাতাল", "Our Hospital")}
            </h2>
          </div>
          <Link href="/gallery" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors flex-shrink-0">
            {t("সব দেখুন", "View All")} <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {PLACEHOLDERS.map((item, i) => (
            <div key={i} className={`bg-gradient-to-br ${item.bg} rounded-2xl aspect-video flex flex-col items-center justify-center border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group`}>
              <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">{item.emoji}</span>
              <p className="text-gray-600 text-xs sm:text-sm font-medium text-center px-2">{t(item.bn, item.en)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
