import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { PageHero } from "@/components/ui/shared";
import { DoctorList } from "@/components/doctors";

export const metadata: Metadata = {
  title: "আমাদের চিকিৎসক | শেরপুর আধুনিক চক্ষু হাসপাতাল",
  description: "শেরপুর আধুনিক চক্ষু হাসপাতালের অভিজ্ঞ চক্ষু বিশেষজ্ঞ চিকিৎসক দলের সাথে পরিচিত হন।",
};

export default function DoctorsPage() {
  return (
    <PublicLayout>
      <PageHero
        tag="আমাদের চিকিৎসক / Our Doctors"
        title="অভিজ্ঞ চক্ষু বিশেষজ্ঞ চিকিৎসক দল"
        subtitle="আমাদের চিকিৎসকরা আপনার চোখের সর্বোত্তম যত্নে প্রতিশ্রুতিবদ্ধ।"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "চিকিৎসক" },
        ]}
      />
      <section className="py-16 md:py-20 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4">
          <DoctorList />
        </div>
      </section>
    </PublicLayout>
  );
}
