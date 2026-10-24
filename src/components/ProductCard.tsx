"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { getProductSlug } from "@/data/products";
import { useOrder } from "@/context/OrderContext";

type Props = {
  product: Product;
  onSelect?: (product: Product) => void;
};

function getCategoryGlyph(category: string, title: string): string {
  if (title.includes("Tổ Yến") || category.includes("tổ")) return "🪺";
  if (title.includes("Đông Trùng") || category.includes("đông trùng")) return "🌿";
  if (title.includes("Hạt Sen") || title.includes("Táo Đỏ") || category.includes("táo đỏ")) return "🌺";
  if (title.includes("Kỷ Tử") || title.includes("Nhãn Nhục") || category.includes("kỷ tử")) return "🍒";
  if (title.includes("Set") || title.includes("Quà") || category.includes("quà")) return "🎁";
  if (title.includes("Đường Phèn") || category.includes("đường phèn")) return "🫙";
  return "🫙";
}

function getProductSeal(category: string, title: string): string {
  if (title.includes("Tổ Yến Rút Lông") || title.includes("Loại To")) return "NGỰ PHẨM";
  if (title.includes("Tổ Yến") || category.includes("tổ")) return "NGUYÊN BẢN";
  if (title.includes("12%")) return "THƯỢNG HẠNG";
  if (title.includes("Đông Trùng") || category.includes("đông trùng")) return "ĐẠI BỔ";
  if (title.includes("Hạt Sen") || category.includes("táo đỏ")) return "DƯỠNG TÂM";
  if (title.includes("Kỷ Tử") || category.includes("kỷ tử")) return "BỔ HUYẾT";
  if (title.includes("Set") || category.includes("quà")) return "HOÀNG GIA";
  return "BỔ PHẾ";
}

