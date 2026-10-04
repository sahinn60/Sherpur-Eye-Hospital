"use client";

import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function MapSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  const details = [
    { icon: "📍", labelBn: "ঠিকানা",    labelEn: "Address",   valueBn: s.address_bn,  valueEn: s.address_en },
    { icon: "📞", labelBn: "ফোন",       labelEn: "Phone",     valueBn: s.phone,       valueEn: s.phone },
    { icon: "🚨", labelBn: "জরুরি",      labelEn: "Emergency", valueBn: s.emergency,   valueEn: s.emergency },
    { icon: "✉️", labelBn: "ইমেইল",      labelEn: "Email",     valueBn: s.email,       valueEn: s.email },
    { icon: "🕐", labelBn: "সময়সূচি",   labelEn: "Hours",     valueBn: `${s.hours_bn}\n${s.friday_bn}`, valueEn: `${s.hours_en}\n${s.friday_en}` },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-primary-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            {t("আমাদের অবস্থান", "Our Location")}
          </span>
          <h2
            className="font-bold text-gray-900 mt-2"
            style={{ fontSize: "clamp(1.4rem, 4vw, 1.875rem)" }}
          >
            {t("আমাদের খুঁজে পান", "Find Us")}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">{t(s.address_bn, s.address_en)}</p>
        </div>

        {/* Map on top on mobile, side-by-side on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-md border border-gray-200 h-56 sm:h-72 lg:h-80">
            <iframe
              src={`https://maps.google.com/maps?q=Sherpur+Adhunik+Eye+Hospital+Sherpur+Bangladesh&output=embed&hl=bn`}
              width="100%" height="100%"
              style={{ border: 0 }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t("হাসপাতালের অবস্থান", "Hospital Location")}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-5">
            {details.map((item) => (
              <div key={item.labelEn} className="flex gap-3">
                <span className="text-lg sm:text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                    {t(item.labelBn, item.labelEn)}
                  </p>
                  <p className="text-gray-700 text-xs sm:text-sm whitespace-pre-line break-words">
                    {t(item.valueBn, item.valueEn)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
