"use client";

import { useState } from "react";
import Header from "@/components/Header";
import InstallPWA from "@/components/InstallPWA";
import HeroSection from "@/components/HeroSection";
import DynamicCampaignBanner from "@/components/DynamicCampaignBanner";
import VIPProductCard from "@/components/VIPProductCard";
import ProductGrid from "@/components/ProductGrid";
import RawNestSection from "@/components/RawNestSection";
import EcoJarSection from "@/components/EcoJarSection";
import HomeArticlesSection from "@/components/HomeArticlesSection";
import AIChatBot from "@/components/AIChatBot";
import OrderTrayButton from "@/components/OrderTrayButton";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";

type RealmTab = "yen-chung" | "yen-to" | "qua-bieu";

const REALM_TABS: { id: RealmTab; label: string; sub: string; glyph: string }[] = [
  { id: "yen-chung", label: "Yến Chưng Tươi", sub: "Giao nóng 20p", glyph: "🫙" },
  { id: "yen-to", label: "Tổ Yến To & Nhỏ", sub: "Tự chưng tại gia", glyph: "🪺" },
  { id: "qua-bieu", label: "Hộp Quà Biếu", sub: "Gấm đỏ & nhung", glyph: "🎁" },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<RealmTab>("yen-chung");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden max-w-full w-full" style={{ background: "var(--parchment)" }}>
      {/* PWA: Tự động quản lý popup 1 lần duy nhất & modal hướng dẫn khi cần */}
      <InstallPWA />

      {/* ── THANH THÔNG BÁO ĐỘNG (1 DÒNG DUY NHẤT Ở TRÊN CÙNG) ── */}
      <DynamicCampaignBanner />

      {/* Header: 1 tầng duy nhất, tích hợp menu tiện ích cư dân */}
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Hero section: tinh gọn, trang nhã, không che khuất */}
      <HeroSection />

      {/* ── Main content ─────────────────────────────────────── */}
      <main id="products" className="flex-1 w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 pb-6 sm:pb-4">
        
        {/* ── 3 Main Realm Tabs (Bấm chuyển ngay, không phải cuộn mỏi tay) ── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 p-1.5 rounded-2xl bg-[#EFE7D5]/80 border border-[#DFD5C0]">
          {REALM_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "yen-chung") setActiveCategory("Tất cả");
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#72161A] to-[#8C1D22] text-[#FFF8DC] shadow-md scale-[1.01]"
                    : "text-stone-800 hover:bg-white/60 active:scale-98"
                }`}
              >
                <span className="text-sm sm:text-base">{tab.glyph}</span>
                <span className="leading-tight text-center sm:text-left">
                  <span className="block font-heading">{tab.label}</span>
                  <span
                    className={`hidden sm:block text-[10px] font-normal ${
                      isActive ? "text-amber-200/80" : "text-stone-500"
                    }`}
                  >
                    {tab.sub}
                  </span>
                </span>
              </button>
            );
          })}
        </div>


        {/* ── PHÂN KHU 1: YẾN CHƯNG TƯƠI (DÙNG NGAY) ── */}
        {activeTab === "yen-chung" && (
          <div>
            {/* VIP Product Spotlight Bar */}
            <VIPProductCard />

            {/* 8 Fresh Jars with sub-filter */}
            <ProductGrid
              mode="fresh"
              activeCategory={activeCategory}
              onCategory={setActiveCategory}
            />
          </div>
        )}

        {/* ── PHÂN KHU 2: TỔ YẾN THƯỢNG HẠNG (LOẠI TO & NHỎ) ── */}
        {activeTab === "yen-to" && <RawNestSection />}

        {/* ── PHÂN KHU 3: HỘP QUÀ BIẾU TÔN QUÝ ── */}
        {activeTab === "qua-bieu" && (
          <ProductGrid
            mode="gift"
            activeCategory="Set quà biếu"
            onCategory={() => {}}
          />
        )}

        {/* ── CHƯƠNG TRÌNH XANH: ĐỔI VỎ HŨ LẤY YẾN ── */}
        <EcoJarSection />

        {/* ── CẨM NANG BẾP YẾN & TỪ KHÓA SEO TỰ NHIÊN ── */}
        <HomeArticlesSection />

      </main>

      <Footer />

      {/* Floating & fixed elements */}
      <AIChatBot />
      <OrderTrayButton />

      {/* Thanh menu cố định đáy màn hình điện thoại */}
      <MobileBottomNav onOpenMenu={() => setIsMenuOpen(true)} />
    </div>
  );
}
