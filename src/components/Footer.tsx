"use client";

import { useRef } from "react";
import Link from "next/link";
import { getZaloLink, ZALO_PHONE } from "@/lib/constants";

const testimonials = [
  {
    name: "Chị Minh Châu",
    building: "Sapphire S1.05",
    text: "Yến chưng ngon tuyệt, giao đúng 20 phút còn bốc khói ấm tận cửa căn hộ. Nhà mình đặt đều đặn hàng tuần!",
    stars: 5,
    tag: "Giao nóng 20p",
  },
  {
    name: "Bác Thanh Hùng",
    building: "Biệt Thự San Hô",
    text: "Vừa gửi lại 10 vỏ hũ cũ cho shipper, được Bếp tặng ngay hũ yến tươi. Ý tưởng đổi vỏ bảo vệ môi trường Ocean Park rất tuyệt vời!",
    stars: 5,
    tag: "Đổi vỏ bảo vệ môi trường",
  },
  {
    name: "Chị Thu Hà",
    building: "Masteri Waterfront",
    text: "Yến táo đỏ hạt sen vị ngọt thanh dịu nhẹ, dùng buổi tối trước khi ngủ giúp ngủ sâu và không mộng mị.",
    stars: 5,
    tag: "Dưỡng tâm an thần",
  },
  {
    name: "Anh Hoàng Tuấn",
    building: "The Zenpark R1.02",
    text: "Set quà biếu sơn mài đỏ viền vàng kim quá sang trọng. Tặng đối tác ai cũng khen chu đáo và đẳng cấp!",
    stars: 5,
    tag: "Quà biếu hoàng gia",
  },
  {
    name: "Chị Thúy Nga",
    building: "The Pavilion P2",
    text: "Bé nhà mình hay ho gió, uống yến chưng đường phèn êm cổ họng ngay. Yến sợi dày, không bở nát như loại công nghiệp.",
    stars: 5,
    tag: "Bé ăn ngon miệng",
  },
  {
    name: "Anh Việt Đức",
    building: "The Zurich ZR1",
    text: "Thử hũ VIP Sâu Đông Trùng Tây Tạng nguyên con, phục hồi thể trạng sau phẫu thuật rất nhanh, bổ dưỡng đích thực!",
    stars: 5,
    tag: "VIP Tây Tạng",
  },
];

export default function Footer() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const zaloLink = getZaloLink("Chào Bếp Yến Ocean! Mình cần tư vấn thêm ạ 🫙");

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <footer>
      {/* ── Testimonials: Block trượt ngang gọn gàng, không tốn diện tích ── */}
      <section className="cloud-pattern-light pt-4 pb-5 px-3 sm:px-4 border-t overflow-hidden max-w-full" style={{ borderColor: "rgba(201,168,76,0.3)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-0.5">
                <span>✦</span>
                <span>Tiếng Nói Cư Dân Đại Đô Thị</span>
              </div>
              <h3
                className="text-lg sm:text-xl font-bold font-heading"
                style={{ color: "var(--red-primary)" }}
              >
                Cư Dân Ocean Park Nói Về Bếp Yến
              </h3>
            </div>

            {/* Điều hướng trượt trái/phải */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-stone-500 mr-1 hidden sm:inline">
                4.9 ⭐ (5.000+ đơn)
              </span>
              <button
                type="button"
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full border border-amber-300/80 bg-white/90 text-stone-700 flex items-center justify-center text-xs font-bold shadow-2xs hover:bg-amber-50 active:scale-95 transition-all"
                title="Trượt sang trái"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-full border border-amber-300/80 bg-white/90 text-stone-700 flex items-center justify-center text-xs font-bold shadow-2xs hover:bg-amber-50 active:scale-95 transition-all"
                title="Trượt sang phải"
              >
                ➔
              </button>
            </div>
          </div>

          {/* Dải thẻ trượt ngang (Horizontal Scroll Track) */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-3 pt-1 px-1 snap-x snap-mandatory scrollbar-hide w-full max-w-full"
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start rounded-2xl p-4 shadow-2xs flex flex-col justify-between transition-all hover:shadow-md border"
                style={{
                  background: "var(--paper)",
                  borderColor: "rgba(201,168,76,0.28)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-900/10 text-red-950 border border-red-900/20">
                      {t.tag}
                    </span>
                    <span className="text-xs text-amber-500">
                      {"⭐".repeat(t.stars)}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-stone-700 line-clamp-3">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2.5 mt-3 pt-2.5 border-t border-amber-900/10">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, var(--red-primary), var(--red-light))",
                      color: "#FFF8DC",
                    }}
                  >
                    {t.name.charAt(t.name.lastIndexOf(" ") + 1)}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold truncate text-stone-900">
                      {t.name}
                    </h5>
                    <p className="text-[10px] text-stone-500 truncate">
                      {t.building}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────── */}
      <div
        className="cloud-pattern py-8 px-4 text-center"
        style={{ background: "var(--red-primary)" }}
      >
        <p
          className="text-sm font-semibold mb-1"
          style={{ color: "rgba(255,215,100,0.8)" }}
        >
          Tư vấn thực đơn · Giao nóng nội khu · Hỗ trợ cư dân
        </p>
        <a
          href={zaloLink}
          target="_blank"
          rel="noreferrer"
          className="tap-active inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
            color: "var(--red-deep)",
          }}
        >
          <span>💬</span>
          Tư Vấn Zalo · {ZALO_PHONE}
        </a>
      </div>

      {/* ── Legal & Compliance Disclaimer strip ─────────────────── */}
      <div
        className="pt-6 pb-[calc(88px+env(safe-area-inset-bottom,0px))] sm:pb-8 px-4 text-center border-t border-amber-400/20"
        style={{ background: "var(--red-deep)" }}
      >
        <div className="max-w-2xl mx-auto rounded-2xl bg-black/25 p-3.5 sm:p-4 border border-amber-300/15 mb-3 shadow-xs">
          <p className="text-[11px] sm:text-xs leading-relaxed text-amber-100/75">
            ℹ️ Website mang tính chất giới thiệu thực đơn dinh dưỡng nội khu Vinhomes Ocean Park. Mọi tư vấn và giao dịch được trao đổi trực tiếp qua Zalo/Hotline chính thức của Bếp Yến Ocean.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10px] text-amber-200/60 mb-2.5">
          <Link href="/cam-nang" className="hover:text-amber-200 underline font-semibold">
            Cẩm nang yến sào
          </Link>
          <span>·</span>
          <Link href="/cam-nang/5-cach-phan-biet-yen-that-va-yen-don-mu-trom" className="hover:text-amber-200">
            Phân biệt yến thật
          </Link>
          <span>·</span>
          <Link href="/cam-nang/thoi-tiet-giao-mua-nen-an-yen-gi-boi-bo-cho-nguoi-gia-va-tre-nho" className="hover:text-amber-200">
            Yến giao mùa
          </Link>
          <span>·</span>
          <Link href="/cam-nang/dia-chi-mua-yen-chung-tuoi-giao-nong-20-phut-vinhomes-ocean-park" className="hover:text-amber-200">
            Giao nóng 20P Ocean Park
          </Link>
        </div>
        <p className="text-[10px] sm:text-[11px] tracking-wide text-amber-200/40">
          © 2025 Bếp Yến Ocean · Vinhomes Ocean Park, Gia Lâm, Hà Nội · Yến chưng tươi cách thủy thượng hạng
        </p>
      </div>
    </footer>
  );
}
