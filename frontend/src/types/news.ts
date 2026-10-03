export type NewsCategory = "ANNOUNCEMENT" | "HEALTH_TIPS" | "EVENTS" | "ACHIEVEMENTS" | "OTHER";

export interface NewsArticle {
  id: string;
  slug: string;
  titleBn: string;
  titleEn: string;
  shortDescBn: string;
  shortDescEn: string;
  contentBn: string;
  contentEn: string;
  featuredImage: string | null;
  category: NewsCategory;
  authorBn: string;
  authorEn: string;
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
}

export interface NewsCategoryTab {
  value: NewsCategory | "ALL";
  labelBn: string;
  labelEn: string;
}

export const NEWS_CATEGORY_TABS: NewsCategoryTab[] = [
  { value: "ALL", labelBn: "সকল", labelEn: "All" },
  { value: "ANNOUNCEMENT", labelBn: "ঘোষণা", labelEn: "Announcement" },
  { value: "HEALTH_TIPS", labelBn: "স্বাস্থ্য টিপস", labelEn: "Health Tips" },
  { value: "EVENTS", labelBn: "ইভেন্ট", labelEn: "Events" },
  { value: "ACHIEVEMENTS", labelBn: "অর্জন", labelEn: "Achievements" },
  { value: "OTHER", labelBn: "অন্যান্য", labelEn: "Other" },
];
