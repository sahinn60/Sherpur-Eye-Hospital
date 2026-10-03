import Image from "next/image";
import Link from "next/link";
import { NewsArticle, NEWS_CATEGORY_TABS } from "@/types/news";
import { useLang } from "@/context/LangContext";

const FALLBACK_IMAGE = "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/nature-mountains";

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const { t } = useLang();

  const categoryLabel = NEWS_CATEGORY_TABS.find((c) => c.value === article.category);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    t("bn-BD", "en-US"),
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <Link
      href={`/news/${article.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* Featured Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Image
          src={article.featuredImage || FALLBACK_IMAGE}
          alt={t(article.titleBn, article.titleEn)}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {article.isFeatured && (
          <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {t("বিশেষ", "Featured")}
          </span>
        )}
        {categoryLabel && (
          <span className="absolute top-3 right-3 bg-white/90 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">
            {t(categoryLabel.labelBn, categoryLabel.labelEn)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-gray-400 text-xs mb-2">{formattedDate}</p>
        <h3 className="text-gray-900 font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {t(article.titleBn, article.titleEn)}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
          {t(article.shortDescBn, article.shortDescEn)}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-gray-400 text-xs">
            {t(article.authorBn, article.authorEn)}
          </span>
          <span className="text-primary-600 text-sm font-medium group-hover:underline">
            {t("পড়ুন →", "Read →")}
          </span>
        </div>
      </div>
    </Link>
  );
}
