"use client";

import { useLang } from "@/context/LangContext";
import { ABOUT_INTRO } from "@/lib/config/aboutConfig";
import { HOSPITAL_INFO } from "@/lib/config/siteConfig";

export function AboutIntro() {
  const { t } = useLang();

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual */}
          <div className="relative order-2 lg:order-1">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-10 min-h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-5">🏥</div>
                <p className="text-primary-800 font-bold text-lg">
                  {t(HOSPITAL_INFO.nameBn, HOSPITAL_INFO.nameEn)}
                </p>
                <p className="text-primary-500 text-sm mt-1">
                  {t(HOSPITAL_INFO.taglineBn, HOSPITAL_INFO.taglineEn)}
                </p>
              </div>
            </div>

            {/* Info badges */}
            <div className="absolute -bottom-4 left-4 right-4 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl shadow-md p-3 text-center border border-gray-100">
                <p className="text-xs text-gray-400">{t("প্রতিষ্ঠাকাল", "Established")}</p>
                <p className="font-bold text-primary-700 text-sm mt-0.5">
                  {t(ABOUT_INTRO.foundedBn, ABOUT_INTRO.foundedEn)}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-3 text-center border border-gray-100">
                <p className="text-xs text-gray-400">{t("অবস্থান", "Location")}</p>
                <p className="font-bold text-primary-700 text-sm mt-0.5">
                  {t(ABOUT_INTRO.locationBn, ABOUT_INTRO.locationEn)}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 lg:pt-0 pt-8">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">
              {t(ABOUT_INTRO.tagBn, ABOUT_INTRO.tagEn)}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6 leading-tight">
              {t(ABOUT_INTRO.titleBn, ABOUT_INTRO.titleEn)}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>{t(ABOUT_INTRO.para1Bn, ABOUT_INTRO.para1En)}</p>
              <p>{t(ABOUT_INTRO.para2Bn, ABOUT_INTRO.para2En)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
