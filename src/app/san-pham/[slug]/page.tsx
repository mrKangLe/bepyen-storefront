import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ALL_PRODUCTS,
  VIP_PRODUCT_WITH_SLUG,
  getProductBySlugOrId,
  getProductSlug,
} from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";

export const instant = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

// 1. Sinh danh sách slug tĩnh cho tất cả sản phẩm
export async function generateStaticParams() {
  const slugs = ALL_PRODUCTS.map((p) => ({ slug: p.slug }));
  slugs.push({ slug: VIP_PRODUCT_WITH_SLUG.slug });
  // Thêm fallback id dạng số
  ALL_PRODUCTS.forEach((p) => slugs.push({ slug: String(p.id) }));
  slugs.push({ slug: "0" });
  return slugs;
}

// 2. OpenGraph & Metadata chuẩn SEO phục vụ chia sẻ Zalo / Facebook
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlugOrId(slug);

  if (!product) {
    return {
      title: "Sản Phẩm Yến Sào | Bếp Yến Ocean",
      description: "Yến chưng tươi cách thủy giao nóng 20 phút tại Vinhomes Ocean Park.",
    };
  }

  const title = `${product.title} – Bếp Yến Ocean Vinhomes Ocean Park`;
  const description =
    product.subtitle ||
    product.description ||
    "Yến chưng tươi cách thủy giao nóng hổi trong 20 phút tận căn hộ Vinhomes Ocean Park.";
  const imageUrl = product.image || "/images/banner-hero.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

// 3. Render Trang Chi Tiết Sản Phẩm
export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlugOrId(slug);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailClient
      product={{
        ...product,
        slug: product.slug || getProductSlug(product.id),
      }}
    />
  );
}
