"use client";

import { useLang } from "@/context/LangContext";
import { PATIENT_CARE_POINTS } from "@/lib/config/aboutConfig";
import { SectionHeader } from "@/components/ui/shared";

export function PatientCareSection() {
  const { t } = useLang();

  return (
    <section className="py-16 md:py-20 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <SectionHeader
              tag={t("রোগীকেন্দ্রিক সেবা", "Patient-Centered Care")}
              title={t("রোগীই আমাদের প্রথম অগ্রাধিকার", "Patients Are Our First Priority")}
              subtitle={t(
                "আমরা বিশ্বাস করি প্রতিটি রোগী অনন্য এবং তাদের প্রয়োজন অনুযায়ী ব্যক্তিগতকৃত সেবা প্রদান করা আমাদের দায়িত্ব।",
                "We believe every patient is unique and it is our responsibility to provide personalized care according to their needs."
              )}
              align="left"
            />

            <div className="space-y-5">
              {PATIENT_CARE_POINTS.map((point) => (
                <div key={point.titleEn} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl flex-shrink-0">
                    {point.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {t(point.titleBn, point.titleEn)}
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {t(point.descBn, point.descEn)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: "👁️", bn: "চোখের যত্ন", en: "Eye Care" },
              { emoji: "🤝", bn: "বিশ্বস্ত সেবা", en: "Trusted Care" },
              { emoji: "💙", bn: "সহানুভূতি", en: "Compassion" },
              { emoji: "🏆", bn: "মানসম্পন্ন চিকিৎসা", en: "Quality Treatment" },
            ].map((item) => (
              <div
                key={item.en}
                className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100 aspect-square"
              >
                <span className="text-5xl mb-3">{item.emoji}</span>
                <p className="font-semibold text-gray-800 text-sm">
                  {t(item.bn, item.en)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
