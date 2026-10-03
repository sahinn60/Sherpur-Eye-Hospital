"use client";

import { useLang } from "@/context/LangContext";
import { FACILITIES } from "@/lib/config/siteConfig";

export function FacilitiesSection() {
  const { t } = useLang();

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">
            {t("সুযোগ-সুবিধা", "Facilities")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {t("আমাদের হাসপাতালের সুবিধাসমূহ", "Our Hospital Facilities")}
          </h2>
          <p className="text-gray-500">
            {t(
              "রোগীদের সর্বোচ্চ আরাম ও সেবা নিশ্চিত করতে আমরা সর্বদা প্রস্তুত।",
              "We are always ready to ensure maximum comfort and care for patients."
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {FACILITIES.map((facility) => (
            <div
              key={facility.titleEn}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 border border-gray-100 hover:border-primary-200 transition-all"
            >
              <div className="text-4xl mb-3">{facility.icon}</div>
              <p className="font-semibold text-gray-800 text-sm">
                {t(facility.titleBn, facility.titleEn)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
