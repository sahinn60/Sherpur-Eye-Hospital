"use client";

import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function AboutIntro() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Image side ── */}
          <div className="relative order-2 lg:order-1">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl overflow-hidden h-80 flex items-center justify-center">
              {s.about_main_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.about_main_image}
                  alt={t("হাসপাতালের ছবি", "Hospital Image")}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-10">
                  <div className="text-8xl mb-5">🏥</div>
                  <p className="text-primary-800 font-bold text-lg">
                    {t(s.hospital_name_bn, s.hospital_name_en)}
                  </p>
                  <p className="text-primary-500 text-sm mt-1">
                    {t(s.tagline_bn, s.tagline_en)}
                  </p>
                </div>
              )}
            </div>

            {/* Info badges */}
            <div className="absolute -bottom-4 left-4 right-4 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl shadow-md p-3 text-center border border-gray-100">
                <p className="text-xs text-gray-400">{t("প্রতিষ্ঠাকাল", "Established")}</p>
                <p className="font-bold text-primary-700 text-sm mt-0.5">
                  {t(s.about_founded_bn, s.about_founded_en) || t("—", "—")}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-3 text-center border border-gray-100">
                <p className="text-xs text-gray-400">{t("অবস্থান", "Location")}</p>
                <p className="font-bold text-primary-700 text-sm mt-0.5">
                  {t(s.about_location_bn, s.about_location_en) || t("—", "—")}
                </p>
              </div>
            </div>
          </div>

          {/* ── Text side ── */}
          <div className="order-1 lg:order-2 lg:pt-0 pt-8">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">
              {t(s.about_tag_bn, s.about_tag_en)}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6 leading-tight">
              {t(s.about_intro_title_bn, s.about_intro_title_en)}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>{t(s.about_para1_bn, s.about_para1_en)}</p>
              <p>{t(s.about_para2_bn, s.about_para2_en)}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
