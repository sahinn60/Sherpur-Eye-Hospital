"use client";

import { useLang } from "@/context/LangContext";
import { TESTIMONIALS } from "@/lib/config/siteConfig";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const { t } = useLang();

  return (
    <section className="py-16 sm:py-24 bg-[#F7FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            {t("রোগীদের মতামত", "Patient Reviews")}
          </span>
          <h2 className="font-extrabold text-gray-900 leading-tight mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
            {t("আমাদের রোগীরা", "What Our")}
            <br />
            <span className="text-blue-600">{t("কী বলেন", "Patients Say")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((item, i) => (
            <div key={i}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <Stars rating={item.rating} />
              <p className="text-gray-600 text-sm leading-relaxed mt-5 mb-6 flex-1 italic">
                "{t(item.textBn, item.textEn)}"
              </p>
              <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white font-bold text-sm">
                    {t(item.nameBn, item.nameEn).charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t(item.nameBn, item.nameEn)}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{t(item.locationBn, item.locationEn)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
