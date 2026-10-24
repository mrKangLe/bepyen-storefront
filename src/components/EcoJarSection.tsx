"use client";

import { useState } from "react";
import Link from "next/link";
import { getZaloLink, ZALO_PHONE } from "@/lib/constants";
import { useOrder } from "@/context/OrderContext";

export default function EcoJarSection() {
  const [jarCount, setJarCount] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const { openTray } = useOrder();

  // Tính phần quà thưởng theo số vỏ (10 vỏ = 1 hũ tươi)
  const freeJars = Math.floor(jarCount / 10);
  const savedCo2Kg = (jarCount * 0.18).toFixed(1); // 1 hũ thủy tinh ~ 180g rác thải

  const zaloExchangeText = `Chào Bếp Yến Ocean! Mình là cư dân Ocean Park. Mình đang có ${jarCount} vỏ hũ rỗng muốn tham gia chương trình "Đổi Vỏ Lấy Yến – Bảo Vệ Môi Trường". Bếp cho shipper qua thu gom và đổi yến thưởng giúp mình nhé!`;

  return (
    <>
      {/* ── BANNER ĐỔI VỎ LẤY YẾN TRÊN TRANG CHỦ (ĐẬM CHẤT SỐNG XANH & NỔI BẬT) ── */}
      <section
        className="my-3.5 sm:my-4 rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden transition-all shadow-lg border"
        style={{
          background: "linear-gradient(135deg, #064E3B 0%, #047857 55%, #065F46 100%)",
          borderColor: "#34D399",
          boxShadow: "0 8px 24px -4px rgba(4, 120, 87, 0.35)",
        }}
      >
        {/* Nền hiệu ứng lá xanh & biểu tượng sinh thái */}
        <div className="absolute -right-4 -bottom-6 text-7xl sm:text-8xl opacity-15 select-none pointer-events-none">
          🌿
        </div>
        <div className="absolute right-24 -top-6 text-5xl opacity-10 select-none pointer-events-none">
          ♻️
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 sm:gap-5">
          <div className="flex-1 min-w-0">
            {/* Huy hiệu sống xanh */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-emerald-300 text-emerald-950 shadow-xs">
                <span>🌱</span>
                <span>Chương Trình Sống Xanh Cư Dân</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-200">
                ✦ 1.240+ vỏ hũ đã thu hồi
              </span>
            </div>

            {/* Tiêu đề quyền lợi siêu hấp dẫn */}
            <h3 className="text-base sm:text-xl font-bold font-heading text-white leading-snug">
              Hoàn Trả 10 Vỏ Hũ Rỗng = <span className="text-amber-300 font-extrabold underline decoration-amber-400 decoration-wavy">Tặng 1 Hũ Yến Tươi</span> Nóng Hổi
            </h3>

            {/* Mô tả súc tích & đậm chất vì cư dân */}
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 leading-relaxed">
              Cùng chung tay giảm thiểu rác thải thủy tinh tại Vinhomes Ocean Park. Bếp Yến Ocean cử shipper ghé tận cửa căn hộ tiếp nhận vỏ & gửi biếu hũ yến chưng tươi cách thủy mới bốc khói <strong>hoàn toàn miễn phí</strong>!
            </p>

            {/* 3 cam kết nhanh */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2.5 text-[11px] text-emerald-100 font-medium">
              <span className="inline-flex items-center gap-1 bg-emerald-900/40 px-2 py-0.5 rounded-md border border-emerald-500/30">
                <span>🛵</span> Nhận vỏ tận cửa căn hộ
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-900/40 px-2 py-0.5 rounded-md border border-emerald-500/30">
                <span>🍲</span> Trao yến nóng bốc khói
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-900/40 px-2 py-0.5 rounded-md border border-emerald-500/30">
                <span>💯</span> 100% Freeship dịch vụ
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-stretch justify-between md:justify-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-emerald-600/40">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="tap-active flex-1 md:flex-initial px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-emerald-950"
              style={{
                background: "linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)",
                boxShadow: "0 4px 14px rgba(245, 158, 11, 0.4)",
              }}
            >
              <span>♻️</span>
              <span>Đổi Vỏ Nhận Yến</span>
              <span className="text-emerald-950 font-bold">➔</span>
            </button>

            <Link
              href="/doi-vo"
              className="text-[11px] sm:text-xs font-bold text-amber-200 hover:text-white underline text-center px-2 py-1"
            >
              Xem chi tiết thể lệ ↗
            </Link>
          </div>
        </div>
      </section>

      {/* ── MODAL CHI TIẾT & BỘ TÍNH ĐỔI VỎ ─────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4"
          style={{ background: "rgba(20, 40, 25, 0.65)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bounce-in w-full max-w-lg rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden max-h-[92vh] overflow-y-auto thin-scroll"
            style={{
              background: "#FFFDF9",
              border: "1.5px solid #A7D7B5",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-all"
            >
              ✕
            </button>

            {/* Header Modal */}
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl flex-shrink-0">
                🌱
              </span>
              <div>
                <h3 className="font-bold text-base sm:text-lg font-heading text-emerald-950 leading-tight">
                  Chương Trình Tri Ân Cư Dân Sống Xanh
                </h3>
                <p className="text-[11px] text-emerald-800">
                  Chung tay cùng Quý cư dân gìn giữ Đại đô thị Ocean Park Xanh – Sạch – Đẳng Cấp
                </p>
              </div>
            </div>

            {/* Thể lệ minh bạch */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 mb-5 text-xs text-stone-700 space-y-2">
              <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                <span>✦</span> Chính Sách Trao Tặng Tri Ân Từ Bếp Yến Ocean:
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200/60 shadow-2xs">
                  <p className="font-bold text-emerald-900 text-[11px]">Gửi lại 10 Vỏ Hũ Rỗng</p>
                  <p className="text-[10px] text-stone-600 mt-0.5 leading-snug">
                    Bếp kính biếu <strong className="text-emerald-700">1 hũ Yến Chưng Tươi Mới</strong> (85.000đ)
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200/60 shadow-2xs">
                  <p className="font-bold text-emerald-900 text-[11px]">Gửi lại 20 Vỏ Hũ Rỗng</p>
                  <p className="text-[10px] text-stone-600 mt-0.5 leading-snug">
                    Bếp kính biếu <strong className="text-emerald-700">2 hũ Yến Chưng Tươi Mới</strong> (170.000đ)
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-stone-500 italic pt-1">
                * Áp dụng với dòng vỏ hũ thủy tinh y tế nguyên vẹn do Bếp Yến Ocean gửi đến Quý cư dân. Quý khách vui lòng tráng sơ nước sạch để bảo đảm vệ sinh môi trường.
              </p>
            </div>

            {/* Bộ đếm tương tác chọn số lượng vỏ */}
            <div className="p-4 rounded-2xl bg-[#F6FBF7] border border-emerald-200 mb-5">
              <p className="text-xs font-bold text-emerald-950 mb-2.5">
                Quý cư dân đang gìn giữ bao nhiêu vỏ hũ tại căn hộ?
              </p>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setJarCount((prev) => Math.max(1, prev - 1))}
                    className="w-9 h-9 rounded-xl border border-emerald-300 bg-white font-bold text-emerald-900 text-sm flex items-center justify-center shadow-2xs active:scale-95"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-extrabold text-lg text-emerald-950">
                    {jarCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setJarCount((prev) => prev + 1)}
                    className="w-9 h-9 rounded-xl border border-emerald-300 bg-white font-bold text-emerald-900 text-sm flex items-center justify-center shadow-2xs active:scale-95"
                  >
                    +
                  </button>
                </div>

                {/* Chọn nhanh */}
                <div className="flex items-center gap-1">
                  {[10, 20, 30, 40].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setJarCount(num)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                        jarCount === num
                          ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                          : "bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      {num} vỏ
                    </button>
                  ))}
                </div>
              </div>

              {/* Kết quả nhận thưởng */}
              <div className="mt-3.5 pt-3 border-t border-emerald-200/70 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-600">Phần quà Bếp trân trọng gửi tặng:</span>
                  <p className="font-extrabold text-emerald-900 text-sm mt-0.5">
                    {freeJars > 0
                      ? `🎁 Kính Biếu ${freeJars} Hũ Yến Chưng Tươi Miễn Phí`
                      : `Gửi lại thêm ${10 - jarCount} vỏ nữa để nhận 1 hũ yến chưng tươi miễn phí!`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-500">Giảm tải môi trường:</span>
                  <p className="font-bold text-emerald-700 text-xs">
                    ~{savedCo2Kg}kg thủy tinh y tế
                  </p>
                </div>
              </div>
            </div>

            {/* Cách thức nhận quà */}
            <div className="space-y-2 mb-5">
              <p className="text-xs font-bold text-stone-800">
                Hai phương thức tiếp nhận thuận tiện nhất cho Quý cư dân:
              </p>
              
              <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-start gap-2.5">
                <span className="text-base flex-shrink-0">🛵</span>
                <div className="text-xs">
                  <strong className="text-stone-900">Cách 1: Gửi lại khi nhận đơn yến mới (Tiện nhất)</strong>
                  <p className="text-stone-600 text-[11px] mt-0.5">
                    Khi đặt yến trên web, Quý cư dân chỉ cần tích chọn &quot;Gửi lại vỏ hũ rỗng&quot;. Shipper sẽ mang kèm phần yến biếu tặng nóng hổi và nhận vỏ ngay tại cửa căn hộ.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-start gap-2.5">
                <span className="text-base flex-shrink-0">💬</span>
                <div className="text-xs">
                  <strong className="text-stone-900">Cách 2: Nhắn Bếp điều shipper qua nhận vỏ riêng</strong>
                  <p className="text-stone-600 text-[11px] mt-0.5">
                    Nếu Quý cư dân chưa có nhu cầu dùng thêm yến, chỉ cần nhắn tin cho Bếp. Shipper nội khu sẽ ghé tiếp nhận vỏ và trao gửi hũ yến biếu tặng hoàn toàn miễn phí ship.
                  </p>
                </div>
              </div>
            </div>

            {/* Hai nút hành động */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href={getZaloLink(zaloExchangeText)}
                target="_blank"
                rel="noreferrer"
                className="tap-active flex-1 py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 text-white shadow-md transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #15803D, #166534)",
                }}
              >
                <span>💬</span>
                <span>Nhắn Bếp Thu Vỏ & Nhận Yến Tri Ân ↗</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  openTray();
                }}
                className="tap-active flex-1 py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border shadow-2xs transition-all hover:bg-stone-50"
                style={{
                  borderColor: "var(--gold)",
                  color: "var(--red-primary)",
                  background: "#FFFDF9",
                }}
              >
                <span>🫙</span>
                <span>Xem Thực Đơn & Gửi Vỏ Khi Giao Đơn</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-stone-400 mt-3">
              Hotline Bếp trưởng: <strong className="text-stone-700">{ZALO_PHONE}</strong> · Phục vụ toàn cư dân OCP1, OCP2, OCP3
            </p>
          </div>
        </div>
      )}
    </>
  );
}
