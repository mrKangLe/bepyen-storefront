"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useOrder } from "@/context/OrderContext";
import { getProductSlug } from "@/data/products";

interface RawNestProduct {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  price: number;
  originalPrice: number;
  volume: string;
  badge: string;
  badgeType: "gold" | "silver" | "emerald";
  seal: string;
  specs: {
    weight: string;
    quantity: string;
    bloomRate: string;
    targetUser: string;
  };
  gifts: string[];
  benefits: string[];
}

const RAW_NESTS: RawNestProduct[] = [
  {
    id: 11,
    title: "Tổ Yến Rút Lông Định Hình Hoàng Gia",
    subtitle: "Tai yến già nguyên tổ đảo tự nhiên tuyển trạch, sợi dài nở bung gấp 4-5 lần",
    category: "Yến tổ thượng hạng",
    price: 4600000,
    originalPrice: 5200000,
    volume: "Hộp 100g (10-12 tai yến to)",
    badge: "LOẠI TO 100G",
    badgeType: "gold",
    seal: "NGỰ PHẨM",
    specs: {
      weight: "100 gram chuẩn định lượng",
      quantity: "10 – 12 tai yến to già nguyên vẹn",
      bloomRate: "Nở bung gấp 4 – 5 lần sợi dầy sần sật",
      targetUser: "Bồi bổ đại phục hồi, biếu tặng đối tác & phụ mẫu",
    },
    gifts: [
      "Hộp sơn mài đỏ lụa vàng lót nhung cao cấp",
      "Thố chưng sứ hoàng gia viền kim",
      "Táo đỏ Tân Cương thượng hạng & đường phèn kết tinh",
      "Nhíp inox y tế chuyên dụng gắp sạch tơ",
      "Cẩm nang ngự y bí truyền canh giờ chưng yến",
    ],
    benefits: [
      "Bổ phế dưỡng âm, phục hồi nguyên khí thần tốc",
      "Chống lão hóa, bổ sung collagen tái tạo làn da",
      "Tăng cường đề kháng tự nhiên cho người lớn tuổi",
    ],
  },
  {
    id: 12,
    title: "Tổ Yến Tinh Chế Sợi Dài Thượng Hạng",
    subtitle: "Tai yến sạch lông trắng ngà tinh tuyển, tiện lợi ngâm nở chưng ngay tại gia",
    category: "Yến tổ thượng hạng",
    price: 2400000,
    originalPrice: 2800000,
    volume: "Hộp 50g (5-6 tai yến)",
    badge: "LOẠI NHỎ 50G",
    badgeType: "silver",
    seal: "NGUYÊN BẢN",
    specs: {
      weight: "50 gram chuẩn định lượng",
      quantity: "5 – 6 tai yến tinh chế tiêu chuẩn",
      bloomRate: "Nở bung gấp 3 – 4 lần, sạch lông 100%",
      targetUser: "Gia đình nhỏ 2-3 người dùng bồi bổ đều đặn 1-2 tháng",
    },
    gifts: [
      "Hộp cứng phủ gấm vàng trang nhã",
      "Táo đỏ Tân Cương thơm ngọt thanh",
      "Đường phèn kim cương tinh khiết",
      "Cẩm nang phương pháp chưng cách thủy chuẩn ngự y",
    ],
    benefits: [
      "Đã làm sạch lông 100%, chỉ cần ngâm nở chưng ngay 20 phút",
      "Dồi dào 18 acid amin & 31 nguyên tố vi lượng",
      "An thần dễ ngủ, bồi bổ trí lực và thể lực",
    ],
  },
  {
    id: 13,
    title: "Tổ Yến Baby Viên Chia Sẵn Tiện Lợi",
    subtitle: "Chia sẵn từng viên định lượng 1 lần chưng, tối ưu cho bé ăn dặm & người bận rộn",
    category: "Yến tổ thượng hạng",
    price: 1750000,
    originalPrice: 2100000,
    volume: "Hộp 50g (10-12 viên baby)",
    badge: "CHO BÉ & CẢ NHÀ",
    badgeType: "emerald",
    seal: "BẢO AN",
    specs: {
      weight: "50 gram (10 – 12 viên)",
      quantity: "1 viên = 1 lần chưng chuẩn định lượng",
      bloomRate: "Sợi mềm dịu dàng, bé cực kỳ thích ăn",
      targetUser: "Bé ăn dặm từ 1 tuổi, mẹ bầu & người bận rộn cần ăn nhanh",
    },
    gifts: [
      "Hộp bảo quản kín khí chuyên dụng",
      "Táo đỏ thái lát tiện lợi",
      "Đường phèn hạt nhỏ vừa khẩu vị bé",
      "Hướng dẫn thực đơn ăn yến chuẩn khoa học cho bé",
    ],
    benefits: [
      "Mỗi lần dùng chỉ cần thả đúng 1 viên vào thố chưng, không lo lãng phí",
      "Kích thích tiêu hóa, hấp thu dinh dưỡng tối đa cho trẻ nhỏ",
      "Tiết kiệm chi phí bồi bổ hàng ngày",
    ],
  },
];

