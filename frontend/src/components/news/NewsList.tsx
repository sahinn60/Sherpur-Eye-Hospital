"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { useNews } from "@/hooks/useNews";
import { NewsCategory, NEWS_CATEGORY_TABS } from "@/types/news";
import { NewsCard } from "./NewsCard";
import { NewsListSkeleton } from "./NewsSkeleton";

export function NewsList() {
  const { t } = useLang();
  const [activeCategory, setActiveCategory] = useState<NewsCategory | "ALL">("ALL");
  const { data: articles, loading, error } = useNews(activeCategory);

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {NEWS_CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveCategory(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === tab.value
                ? "bg-primary-600 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600"
            }`}
          >
            {t(tab.labelBn, tab.labelEn)}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && <NewsListSkeleton />}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-gray-500 text-lg">
            {t("সংবাদ লোড করতে সমস্যা হয়েছে।", "Failed to load news.")}
          </p>
          <p className="text-gray-400 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && articles && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">📰</div>
          <p className="text-gray-500 text-lg">
            {t("এই বিভাগে কোনো সংবাদ নেই।", "No articles in this category.")}
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && articles && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
