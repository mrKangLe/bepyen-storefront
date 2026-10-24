"use client";

import Image from "next/image";
import Link from "next/link";
import { ZALO_PHONE, getZaloLink } from "@/lib/constants";

export default function HeroSection() {
  const zaloLink = getZaloLink("Chào Bếp Yến Ocean! Tôi muốn đặt yến chưng nóng giao ngay 🫙");

  const scrollToMenu = () => {
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto px-3 sm:px-4 pt-3 pb-2 select-none">
      {/* ── BANNER QUẢNG CÁO NGỰ YẾN CHƯNG NÓNG BỐC KHÓI ────────────── */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#C59B27]/60 group min-h-[260px] sm:min-h-[300px] flex items-center"
        style={{
          background: "linear-gradient(135deg, #2D080A 0%, #150304 100%)",
        }}
      >
        {/* Ảnh Banner 4K Chụp Thực Tế Hũ Yến Chưng Nóng Bốc Khói */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/banner-hero.jpg"
            alt="Yến chưng tươi cách thủy nóng hổi Bếp Yến Ocean"
            fill
            priority
            className="object-cover object-right sm:object-center opacity-85 transition-transform duration-700 group-hover:scale-105"
          />
          {/* Lớp phủ chuyển sắc hoàng gia để nổi bật thông điệp */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(35,5,7,0.92) 0%, rgba(45,8,10,0.85) 45%, rgba(20,3,4,0.3) 100%)",
            }}
          />
          <div className="cloud-pattern absolute inset-0 opacity-15 pointer-events-none" />
        </div>

        {/* Nội dung Banner Quảng Cáo */}
        <div className="relative z-10 p-4 sm:p-7 max-w-xl text-[#FFF8DC]">
          {/* Huy hiệu cung đình */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 bg-gradient-to-r from-amber-400 to-amber-500 text-red-950 shadow-sm">
            <span>🔥</span>
            <span>Mẻ Chưng Tươi Mới · Giao Nóng 20 Phút</span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold font-heading text-white leading-tight drop-shadow-md">
            Ngự Yến Chưng Nóng <br className="hidden sm:inline" />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #FFF3C4, #F5DE98, #D4AF37)",
              }}
            >
              Giao Tận Căn Hộ Ocean Park
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/90 mt-1 leading-snug font-normal">
            100% sợi yến tươi nguyên chất chưng nóng cách thủy, mở nắp bốc khói bồi bổ cả nhà.
          </p>

          {/* Hàng ngang 3 badge chính sách tinh gọn (icon + text ngắn) */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-3 text-center">
            <span className="flex items-center justify-center gap-1 bg-black/45 backdrop-blur-xs py-1.5 px-2 rounded-xl border border-amber-400/30 text-[11px] sm:text-xs font-bold text-amber-200">
              <span>🚀</span>
              <span>Freeship 100%</span>
            </span>
            <span className="flex items-center justify-center gap-1 bg-black/45 backdrop-blur-xs py-1.5 px-2 rounded-xl border border-amber-400/30 text-[11px] sm:text-xs font-bold text-amber-200">
              <span>🛵</span>
              <span>Giao Nóng 20–30P</span>
            </span>
            <Link
              href="/doi-vo"
              className="flex items-center justify-center gap-1 bg-emerald-950/60 backdrop-blur-xs py-1.5 px-2 rounded-xl border border-emerald-400/40 text-[11px] sm:text-xs font-bold text-emerald-300 hover:bg-emerald-900/70 transition"
            >
              <span>🫙</span>
              <span>10 Vỏ = 1 Hũ</span>
            </Link>
          </div>

          {/* Nút hành động trực tiếp */}
          <div className="flex items-center gap-2.5 mt-4">
            <button
              type="button"
              onClick={scrollToMenu}
              className="tap-active flex-1 sm:flex-initial px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-black shadow-xl transition-all hover:scale-105 active:scale-95 border border-amber-300 flex items-center justify-center gap-1.5"
              style={{
                background: "linear-gradient(135deg, #F5DE98, #D4AF37, #AA8222)",
                color: "#3A080B",
              }}
            >
              <span>🍲</span>
              <span>Đặt Giao Nóng Ngay</span>
            </button>

            <Link
              href="/doi-vo"
              className="tap-active px-3.5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-white/15 hover:bg-white/25 border border-white/20 transition-all flex items-center gap-1"
            >
              <span>♻️</span>
              <span>Đổi Vỏ</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
