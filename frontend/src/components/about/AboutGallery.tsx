"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { ABOUT_GALLERY } from "@/lib/config/aboutConfig";
import { SectionHeader } from "@/components/ui/shared";

const GALLERY_KEYS = [
  "about_gallery_1",
  "about_gallery_2",
  "about_gallery_3",
  "about_gallery_4",
  "about_gallery_5",
  "about_gallery_6",
] as const;

export function AboutGallery() {
  const { t } = useLang();
  const { s } = useSiteSettings();

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
          </div>
          <Link
            href="/gallery"
            className="text-primary-600 hover:text-primary-800 font-semibold text-sm flex-shrink-0 transition-colors"
          >
            {t("সব দেখুন →", "View All →")}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ABOUT_GALLERY.map((item, i) => {
            const imgUrl = s[GALLERY_KEYS[i]];
            return (
              <div
                key={i}
                className="rounded-2xl aspect-video overflow-hidden border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group cursor-pointer bg-white"
              >
                {imgUrl ? (
                  <div className="relative w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={t(item.labelBn, item.labelEn)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-white text-sm font-medium">{t(item.labelBn, item.labelEn)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <span className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                      {item.emoji}
                    </span>
                    <p className="text-gray-600 text-sm font-medium">{t(item.labelBn, item.labelEn)}</p>
                    <p className="text-gray-300 text-xs mt-1">{t("ছবি শীঘ্রই আসছে", "Photo coming soon")}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
