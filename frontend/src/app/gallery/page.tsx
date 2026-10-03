import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { PageHero } from "@/components/ui/shared";
import { GalleryGrid } from "@/components/gallery";

export const metadata: Metadata = {
  title: "গ্যালারি | শেরপুর আধুনিক চক্ষু হাসপাতাল",
  description: "শেরপুর আধুনিক চক্ষু হাসপাতালের হাসপাতাল, চিকিৎসক, সুবিধা ও ইভেন্টের ছবি দেখুন।",
};

export default function GalleryPage() {
  return (
    <PublicLayout>
      <PageHero
        tag="গ্যালারি / Gallery"
        title="আমাদের হাসপাতালের গ্যালারি"
        subtitle="হাসপাতাল, চিকিৎসক, আধুনিক সুবিধা ও বিভিন্ন ইভেন্টের ছবি দেখুন।"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "গ্যালারি" },
        ]}
      />
      <section className="py-16 md:py-20 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4">
          <GalleryGrid />
        </div>
      </section>
    </PublicLayout>
  );
}
