import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { PageHero } from "@/components/ui/shared";
import {
  AboutIntro,
  MissionVision,
  ValuesSection,
  PatientCareSection,
  EquipmentSection,
  EnvironmentSection,
  ContactReasonsSection,
  AboutGallery,
  AboutCTA,
} from "@/components/about";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে | শেরপুর আধুনিক চক্ষু হাসপাতাল",
  description:
    "শেরপুর আধুনিক চক্ষু হাসপাতাল ও ফ্যাকো সেন্টার সম্পর্কে জানুন — আমাদের লক্ষ্য, দৃষ্টিভঙ্গি, মূল্যবোধ ও সেবা।",
};

export default function AboutPage() {
  return (
    <PublicLayout>
      <PageHero
        tag="আমাদের সম্পর্কে / About Us"
        title="শেরপুর আধুনিক চক্ষু হাসপাতাল ও ফ্যাকো সেন্টার"
        subtitle="শেরপুর জেলার মানুষের চোখের সেবায় নিবেদিত একটি আধুনিক বিশেষায়িত হাসপাতাল।"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "আমাদের সম্পর্কে" },
        ]}
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
