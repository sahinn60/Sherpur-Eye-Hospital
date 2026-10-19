"use client";

import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function StatsSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  const stats = [
    { valueBn: s.stat1_value_bn, valueEn: s.stat1_value_en, labelBn: s.stat1_label_bn, labelEn: s.stat1_label_en, icon: "🏆" },
    { valueBn: s.stat2_value_bn, valueEn: s.stat2_value_en, labelBn: s.stat2_label_bn, labelEn: s.stat2_label_en, icon: "👨‍⚕️" },
    { valueBn: s.stat3_value_bn, valueEn: s.stat3_value_en, labelBn: s.stat3_label_bn, labelEn: s.stat3_label_en, icon: "🏥" },
    { valueBn: s.stat4_value_bn, valueEn: s.stat4_value_en, labelBn: s.stat4_label_bn, labelEn: s.stat4_label_en, icon: "😊" },
  ];

  return (
    <section className="py-14 sm:py-20 bg-blue-600 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500 opacity-30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-700 opacity-30 blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-5 sm:p-7 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="text-3xl sm:text-4xl mb-3">{stat.icon}</div>
              <p className="font-extrabold text-white leading-none mb-2"
                style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)" }}>
                {t(stat.valueBn, stat.valueEn)}
              </p>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">
                {t(stat.labelBn, stat.labelEn)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
