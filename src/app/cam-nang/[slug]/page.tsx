import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLES, Article } from "@/data/articles";
import ArticleDetailClient from "./ArticleDetailClient";

export const instant = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

// 1. Sinh danh sách slug tĩnh cho tất cả bài viết
export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

// 2. OpenGraph & Metadata chuẩn SEO Google
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: "Cẩm Nang Dưỡng Sinh | Bếp Yến Ocean",
      description: "Cẩm nang nhận biết yến thật và bí quyết dưỡng sinh bồi bổ sức khỏe gia đình.",
    };
  }

  const title = `${article.title} | Bếp Yến Ocean`;
  const description = article.shortDesc;
  const imageUrl = article.image || "/images/banner-hero.jpg";

  return {
    title,
    description,
    keywords: article.keywords,
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: article.title,
        },
      ],
      publishedTime: article.date,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetailClient article={article} />;
}
