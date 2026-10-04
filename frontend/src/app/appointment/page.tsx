"use client";

import { PublicLayout } from "@/components/layout";
import { PageHero } from "@/components/ui/shared";
import { AppointmentSection } from "@/components/appointment";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useLang } from "@/context/LangContext";

export default function AppointmentPage() {
  const { s } = useSiteSettings();
  const { t } = useLang();
  return (
    <PublicLayout>
      <PageHero
        tag={t("অ্যাপয়েন্টমেন্ট / Appointment", "Appointment")}
        title={t("অ্যাপয়েন্টমেন্ট নিন", "Book an Appointment")}
        subtitle={t("আমাদের অভিজ্ঞ চক্ষু বিশেষজ্ঞের সাথে পরামর্শের জন্য অ্যাপয়েন্টমেন্ট নিন।", "Book an appointment with our experienced eye specialists.")}
        breadcrumbs={[{ label: t("হোম", "Home"), href: "/" }, { label: t("অ্যাপয়েন্টমেন্ট", "Appointment") }]}
        bgImage={s.hero_appointment_image || undefined}
      />
      <AppointmentSection />
    </PublicLayout>
  );
}
