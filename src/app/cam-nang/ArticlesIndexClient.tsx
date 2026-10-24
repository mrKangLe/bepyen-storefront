"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderTrayButton from "@/components/OrderTrayButton";
import AIChatBot from "@/components/AIChatBot";
import MobileBottomNav from "@/components/MobileBottomNav";
import { ARTICLES } from "@/data/articles";

export default function ArticlesIndexClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden max-w-full w-full"
      style={{ background: "var(--parchment)" }}
    >
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Breadcrumb */}
      <nav className="bg-[#FAF6ED] border-b border-[#E8DFCE] py-2 px-3 sm:px-4 text-xs">
        <div className="max-w-3xl mx-auto flex items-center gap-1.5 text-stone-600">
          <Link href="/" className="hover:text-red-900 transition flex items-center gap-1">
            <span>🏠</span>
            <span>Trang Chủ</span>
          </Link>
          <span className="text-stone-400">/</span>
          <span className="text-red-950 font-semibold">Cẩm Nang Dưỡng Sinh Hoàng Gia</span>
        </div>
      </nav>

      <main className="flex-1 max-w-3xl w-full mx-auto px-3.5 sm:px-6 pt-5 pb-3 sm:pb-4">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold tracking-wider inline-block mb-2 shadow-xs"
            style={{
              background: "linear-gradient(135deg, var(--gold-light), var(--gold))",
              color: "var(--red-deep)",
            }}
          >
            📖 KIẾN THỨC CẨM NANG NGỰ THIỆN
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-red-950 mb-2">
            Cẩm Nang Bếp Yến Ocean
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Kinh nghiệm phân biệt yến thật giả, phương pháp chưng cất bảo toàn vi chất và bí quyết bồi bổ phế khí, hồi phục nguyên khí cho mọi lứa tuổi.
          </p>
        </div>

        {/* Danh sách bài viết */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/cam-nang/${article.slug}`}
              className="p-4 rounded-2xl bg-white border border-[#E3D9C3] hover:border-red-900/50 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3 border border-stone-200">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#72161A]/90 text-white backdrop-blur-xs">
                    {article.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1.5">
                  <span>⏱️ {article.readTime}</span>
                  <span>•</span>
                  <span>📅 {article.date}</span>
                </div>

                <h2 className="font-heading font-bold text-sm sm:text-base text-stone-900 group-hover:text-red-950 transition line-clamp-2 mb-1.5">
                  {article.title}
                </h2>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {article.shortDesc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-500 font-medium">
                  {article.author}
                </span>
                <span className="text-red-900 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Đọc cẩm nang ➔
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
      <AIChatBot
        customTooltip="Em Nhung: Dạ Bác & Anh/Chị cần em tư vấn vị yến bồi bổ hay giao nóng 20P ạ? 🫙"
        defaultPrompt="Em Nhung ơi, tư vấn giúp mình các vị yến chưng bồi bổ phù hợp nhé!"
      />
      <OrderTrayButton />
      <MobileBottomNav onOpenMenu={() => setIsMenuOpen(true)} />
    </div>
  );
}
