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
    <section className="py-12 sm:py-16 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <div key={stat.labelEn} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 sm:p-6 text-center border border-white/20">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="font-extrabold text-white mb-1" style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}>
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
