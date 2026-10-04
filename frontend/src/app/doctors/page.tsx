"use client";

import { PublicLayout } from "@/components/layout";
import { PageHero } from "@/components/ui/shared";
import { DoctorList } from "@/components/doctors";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useLang } from "@/context/LangContext";

export default function DoctorsPage() {
  const { s } = useSiteSettings();
  const { t } = useLang();
  return (
    <PublicLayout>
      <PageHero
        tag={t("আমাদের চিকিৎসক / Our Doctors", "Our Doctors")}
        title={t("অভিজ্ঞ চক্ষু বিশেষজ্ঞ চিকিৎসক দল", "Experienced Eye Specialist Team")}
        subtitle={t("আমাদের চিকিৎসকরা আপনার চোখের সর্বোত্তম যত্নে প্রতিশ্রুতিবদ্ধ।", "Our doctors are committed to providing the best care for your eyes.")}
        breadcrumbs={[{ label: t("হোম", "Home"), href: "/" }, { label: t("চিকিৎসক", "Doctors") }]}
        bgImage={s.hero_doctors_image || undefined}
      />
      <section className="py-16 md:py-20 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4">
          <DoctorList />
        </div>
      </section>
    </PublicLayout>
  );
}
