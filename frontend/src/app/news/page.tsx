"use client";

import { PublicLayout } from "@/components/layout";
import { PageHero } from "@/components/ui/shared";
import { NewsList } from "@/components/news";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useLang } from "@/context/LangContext";

export default function NewsPage() {
  const { s } = useSiteSettings();
  const { t } = useLang();
  return (
    <PublicLayout>
      <PageHero
        tag={t("সংবাদ / News", "News")}
        title={t("সর্বশেষ সংবাদ ও ঘোষণা", "Latest News & Announcements")}
        subtitle={t("হাসপাতালের সর্বশেষ খবর, স্বাস্থ্য টিপস, ইভেন্ট ও অর্জন সম্পর্কে জানুন।", "Stay updated with the latest hospital news, health tips, events and achievements.")}
        breadcrumbs={[{ label: t("হোম", "Home"), href: "/" }, { label: t("সংবাদ", "News") }]}
        bgImage={s.hero_news_image || undefined}
      />
      <section className="py-16 md:py-20 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4">
          <NewsList />
        </div>
      </section>
    </PublicLayout>
  );
}
