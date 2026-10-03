import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout";
import { PageHero } from "@/components/ui/shared";
import { NewsDetail } from "@/components/news";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/news/${params.slug}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error();
    const json = await res.json();
    const article = json.data;
    return {
      title: `${article.titleBn} | শেরপুর আধুনিক চক্ষু হাসপাতাল`,
      description: article.shortDescBn,
      openGraph: {
        title: article.titleBn,
        description: article.shortDescBn,
        images: article.featuredImage ? [article.featuredImage] : [],
      },
    };
  } catch {
    return {
      title: "সংবাদ | শেরপুর আধুনিক চক্ষু হাসপাতাল",
    };
  }
}

export default function NewsArticlePage({ params }: Props) {
  return (
    <PublicLayout>
      <PageHero
        tag="সংবাদ / News"
        title="সংবাদ বিস্তারিত"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "সংবাদ", href: "/news" },
          { label: "বিস্তারিত" },
        ]}
      />
      <NewsDetail slug={params.slug} />
    </PublicLayout>
  );
}
