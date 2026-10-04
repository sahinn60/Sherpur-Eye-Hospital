"use client";

import { useLang } from "@/context/LangContext";
import { TESTIMONIALS } from "@/lib/config/siteConfig";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const { t } = useLang();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-primary-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            {t("রোগীদের মতামত", "Patient Reviews")}
          </span>
          <h2
            className="font-bold text-gray-900 mt-2 mb-3"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
          >
            {t("আমাদের রোগীরা কী বলেন", "What Our Patients Say")}
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm">
            {t(
              "* এগুলো প্রতিনিধিত্বমূলক মতামত। বাস্তব রোগীদের মতামত শীঘ্রই যুক্ত করা হবে।",
              "* These are representative reviews. Real patient reviews will be added soon."
            )}
          </p>
        </div>

        {/* 1 col mobile, 3 col md */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all"
            >
              <StarRating rating={item.rating} />
              <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4 italic">
                "{t(item.textBn, item.textEn)}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-bold text-sm">
                    {t(item.nameBn, item.nameEn).charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {t(item.nameBn, item.nameEn)}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {t(item.locationBn, item.locationEn)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
