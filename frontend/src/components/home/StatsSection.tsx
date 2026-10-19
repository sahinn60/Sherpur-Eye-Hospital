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
    <section className="py-10 sm:py-14" style={{ backgroundColor: "#2563EB" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center text-center rounded-2xl p-5 sm:p-6"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #DFE7F1",
                borderRadius: "14px",
                boxShadow: "0 1px 4px 0 rgba(21,54,90,0.07)",
              }}
            >
              <p
                className="font-extrabold leading-none mb-1.5"
                style={{ fontSize: "clamp(1.75rem, 5vw, 2.75rem)", color: "#15365A" }}
              >
                {t(stat.valueBn, stat.valueEn)}
              </p>
              <p className="text-xs sm:text-sm font-medium" style={{ color: "#526174" }}>
                {t(stat.labelBn, stat.labelEn)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
