"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { ARTICLES } from "@/lib/config/siteConfig";

export function ArticlesSection() {
  const { t } = useLang();

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
          <div>
            <span className="text-blue-600 text-xs font-semibold uppercase tracking-widest">
              {t("স্বাস্থ্য তথ্য", "Health Info")}
            </span>
            <h2 className="font-extrabold text-gray-900 mt-2" style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}>
              {t("সর্বশেষ স্বাস্থ্য নিবন্ধ", "Latest Health Articles")}
            </h2>
          </div>
          <Link href="/news" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors flex-shrink-0">
            {t("সব দেখুন", "View All")} <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {ARTICLES.map((article) => (
            <Link key={article.slug} href={`/news/${article.slug}`}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 h-40 flex items-center justify-center">
                <span className="text-5xl">📰</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {t(article.category.bn, article.category.en)}
                  </span>
                  <span className="text-gray-400 text-xs">{article.date}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug text-sm sm:text-base">
                  {t(article.titleBn, article.titleEn)}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                  {t(article.excerptBn, article.excerptEn)}
                </p>
                <p className="text-blue-600 text-xs font-semibold mt-3 flex items-center gap-1">
                  {t("পড়ুন", "Read More")} <ArrowRight size={12} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