export default function RawNestSection() {
  const { addItem, items, updateQty } = useOrder();
  const [addedId, setAddedId] = useState<number | null>(null);

  const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "đ";

  const handleAdd = (item: RawNestProduct) => {
    addItem({
      key: `nest-${item.id}`,
      productId: item.id,
      title: item.title,
      volume: item.volume,
      unitPrice: item.price,
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  return (
    <section id="yen-to" className="py-2">
      {/* Royal Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="imperial-seal px-3 py-0.5 text-[11px] tracking-widest">
            TRẤN CUNG BẢO VẬT
          </span>
        </div>

        <h2
          className="text-2xl sm:text-3xl font-extrabold font-heading tracking-wide"
          style={{ color: "var(--red-primary)" }}
        >
          Hoàng Gia Ngự Phẩm · Tổ Yến Thô & Tinh Chế
        </h2>

        <p
          className="text-xs sm:text-sm mt-2 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--ink-light)" }}
        >
          Tuyển trạch từ những vách đá đảo yến tự nhiên · Rút lông khô giữ trọn 31 nguyên tố vi chất quý hiếm · Tặng trọn bộ phụ kiện & thố sứ ngự y để tự tay chưng tươi tại gia
        </p>

        {/* 3 Đại Cam Kết Hoàng Gia */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-5 text-[11px] font-bold">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 shadow-xs">
            <span className="text-red-700">✦</span>
            <span>100% Tổ Yến Đảo Tự Nhiên</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 shadow-xs">
            <span className="text-red-700">✦</span>
            <span>Không Tẩy Trắng · Không Độn Mủ Trôm</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 shadow-xs">
            <span className="text-red-700">✦</span>
            <span>Bồi Hoàn 500% Nếu Pha Trộn</span>
          </div>
        </div>

        <div className="eastern-divider max-w-xs mx-auto mt-4 opacity-50">
          <span className="text-xs">✦</span>
        </div>
      </div>

      {/* 3 Luxury Cards List */}
      <div className="grid grid-cols-1 gap-5">
        {RAW_NESTS.map((item) => {
          const isAdded = addedId === item.id;
          const isTopTier = item.id === 11;
          const itemKey = `nest-${item.id}`;
          const currentItem = items.find((i) => i.key === itemKey);
          const quantity = currentItem ? currentItem.qty : 0;

          return (
            <div
              key={item.id}
              className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                isTopTier
                  ? "lacquer-wood-card corner-ornament shadow-xl md:-translate-y-2"
                  : "parchment-card shadow-md hover:shadow-lg"
              }`}
              style={{
                border: isTopTier
                  ? "2px solid #C59B27"
                  : "1px solid #DFD5C0",
                background: isTopTier
                  ? "linear-gradient(180deg, #2D080A 0%, #1A0405 100%)"
                  : "linear-gradient(180deg, #FFFDF8 0%, #F9F3E5 100%)",
                color: isTopTier ? "#F9F5EA" : "var(--ink)",
              }}
            >
              {/* Badge & Seal Header */}
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase ${
                      isTopTier
                        ? "bg-amber-400 text-red-950 shadow-xs font-black"
                        : "bg-red-900/10 text-red-900 border border-red-900/20"
                    }`}
                  >
                    {item.badge}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 border ${
                      isTopTier
                        ? "border-amber-400/60 text-amber-300"
                        : "border-red-800 text-red-800 bg-red-50"
                    }`}
                  >
                    [{item.seal}]
                  </span>
                </div>

                {/* Ảnh Tổ Yến Thực Tế */}
                <Link
                  href={`/san-pham/${getProductSlug(item.id)}`}
                  className="block relative w-full h-40 sm:h-44 rounded-xl overflow-hidden mb-3 border border-amber-400/30 shadow-inner group/raw"
                  title={`Xem chi tiết ${item.title}`}
                >
                  <Image
                    src="/images/product-to-yen.jpg"
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/raw:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {item.volume}
                  </div>
                </Link>

                <div>
                  <Link
                    href={`/san-pham/${getProductSlug(item.id)}`}
                    className="block group/title"
                    title={`Xem chi tiết ${item.title}`}
                  >
                    <h3
                      className={`text-base sm:text-lg font-bold font-heading leading-tight transition-colors ${
                        isTopTier ? "text-amber-200 group-hover/title:text-amber-300" : "text-red-950 group-hover/title:text-red-700"
                      }`}
                    >
                      {item.title}
                    </h3>
                  </Link>
                  <p
                    className={`text-xs mt-1 leading-snug ${
                      isTopTier ? "text-amber-100/70" : "text-gray-600"
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>

                {/* Pricing Block */}
                <div className="mt-4 pt-3 border-t border-dashed border-amber-900/20 flex items-baseline gap-2.5">
                  <span
                    className={`text-2xl font-black ${
                      isTopTier ? "text-amber-300" : "text-red-800"
                    }`}
                  >
                    {formatPrice(item.price)}
                  </span>
                  <span
                    className={`text-xs line-through ${
                      isTopTier ? "text-amber-200/40" : "text-gray-400"
                    }`}
                  >
                    {formatPrice(item.originalPrice)}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-700 text-white ml-auto">
                    Tiết kiệm {formatPrice(item.originalPrice - item.price)}
                  </span>
                </div>

                {/* Specifications table */}
                <div
                  className={`mt-4 p-3 rounded-xl text-xs space-y-1.5 ${
                    isTopTier
                      ? "bg-amber-950/40 border border-amber-500/20 text-amber-100/90"
                      : "bg-[#F3EDE0]/80 border border-[#E2D8C3] text-gray-800"
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="opacity-70">Quy cách:</span>
                    <span className="font-bold">{item.specs.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Số lượng:</span>
                    <span className="font-bold">{item.specs.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Độ nở:</span>
                    <span className="font-bold">{item.specs.bloomRate}</span>
                  </div>
                  <div className="pt-1 border-t border-amber-500/10 text-[11px] leading-tight opacity-90">
                    <span className="font-semibold text-amber-600 dark:text-amber-400">Phù hợp: </span>
                    {item.specs.targetUser}
                  </div>
                </div>

                {/* Gifts included */}
                <div className="mt-4">
                  <p
                    className={`text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                      isTopTier ? "text-amber-300" : "text-red-900"
                    }`}
                  >
                    <span>🎁</span>
                    <span>Tặng kèm trọn bộ ngự thiện:</span>
                  </p>
                  <ul className="text-xs space-y-1">
                    {item.gifts.map((gift, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-1.5 leading-snug ${
                          isTopTier ? "text-amber-100/80" : "text-gray-700"
                        }`}
                      >
                        <span className="text-amber-500 flex-shrink-0 mt-0.5">✔</span>
                        <span>{gift}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-3">
                {quantity > 0 ? (
                  <div className="flex items-center justify-between h-12 bg-amber-50 rounded-xl border border-amber-400 p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => updateQty(itemKey, quantity - 1)}
                      className="w-10 h-10 rounded-lg bg-white text-stone-800 hover:bg-stone-100 flex items-center justify-center font-black text-base shadow-2xs border border-stone-200 active:scale-95 transition cursor-pointer"
                      title="Bớt 1 hộp"
                    >
                      －
                    </button>
                    <span className="font-black text-sm text-red-950">
                      Đã chọn {quantity} hộp
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(itemKey, quantity + 1)}
                      className="w-10 h-10 rounded-lg bg-red-900 text-amber-200 hover:bg-red-800 flex items-center justify-center font-black text-base shadow-2xs border border-red-950 active:scale-95 transition cursor-pointer"
                      title="Thêm 1 hộp"
                    >
                      ＋
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleAdd(item)}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : isTopTier
                        ? "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-red-950 hover:brightness-105 active:scale-[0.98]"
                        : "bg-gradient-to-r from-[#72161A] to-[#8C1D22] text-[#FFF8DC] hover:brightness-110 active:scale-[0.98]"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <span>✓</span>
                        <span>Đã Thêm Vào Khay</span>
                      </>
                    ) : (
                      <>
                        <span>＋</span>
                        <span>Chọn Mua Hộp Này</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
