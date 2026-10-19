"use client";

import { useLang } from "@/context/LangContext";
import { TESTIMONIALS } from "@/lib/config/siteConfig";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const { t } = useLang();

  return (
    <section className="py-14 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-blue-600 text-xs font-semibold uppercase tracking-widest">
            {t("রোগীদের মতামত", "Patient Reviews")}
          </span>
          <h2 className="font-extrabold text-gray-900 mt-2 mb-3" style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}>
            {t("আমাদের রোগীরা কী বলেন", "What Our Patients Say")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
              <Stars rating={item.rating} />
              <p className="text-gray-600 text-sm leading-relaxed mt-4 mb-5 italic">
                "{t(item.textBn, item.textEn)}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">
                    {t(item.nameBn, item.nameEn).charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t(item.nameBn, item.nameEn)}</p>
                  <p className="text-gray-400 text-xs">{t(item.locationBn, item.locationEn)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          {t("* এগুলো প্রতিনিধিত্বমূলক মতামত।", "* These are representative reviews.")}
        </p>
      </div>
    </section>
  );
}
