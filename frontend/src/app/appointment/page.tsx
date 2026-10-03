import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { PageHero } from "@/components/ui/shared";
import { AppointmentSection } from "@/components/appointment";

export const metadata: Metadata = {
  title: "অ্যাপয়েন্টমেন্ট | শেরপুর আধুনিক চক্ষু হাসপাতাল",
  description: "শেরপুর আধুনিক চক্ষু হাসপাতালে অ্যাপয়েন্টমেন্ট নিন।",
};

export default function AppointmentPage() {
  return (
    <PublicLayout>
      <PageHero
        tag="অ্যাপয়েন্টমেন্ট / Appointment"
        title="অ্যাপয়েন্টমেন্ট নিন"
        subtitle="আমাদের অভিজ্ঞ চক্ষু বিশেষজ্ঞের সাথে পরামর্শের জন্য অ্যাপয়েন্টমেন্ট নিন।"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "অ্যাপয়েন্টমেন্ট" },
        ]}
      />
      <AppointmentSection />
    </PublicLayout>
  );
}
