"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderTrayButton from "@/components/OrderTrayButton";
import AIChatBot from "@/components/AIChatBot";
import MobileBottomNav from "@/components/MobileBottomNav";
import type { Article } from "@/data/articles";
import { ARTICLES } from "@/data/articles";
import { ALL_PRODUCTS, VIP_PRODUCT_WITH_SLUG } from "@/data/products";
import { useOrder } from "@/context/OrderContext";
import { ZALO_PHONE, getZaloLink } from "@/lib/constants";

const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "đ";

type CleanRelatedProduct = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  image: string;
  volume: string;
};

type Props = {
  article: Article;
};

export default function ArticleDetailClient({ article }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addedIds, setAddedIds] = useState<number[]>([]);
  const { addItem, openTray } = useOrder();

  // Tìm các sản phẩm liên quan theo ID
  const relatedProducts: CleanRelatedProduct[] = article.relatedProductIds
    .map((id) => {
      if (id === 0) {
        return {
          id: 0,
          slug: VIP_PRODUCT_WITH_SLUG.slug || "yen-chung-dong-trung-ha-thao-tay-tang-vip",
          title: VIP_PRODUCT_WITH_SLUG.title,
          subtitle: VIP_PRODUCT_WITH_SLUG.subtitle,
          price: (VIP_PRODUCT_WITH_SLUG.baseFlavors[0]?.price || 135000) + VIP_PRODUCT_WITH_SLUG.wormPrice,
          originalPrice: 650000,
          image: VIP_PRODUCT_WITH_SLUG.image || "/images/banner-hero.jpg",
          volume: "Hũ 200ml + 1 Sâu Tây Tạng",
        };
      }
      const p = ALL_PRODUCTS.find((prod) => prod.id === id);
      if (!p) return null;
      return {
        id: p.id,
        slug: p.slug || String(p.id),
        title: p.title,
        subtitle: p.subtitle,
        price: p.price,
        originalPrice: p.originalPrice || Math.round(p.price * 1.25),
        image: p.image || "/images/product-sen-tao-do.jpg",
        volume: p.volume || "Hũ 200ml",
      };
    })
    .filter((p): p is CleanRelatedProduct => p !== null);

  // Lấy các bài viết khác để đọc tiếp
  const otherArticles = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);
  const primaryProduct = relatedProducts[0];

  // Tooltip & Prompt gợi ý cá nhân hóa cho Chatbot Bếp Trưởng Nhung (Xưng Em lễ phép, nhẹ nhàng)
  let botTooltip = "Em Nhung: Dạ Bác & Anh/Chị cần em tư vấn vị yến bồi bổ hay giao nóng 20P ạ? 🫙";
  let botPrompt = `Em Nhung ơi, tư vấn giúp mình vị yến bồi bổ phù hợp với!`;

  if (article.slug.includes("phan-biet")) {
    botTooltip = "Em Nhung: Dạ Bác & Anh/Chị cần em hướng dẫn kiểm tra sợi yến thật khi nhận hàng 20P không ạ? 🫙";
    botPrompt = "Em Nhung ơi, hướng dẫn giúp mình cách nhận biết sợi yến thật khi shipper giao đến với!";
  } else if (article.slug.includes("giao-mua")) {
    botTooltip = "Em Nhung: Dạ trời trở lạnh rồi, để em gợi ý vị yến ấm tỳ vị bổ phế cho cả nhà mình nhé! 🌿";
    botPrompt = "Em Nhung ơi, thời tiết này người nhà mình hay ho thì nên chưng vị yến nào ấm tỳ vị tốt nhất?";
  } else if (article.slug.includes("ocean-park")) {
    botTooltip = "Em Nhung: Dạ Bếp đang chưng mẻ yến tươi mới, em ship nóng 20P tới sảnh căn hộ mình luôn ạ! 🛵";
    botPrompt = "Em Nhung ơi, mình ở Vinhomes Ocean Park muốn đặt giao nóng hũ yến tươi thì Bếp ship thế nào?";
  } else if (article.slug.includes("ha-noi") || article.slug.includes("qua-bieu")) {
    botTooltip = "Em Nhung: Dạ Bác & Anh/Chị cần em chuẩn bị set quà biếu sơn mài gấm đỏ giao hỏa tốc không ạ? 🎁";
    botPrompt = "Em Nhung ơi, tư vấn giúp mình set quà biếu yến sào sang trọng lịch thiệp biếu đối tác với!";
  }

  const handleAddToCart = (product: CleanRelatedProduct) => {
    addItem({
      key: `${product.id}-${product.volume}`,
      productId: product.id,
      title: product.title,
      volume: product.volume,
      unitPrice: product.price,
    });
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 2000);
    openTray();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareZaloUrl = `https://zalo.me/share?url=${encodeURIComponent(
    `https://bepyen.ocean/cam-nang/${article.slug}`
  )}`;

  const handleShareZalo = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `https://bepyen.ocean/cam-nang/${article.slug}`;
    window.open(`https://zalo.me/share?url=${encodeURIComponent(currentUrl)}`, "_blank");
  };

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden max-w-full w-full"
      style={{ background: "var(--parchment)" }}
    >
      {/* Header */}
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Breadcrumb Navigation */}
      <nav className="bg-[#FAF6ED] border-b border-[#E8DFCE] py-2 px-3 sm:px-4 text-xs">
        <div className="max-w-3xl mx-auto flex items-center gap-1.5 text-stone-600 truncate">
          <Link href="/" className="hover:text-red-900 transition flex items-center gap-1">
            <span>🏠</span>
            <span>Trang Chủ</span>
          </Link>
          <span className="text-stone-400">/</span>
          <Link href="/cam-nang" className="hover:text-red-900 transition font-medium">
            Cẩm Nang Bếp Yến
          </Link>
          <span className="text-stone-400">/</span>
          <span className="text-red-950 font-semibold truncate">{article.title}</span>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-3.5 sm:px-6 pt-4 pb-2 sm:pb-3">
        {/* Article Header Card */}
        <header className="mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide shadow-xs"
              style={{
                background: "linear-gradient(135deg, var(--gold-light), var(--gold))",
                color: "var(--red-deep)",
              }}
            >
              🏷️ {article.category}
            </span>
            <span className="text-stone-500 text-xs flex items-center gap-1">
              <span>⏱️</span> {article.readTime}
            </span>
            <span className="text-stone-400 text-xs">•</span>
            <span className="text-stone-500 text-xs flex items-center gap-1">
              <span>📅</span> {article.date}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading text-red-950 leading-snug sm:leading-tight mb-3">
            {article.title}
          </h1>

          {/* Lead Quote */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#EFE7D5]/70 border-l-4 border-[#8C1D22] text-xs sm:text-sm text-stone-700 italic leading-relaxed mb-5 shadow-xs">
            {article.shortDesc}
          </div>

          {/* Author Badge */}
          <div className="flex items-center justify-between py-2.5 border-y border-amber-900/10">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-amber-100 shadow-sm"
                style={{ background: "var(--red-primary)" }}
              >
                Y
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900 leading-tight">
                  {article.author}
                </p>
                <p className="text-[10px] text-stone-500">
                  Cẩm nang ẩm thực dưỡng sinh hoàng gia
                </p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold border border-stone-300 hover:bg-stone-100 transition flex items-center gap-1 text-stone-700"
                title="Sao chép liên kết"
              >
                <span>🔗</span>
                <span>{copied ? "Đã chép!" : "Copy link"}</span>
              </button>
              <a
                href={shareZaloUrl}
                onClick={handleShareZalo}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1"
                title="Chia sẻ lên Zalo"
              >
                <span>💬</span>
                <span>Zalo</span>
              </a>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.image && (
          <div className="relative w-full h-52 sm:h-72 rounded-2xl overflow-hidden mb-4 shadow-md border border-amber-900/15">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {/* ── CARD NEO SẢN PHẨM ĐANG CHƯNG NÓNG (TỐI ƯU CHUYỂN ĐỔI NGAY) ── */}
        {primaryProduct && (
          <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#FFF9EE] to-[#F5EFE0] border-2 border-[#D4AF37] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-red-950">
                  Mẻ Yến Tươi Đang Nổi Lửa Chưng Nóng
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-900">
                Giao nóng 20P nội khu
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-amber-200/80">
                <Image
                  src={primaryProduct.image}
                  alt={primaryProduct.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-xs sm:text-sm text-stone-900 truncate">
                  {primaryProduct.title}
                </h3>
                <p className="text-[11px] text-stone-500 line-clamp-1 mb-1">
                  {primaryProduct.subtitle} · 100% sợi yến tươi chưng cách thủy
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs sm:text-sm font-extrabold text-[#72161A]">
                    {formatPrice(primaryProduct.price)}
                  </span>
                  <span className="text-[10px] text-stone-400 line-through">
                    {formatPrice(primaryProduct.originalPrice)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleAddToCart(primaryProduct)}
                  className="tap-active px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-black shadow-md transition-all hover:scale-105 flex items-center gap-1"
                  style={{
                    background: "linear-gradient(135deg, #72161A, #8C1D22)",
                    color: "#FFF8DC",
                  }}
                >
                  <span>🛵</span>
                  <span>{addedIds.includes(primaryProduct.id) ? "Đã Vào Khay" : "Đặt Giao Nóng"}</span>
                </button>
              </div>
            </div>

            {/* Nút kích hoạt Bot Chat tư vấn vị phù hợp ngay */}
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("open-ai-chat", {
                    detail: { prompt: botPrompt },
                  })
                );
              }}
              className="tap-active w-full mt-2.5 py-1.5 px-2.5 rounded-xl border border-amber-400/80 bg-amber-50/70 hover:bg-amber-100/80 text-amber-950 text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
            >
              <span className="text-amber-800 font-black text-xs">✦</span>
              <span>Em Nhung: Dạ Bác & Anh/Chị cần em tư vấn vị yến hay kiểm tra sợi yến? Nhắn em ngay ạ ➔</span>
            </button>
          </div>
        )}

        {/* Article Body Content */}
        <article
          className="article-content text-sm sm:text-base leading-relaxed text-stone-800 space-y-3.5 mb-5"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Tags / Keywords */}
        <div className="mb-5 pt-3 border-t border-stone-200">
          <p className="text-xs font-bold text-stone-600 mb-1.5 flex items-center gap-1">
            <span>🔖</span> Từ khóa tìm kiếm:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {article.keywords.map((kw, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* Author Guarantee Box */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#72161A] to-[#450A0E] text-[#FFF8DC] mb-5 shadow-md border border-amber-400/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-300 flex items-center justify-center text-xs font-black text-amber-200 shrink-0 font-heading tracking-wider">
              NGỰ
            </div>
            <div className="flex-1">
              <h4 className="font-heading font-bold text-xs sm:text-sm text-amber-200 mb-1">
                Cam Kết Từ Bếp Trưởng Nhung — Bếp Yến Ocean
              </h4>
              <p className="text-xs leading-relaxed text-amber-100/90 mb-2.5">
                “Tất cả hũ yến tại Bếp Yến Ocean đều được chúng em chưng tươi thủ công sau khi quý cư dân đặt hàng, giữ trọn độ dai giòn sần sật và độ nóng hổi khi trao tận tay. Em cam kết 100% yến sào thật nguyên chất, phát hiện yến độn Bếp em xin đền ngay gấp 10 lần!”
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <a
                  href={`tel:${ZALO_PHONE}`}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-400 text-red-950 font-bold hover:bg-amber-300 transition flex items-center gap-1"
                >
                  <span>☎ Hotline:</span> <span>{ZALO_PHONE}</span>
                </a>
                <a
                  href={getZaloLink(`Dạ chào Bếp Trưởng Nhung, mình vừa đọc bài '${article.title}', muốn được tư vấn vị yến phù hợp ạ!`)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition flex items-center gap-1"
                >
                  <span>💬 Nhắn Bếp Trưởng Nhung</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── SẢN PHẨM KHUYÊN DÙNG TRONG BÀI VIẾT (CHỐT ĐƠN NGAY) ── */}
        {relatedProducts.length > 0 && (
          <section className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-[#F5EFE0] border-2 border-[#D4AF37] shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-red-900 uppercase">
                  GỢI Ý THƯỞNG THỨC
                </span>
                <h3 className="font-heading font-bold text-base sm:text-lg text-red-950">
                  🛵 Thử Ngay Yến Chưng Nóng Đúng Chuẩn Dưỡng Sinh
                </h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-900 font-bold hidden sm:inline-block">
                Giao nóng 20–30p nội khu
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedProducts.map((p) => {
                if (!p) return null;
                const isAdded = addedIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-white border border-[#E0D5BE] flex flex-col justify-between shadow-xs hover:border-red-900/40 transition"
                  >
                    <div className="flex gap-2.5 mb-2.5">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-stone-900 truncate">
                          {p.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 line-clamp-1 mb-1">
                          {p.subtitle}
                        </p>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs sm:text-sm font-extrabold text-[#72161A]">
                            {formatPrice(p.price)}
                          </span>
                          <span className="text-[10px] text-stone-400 line-through">
                            {formatPrice(p.originalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/san-pham/${p.slug}`}
                        className="text-[11px] px-2 py-1.5 rounded-lg border border-stone-300 text-stone-700 font-semibold hover:bg-stone-100 transition text-center shrink-0"
                      >
                        Chi tiết
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(p)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs ${
                          isAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-gradient-to-r from-[#72161A] to-[#8C1D22] text-[#FFF8DC] hover:opacity-95"
                        }`}
                      >
                        <span>{isAdded ? "✓ Đã Vào Khay" : "🛵 Thêm Vào Khay Yến"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── BÀI VIẾT TIẾP THEO NÊN ĐỌC (TẠP CHÍ DƯỠNG SINH CUNG ĐÌNH) ── */}
        {otherArticles.length > 0 && (
          <section className="mb-1 pt-3.5 border-t border-[#DFD5C0]">
            <div className="flex items-end justify-between mb-4 px-0.5">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider inline-block mb-1 shadow-xs bg-amber-100 text-red-950 border border-amber-300">
                  ✨ TIẾP TỤC KHÁM PHÁ CẨM NANG
                </span>
                <h3 className="font-heading font-extrabold text-base sm:text-xl text-red-950">
                  Bài Viết Tiếp Theo Dành Cho Bạn
                </h3>
                <p className="text-xs text-stone-600">
                  Bí quyết ẩm thực bồi bổ sức khỏe và nhận biết yến nguyên chất từ Bếp Trưởng
                </p>
              </div>

              <Link
                href="/cam-nang"
                className="text-xs font-bold text-red-900 hover:text-red-950 transition flex items-center gap-1 shrink-0"
              >
                <span>Xem tất cả</span>
                <span>➔</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {otherArticles.map((item) => (
                <Link
                  key={item.slug}
                  href={`/cam-nang/${item.slug}`}
                  className="rounded-2xl bg-white border border-[#E3D9C3] hover:border-red-900/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Thumbnail lớn có ảnh */}
                    <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-stone-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-108 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 240px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#72161A]/90 text-amber-100 shadow-xs backdrop-blur-xs">
                        {item.category}
                      </span>
                      <span className="absolute bottom-2 left-2 text-[10px] text-white/90 font-medium flex items-center gap-1">
                        <span>⏱️</span> {item.readTime}
                      </span>
                    </div>

                    {/* Nội dung tóm tắt */}
                    <div className="p-3">
                      <h4 className="font-heading font-bold text-xs sm:text-[13px] text-stone-900 group-hover:text-red-950 transition-colors line-clamp-2 leading-snug mb-1.5">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                        {item.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Nút Đọc ngay */}
                  <div className="px-3 pb-3 pt-1 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-medium">
                      Bếp Yến Ocean
                    </span>
                    <span className="text-[11px] font-bold text-red-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Đọc bài này</span>
                      <span>➔</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Elements (Không còn thanh sticky ngang đáy gây đè chéo chân trang) */}
      <AIChatBot customTooltip={botTooltip} defaultPrompt={botPrompt} />
      <OrderTrayButton />
      <MobileBottomNav onOpenMenu={() => setIsMenuOpen(true)} />
    </div>
  );
}
