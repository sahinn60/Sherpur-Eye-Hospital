import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { DoctorProfile } from "@/components/doctors";

export const metadata: Metadata = {
  title: "চিকিৎসক প্রোফাইল | শেরপুর আধুনিক চক্ষু হাসপাতাল",
};

interface Props {
  params: { id: string };
}

export default function DoctorDetailPage({ params }: Props) {
  return (
    <PublicLayout>
      <DoctorProfile id={params.id} />
    </PublicLayout>
  );
}
