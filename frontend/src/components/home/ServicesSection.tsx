"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { SERVICES } from "@/lib/config/siteConfig";

export function ServicesSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  const icons = [s.icon_service_1, s.icon_service_2, s.icon_service_3, s.icon_service_4, s.icon_service_5, s.icon_service_6];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-primary-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            {t("আমাদের সেবা", "Our Services")}
          </span>
          <h2 className="font-bold text-gray-900 mt-2 mb-3" style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}>
            {t("সকল চক্ষু সেবা এক ছাদের নিচে", "All Eye Care Services Under One Roof")}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            {t("আমরা চোখের সকল ধরনের সমস্যার আধুনিক চিকিৎসা প্রদান করি।", "We provide modern treatment for all types of eye problems.")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {SERVICES.map((service, i) => (
            <div key={service.titleEn} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md border border-gray-100 hover:border-primary-200 transition-all group">
              <div className="text-3xl sm:text-4xl mb-3">{icons[i] || service.icon}</div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                {t(service.titleBn, service.titleEn)}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t(service.descBn, service.descEn)}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10">
          <Link href="/services" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm sm:text-base">
            {t("সকল সেবা দেখুন", "View All Services")}
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
