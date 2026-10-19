"use client";

import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { FACILITIES } from "@/lib/config/siteConfig";

export function FacilitiesSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();
  const icons = [s.icon_facility_1, s.icon_facility_2, s.icon_facility_3, s.icon_facility_4, s.icon_facility_5, s.icon_facility_6];

  return (
    <section className="py-14 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-blue-600 text-xs font-semibold uppercase tracking-widest">{t("সুযোগ-সুবিধা", "Facilities")}</span>
          <h2 className="font-extrabold text-gray-900 mt-2 mb-3" style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}>
            {t("আমাদের হাসপাতালের সুবিধাসমূহ", "Our Hospital Facilities")}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">{t("রোগীদের সর্বোচ্চ আরাম ও সেবা নিশ্চিত করতে আমরা সর্বদা প্রস্তুত।", "We are always ready to ensure maximum comfort and care for patients.")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {FACILITIES.map((facility, i) => (
            <div key={facility.titleEn} className="bg-white rounded-2xl p-5 sm:p-6 flex items-center gap-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">
                {icons[i] || facility.icon}
              </div>
              <p className="font-semibold text-gray-800 text-sm">{t(facility.titleBn, facility.titleEn)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
