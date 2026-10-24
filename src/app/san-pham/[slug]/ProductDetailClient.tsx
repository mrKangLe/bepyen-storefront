"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product, VIPProduct } from "@/data/products";
import { ALL_PRODUCTS, getProductSlug } from "@/data/products";
import { useOrder } from "@/context/OrderContext";
import { ZALO_PHONE, getZaloLink } from "@/lib/constants";
import {
  getStoredAffiliateCode,
  saveAffiliateCode,
  buildProductShareUrl,
  calculateCommission,
} from "@/lib/affiliate";
import OrderModal from "@/components/OrderModal";
import AIChatBot from "@/components/AIChatBot";
import ResidentReviewsFB from "@/components/ResidentReviewsFB";
import AffiliateGuideModal, {
  AffiliateSettingsData,
} from "@/components/AffiliateGuideModal";
import VIPTibetanCinemaModal from "@/components/VIPTibetanCinemaModal";

type Props = {
  product: (Product | VIPProduct) & { isVIP?: boolean; slug: string };
};

function getSeal(category?: string, title?: string): string {
  const t = title || "";
  const c = category || "";
  if (t.includes("Sâu Đông Trùng") || t.includes("VIP")) return "ĐẠI BỔ HOÀNG GIA";
  if (t.includes("Tổ Yến Rút Lông") || t.includes("Loại To")) return "NGỰ PHẨM";
  if (t.includes("12%")) return "THƯỢNG HẠNG";
  if (t.includes("Đông Trùng") || c.includes("đông trùng")) return "BỔ KHÍ HUYẾT";
  if (t.includes("Hạt Sen") || t.includes("Táo Đỏ")) return "DƯỠNG TÂM AN THẦN";
  if (t.includes("Hạt Chia")) return "THANH LỌC DÁNG ĐẸP";
  if (t.includes("Kỷ Tử")) return "BỔ HUYẾT SÁNG MẮT";
  if (t.includes("Set") || c.includes("quà")) return "QUÀ TẶNG CAO CẤP";
  return "BỔ PHẾ THANH NHIỆT";
}

