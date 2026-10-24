"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { VIP_PRODUCT as DEFAULT_VIP, type VIPProduct } from "@/data/products";
import { useOrder } from "@/context/OrderContext";
import VIPTibetanCinemaModal from "@/components/VIPTibetanCinemaModal";

export default function VIPProductCard() {
  const [vipProduct, setVipProduct] = useState<VIPProduct>(DEFAULT_VIP);
  const [selectedFlavorId, setSelectedFlavorId] = useState<number>(1);
  const [worms, setWorms] = useState<1 | 2>(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [added, setAdded] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [cinemaStep, setCinemaStep] = useState<"trailer" | "order">("trailer");

  const { addItem, openTray } = useOrder();

  useEffect(() => {
    let isMounted = true;
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.vip_product) {
          setVipProduct(data.vip_product);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedFlavor =
    vipProduct.baseFlavors.find((f) => f.id === selectedFlavorId) ||
    vipProduct.baseFlavors[0] ||
    { id: 1, name: "Đường Phèn Thanh Mát", price: 80000 };
  const wormPrice = vipProduct.wormPrice || 400000;
  const wormTotal = worms * wormPrice;
  const unitPrice = selectedFlavor.price + wormTotal;

  const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "đ";

  const handleOpenTrailer = () => {
    setCinemaStep("trailer");
    setIsCinemaOpen(true);
  };

  const handleOpenQuickOrder = () => {
    setCinemaStep("order");
    setIsCinemaOpen(true);
  };

  const handleAddQuick = () => {
    const key = `vip-${selectedFlavorId}-${worms}`;
    const extras = `Sâu đông trùng Tây Tạng × ${worms} con (+${formatPrice(wormTotal)})`;
    addItem({
      key,
      productId: 0,
      title: `Yến Thượng Hạng · ${selectedFlavor.name}`,
      volume: "Hũ Ngự Phẩm VIP",
      unitPrice,
      extras,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openTray();
    }, 800);
  };

  const vipImage = vipProduct.image || "/images/product-vip-sau.jpg";

  return (
    <>
      <div className="relative rounded-3xl overflow-hidden border border-amber-400/80 shadow-xl mb-6 bg-gradient-to-b from-[#2E070B] via-[#1D0306] to-[#0D0102] text-[#F9F5EA] group">
        {/* Hào quang vàng kim lấp lánh chạy dọc viền */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-90" />
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 via-yellow-300/15 to-amber-600/10 rounded-3xl blur-md pointer-events-none" />

        {/* ── CARD CONTENT ───────────────────────────────────── */}
        <div className="relative p-3.5 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Cụm Thông Tin & Ảnh */}
          <div className="flex items-center gap-3.5 sm:gap-4 w-full md:w-auto">
            {/* Ảnh đại bổ Tây Tạng - Bấm là kích hoạt rạp phim */}
            <div
              onClick={handleOpenTrailer}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-lg flex-shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
              title="Nhấn để xem thước phim huyền thoại Sâu Tây Tạng"
            >
              <Image
                src={vipImage}
                alt={vipProduct.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />

              {/* Nút Play nhỏ trên ảnh */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-400/90 text-red-950 flex items-center justify-center text-xs font-black shadow-md">
                  ▶
                </span>
              </div>

              {/* Tag VIP */}
              <div className="absolute top-0 right-0 bg-red-800 text-amber-200 text-[8px] font-black px-1.5 py-0.2 rounded-bl">
                VIP
              </div>
            </div>

            {/* Thông tin chữ & Câu chuyện kích thích tò mò */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-red-950 uppercase tracking-wider shadow-xs">
                  👑 CỰC PHẨM NGỰ THIỆN
                </span>
                <span className="text-[10px] text-amber-300/90 font-serif font-bold">
                  Sâu Tây Tạng 400k/Con
                </span>
              </div>

              <h3
                onClick={handleOpenTrailer}
                className="text-sm sm:text-lg font-black font-heading text-amber-100 hover:text-amber-300 transition cursor-pointer line-clamp-1"
                title="Bấm để xem thước phim câu chuyện sâu đông trùng"
              >
                {vipProduct.title}
              </h3>

              <p className="text-[11px] text-stone-300 line-clamp-1 sm:line-clamp-2 mt-0.5 font-light">
                Ấu trùng ngậm tuyết Himalaya 4.500m · Đại bổ nguyên khí, hồi sinh thể trạng sau phẫu thuật.
              </p>
            </div>
          </div>

          {/* Cụm Giá & 2 Nút Bấm Hành Động */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 border-amber-500/20 pt-2.5 md:pt-0">
            <div className="text-left md:text-right">
              <span className="text-[10px] text-amber-200/70 block uppercase font-bold">
                Trọn hũ từ
              </span>
              <span className="text-base sm:text-xl font-black text-amber-300 font-heading">
                {formatPrice(unitPrice)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* NÚT 1: XEM THƯỚC PHIM ĐIỆN ẢNH (CHÍNH - ĐÁNH MẠNH CẢM XÚC) */}
              <button
                type="button"
                onClick={handleOpenTrailer}
                className="tap-active h-10 px-3.5 sm:px-4 rounded-xl text-xs font-black shadow-lg border border-amber-400/80 bg-gradient-to-r from-[#881318] via-[#B91C1C] to-[#881318] text-amber-200 hover:brightness-110 flex items-center gap-1.5 transition cursor-pointer active:scale-95 shrink-0 animate-pulse"
                title="Xem thước phim điện ảnh câu chuyện sâu Tây Tạng 400k"
              >
                <span className="text-sm">🎬</span>
                <span>Xem Phim (14s)</span>
              </button>

              {/* NÚT 2: ĐẶT NHANH (CHO KHÁCH VỘI) */}
              <button
                type="button"
                onClick={handleOpenQuickOrder}
                className="tap-active h-10 px-3.5 sm:px-4 rounded-xl text-xs font-black shadow-lg bg-gradient-to-r from-amber-400 to-amber-500 text-red-950 hover:brightness-110 flex items-center gap-1 transition cursor-pointer active:scale-95 shrink-0"
                title="Bấm để chọn vị cốt và đặt ngay"
              >
                <span>＋ Đặt Ngay</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dải chân cam kết ngắn gọn */}
        <div className="px-4 py-1.5 bg-black/40 border-t border-amber-500/20 flex items-center justify-between text-[10px] text-amber-200/80">
          <span className="flex items-center gap-1 font-medium">
            <span className="text-amber-400">♨️</span> Chưng mẻ riêng cách thủy · Giao nóng 20–30P
          </span>
          <Link
            href="/san-pham/yen-thuong-hang-sau-dong-trung-nguyen-con"
            className="font-bold underline text-amber-300 hover:text-white transition"
          >
            Xem trang chi tiết ↗
          </Link>
        </div>
      </div>

      {/* RẠP PHIM ĐIỆN ẢNH & MODAL ĐẶT HÀNG NGỰ PHẨM */}
      <VIPTibetanCinemaModal
        isOpen={isCinemaOpen}
        onClose={() => setIsCinemaOpen(false)}
        vipProduct={vipProduct}
        initialStep={cinemaStep}
      />
    </>
  );
}
