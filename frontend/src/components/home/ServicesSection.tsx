"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { SERVICES } from "@/lib/config/siteConfig";

export function ServicesSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  const icons = [s.icon_service_1, s.icon_service_2, s.icon_service_3, s.icon_service_4, s.icon_service_5, s.icon_service_6];

  return (
    <section className="py-14 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-blue-600 text-xs font-semibold uppercase tracking-widest">
            {t("আমাদের সেবা", "Our Services")}
          </span>
          <h2 className="font-extrabold text-gray-900 mt-2 mb-3" style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}>
            {t("সকল চক্ষু সেবা এক ছাদের নিচে", "All Eye Care Under One Roof")}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            {t("আমরা চোখের সকল ধরনের সমস্যার আধুনিক চিকিৎসা প্রদান করি।", "We provide modern treatment for all types of eye problems.")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {SERVICES.map((service, i) => (
            <div key={service.titleEn} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-100 transition-colors">
                {icons[i] || service.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                {t(service.titleBn, service.titleEn)}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t(service.descBn, service.descEn)}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/services" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors text-sm">
            {t("সকল সেবা দেখুন", "View All Services")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
