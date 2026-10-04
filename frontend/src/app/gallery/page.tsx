"use client";

import { PublicLayout } from "@/components/layout";
import { PageHero } from "@/components/ui/shared";
import { GalleryGrid } from "@/components/gallery";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useLang } from "@/context/LangContext";

export default function GalleryPage() {
  const { s } = useSiteSettings();
  const { t } = useLang();
  return (
    <PublicLayout>
      <PageHero
        tag={t("গ্যালারি / Gallery", "Gallery")}
        title={t("আমাদের হাসপাতালের গ্যালারি", "Our Hospital Gallery")}
        subtitle={t("হাসপাতাল, চিকিৎসক, আধুনিক সুবিধা ও বিভিন্ন ইভেন্টের ছবি দেখুন।", "View photos of the hospital, doctors, modern facilities and various events.")}
        breadcrumbs={[{ label: t("হোম", "Home"), href: "/" }, { label: t("গ্যালারি", "Gallery") }]}
        bgImage={s.hero_gallery_image || undefined}
      />
      <section className="py-16 md:py-20 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4">
          <GalleryGrid />
        </div>
      </section>
    </PublicLayout>
  );
}
