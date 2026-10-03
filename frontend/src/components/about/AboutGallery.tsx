"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { ABOUT_GALLERY } from "@/lib/config/aboutConfig";
import { SectionHeader } from "@/components/ui/shared";

export function AboutGallery() {
  const { t } = useLang();

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">
              {t("গ্যালারি", "Gallery")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              {t("আমাদের হাসপাতাল", "Our Hospital")}
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              {t(
                "ছবিগুলো শীঘ্রই যুক্ত করা হবে।",
                "Photos will be added soon."
              )}
            </p>
          </div>
          <Link
            href="/gallery"
            className="text-primary-600 hover:text-primary-800 font-semibold text-sm flex-shrink-0 transition-colors"
          >
            {t("সব দেখুন →", "View All →")}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ABOUT_GALLERY.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl aspect-video flex flex-col items-center justify-center border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all group cursor-pointer"
            >
              <span className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                {item.emoji}
              </span>
              <p className="text-gray-600 text-sm font-medium">
                {t(item.labelBn, item.labelEn)}
              </p>
              <p className="text-gray-300 text-xs mt-1">
                {t("ছবি শীঘ্রই আসছে", "Photo coming soon")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
