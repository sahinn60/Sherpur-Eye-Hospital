"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { SERVICES } from "@/lib/config/siteConfig";

export function ServicesSection() {
  const { t } = useLang();

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">
            {t("আমাদের সেবা", "Our Services")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {t("সকল চক্ষু সেবা এক ছাদের নিচে", "All Eye Care Services Under One Roof")}
          </h2>
          <p className="text-gray-500">
            {t(
              "আমরা চোখের সকল ধরনের সমস্যার আধুনিক চিকিৎসা প্রদান করি।",
              "We provide modern treatment for all types of eye problems."
            )}
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.titleEn}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 hover:border-primary-200 transition-all group"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                {t(service.titleBn, service.titleEn)}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t(service.descBn, service.descEn)}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {t("সকল সেবা দেখুন", "View All Services")}
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
