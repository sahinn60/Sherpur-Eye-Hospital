"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { ARTICLES } from "@/lib/config/siteConfig";

export function ArticlesSection() {
  const { t } = useLang();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 sm:mb-12">
          <div>
            <span className="text-primary-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              {t("স্বাস্থ্য তথ্য", "Health Info")}
            </span>
            <h2
              className="font-bold text-gray-900 mt-2"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
            >
              {t("সর্বশেষ স্বাস্থ্য নিবন্ধ", "Latest Health Articles")}
            </h2>
          </div>
          <Link
            href="/news"
            className="text-primary-600 hover:text-primary-800 font-semibold text-sm flex-shrink-0 transition-colors"
          >
            {t("সব দেখুন →", "View All →")}
          </Link>
        </div>

        {/* 1 col mobile, 3 col md */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/news/${article.slug}`}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group"
            >
              <div className="bg-gradient-to-br from-primary-100 to-primary-50 h-36 sm:h-44 flex items-center justify-center">
                <span className="text-4xl sm:text-5xl">📰</span>
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <span className="bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {t(article.category.bn, article.category.en)}
                  </span>
                  <span className="text-gray-400 text-xs">{article.date}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors leading-snug text-sm sm:text-base">
                  {t(article.titleBn, article.titleEn)}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                  {t(article.excerptBn, article.excerptEn)}
                </p>
                <p className="text-primary-600 text-xs font-semibold mt-3">
                  {t("পড়ুন →", "Read More →")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
