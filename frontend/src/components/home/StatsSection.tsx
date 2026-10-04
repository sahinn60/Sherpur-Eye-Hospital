"use client";

import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function StatsSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  const stats = [
    { valueBn: s.stat1_value_bn, valueEn: s.stat1_value_en, labelBn: s.stat1_label_bn, labelEn: s.stat1_label_en },
    { valueBn: s.stat2_value_bn, valueEn: s.stat2_value_en, labelBn: s.stat2_label_bn, labelEn: s.stat2_label_en },
    { valueBn: s.stat3_value_bn, valueEn: s.stat3_value_en, labelBn: s.stat3_label_bn, labelEn: s.stat3_label_en },
    { valueBn: s.stat4_value_bn, valueEn: s.stat4_value_en, labelBn: s.stat4_label_bn, labelEn: s.stat4_label_en },
  ];

  return (
    <section className="py-10 sm:py-14 bg-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.labelEn} className="text-center">
              <p
                className="font-bold text-white mb-1"
                style={{ fontSize: "clamp(1.75rem, 6vw, 3rem)" }}
              >
                {t(stat.valueBn, stat.valueEn)}
              </p>
              <p className="text-primary-200 text-xs sm:text-sm font-medium">
                {t(stat.labelBn, stat.labelEn)}
              </p>
            </div>
          ))}
        </div>
        <p className="text-center text-primary-300 text-xs mt-6 sm:mt-8">
          {t("* সংখ্যাগুলো আনুমানিক এবং নিয়মিত আপডেট করা হয়", "* Numbers are approximate and regularly updated")}
        </p>
      </div>
    </section>
  );
}
