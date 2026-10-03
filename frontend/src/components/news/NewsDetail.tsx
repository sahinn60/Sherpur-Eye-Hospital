"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { useNewsArticle } from "@/hooks/useNews";
import { NEWS_CATEGORY_TABS } from "@/types/news";
import { NewsDetailSkeleton } from "./NewsSkeleton";

interface NewsDetailProps {
  slug: string;
}

export function NewsDetail({ slug }: NewsDetailProps) {
  const { t } = useLang();
  const { data: article, loading, error } = useNewsArticle(slug);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-white min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-4">
          <NewsDetailSkeleton />
        </div>
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className="py-20 bg-white min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t("নিবন্ধটি পাওয়া যায়নি", "Article Not Found")}
          </h2>
          <p className="text-gray-500 mb-6">
            {t("এই নিবন্ধটি বিদ্যমান নেই বা সরিয়ে নেওয়া হয়েছে।", "This article does not exist or has been removed.")}
          </p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            {t("← সকল সংবাদ", "← All News")}
          </Link>
        </div>
      </section>
    );
  }

  const categoryLabel = NEWS_CATEGORY_TABS.find((c) => c.value === article.category);
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    t("bn-BD", "en-US"),
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back link */}
        <Link
          href="/news"
          className="inline-flex items-center gap-1 text-primary-600 text-sm font-medium hover:underline mb-6"
        >
          {t("← সকল সংবাদ", "← All News")}
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {categoryLabel && (
            <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">
              {t(categoryLabel.labelBn, categoryLabel.labelEn)}
            </span>
          )}
          {article.isFeatured && (
            <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
              {t("বিশেষ", "Featured")}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {t(article.titleBn, article.titleEn)}
        </h1>

        {/* Author & Date */}
        <div className="flex items-center gap-3 text-gray-400 text-sm mb-8 pb-6 border-b border-gray-100">
          <span>{t(article.authorBn, article.authorEn)}</span>
          <span>·</span>
          <span>{formattedDate}</span>
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-8 bg-gray-100">
            <Image
              src={article.featuredImage}
              alt={t(article.titleBn, article.titleEn)}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Short description */}
        <p className="text-gray-600 text-lg leading-relaxed mb-8 font-medium border-l-4 border-primary-400 pl-4">
          {t(article.shortDescBn, article.shortDescEn)}
        </p>

        {/* Full content */}
        <div
          className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-primary-600 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: t(article.contentBn, article.contentEn) }}
        />
      </div>
    </section>
  );
}
