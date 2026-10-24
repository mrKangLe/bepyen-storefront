import Image from "next/image";
import Link from "next/link";
import { ARTICLES } from "@/data/articles";

export default function HomeArticlesSection() {
  return (
    <section className="mt-5 mb-1 pt-1 pb-1">
      {/* Header section */}
      <div className="flex items-end justify-between mb-4 px-1">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider mb-1 shadow-xs bg-amber-100 text-red-950 border border-amber-300/80">
            <span>📖</span>
            <span>CẨM NANG DƯỠNG SINH</span>
          </div>
          <h2 className="font-heading font-extrabold text-base sm:text-xl text-red-950">
            Kiến Thức Bổ Ích & Phân Biệt Yến Thật
          </h2>
          <p className="text-[11px] sm:text-xs text-stone-600 mt-0.5">
            Bí quyết dưỡng thân, ấm tỳ vị & nhận biết yến nguyên chất từ Bếp Trưởng
          </p>
        </div>

        <Link
          href="/cam-nang"
          className="text-xs font-bold text-red-900 hover:text-red-950 transition flex items-center gap-0.5 shrink-0 ml-2"
        >
          <span>Tất cả</span>
          <span>➔</span>
        </Link>
      </div>

      {/* Dải cuộn ngang mượt mà trên mobile, grid trên màn hình lớn */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-x-auto pb-3 pt-1 -mx-3 px-3 sm:mx-0 sm:px-0 no-scrollbar snap-x snap-mandatory">
        {ARTICLES.map((article) => (
          <Link
            key={article.slug}
            href={`/cam-nang/${article.slug}`}
            className="w-[260px] sm:w-auto shrink-0 snap-start p-3 rounded-2xl bg-white border border-[#E3D9C3] hover:border-red-900/40 hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              {/* Thumbnail */}
              <div className="relative w-full h-32 rounded-xl overflow-hidden mb-2.5 border border-stone-200">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 260px, 300px"
                />
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#72161A]/90 text-white backdrop-blur-xs">
                  {article.category}
                </span>
              </div>

              {/* Read time */}
              <div className="flex items-center gap-1.5 text-[10px] text-stone-500 mb-1">
                <span>⏱️ {article.readTime}</span>
                <span>•</span>
                <span>{article.date}</span>
              </div>

              {/* Title */}
              <h3 className="font-heading font-bold text-xs sm:text-[13px] text-stone-900 group-hover:text-red-950 transition line-clamp-2 leading-snug mb-1">
                {article.title}
              </h3>

              {/* Short desc */}
              <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                {article.shortDesc}
              </p>
            </div>

            <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[10px] text-stone-400">
                Bếp Yến Ocean
              </span>
              <span className="text-[11px] text-red-900 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                Đọc ngay ➔
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
