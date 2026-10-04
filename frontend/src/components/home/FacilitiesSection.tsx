"use client";

import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { FACILITIES } from "@/lib/config/siteConfig";

export function FacilitiesSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  const icons = [s.icon_facility_1, s.icon_facility_2, s.icon_facility_3, s.icon_facility_4, s.icon_facility_5, s.icon_facility_6];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-primary-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">{t("সুযোগ-সুবিধা", "Facilities")}</span>
          <h2 className="font-bold text-gray-900 mt-2 mb-3" style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}>
            {t("আমাদের হাসপাতালের সুবিধাসমূহ", "Our Hospital Facilities")}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">{t("রোগীদের সর্বোচ্চ আরাম ও সেবা নিশ্চিত করতে আমরা সর্বদা প্রস্তুত।", "We are always ready to ensure maximum comfort and care for patients.")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {FACILITIES.map((facility, i) => (
            <div key={facility.titleEn} className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 border border-gray-100 hover:border-primary-200 transition-all">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{icons[i] || facility.icon}</div>
              <p className="font-semibold text-gray-800 text-xs sm:text-sm">{t(facility.titleBn, facility.titleEn)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