export default function ProductCard({ product }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, items, updateQty } = useOrder();

  const [selectedVol, setSelectedVol] = useState<string>(() => {
    if (product.volumeOptions && product.volumeOptions.length > 0) {
      return product.volumeOptions[0].volume;
    }
    return product.volume;
  });

  const currentVolOption = product.volumeOptions?.find((v) => v.volume === selectedVol);
  const currentPrice = currentVolOption ? currentVolOption.price : product.price;
  const currentOriginalPrice = currentVolOption?.originalPrice || product.originalPrice;

  // Key line-item trong giỏ hàng: nếu có chọn dung tích thì phân biệt theo dung tích
  const itemKey = `${product.id}-${selectedVol.replace(/\s+/g, "")}`;
  const cartItem = items.find((i) => i.key === itemKey);
  const quantity = cartItem ? cartItem.qty : 0;

  const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "đ";

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      key: itemKey,
      productId: product.id,
      title: product.title,
      volume: selectedVol,
      unitPrice: currentPrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Khi bấm mua ở mặt sau thẻ: thêm vào giỏ và tự động lật lại mặt trước
  const handleAddFromBack = (e: React.MouseEvent) => {
    handleAdd(e);
    setTimeout(() => {
      setIsFlipped(false);
    }, 900);
  };

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const seal = getProductSeal(product.category, product.title);
  const glyph = getCategoryGlyph(product.category, product.title);
  const imageUrl = product.image || "/images/product-duong-phen.jpg";
  const slug = product.slug || getProductSlug(product.id);

  return (
    <div
      className={`flip-card w-full text-left transition-all h-[395px] sm:h-[425px] ${
        isFlipped ? "is-flipped" : ""
      }`}
      style={{
        outline: "none",
      }}
    >
      <div className="flip-card-inner">
        {/* ══════════════════════════════════════════════════════════
            MẶT TRƯỚC (FRONT) - ẢNH SẢN PHẨM THỰC TẾ + THÔNG TIN NHANH
            ══════════════════════════════════════════════════════════ */}
        <div
          className="flip-card-front parchment-card corner-ornament flex flex-col justify-between p-3 sm:p-3.5 rounded-2xl transition-all group shadow-sm hover:shadow-md"
        >
          {/* 1. KHUNG ẢNH SẢN PHẨM SẮC NÉT (TỶ LỆ VUÔNG 1:1 CHUẨN THƯƠNG MẠI - KHÔNG MÉO) */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-amber-900/15 bg-amber-50/50 flex-shrink-0 shadow-inner">
            <Link
              href={`/san-pham/${slug}`}
              className="block w-full h-full relative"
              title={`Xem chi tiết & đặt ${product.title}`}
            >
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 50vw, 320px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              {/* Lớp bóng đổ nhẹ ở góc ảnh */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25 pointer-events-none" />
            </Link>

            {/* Triện son hoàng gia đè trên góc trái ảnh */}
            <div className="absolute top-2 left-2 z-10 pointer-events-none">
              <span className="imperial-seal px-2 py-0.5 text-[8px] sm:text-[9px] shadow-md">
                {seal}
              </span>
            </div>

            {/* Nút lật xem dược tính đè góc phải ảnh */}
            <div className="absolute top-2 right-2 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsFlipped(true);
                }}
                className="tap-active text-[9px] font-bold px-2.5 py-1 rounded-full border border-amber-400/50 flex items-center gap-1 text-white bg-black/60 backdrop-blur-xs shadow-md hover:bg-black/80 transition"
                title="Bấm để lật xem dược tính & thành phần"
              >
                <span>Dược Tính</span>
                <span className="text-[10px]">↻</span>
              </button>
            </div>

            {/* Badge nổi bật (nếu có) */}
            {product.badge && (
              <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md text-white shadow-sm tracking-wide ${
                    product.badgeColor || "bg-red-700"
                  }`}
                >
                  {product.badge}
                </span>
              </div>
            )}

            {/* Dung tích đang chọn */}
            <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-amber-200 backdrop-blur-xs">
                {selectedVol}
              </span>
            </div>
          </div>

          {/* 2. THÔNG TIN SẢN PHẨM & BỘ CHỌN DUNG TÍCH (GỌN GÀNG, KHOA HỌC) */}
          <div className="flex-1 flex flex-col justify-between my-2 text-left min-h-0">
            <div>
              <Link
                href={`/san-pham/${slug}`}
                className="hover:text-red-800 transition block group/title"
                title={`Xem chi tiết ${product.title}`}
              >
                <h3 className="font-extrabold text-xs sm:text-sm leading-snug line-clamp-2 font-heading text-stone-900 group-hover/title:text-red-800 transition-colors">
                  {product.title}
                </h3>
              </Link>

              {/* CÔNG DỤNG BỒI BỔ THEO NHU CẦU - TO RÕ, DỄ NHÌN, CHỌN NHANH */}
              <div className="mt-1.5 p-1.5 sm:p-2 rounded-xl bg-amber-900/5 border border-amber-900/10">
                <p className="text-[11px] sm:text-xs font-semibold text-amber-950 leading-snug line-clamp-2">
                  <span className="text-amber-700 font-black mr-1">✦</span>
                  <span className="text-stone-700">
                    {product.subtitle || (product.benefits ? product.benefits[0] : "")}
                  </span>
                </p>
              </div>
            </div>

            {/* THANH CHỌN DUNG TÍCH (75ml · 100ml · 150ml · 200ml) */}
            {product.volumeOptions && product.volumeOptions.length > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="mt-2 pt-1.5 border-t border-amber-900/10 flex items-center justify-between gap-1"
              >
                <span className="text-[9px] font-bold text-amber-950 shrink-0">Dung tích:</span>
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                  {product.volumeOptions.map((v) => {
                    const isSel = v.volume === selectedVol;
                    return (
                      <button
                        key={v.volume}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVol(v.volume);
                        }}
                        className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold transition-all border cursor-pointer ${
                          isSel
                            ? "bg-red-900 text-amber-100 border-red-950 shadow-2xs scale-105"
                            : "bg-amber-100/60 text-stone-700 hover:bg-amber-200/70 border-amber-300/60"
                        }`}
                        title={`Dung tích ${v.volume} - ${formatPrice(v.price)}`}
                      >
                        {v.volume.replace("Hũ ", "")}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-1.5 text-[9px] text-stone-500 font-medium">
                <span>Quy cách: {product.volume}</span>
              </div>
            )}
          </div>

          {/* 3. DÒNG GIÁ & NÚT CHỌN MUA */}
          <div className="flex items-center justify-between pt-1.5 border-t border-amber-800/15 w-full mt-0.5 gap-2">
            <div>
              <span
                className="text-sm sm:text-base font-black tracking-tight"
                style={{ color: "var(--red-primary)" }}
              >
                {formatPrice(currentPrice)}
              </span>
              {currentOriginalPrice && (
                <span className="text-[10px] line-through ml-1 text-stone-400">
                  {formatPrice(currentOriginalPrice)}
                </span>
              )}
            </div>

            {quantity > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center h-8 sm:h-9 bg-amber-50/95 rounded-xl border border-amber-400/90 p-0.5 shadow-2xs shrink-0"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQty(itemKey, quantity - 1);
                  }}
                  className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-lg bg-white text-stone-800 hover:bg-stone-100 flex items-center justify-center font-black text-xs sm:text-sm shadow-2xs border border-stone-200 active:scale-90 transition cursor-pointer"
                  title="Bớt 1 hũ"
                >
                  －
                </button>

                <span className="px-1.5 sm:px-2 font-black text-xs sm:text-sm text-red-950 min-w-[20px] sm:min-w-[24px] text-center">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQty(itemKey, quantity + 1);
                  }}
                  className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-lg bg-red-900 text-amber-200 hover:bg-red-800 flex items-center justify-center font-black text-xs sm:text-sm shadow-2xs border border-red-950 active:scale-90 transition cursor-pointer"
                  title="Thêm 1 hũ"
                >
                  ＋
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={product.inStock ? handleAdd : undefined}
                disabled={!product.inStock}
                className={`tap-active h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-black shadow-xs flex items-center justify-center gap-1 transition-all border shrink-0 whitespace-nowrap ${
                  !product.inStock
                    ? "bg-stone-200 text-stone-500 cursor-not-allowed border-stone-300"
                    : added
                    ? "bg-emerald-700 text-white border-emerald-600 scale-95"
                    : "bg-gradient-to-r from-red-800 to-red-900 text-amber-100 hover:from-red-700 hover:to-red-800 border-amber-600/40 hover:scale-[1.02]"
                }`}
                title={product.inStock ? "Chọn mua hũ yến này" : "Tạm hết nguyên liệu"}
              >
                {!product.inStock ? "Tạm Hết" : added ? "✓ Đã Thêm" : "＋ Mua"}
              </button>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            MẶT SAU (BACK) - CHI TIẾT DƯỢC TÍNH & THÀNH PHẦN KÈM HÌNH
            ══════════════════════════════════════════════════════════ */}
        <div
          className="flip-card-back flex flex-col justify-between p-3.5 shadow-md rounded-2xl overflow-hidden"
          style={{
            background: "var(--paper)",
            border: "1.5px solid var(--gold)",
          }}
        >
          {/* Header mặt sau có ảnh thumbnail nhỏ - Chạm vào là lật lại mặt trước ngay */}
          <div
            onClick={() => setIsFlipped(false)}
            className="flex items-center gap-2 pb-2 border-b border-amber-900/10 cursor-pointer hover:bg-black/5 -m-1 p-2 rounded-xl transition"
            title="Chạm để đóng bảng dược tính (xem lại ảnh)"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0 border border-amber-500/30">
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <span
                className="text-[9px] font-black tracking-wider uppercase block"
                style={{ color: "var(--gold)" }}
              >
                ✦ DƯỢC TÍNH ĐÔNG Y ✦
              </span>
              <h4
                className="font-extrabold text-xs sm:text-sm leading-tight font-heading truncate text-red-950"
              >
                {product.title}
              </h4>
              <p className="text-[10px] text-stone-500 flex items-center gap-1 font-medium">
                <span className="text-amber-900 font-bold">{selectedVol}</span>
                <span>· Chạm để lật lại</span>
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="px-2.5 py-1.5 rounded-full text-xs font-black text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 border border-stone-300 flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer"
              title="Đóng bảng dược tính"
            >
              <span>✕</span>
              <span>Đóng</span>
            </button>
          </div>

          {/* Nội dung chi tiết - Chữ to rõ ràng, dễ đọc, không bị bé */}
          <div className="flex-1 overflow-y-auto thin-scroll py-2.5 space-y-2.5">
            {/* Thành phần ngự chưng */}
            <div className="bg-amber-950/5 rounded-xl p-2.5 border border-amber-900/10">
              <p className="font-extrabold text-xs text-amber-950 uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>🌿</span>
                <span>Thành phần ngự chưng:</span>
              </p>
              <ul className="text-xs sm:text-[13px] text-stone-800 space-y-1 font-medium">
                {product.ingredients.map((ing, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Công dụng bồi bổ */}
            <div className="bg-amber-950/5 rounded-xl p-2.5 border border-amber-900/10">
              <p className="font-extrabold text-xs text-red-950 uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>✨</span>
                <span>Công dụng bồi bổ:</span>
              </p>
              <ul className="text-xs sm:text-[13px] text-stone-800 space-y-1 font-medium">
                {product.benefits.map((ben, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-amber-600 font-bold shrink-0">✦</span>
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nút thêm vào giỏ mặt sau */}
          <div className="pt-2 border-t border-amber-900/10 flex items-center gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsFlipped(false)}
              className="h-9.5 px-3 rounded-xl text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 shrink-0 flex items-center gap-1 shadow-2xs active:brightness-90 cursor-pointer"
              title="Quay lại xem ảnh sản phẩm"
            >
              <span>←</span>
              <span>Xem Ảnh</span>
            </button>

            {quantity > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-between h-9.5 bg-amber-50 rounded-xl border border-amber-400/80 p-0.5 shadow-2xs"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQty(itemKey, quantity - 1);
                  }}
                  className="w-8 h-8 rounded-lg bg-white text-stone-800 hover:bg-stone-100 flex items-center justify-center font-black text-sm shadow-2xs border border-stone-200 active:brightness-90 cursor-pointer"
                  title="Bớt 1 hũ"
                >
                  －
                </button>

                <span className="px-2 font-black text-xs text-red-950 text-center">
                  Đã chọn {quantity} hũ
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQty(itemKey, quantity + 1);
                  }}
                  className="w-8 h-8 rounded-lg bg-red-900 text-amber-200 hover:bg-red-800 flex items-center justify-center font-black text-sm shadow-2xs border border-red-950 active:brightness-90 cursor-pointer"
                  title="Thêm 1 hũ"
                >
                  ＋
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={product.inStock ? handleAddFromBack : undefined}
                disabled={!product.inStock}
                className="flex-1 h-9.5 px-2 rounded-xl text-[11px] sm:text-xs font-black text-white shadow-md transition-all text-center flex items-center justify-center gap-1 active:brightness-90 cursor-pointer whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, var(--red-primary), var(--red-deep))",
                }}
              >
                ＋ Thêm Vào Khay ({selectedVol.replace("Hũ ", "")} · {formatPrice(currentPrice)})
              </button>
            )}
          </div>
          </div>
        </div>
      </div>
    );
  }
