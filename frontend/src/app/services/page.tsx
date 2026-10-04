"use client";

import { PublicLayout } from "@/components/layout";
import { PageHero } from "@/components/ui/shared";
import { ServiceList } from "@/components/services";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useLang } from "@/context/LangContext";

export default function ServicesPage() {
  const { s } = useSiteSettings();
  const { t } = useLang();
  return (
    <PublicLayout>
      <PageHero
        tag={t("আমাদের সেবা / Our Services", "Our Services")}
        title={t("সকল চক্ষু সেবা এক ছাদের নিচে", "All Eye Services Under One Roof")}
        subtitle={t("আমরা চোখের সকল ধরনের সমস্যার আধুনিক চিকিৎসা প্রদান করি।", "We provide modern treatment for all types of eye problems.")}
        breadcrumbs={[{ label: t("হোম", "Home"), href: "/" }, { label: t("সেবাসমূহ", "Services") }]}
        bgImage={s.hero_services_image || undefined}
      />
      <section className="py-16 md:py-20 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4">
          <ServiceList />
        </div>
      </section>
    </PublicLayout>
  );
}
