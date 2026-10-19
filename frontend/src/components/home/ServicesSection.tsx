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
    <section className="py-16 sm:py-24 bg-[#F7FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            {t("আমাদের সেবা", "Our Services")}
          </span>
          <h2 className="font-extrabold text-gray-900 leading-tight mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
            {t("সকল চক্ষু সেবা", "All Eye Care Services")}
            <br />
            <span className="text-blue-600">{t("এক ছাদের নিচে", "Under One Roof")}</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            {t("আমরা চোখের সকল ধরনের সমস্যার আধুনিক চিকিৎসা প্রদান করি।", "We provide modern treatment for all types of eye problems.")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {SERVICES.map((service, i) => (
            <div key={service.titleEn}
              className="group bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center text-2xl mb-5 transition-colors duration-300">
                {icons[i] || service.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                {t(service.titleBn, service.titleEn)}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t(service.descBn, service.descEn)}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 text-sm">
            {t("সকল সেবা দেখুন", "View All Services")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
