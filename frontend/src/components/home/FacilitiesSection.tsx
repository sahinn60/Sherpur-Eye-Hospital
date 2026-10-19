"use client";

import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { FACILITIES } from "@/lib/config/siteConfig";

export function FacilitiesSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();
  const icons = [s.icon_facility_1, s.icon_facility_2, s.icon_facility_3, s.icon_facility_4, s.icon_facility_5, s.icon_facility_6];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            {t("সুযোগ-সুবিধা", "Facilities")}
          </span>
          <h2 className="font-extrabold text-gray-900 leading-tight mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
            {t("আমাদের হাসপাতালের", "Our Hospital")}
            <br />
            <span className="text-blue-600">{t("সুবিধাসমূহ", "Facilities")}</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            {t("রোগীদের সর্বোচ্চ আরাম ও সেবা নিশ্চিত করতে আমরা সর্বদা প্রস্তুত।", "We are always ready to ensure maximum comfort and care for patients.")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {FACILITIES.map((facility, i) => (
            <div key={facility.titleEn}
              className="group bg-[#F7FAFF] hover:bg-blue-600 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex items-center gap-4 border border-gray-100 hover:border-blue-600 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm transition-colors">
                {icons[i] || facility.icon}
              </div>
              <p className="font-semibold text-gray-800 group-hover:text-white text-sm transition-colors">
                {t(facility.titleBn, facility.titleEn)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
