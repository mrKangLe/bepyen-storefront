"use client";

import Link from "next/link";

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export default function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Thanh điều hướng cố định điện thoại"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] border-t select-none backdrop-blur-md"
      style={{
        background: "rgba(42, 6, 8, 0.98)",
        borderColor: "rgba(197, 155, 39, 0.4)",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.4)",
      }}
    >
      <div className="grid grid-cols-4 items-center text-center">
        {/* 1. Thực đơn */}
        <button
          type="button"
          onClick={scrollToProducts}
          className="flex flex-col items-center justify-center py-1 text-[#FFF8DC] hover:text-amber-300 tap-active"
        >
          <span className="text-lg leading-none">🍲</span>
          <span className="text-[11px] font-bold mt-1 tracking-tight">Thực Đơn</span>
        </button>

        {/* 2. Ưu đãi cư dân */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 text-[#FFF8DC] hover:text-amber-300 tap-active"
        >
          <span className="text-lg leading-none">🎁</span>
          <span className="text-[11px] font-bold mt-1 tracking-tight">Ưu Đãi</span>
        </button>

        {/* 3. Đổi vỏ hũ tươi */}
        <Link
          href="/doi-vo"
          className="flex flex-col items-center justify-center py-1 text-[#FFF8DC] hover:text-amber-300 tap-active"
        >
          <span className="text-lg leading-none">♻️</span>
          <span className="text-[11px] font-bold mt-1 tracking-tight">Đổi Vỏ</span>
        </Link>

        {/* 4. Tiện ích & Hướng dẫn */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 text-[#FFF8DC] hover:text-amber-300 tap-active"
        >
          <span className="text-lg leading-none">☰</span>
          <span className="text-[11px] font-bold mt-1 tracking-tight">Tiện Ích</span>
        </button>
      </div>
    </nav>
  );
}
