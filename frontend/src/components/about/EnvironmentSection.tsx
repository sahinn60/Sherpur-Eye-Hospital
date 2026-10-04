"use client";

import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { ENVIRONMENT_FEATURES } from "@/lib/config/aboutConfig";
import { SectionHeader } from "@/components/ui/shared";

const ENV_ITEMS = [
  { key: "about_env_image_1" as const, emoji: "🏥", bn: "পরিষ্কার পরিবেশ",    en: "Clean Environment" },
  { key: "about_env_image_2" as const, emoji: "❄️", bn: "শীতাতপ নিয়ন্ত্রিত", en: "Air Conditioned" },
  { key: "about_env_image_3" as const, emoji: "♿", bn: "সকলের জন্য সুবিধা",  en: "Accessible for All" },
  { key: "about_env_image_4" as const, emoji: "🔒", bn: "নিরাপদ প্রাঙ্গণ",    en: "Secure Premises" },
];

export function EnvironmentSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual grid */}
          <div className="grid grid-cols-2 gap-4">
            {ENV_ITEMS.map((item) => (
              <div
                key={item.en}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 aspect-square flex flex-col items-center justify-center text-center"
              >
                {s[item.key] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s[item.key]}
                    alt={t(item.bn, item.en)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6">
                    <span className="text-5xl mb-3 block">{item.emoji}</span>
                    <p className="font-semibold text-gray-700 text-sm">{t(item.bn, item.en)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          <div>
            <SectionHeader
              tag={t("হাসপাতালের পরিবেশ", "Hospital Environment")}
              title={t("আরামদায়ক ও নিরাপদ পরিবেশ", "Comfortable & Safe Environment")}
              subtitle={t(
                "আমরা নিশ্চিত করি যে প্রতিটি রোগী একটি পরিষ্কার, আরামদায়ক ও নিরাপদ পরিবেশে চিকিৎসা সেবা পান।",
                "We ensure every patient receives care in a clean, comfortable, and safe environment."
              )}
              align="left"
            />
            <ul className="space-y-3">
              {ENVIRONMENT_FEATURES.map((feature) => (
                <li key={feature.en} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm">{t(feature.bn, feature.en)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
