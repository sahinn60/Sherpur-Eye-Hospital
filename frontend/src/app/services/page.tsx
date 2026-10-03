import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { PageHero } from "@/components/ui/shared";
import { ServiceList } from "@/components/services";

export const metadata: Metadata = {
  title: "আমাদের সেবাসমূহ | শেরপুর আধুনিক চক্ষু হাসপাতাল",
  description: "শেরপুর আধুনিক চক্ষু হাসপাতালের সকল চক্ষু সেবা — ফ্যাকো সার্জারি, রেটিনা, গ্লুকোমা, শিশু চক্ষু চিকিৎসা এবং আরও অনেক কিছু।",
};

export default function ServicesPage() {
  return (
    <PublicLayout>
      <PageHero
        tag="আমাদের সেবা / Our Services"
        title="সকল চক্ষু সেবা এক ছাদের নিচে"
        subtitle="আমরা চোখের সকল ধরনের সমস্যার আধুনিক চিকিৎসা প্রদান করি।"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "সেবাসমূহ" },
        ]}
      />
      <section className="py-16 md:py-20 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4">
          <ServiceList />
        </div>
      </section>
    </PublicLayout>
  );
}
