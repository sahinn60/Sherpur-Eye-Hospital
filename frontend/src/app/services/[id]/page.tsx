import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { ServiceDetail } from "@/components/services";

export const metadata: Metadata = {
  title: "সেবার বিবরণ | শেরপুর আধুনিক চক্ষু হাসপাতাল",
};

interface Props {
  params: { id: string };
}

export default function ServiceDetailPage({ params }: Props) {
  return (
    <PublicLayout>
      <ServiceDetail id={params.id} />
    </PublicLayout>
  );
}
