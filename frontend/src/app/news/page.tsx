import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { PageHero } from "@/components/ui/shared";
import { NewsList } from "@/components/news";

export const metadata: Metadata = {
  title: "সংবাদ ও ঘোষণা | শেরপুর আধুনিক চক্ষু হাসপাতাল",
  description: "শেরপুর আধুনিক চক্ষু হাসপাতালের সর্বশেষ সংবাদ, স্বাস্থ্য টিপস ও ঘোষণা পড়ুন।",
};

export default function NewsPage() {
  return (
    <PublicLayout>
      <PageHero
        tag="সংবাদ / News"
        title="সর্বশেষ সংবাদ ও ঘোষণা"
        subtitle="হাসপাতালের সর্বশেষ খবর, স্বাস্থ্য টিপস, ইভেন্ট ও অর্জন সম্পর্কে জানুন।"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "সংবাদ" },
        ]}
      />
      <section className="py-16 md:py-20 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4">
          <NewsList />
        </div>
      </section>
    </PublicLayout>
  );
}
