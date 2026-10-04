"use client";

import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { VALUES } from "@/lib/config/aboutConfig";
import { SectionHeader } from "@/components/ui/shared";

export function ValuesSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  const icons = [s.icon_value_1, s.icon_value_2, s.icon_value_3, s.icon_value_4, s.icon_value_5, s.icon_value_6];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          tag={t("আমাদের মূল্যবোধ", "Our Values")}
          title={t("যে নীতিতে আমরা কাজ করি", "The Principles We Work By")}
          subtitle={t("আমাদের প্রতিটি কাজ এই মূল্যবোধ দ্বারা পরিচালিত।", "Every action we take is guided by these values.")}
          align="center"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUES.map((value, i) => (
            <div key={value.titleEn} className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center text-2xl flex-shrink-0 transition-colors">
                {icons[i] || value.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1.5">{t(value.titleBn, value.titleEn)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t(value.descBn, value.descEn)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
