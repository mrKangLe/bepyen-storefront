"use client";

import { useState } from "react";
import Link from "next/link";
import { ZALO_PHONE, getZaloLink, OCEAN_PARK_BUILDINGS } from "@/lib/constants";
import AIChatBot from "@/components/AIChatBot";

export default function DoiVoPage() {
  const [jarCount, setJarCount] = useState(5);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [building, setBuilding] = useState(OCEAN_PARK_BUILDINGS[0]);
  const [apartment, setApartment] = useState("");
  const [wantsToOrderMore, setWantsToOrderMore] = useState(false);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Tính phần quà tri ân (10 vỏ = 1 hũ tươi)
  const freeJars = Math.floor(jarCount / 10);
  const savedCo2Kg = (jarCount * 0.18).toFixed(1);

  const getRewardTitle = (qty: number) => {
    if (qty >= 30) return "🎁 Kính biếu 3 Hũ Yến Chưng Tươi Mới (255.000đ)";
    if (qty >= 20) return "🎁 Kính biếu 2 Hũ Yến Chưng Tươi Mới (170.000đ)";
    if (qty >= 10) return "🎁 Kính biếu 1 Hũ Yến Chưng Tươi Mới Thanh Mát (85.000đ)";
    return `Gửi lại thêm ${10 - qty} vỏ nữa để nhận 1 hũ yến chưng tươi kính biếu!`;
  };

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/doi-vo`;
    }
    return "https://bepyen.ocean/doi-vo";
  };

  const shareText = `🌱 Thân gửi Quý cư dân Vinhomes Ocean Park! Nhà mình hay dùng yến chưng nhớ giữ lại vỏ hũ thủy tinh nhé. Bếp Yến Ocean đang có chương trình tri ân cư dân sống xanh – shipper ghé tận cửa căn hộ tiếp nhận vỏ rỗng và gửi biếu yến chưng tươi cách thủy nóng hổi hoàn toàn miễn phí (cứ 5 vỏ rỗng = Bếp kính biếu 1 hũ yến nóng bốc khói). Chi tiết chương trình Quý cư dân xem tại: ${getShareUrl()}`;

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg("Dạ Bếp xin tên và số điện thoại để liên hệ thu gom tận nơi nhé ạ!");
      return;
    }
    setErrorMsg("");

    setIsSubmitting(true);

    const addressText = `${apartment ? `Căn ${apartment}, ` : ""}${building}`;
    const rewardText = getRewardTitle(jarCount);

    const fullMessage = [
      `🌱 TIẾP NHẬN VỎ HŨ RỖNG & TRAO YẾN TRI ÂN · VÌ OCEAN PARK XANH`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `👤 Quý cư dân: ${name.trim()}`,
      `📞 Số điện thoại: ${phone.trim()}`,
      `🏠 Địa chỉ căn hộ: ${addressText}`,
      `♻️ Số lượng vỏ gửi lại: ${jarCount} vỏ hũ rỗng`,
      `🎁 Phần quà Bếp kính biếu: ${rewardText}`,
      wantsToOrderMore ? `🍲 Có nhu cầu đặt thêm yến chưng tươi mẻ mới giao nóng cùng lúc!` : `🛵 Shipper ghé tiếp nhận vỏ và gửi yến tri ân tận cửa.`,
      note ? `📝 Ghi chú: ${note.trim()}` : "",
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `💬 Nhờ Bếp sắp xếp shipper ghé tiếp nhận vỏ và trao gửi quà tri ân giúp mình nhé!`,
    ]
      .filter(Boolean)
      .join("\n");

    // 1. Ghi nhận thông tin vào CRM hệ thống Bếp
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          phone: phone.trim(),
          building,
          apartment,
          notes: `[TRI ÂN ĐỔI VỎ - ${jarCount} VỎ HŨ] ${rewardText}${wantsToOrderMore ? " [Đặt thêm yến nóng]" : ""} - ${note || ""}`.trim(),
          items: [
            {
              title: `[Quà Tri Ân Đổi Vỏ] ${rewardText.replace("🎁 Kính biếu ", "")}`,
              price: 0,
              quantity: freeJars || 1,
            },
          ],
          total_price: 0,
          order_source: "doi_vo_tri_an",
          health_profile: `Quý cư dân gửi lại ${jarCount} vỏ hũ bảo vệ môi trường Ocean Park`,
        }),
      });
    } catch (err) {
      console.warn("Lỗi lưu yêu cầu đổi vỏ:", err);
    }

    // 2. Tự động sao chép nội dung & Mở Zalo Bếp trưởng
    try {
      await navigator.clipboard.writeText(fullMessage);
    } catch {}

    setIsSubmitting(false);
    setIsDone(true);

    // Mở Zalo
    setTimeout(() => {
      window.open(getZaloLink(fullMessage), "_blank");
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col font-body" style={{ background: "var(--parchment)" }}>
      {/* ── TOP HEADER TINH GỌN ──────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-amber-900/10 backdrop-blur-md bg-[#FFFDF9]/95 py-2 px-3 sm:px-4 shadow-2xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 select-none group">
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs border"
              style={{
                background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
                borderColor: "var(--gold-light)",
                color: "var(--red-deep)",
              }}
            >
              Y
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm font-heading text-red-950">
                Bếp Yến Ocean
              </span>
              <span className="hidden sm:inline-block text-[10px] text-stone-500 font-medium ml-1.5">
                · Vinhomes Ocean Park
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs font-bold text-red-900 hover:text-red-700 underline px-2 py-1"
            >
              ← Xem thực đơn
            </Link>
            <a
              href={`tel:${ZALO_PHONE}`}
              className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-amber-300 text-amber-950 bg-amber-50"
            >
              📞 {ZALO_PHONE}
            </a>
          </div>
        </div>
      </header>

      {/* ── NỘI DUNG CHÍNH (TỐI ƯU GỌN GÀNG, KHÔNG CUỘN DÀI) ─────── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-5">
        
        {/* Banner tiêu đề tinh gọn */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl p-3 sm:p-4 shadow-sm border border-emerald-500/30">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-emerald-950">
                🌱 SỐNG XANH
              </span>
              <span className="text-[11px] text-emerald-200">
                100% Freeship thu vỏ tận cửa
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-bold font-heading text-amber-200 leading-tight">
              Hoàn Trả Vỏ Hũ Rỗng – Nhận Yến Chưng Nóng Tri Ân
            </h1>
            <p className="text-[11px] sm:text-xs text-emerald-100/90 mt-0.5">
              Shipper ghé tận cửa căn hộ nhận vỏ rỗng & trao hũ yến chưng cách thủy mới bốc khói hoàn toàn miễn phí.
            </p>
          </div>

          {/* Nút bật AI nhanh */}
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("open-ai-chat", {
                  detail: {
                    prompt: "Em ơi hỗ trợ chị gửi lại vỏ hũ rỗng đổi yến chưng nóng với!",
                  },
                })
              );
            }}
            className="tap-active shrink-0 px-3.5 py-2 rounded-xl font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 self-start sm:self-center"
            style={{
              background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
              color: "var(--red-deep)",
            }}
          >
            <span>🤖</span>
            <span>AI Đổi Vỏ Hộ Trong 10s ➔</span>
          </button>
        </div>

        {/* ── BỐ CỤC 2 CỘT TỐI ƯU TRÊN MÀN HÌNH (DESKTOP) & LIỀN MẠCH (MOBILE) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
          
          {/* CỘT TRÁI (5 Cột): Thể lệ 3 mốc & Bộ chọn số lượng vỏ */}
          <div className="lg:col-span-5 space-y-3">
            {/* 3 Thẻ Mốc Quà Tặng Siêu Gọn */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <div
                onClick={() => setJarCount(10)}
                className={`cursor-pointer rounded-xl p-2 sm:p-2.5 border-2 transition-all text-center relative overflow-hidden ${
                  jarCount === 10
                    ? "bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/30 shadow-xs"
                    : "bg-white border-amber-300 hover:border-amber-400"
                }`}
              >
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[7px] font-black px-1 rounded-bl">
                  HOT
                </div>
                <span className="text-base sm:text-lg block mb-0.5">🫙</span>
                <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200 px-1.5 py-0.2 rounded-full inline-block">
                  10 Vỏ
                </span>
                <p className="text-[10px] font-bold text-stone-800 mt-1 leading-tight">
                  Tặng 1 Hũ Yến Tươi
                </p>
                <span className="text-[9px] text-stone-500 block">(85.000đ)</span>
              </div>

              <div
                onClick={() => setJarCount(20)}
                className={`cursor-pointer rounded-xl p-2 sm:p-2.5 border transition-all text-center ${
                  jarCount === 20
                    ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30 shadow-xs"
                    : "bg-white border-stone-200 hover:border-emerald-300"
                }`}
              >
                <span className="text-base sm:text-lg block mb-0.5">🫙🫙</span>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full inline-block">
                  20 Vỏ
                </span>
                <p className="text-[10px] font-bold text-stone-800 mt-1 leading-tight">
                  Tặng 2 Hũ Yến Tươi
                </p>
                <span className="text-[9px] text-stone-500 block">(170.000đ)</span>
              </div>

              <div
                onClick={() => setJarCount(30)}
                className={`cursor-pointer rounded-xl p-2 sm:p-2.5 border transition-all text-center ${
                  jarCount === 30
                    ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30 shadow-xs"
                    : "bg-white border-stone-200 hover:border-emerald-300"
                }`}
              >
                <span className="text-base sm:text-lg block mb-0.5">🎁</span>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full inline-block">
                  30 Vỏ
                </span>
                <p className="text-[10px] font-bold text-stone-800 mt-1 leading-tight">
                  Tặng 3 Hũ Yến Tươi
                </p>
                <span className="text-[9px] text-stone-500 block">(255.000đ)</span>
              </div>
            </div>

            {/* Khối Bộ Chọn Số Lượng Vỏ Trực Quan */}
            <div className="rounded-2xl p-3 sm:p-3.5 bg-white border border-emerald-300/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                  <span>♻️</span>
                  <span>Chọn Số Vỏ Hũ Bạn Gửi:</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  Giảm ~{savedCo2Kg}kg rác thủy tinh
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 bg-emerald-50/70 p-2 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setJarCount((c) => Math.max(1, c - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-emerald-300 font-black text-emerald-900 text-base flex items-center justify-center shadow-2xs active:scale-95"
                  >
                    -
                  </button>
                  <div className="min-w-14 text-center">
                    <span className="text-xl sm:text-2xl font-black text-emerald-950 font-mono">
                      {jarCount}
                    </span>
                    <span className="text-[10px] text-stone-500 block leading-none">vỏ hũ</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setJarCount((c) => c + 1)}
                    className="w-8 h-8 rounded-lg bg-white border border-emerald-300 font-black text-emerald-900 text-base flex items-center justify-center shadow-2xs active:scale-95"
                  >
                    +
                  </button>
                </div>

                {/* Nút chọn nhanh */}
                <div className="flex items-center gap-1">
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setJarCount(num)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all ${
                        jarCount === num
                          ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                          : "bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      {num}v
                    </button>
                  ))}
                </div>
              </div>

              {/* Hộp quà nhận được trực quan */}
              <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50/60 border border-amber-300/80 flex items-center gap-2 text-xs">
                <span className="text-xl shrink-0">🎁</span>
                <div className="leading-tight">
                  <span className="text-[10px] text-stone-500 block">Quà Bếp Yến Ocean kính tặng:</span>
                  <strong className="text-red-950 font-bold text-xs sm:text-[13px]">
                    {getRewardTitle(jarCount)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Lan tỏa chia sẻ cư dân */}
            <div className="p-2.5 rounded-xl bg-[#EFE9DA]/60 border border-[#DFD5C0] flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-stone-600 truncate">
                📢 Cùng lan tỏa lối sống xanh với hàng xóm:
              </span>
              <button
                type="button"
                onClick={handleCopyShare}
                className="tap-active px-3 py-1 rounded-lg text-[10px] font-bold text-red-950 bg-amber-300 hover:bg-amber-400 shrink-0 shadow-2xs"
              >
                {copiedShare ? "✓ Đã sao chép!" : "📋 Chép Lời Nhắn"}
              </button>
            </div>
          </div>

          {/* CỘT PHẢI (7 Cột): Form Đăng Ký Giao Nhận Tận Cửa */}
          <div className="lg:col-span-7">
            <div
              className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-md border relative overflow-hidden bg-white"
              style={{ borderColor: "rgba(201,168,76,0.5)" }}
            >
              {isDone ? (
                /* Màn hình gửi thành công */
                <div className="text-center py-5 space-y-3">
                  <span className="text-4xl block animate-bounce">🎉</span>
                  <h3 className="text-base sm:text-lg font-bold font-heading text-emerald-950">
                    Gửi Yêu Cầu Đổi Vỏ Thành Công!
                  </h3>
                  <p className="text-xs text-stone-700 max-w-sm mx-auto leading-relaxed">
                    Bếp Yến Ocean xin cảm ơn Quý cư dân <strong>{name}</strong> ({phone} - {building} {apartment ? `Căn ` + apartment : ""}). Shipper nội khu sẽ ghé tiếp nhận vỏ & trao yến nóng tận tay hoàn toàn miễn phí!
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                    <a
                      href={getZaloLink(`Chào Bếp Yến Ocean! Mình vừa đăng ký gửi lại ${jarCount} vỏ hũ rỗng tại ${building}. Bếp kiểm tra và sắp xếp giúp mình nhé!`)}
                      target="_blank"
                      rel="noreferrer"
                      className="tap-active flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5"
                      style={{ background: "linear-gradient(135deg, #15803D, #166534)" }}
                    >
                      <span>💬</span>
                      <span>Mở Zalo Xác Nhận Ngay ↗</span>
                    </a>

                    <Link
                      href="/"
                      className="tap-active flex-1 py-2.5 rounded-xl text-xs font-bold border border-amber-800/30 text-amber-950 bg-amber-50 flex items-center justify-center gap-1.5"
                    >
                      <span>🫙</span>
                      <span>Xem Thực Đơn Yến</span>
                    </Link>
                  </div>
                </div>
              ) : (
                /* Form nhập liệu gọn gàng */
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                    <h3 className="font-bold text-xs sm:text-sm text-stone-900 font-heading flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center">
                        ✓
                      </span>
                      <span>Địa Chỉ Căn Hộ Nhận Yến Tri Ân Tận Tay</span>
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Freeship 100%
                    </span>
                  </div>

                  {/* 2 Cột: Tên & SĐT */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-stone-700 uppercase block mb-0.5">
                        Tên Quý Cư Dân (*)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="VD: Chị Mai, Anh Tuấn..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-stone-700 uppercase block mb-0.5">
                        Số Điện Thoại Zalo (*)
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="09xx xxx xxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-bold text-red-950 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* 2 Cột: Tòa & Căn hộ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-stone-700 uppercase block mb-0.5">
                        Tòa Căn Hộ / Phân Khu (*)
                      </label>
                      <select
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:border-emerald-600 truncate"
                      >
                        {OCEAN_PARK_BUILDINGS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-stone-700 uppercase block mb-0.5">
                        Số Căn Hộ / Tầng
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Căn 12A08"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Checkbox đặt thêm món yến nóng tiện chuyến */}
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={wantsToOrderMore}
                        onChange={(e) => setWantsToOrderMore(e.target.checked)}
                        className="mt-0.5 w-3.5 h-3.5 rounded text-red-800 accent-red-800 cursor-pointer"
                      />
                      <div className="text-[11px] leading-snug">
                        <span className="font-bold text-red-950">
                          Tiện chuyến shipper ghé, tôi muốn đặt thêm yến chưng tươi nóng mẻ mới
                        </span>
                        <p className="text-[10px] text-stone-500">
                          Đặc quyền cư dân: <strong>Freeship 100%</strong> toàn Ocean Park · Giao nóng 20–30 phút.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Ghi chú */}
                  <div>
                    <label className="text-[10px] font-bold text-stone-700 uppercase block mb-0.5">
                      Ghi Chú Cho Bếp (VD: Giao sau 17h, gửi lễ tân sảnh...)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Gửi lễ tân sảnh, giao giờ ăn tối..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Báo lỗi nếu thiếu thông tin */}
                  {errorMsg && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-bold flex items-center gap-1.5">
                      <span>⚠️</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Nút gửi form */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="tap-active w-full py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black text-white shadow-md transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, #15803D, #166534)",
                      boxShadow: "0 4px 14px rgba(22, 101, 52, 0.35)",
                    }}
                  >
                    <span>{isSubmitting ? "⏳ Đang gửi thông tin..." : "🌿 GỬI TIẾP NHẬN VỎ & NHẬN YẾN TRI ÂN ➔"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer info ngắn gọn */}
        <div className="mt-4 text-center text-[10px] text-stone-500 space-y-0.5">
          <p>Bếp Yến Ocean · Vinhomes Ocean Park, Gia Lâm, Hà Nội · Hotline: <strong className="text-stone-700">{ZALO_PHONE}</strong></p>
        </div>
      </main>

      {/* Trợ lý AI Bếp Yến */}
      <AIChatBot />
    </div>
  );
}
