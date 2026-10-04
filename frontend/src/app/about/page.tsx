"use client";

import { PublicLayout } from "@/components/layout";
import { PageHero } from "@/components/ui/shared";
import {
  AboutIntro, MissionVision, ValuesSection, PatientCareSection,
  EquipmentSection, EnvironmentSection, ContactReasonsSection,
  AboutGallery, AboutCTA,
} from "@/components/about";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useLang } from "@/context/LangContext";


export default function AboutPage() {
  const { s } = useSiteSettings();
  const { t } = useLang();
  return (
    <PublicLayout>
      <PageHero
        tag={t("আমাদের সম্পর্কে / About Us", "About Us")}
        title={t("শেরপুর আধুনিক চক্ষু হাসপাতাল ও ফ্যাকো সেন্টার", "Sherpur Adhunik Eye Hospital & Phaco Center")}
        subtitle={t("শেরপুর জেলার মানুষের চোখের সেবায় নিবেদিত একটি আধুনিক বিশেষায়িত হাসপাতাল।", "A modern specialized hospital dedicated to eye care for the people of Sherpur district.")}
        breadcrumbs={[{ label: t("হোম", "Home"), href: "/" }, { label: t("আমাদের সম্পর্কে", "About Us") }]}
        bgImage={s.hero_about_image || undefined}
      />
      <AboutIntro />
      <MissionVision />
      <ValuesSection />
      <PatientCareSection />
      <EquipmentSection />
      <EnvironmentSection />
      <ContactReasonsSection />
      <AboutGallery />
      <AboutCTA />
    </PublicLayout>
  );
}
