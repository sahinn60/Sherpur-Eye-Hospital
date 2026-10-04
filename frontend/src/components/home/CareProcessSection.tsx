"use client";

import { useLang } from "@/context/LangContext";
import { CARE_STEPS } from "@/lib/config/siteConfig";

export function CareProcessSection() {
  const { t } = useLang();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-primary-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            {t("চিকিৎসা প্রক্রিয়া", "Care Process")}
          </span>
          <h2
            className="font-bold text-gray-900 mt-2 mb-3"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
          >
            {t("কীভাবে সেবা নেবেন", "How to Get Care")}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            {t(
              "মাত্র কয়েকটি সহজ ধাপে আমাদের বিশেষজ্ঞ সেবা গ্রহণ করুন।",
              "Get our specialist care in just a few simple steps."
            )}
          </p>
        </div>

        {/* 1 col mobile, 2 col sm, 4 col lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-primary-200 z-0" />

          {CARE_STEPS.map((step, i) => (
            <div key={step.step} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-600 text-white flex flex-col items-center justify-center mb-3 sm:mb-4 shadow-lg">
                <span className="text-[10px] sm:text-xs font-medium opacity-80">{t("ধাপ", "Step")}</span>
                <span className="text-lg sm:text-xl font-bold leading-none">{i + 1}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                {t(step.titleBn, step.titleEn)}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                {t(step.descBn, step.descEn)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