export default function ProductDetailClient({ product }: Props) {
  const { addItem, openTray, totalItems } = useOrder();
  const [added, setAdded] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState("");
  const [affiliateEnabled, setAffiliateEnabled] = useState(true);
  const [commissionRate, setCommissionRate] = useState(0.08);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [affiliateSettings, setAffiliateSettings] = useState<AffiliateSettingsData>({
    enabled: true,
    commission_rate: 0.08,
  });
  const [campaign, setCampaign] = useState<{
    enabled: boolean;
    badge: string;
    title: string;
  } | null>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  // VIP Product State (nếu là hũ sâu đông trùng)
  const isVIP = Boolean(product.isVIP);
  const vipProd = isVIP ? (product as unknown as VIPProduct) : null;
  const [showCinemaModal, setShowCinemaModal] = useState(false);
  const [selectedFlavorId, setSelectedFlavorId] = useState(1);
  const [wormCount, setWormCount] = useState(1);
  const regProdInit = !(product as any).isVIP ? (product as Product) : null;
  const [selectedVol, setSelectedVol] = useState<string>(() => {
    if (regProdInit?.volumeOptions && regProdInit.volumeOptions.length > 0) {
      return regProdInit.volumeOptions[0].volume;
    }
    return regProdInit?.volume || "Hũ 75ml";
  });

  useEffect(() => {
    setIsMounted(true);
    const existing = getStoredAffiliateCode();
    if (existing) {
      setAffiliateCode(existing);
    }
    // Lấy trạng thái Bật / Tắt Affiliate & cài đặt chiến dịch mùa vụ từ CPanel của Bố
    fetch("/api/affiliate")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setAffiliateSettings(data);
          if (typeof data.enabled === "boolean") {
            setAffiliateEnabled(data.enabled);
          }
          if (typeof data.commission_rate === "number") {
            setCommissionRate(data.commission_rate);
          }
        }
      })
      .catch(() => {});

    // Lấy trạng thái Bật / Tắt Khuyến Mãi Động (Dynamic Campaign) từ CPanel
    fetch("/api/promotions")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.dynamic_campaign) {
          setCampaign(data.dynamic_campaign);
        }
      })
      .catch(() => {});
  }, []);

  const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "đ";

  // Tính giá hiện tại
  let currentPrice = 0;
  let originalPrice: number | undefined = undefined;

  if (isVIP && vipProd) {
    const base = vipProd.baseFlavors.find((f) => f.id === selectedFlavorId) || vipProd.baseFlavors[0];
    currentPrice = base.price + wormCount * vipProd.wormPrice;
  } else {
    const regProd = product as Product;
    const volOpt = regProd.volumeOptions?.find((v) => v.volume === selectedVol);
    currentPrice = volOpt ? volOpt.price : regProd.price;
    originalPrice = volOpt?.originalPrice || regProd.originalPrice;
  }

  const commission = Math.round(currentPrice * commissionRate);
  const commissionPercent = Math.round(commissionRate * 100);
  const canonicalShareUrl = buildProductShareUrl(product.slug, affiliateCode);
  const seal = getSeal((product as any).category, product.title);
  const imageUrl = product.image || "/images/product-duong-phen.jpg";

  // Lấy URL thực tế trên trình duyệt khi người dùng bấm tương tác
  const getDynamicShareUrl = () => {
    if (typeof window !== "undefined" && window.location.origin) {
      return buildProductShareUrl(product.slug, affiliateCode, window.location.origin);
    }
    return canonicalShareUrl;
  };

  // Thêm vào giỏ
  const handleAddToCart = () => {
    if (isVIP && vipProd) {
      const base = vipProd.baseFlavors.find((f) => f.id === selectedFlavorId) || vipProd.baseFlavors[0];
      addItem({
        key: `vip-${selectedFlavorId}-${wormCount}`,
        productId: 0,
        title: `${product.title} (${base.name})`,
        volume: `Sâu Tây Tạng × ${wormCount} con`,
        unitPrice: currentPrice,
        extras: `${wormCount} sâu ĐT (+${(wormCount * vipProd.wormPrice).toLocaleString("vi-VN")}đ)`,
      });
    } else {
      const regProd = product as Product;
      const itemKey = `${regProd.id}-${selectedVol.replace(/\s+/g, "")}`;
      addItem({
        key: itemKey,
        productId: regProd.id,
        title: regProd.title,
        volume: selectedVol,
        unitPrice: currentPrice,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleOrderNow = () => {
    handleAddToCart();
    openTray();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getDynamicShareUrl());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {}
  };

  const handleCopyShareText = async () => {
    try {
      const url = getDynamicShareUrl();
      const text = `🍲 Mời bạn thưởng thức ${product.title} nóng hổi tại Bếp Yến Ocean (Vinhomes Ocean Park). 100% yến chưng tươi cách thủy theo yêu cầu, giao nhanh 20-30 phút tận cửa. Xem chi tiết & đặt tại: ${url}`;
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {}
  };

  const handleShareZalo = () => {
    const url = getDynamicShareUrl();
    window.open(`https://zalo.me/share?url=${encodeURIComponent(url)}`, "_blank");
  };

  const handleNativeShare = async () => {
    const url = getDynamicShareUrl();
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: product.title,
          text: `🍲 Mời bạn thưởng thức ${product.title} chưng tươi nóng hổi tại Bếp Yến Ocean!`,
          url: url,
        });
        return;
      } catch (err) {}
    }
    handleCopyLink();
  };

  const handleSaveCode = (code: string) => {
    setAffiliateCode(code);
    saveAffiliateCode(code);
  };

  // Lấy 2 sản phẩm gợi ý cùng danh mục
  const relatedProducts = ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === (product as any).category
  ).slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col font-body pb-28" style={{ background: "var(--parchment)" }}>
      {/* ── TOP HEADER ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-amber-900/10 backdrop-blur-md bg-[#FFFDF9]/95 py-2.5 px-4 shadow-2xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-red-950 hover:text-red-700 transition"
          >
            <span>‹</span>
            <span>Về Thực Đơn</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border"
              style={{
                background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
                borderColor: "var(--gold-light)",
                color: "var(--red-deep)",
              }}
            >
              Y
            </div>
            <span className="font-extrabold text-sm font-heading text-red-950">
              Bếp Yến Ocean
            </span>
          </Link>

          {/* Nút Chia sẻ nhanh & Khay ngự thiện */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNativeShare}
              className="tap-active flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition shadow-2xs bg-amber-50/90 hover:bg-amber-100 border-amber-300/80 text-red-950 cursor-pointer"
              title="Chia sẻ món yến này"
            >
              <span>🔗</span>
              <span>Chia sẻ</span>
            </button>

            <button
              type="button"
              onClick={openTray}
              className="tap-active flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition shadow-2xs"
              style={{
                background: totalItems > 0 ? "linear-gradient(135deg, var(--gold), var(--gold-light))" : "#F5EFE0",
                borderColor: "var(--gold-dark)",
                color: "var(--red-deep)",
              }}
            >
              <span>🫙</span>
              <span>Khay ({totalItems})</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── NỘI DUNG CHÍNH (KHÓNG CHẾ MAX-W-2XL ĐỒNG BỘ 2 CỘT) ─ */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-3.5 sm:px-4 py-2.5 space-y-2.5 sm:space-y-3">
        {/* Breadcrumb tinh gọn */}
        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 min-w-0">
          <Link href="/" className="hover:text-amber-900 shrink-0 font-medium">Trang chủ</Link>
          <span>/</span>
          <span className="line-clamp-1 font-semibold text-stone-800">{product.title}</span>
        </div>

        {/* ── KHUNG ẢNH VÀ THÔNG TIN ĐỈNH CAO ─────────────────── */}
        <div
          className="rounded-2xl sm:rounded-3xl p-3 sm:p-4.5 shadow-sm border relative overflow-hidden"
          style={{
            background: "#FFFDF9",
            borderColor: "rgba(201,168,76,0.45)",
          }}
        >
          {/* Ảnh sản phẩm lớn sắc nét, tôn vinh trọn vẹn từng sợi yến & nguyên liệu ngự thiện */}
          <div className="relative w-full aspect-square max-h-[340px] sm:max-h-[400px] rounded-2xl overflow-hidden border border-amber-900/15 bg-amber-50/50 shadow-inner group">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 672px) 100vw, 672px"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20 pointer-events-none" />

            {/* Triện son hoàng gia */}
            <div className="absolute top-3 left-3 z-10">
              <span className="imperial-seal px-3 py-1 text-[11px] sm:text-xs shadow-md">
                {seal}
              </span>
            </div>

            {/* Huy hiệu badge */}
            {(product as any).badge && (
              <div className="absolute top-3 right-3 z-10">
                <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-red-700 text-amber-100 shadow-md border border-amber-400/40">
                  {(product as any).badge}
                </span>
              </div>
            )}

            {/* Huy hiệu cam kết tươi nóng & không chất bảo quản góc dưới ảnh */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-1 text-[10px] sm:text-xs font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-md">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">♨️</span> Chưng tươi nóng theo đơn
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">🛡️</span> 0% Bảo quản · HSD 7 ngày
              </span>
            </div>
          </div>

          {/* Thông tin tên & Giá bán rõ ràng */}
          <div className="mt-3 space-y-2.5">
            <div>
              <h1 className="text-lg sm:text-2xl font-black font-heading text-red-950 leading-tight">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-xs sm:text-sm text-stone-600 mt-0.5 leading-snug">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* ── BẢNG GIÁ HOÀNG GIA & KHUYẾN MÃI TINH GỌN, SANG TRỌNG ── */}
            <div className="rounded-2xl p-3 sm:p-3.5 bg-gradient-to-br from-amber-50/90 via-[#FFFDF5] to-amber-100/60 border border-amber-300 shadow-sm space-y-2.5">
              {/* DÒNG 1: GIÁ BÁN NỔI BẬT */}
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                  {/* Giá chính to đậm màu đỏ ngọc hoàng gia */}
                  <span className="text-2xl sm:text-3xl font-black text-red-950 font-heading tracking-tight leading-none">
                    {formatPrice(currentPrice)}
                  </span>

                  {/* Giá gốc gạch ngang */}
                  {originalPrice && (
                    <span className="text-xs sm:text-sm text-stone-400 line-through leading-none font-medium">
                      {formatPrice(originalPrice)}
                    </span>
                  )}

                  {/* Huy hiệu Tiết kiệm % */}
                  {originalPrice && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-black bg-red-600 text-white shadow-2xs leading-none">
                      -{Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Tag dung tích đang chọn */}
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300/60 shrink-0">
                  {selectedVol}
                </span>
              </div>

              {/* DÒNG 2: BỘ CHỌN CỠ HŨ TINH GỌN (CHIP ĐÍNH KÈM GIÁ TIỀN) */}
              {!(product as any).isVIP && (product as Product).volumeOptions && (product as Product).volumeOptions!.length > 0 && (
                <div className="flex items-center gap-2 pt-1 text-xs border-t border-amber-900/10">
                  <span className="text-stone-500 font-bold shrink-0">Cỡ hũ:</span>
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {(product as Product).volumeOptions!.map((vol) => {
                      const isSel = vol.volume === selectedVol;
                      return (
                        <button
                          key={vol.volume}
                          type="button"
                          onClick={() => setSelectedVol(vol.volume)}
                          className={`tap-active px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ${
                            isSel
                              ? "bg-red-950 text-amber-200 border-amber-400 shadow-xs"
                              : "bg-white text-stone-700 hover:bg-amber-50/50 border-stone-200"
                          }`}
                        >
                          <span>{vol.volume}</span>
                          <span className={`text-[10px] font-extrabold ${isSel ? "text-white" : "text-red-900"}`}>
                            ({(vol.price / 1000).toLocaleString("vi-VN")}k)
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tùy chọn riêng cho VIP Sâu Đông Trùng */}
              {isVIP && vipProd && (
                <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-300 space-y-1.5">
                  <span className="text-xs font-bold text-amber-950 block">
                    👑 Tùy biến hũ yến chưng sâu ngự thiện:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <select
                      value={selectedFlavorId}
                      onChange={(e) => setSelectedFlavorId(Number(e.target.value))}
                      className="text-xs font-bold p-1.5 rounded-lg border border-amber-300 bg-white text-stone-900"
                    >
                      {vipProd.baseFlavors.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({formatPrice(f.price)})
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1.5">
                      {[1, 2].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setWormCount(num)}
                          className={`flex-1 py-1 rounded-lg text-xs font-bold border transition ${
                            wormCount === num
                              ? "bg-red-900 text-amber-100 border-red-950 shadow-xs"
                              : "bg-white text-stone-700 border-stone-300"
                          }`}
                        >
                          {num} con (+{(num * vipProd.wormPrice).toLocaleString("vi-VN")}đ)
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nút xem thước phim huyền thoại */}
                  <button
                    type="button"
                    onClick={() => setShowCinemaModal(true)}
                    className="tap-active w-full py-2 px-3 rounded-xl text-xs font-black bg-gradient-to-r from-[#72161A] via-[#941C22] to-[#72161A] text-amber-200 border border-amber-400/60 shadow-md flex items-center justify-center gap-1.5 transition hover:brightness-110 active:scale-95 animate-pulse cursor-pointer"
                  >
                    <span>🎬</span>
                    <span>Xem Thước Phim Huyền Thoại Sâu Tây Tạng (14s) ➔</span>
                  </button>
                </div>
              )}

              {/* DÒNG 3: 3 ĐẶC QUYỀN VÀNG OCEAN PARK - TINH GỌN 1 DÒNG DUY NHẤT, KHÔNG RỐI MẮT */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-amber-900/10 text-center">
                <div className="p-1.5 rounded-lg bg-white/90 border border-amber-200/90 shadow-2xs">
                  <span className="text-xs block font-bold text-red-950">🚀 FREESHIP 100%</span>
                  <span className="text-[10px] text-stone-500 block">Nội khu Ocean Park</span>
                </div>
                <div className="p-1.5 rounded-lg bg-white/90 border border-amber-200/90 shadow-2xs">
                  <span className="text-xs block font-bold text-red-950">🛵 Giao Nóng 20–30P</span>
                  <span className="text-[10px] text-stone-500 block">Tận cửa căn hộ</span>
                </div>
                <div className="p-1.5 rounded-lg bg-white/90 border border-emerald-200/90 shadow-2xs">
                  <span className="text-xs block font-bold text-emerald-950">🫙 10 Vỏ = 1 Hũ</span>
                  <span className="text-[10px] text-emerald-700 block">Đổi hũ tươi</span>
                </div>
              </div>

              {/* CON NHỘNG KHUYẾN MÃI ĐỘNG (BẬT/TẮT TRONG CPANEL) - NẰM GIỮA & DƯỚI CÂN ĐỐI, NHẤP NHÁY NHẸ GÂY CHÚ Ý */}
              {campaign && campaign.enabled && (
                <div className="flex justify-center pt-2">
                  <div className="animate-pulse inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-black shadow-md border border-amber-400/60 bg-gradient-to-r from-[#72161A] via-[#941C22] to-[#72161A] text-amber-200 select-none">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                    </span>
                    <span className="text-amber-300 font-extrabold tracking-wide uppercase">
                      🔥 {campaign.badge || "CHỈ HÔM NAY"}:
                    </span>
                    <span className="text-white drop-shadow-xs font-bold">
                      {campaign.title || "Miễn phí 100% ship nội khu Vinhomes Ocean Park"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── KHỐI CHIA SẺ & ĐẠI SỨ BẾP YẾN (TINH GỌN 1 HÀNG DUY NHẤT) ── */}
        {affiliateEnabled && (
          <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-[#2D1408] via-[#4A1D0B] to-[#2D1408] border border-amber-400/40 text-amber-100 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm shrink-0">🤝</span>
              <span className="text-[11px] font-bold text-amber-200 truncate">
                Đại sứ Bếp Yến: Nhận {commission.toLocaleString("vi-VN")}đ/hũ
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="tap-active px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs flex items-center gap-1 cursor-pointer transition hover:brightness-105"
                style={{
                  background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
                  color: "var(--red-deep)",
                }}
              >
                <span>{copiedLink ? "✓ Đã Chép" : "📋 Chép link"}</span>
              </button>
              <button
                type="button"
                onClick={handleShareZalo}
                className="tap-active px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>💬 Zalo</span>
              </button>
            </div>
          </div>
        )}

        {/* ── CHI TIẾT HƯƠNG VỊ & DƯỢC TÍNH (GOM GỌN GÀNG, SANG TRỌNG, KHÔNG CUỘN MỎI TAY) ── */}
        <div
          className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-4.5 shadow-2xs border space-y-2.5"
          style={{ background: "#FFFDF9", borderColor: "rgba(201,168,76,0.45)" }}
        >
          {/* Tiêu đề mục tinh giản */}
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
            <h2 className="text-xs sm:text-sm font-black font-heading text-red-950 flex items-center gap-1.5">
              <span>🍲</span>
              <span>Hương Vị Ngự Thiện & Dược Tính</span>
            </h2>
            <span className="text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300/50">
              Chưng cách thủy mẻ nhỏ
            </span>
          </div>

          {/* Mô tả hương vị súc tích */}
          {product.description && (
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
              "{product.description}"
            </p>
          )}

          {/* Gom Thành phần & Công dụng vào khối mini gọn gàng */}
          <div className="pt-1.5 border-t border-amber-900/10 space-y-2 text-xs">
            {/* Thành phần */}
            {Array.isArray((product as any).ingredients) && (product as any).ingredients.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-stone-500 font-bold shrink-0 text-[11px] sm:text-xs mt-0.5">🌿 Thành phần:</span>
                <div className="flex flex-wrap gap-1">
                  {(product as any).ingredients.map((ing: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50/80 text-stone-800 border border-amber-200/80"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Công dụng bồi bổ */}
            {Array.isArray((product as any).benefits) && (product as any).benefits.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-stone-500 font-bold shrink-0 text-[11px] sm:text-xs mt-0.5">✨ Công dụng:</span>
                <div className="space-y-1 flex-1">
                  {(product as any).benefits.map((b: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-1 text-[11px] sm:text-xs text-stone-800 leading-snug font-medium">
                      <span className="text-amber-600 font-bold shrink-0">✦</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── CẢM NHẬN THỰC TẾ TỪ CƯ DÂN VINHOMES OCEAN PARK (FACEBOOK) ── */}
        <ResidentReviewsFB
          productTitle={product.title}
          productSlug={product.slug}
          category={(product as any).category}
        />

        {/* ── MÓN YẾN CÙNG VỊ GỢI Ý DÙNG KÈM ─────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-950 font-heading">
                Gợi Ý Dùng Kèm
              </h3>
              <Link href="/" className="text-[11px] font-bold text-red-900 underline">
                Xem tất cả ➔
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/san-pham/${rp.slug}`}
                  className="rounded-2xl p-2.5 bg-white border border-amber-900/10 shadow-2xs hover:shadow-md transition flex items-center gap-2.5"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-amber-50">
                    <Image
                      src={rp.image || "/images/product-duong-phen.jpg"}
                      alt={rp.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 truncate font-heading">
                      {rp.title}
                    </h4>
                    <span className="text-xs font-black text-red-900 block mt-0.5">
                      {formatPrice(rp.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── STICKY BOTTOM ACTION BAR (CỐ ĐỊNH Ở ĐÁY) ───────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 border-t border-amber-900/15 backdrop-blur-md py-3 px-4 shadow-xl">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div className="leading-tight shrink-0">
            <span className="text-[10px] text-stone-500 block uppercase font-bold">Tổng tiền</span>
            <span className="text-lg sm:text-xl font-black text-red-950 font-heading">
              {formatPrice(currentPrice)}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-sm justify-end">
            <button
              type="button"
              onClick={handleAddToCart}
              className="tap-active py-3 px-3.5 rounded-2xl text-xs font-bold border transition shadow-xs flex items-center justify-center gap-1.5"
              style={{
                background: added ? "#15803D" : "#FEF3C7",
                color: added ? "#FFFFFF" : "#78350F",
                borderColor: added ? "#166534" : "#F59E0B",
              }}
            >
              <span>{added ? "✓" : "🫙"}</span>
              <span>{added ? "Đã Thêm Khay!" : "Thêm Vào Khay"}</span>
            </button>

            <button
              type="button"
              onClick={handleOrderNow}
              className="tap-active flex-1 py-3 px-4 rounded-2xl text-xs font-black text-white shadow-lg transition hover:scale-[1.02] flex items-center justify-center gap-1.5"
              style={{
                background: "linear-gradient(135deg, var(--red-primary), var(--red-deep))",
                boxShadow: "0 4px 16px rgba(114, 22, 26, 0.35)",
              }}
            >
              <span>🛵</span>
              <span>Đặt Giao Nóng ➔</span>
            </button>
          </div>
        </div>
      </div>

      {/* Order Modal (Khay ngự thiện) */}
      <OrderModal />

      {/* Trợ lý AI Bếp Yến */}
      <AIChatBot />

      {/* Rạp Phim Thước Phim Huyền Thoại Sâu Tây Tạng */}
      {isVIP && vipProd && (
        <VIPTibetanCinemaModal
          isOpen={showCinemaModal}
          onClose={() => setShowCinemaModal(false)}
          vipProduct={vipProd}
          initialStep="trailer"
        />
      )}

      {/* Popup Thể Lệ & Hướng Dẫn Tham Gia Đại Sứ Affiliate */}
      <AffiliateGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        settings={affiliateSettings}
        onSelectInput={() => {
          codeInputRef.current?.focus();
          codeInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
      />
    </div>
  );
}
