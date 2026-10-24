"use client";

import Link from "next/link";
import { ZALO_PHONE, getZaloLink } from "@/lib/constants";
import { usePWA } from "@/context/PWAContext";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export default function Header({ isMenuOpen, setIsMenuOpen }: HeaderProps) {
  const zaloLink = getZaloLink("Xin chào Bếp Yến Ocean! Tôi muốn tư vấn về yến chưng tươi Đông Y thượng hạng 🫙");
  const { isInstalled, isAndroid, isIOS, triggerInstall } = usePWA();

  return (
    <>
      <header className="sticky top-0 z-50 w-full shadow-md select-none" style={{ background: "var(--red-primary)" }}>
        {/* Cloud pattern overlay */}
        <div className="cloud-pattern absolute inset-0 opacity-20 pointer-events-none" />

        {/* Main header bar – tinh gọn, 1 tầng duy nhất, không rườm rà */}
        <div className="relative px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between max-w-2xl mx-auto">
          {/* Logo left */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl font-black shadow-md border transition-transform group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #E5C158, #C59B27, #8C6B1A)",
                borderColor: "var(--gold-light)",
                color: "var(--red-deep)",
              }}
            >
              Y
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className="font-extrabold text-sm sm:text-lg leading-tight tracking-wider font-heading"
                  style={{ color: "var(--gold-light)" }}
                >
                  Bếp Yến Ocean
                </span>
                <span className="imperial-seal px-1.5 py-0.2 text-[8px] bg-red-950/40 border-amber-400/40 text-amber-300">
                  NGỰ CHẾ
                </span>
              </div>
              <div
                className="text-[9px] sm:text-[11px] leading-tight tracking-wide font-medium"
                style={{ color: "rgba(255,225,140,0.85)" }}
              >
                Đông Dược Cung Đình · Ocean Park
              </div>
            </div>
          </Link>

          {/* Right: Hotline, Zalo Tư Vấn & Menu Tiện Ích */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <a
              href={`tel:${ZALO_PHONE}`}
              className="hidden md:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-500/30 hover:bg-black/20 transition"
              style={{ color: "var(--gold-light)" }}
            >
              <span className="text-amber-400">☎</span>
              <span>{ZALO_PHONE}</span>
            </a>

            <a
              href={zaloLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold shadow-md tap-active transition-all hover:scale-105 border border-amber-300"
              style={{
                background: "linear-gradient(135deg, #F5DE98, #D4AF37, #AA8222)",
                color: "#3A080B",
              }}
            >
              <span>Tư Vấn Zalo</span>
            </a>

            {/* Nút Mở Menu Cố Định / Tiện Ích Cư Dân */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="tap-active flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold border border-amber-400/50 hover:bg-black/20 transition-all"
              style={{ color: "var(--gold-light)" }}
              title="Menu tiện ích cư dân"
            >
              <span className="text-sm">☰</span>
              <span className="hidden sm:inline">Tiện Ích</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── DRAWER TIỆN ÍCH CƯ DÂN (MENU CỐ ĐỊNH GỌN GÀNG) ─────────────── */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="w-full max-w-xs h-full p-5 flex flex-col justify-between shadow-2xl relative animate-slide-left text-stone-800"
            style={{
              background: "#FFFDF9",
              borderLeft: "2px solid var(--gold)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Header Drawer */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-900/15 mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-amber-100"
                    style={{ background: "var(--red-primary)" }}
                  >
                    Y
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-heading text-red-950">
                      Bếp Yến Ocean
                    </h3>
                    <p className="text-[10px] text-stone-500">
                      Tiện ích cư dân Vinhomes Ocean Park
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-stone-500 hover:text-stone-900 bg-stone-100"
                >
                  ✕
                </button>
              </div>

              {/* Danh sách các tính năng trong Menu */}
              <div className="space-y-3">
                {/* 1. MỤC CÀI APP ĐIỆN THOẠI (Kiểm tra thiết bị đã cài chưa) */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-red-950 flex items-center gap-1.5">
                      <span>📲</span>
                      <span>Ứng Dụng Điện Thoại</span>
                    </span>
                    {isInstalled ? (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Đã Cài Đặt
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900">
                        Chưa cài
                      </span>
                    )}
                  </div>

                  {!isInstalled ? (
                    <>
                      <p className="text-[11px] text-stone-600 leading-snug mb-2.5">
                        Cài App lên màn hình để mở nhanh 1 chạm, nhận thông báo giao nóng 20 phút & ưu đãi cư dân.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          triggerInstall();
                        }}
                        className="tap-active w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-[1.02] border border-amber-300 cursor-pointer"
                        style={{
                          background: "linear-gradient(135deg, #F5DE98, #D4AF37)",
                          color: "#3A080B",
                        }}
                      >
                        <span>{isIOS ? "🍎" : "⚡"}</span>
                        <span>{isIOS ? "Cài Lên iPhone (Màn Hình)" : isAndroid ? "Cài Lên Android (1 Chạm)" : "Cài Lên Màn Hình"}</span>
                      </button>
                    </>
                  ) : (
                    <p className="text-[11px] text-emerald-800 font-medium">
                      ✓ Bạn đang trải nghiệm phiên bản ứng dụng cài đặt trực tiếp trên thiết bị!
                    </p>
                  )}
                </div>

                {/* 2. DỰ ÁN SỐNG XANH - HOÀN VỎ HŨ NHẬN YẾN */}
                <Link
                  href="/doi-vo"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between hover:bg-emerald-50 transition tap-active block"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">♻️</span>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950 font-heading">
                        Gửi Lại Vỏ Hũ · Nhận Yến Tri Ân
                      </h4>
                      <p className="text-[10px] text-emerald-800">
                        Cứ 10 vỏ rỗng = Bếp biếu 1 hũ yến mới nóng hổi
                      </p>
                    </div>
                  </div>
                  <span className="text-emerald-700 text-xs font-bold">➔</span>
                </Link>

                {/* 3. CẨM NANG DƯỠNG SINH & NHẬN BIẾT YẾN THẬT */}
                <Link
                  href="/cam-nang"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between hover:bg-amber-100/50 transition tap-active block"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">📖</span>
                    <div>
                      <h4 className="text-xs font-bold text-red-950 font-heading">
                        Cẩm Nang & Phân Biệt Yến Thật
                      </h4>
                      <p className="text-[10px] text-stone-600">
                        Bí quyết nhận biết yến giả, yến giao mùa cho trẻ & người già
                      </p>
                    </div>
                  </div>
                  <span className="text-amber-800 text-xs font-bold">➔</span>
                </Link>

                {/* 4. ĐẶC QUYỀN CƯ DÂN */}
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="text-xs font-bold text-red-950 flex items-center gap-1.5 mb-1.5">
                    <span>🎁</span>
                    <span>Đặc Quyền Cư Dân Ocean Park</span>
                  </h4>
                  <ul className="text-[11px] text-stone-600 space-y-1 list-disc list-inside">
                    <li>Freeship 100% nội khu mọi đơn hàng</li>
                    <li>Giao nóng bốc khói 20–30 phút tận căn hộ</li>
                    <li>10 vỏ hũ thủy tinh rỗng đổi 1 hũ yến tươi mới</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Drawer: Hotline & Zalo */}
            <div className="pt-3 border-t border-stone-200 space-y-2">
              <a
                href={`tel:${ZALO_PHONE}`}
                className="w-full py-2 px-3 rounded-xl border border-red-900/20 text-red-950 text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition"
              >
                <span>☎ Hotline Bếp: {ZALO_PHONE}</span>
              </a>

              <a
                href={zaloLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md text-white"
                style={{
                  background: "linear-gradient(135deg, var(--red-primary), var(--red-deep))",
                }}
              >
                <span>💬 Chat Zalo Trực Tiếp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
