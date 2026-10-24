"use client";

import { usePWA } from "@/context/PWAContext";

export default function InstallPWA() {
  const {
    isInstalled,
    isAndroid,
    isIOS,
    showGuideModal,
    setShowGuideModal,
    showAutoPrompt,
    dismissAutoPrompt,
    triggerInstall,
  } = usePWA();

  // Đã cài đặt rồi thì tuyệt đối không hiển thị popup/banner gì nữa
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* ── 1. POPUP / THÔNG BÁO TỰ ĐỘNG (CHỈ HIỂN THỊ ĐÚNG 1 LẦN DUY NHẤT TRÊN ĐIỆN THOẠI) ── */}
      {showAutoPrompt && (
        <aside
          role="region"
          aria-label="Cài đặt ứng dụng"
          className="fixed bottom-[calc(56px+env(safe-area-inset-bottom,0px)+10px)] left-3 right-3 sm:left-auto sm:right-5 sm:bottom-6 sm:max-w-sm z-50 bounce-in"
        >
          <div
            className="rounded-2xl p-3.5 shadow-2xl relative text-stone-900 border"
            style={{
              background: "linear-gradient(135deg, #FFFDF9, #FBF6EC)",
              borderColor: "var(--gold)",
              boxShadow: "0 10px 30px rgba(70, 10, 13, 0.35), 0 0 15px rgba(201, 168, 76, 0.25)",
            }}
          >
            {/* Nút đóng 1 lần duy nhất */}
            <button
              type="button"
              onClick={dismissAutoPrompt}
              aria-label="Đóng và không hiện lại"
              className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-stone-400 hover:text-stone-800 bg-stone-100/80 transition-colors cursor-pointer"
              title="Đóng (không hiện lại)"
            >
              ✕
            </button>

            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-xs border"
                style={{
                  background: "linear-gradient(135deg, var(--red-primary), var(--red-deep))",
                  borderColor: "var(--gold)",
                  color: "#FFF8DC",
                }}
              >
                {isIOS ? "🍎" : "📲"}
              </div>
              <div className="min-w-0 pr-4">
                <h4 className="font-bold text-xs sm:text-sm text-red-950 font-heading">
                  {isIOS ? "Cài Bếp Yến Lên iPhone" : "Cài App Bếp Yến Ocean"}
                </h4>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                  {isIOS
                    ? "Đưa icon ra màn hình chính Safari · Chạm là mở đặt nóng 20 phút"
                    : "Mở 1 chạm trên màn hình · Nhận ưu đãi cư dân & theo dõi thợ chưng nóng 20p"}
                </p>

                <div className="flex items-center gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={triggerInstall}
                    className="tap-active px-3.5 py-1.5 rounded-full text-xs font-bold text-[#3A080B] shadow-md transition-all hover:scale-105 border border-amber-300 cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #F5DE98, #D4AF37, #AA8222)",
                    }}
                  >
                    {isIOS ? "🍎 Hướng Dẫn Cài (10s)" : isAndroid ? "⚡ Cài Ngay (1 Chạm)" : "📲 Cài Lên Màn Hình"}
                  </button>
                  <button
                    type="button"
                    onClick={dismissAutoPrompt}
                    className="text-[11px] font-medium text-stone-500 hover:text-stone-800 px-2 py-1 cursor-pointer"
                  >
                    Để sau
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ── 2. MODAL HƯỚNG DẪN CHI TIẾT (CHỈ DÀNH RIÊNG CHO IPHONE / IPAD VÌ APPLE KHÔNG HỖ TRỢ API TỰ ĐỘNG) ── */}
      {showGuideModal && isIOS && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs select-none"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="bounce-in w-full max-w-sm rounded-3xl p-5 sm:p-6 shadow-2xl relative text-stone-900 border-[1.5px] max-h-[92vh] overflow-y-auto thin-scroll"
            style={{
              background: "#FFFDF9",
              borderColor: "var(--gold)",
              boxShadow: "0 20px 40px rgba(44, 24, 16, 0.35)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng modal */}
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition cursor-pointer"
              title="Đóng hướng dẫn"
            >
              ✕
            </button>

            {/* HEADER MODAL DÀNH RIÊNG CHO IPHONE */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-sm border shrink-0"
                style={{
                  background: "linear-gradient(135deg, #007AFF, #0051A8)",
                  borderColor: "#70B4FF",
                  color: "#FFF8DC",
                }}
              >
                🍎
              </div>
              <div className="min-w-0 pr-6">
                <h4 className="font-extrabold text-sm sm:text-base font-heading text-red-950 leading-tight">
                  Cài Bếp Yến Lên iPhone
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  3 bước đưa icon ra màn hình chính Safari
                </p>
              </div>
            </div>

            {/* 3 BƯỚC SAFARI GUIDE CHO IPHONE */}
            <div className="space-y-2.5 mb-4">
              {/* BƯỚC 1: BẤM NÚT CHIA SẺ */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <div className="w-9 h-9 rounded-xl bg-[#007AFF]/10 border border-[#007AFF]/30 flex items-center justify-center text-[#007AFF] shrink-0 shadow-2xs">
                  {/* Safari Share Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-red-900 text-amber-200 flex items-center justify-center font-bold text-[9px]">1</span>
                    <h5 className="font-bold text-xs text-stone-900">Bấm nút Chia Sẻ trên Safari</h5>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                    Ở thanh công cụ dưới cùng Safari, bấm biểu tượng <strong className="text-[#007AFF]">Chia sẻ [ ↑ ]</strong> (ô vuông có mũi tên chỉ lên).
                  </p>
                </div>
              </div>

              {/* BƯỚC 2: CHỌN THÊM VÀO MÀN HÌNH CHÍNH */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-2xs">
                  {/* Add to Home Screen Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-red-900 text-amber-200 flex items-center justify-center font-bold text-[9px]">2</span>
                    <h5 className="font-bold text-xs text-stone-900">Chọn &quot;Thêm vào MH chính&quot;</h5>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                    Kéo danh sách xuống dưới và bấm chọn dòng <strong className="text-red-950">&quot;Thêm vào Màn hình chính&quot;</strong> (Add to Home Screen).
                  </p>
                </div>
              </div>

              {/* BƯỚC 3: BẤM NÚT THÊM Ở GÓC TRÊN */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <div className="w-9 h-9 rounded-xl bg-[#007AFF] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                  Thêm
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-red-900 text-amber-200 flex items-center justify-center font-bold text-[9px]">3</span>
                    <h5 className="font-bold text-xs text-stone-900">Bấm &quot;Thêm&quot; ở góc trên</h5>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                    Bấm nút <strong className="text-[#007AFF] font-bold">&quot;Thêm&quot;</strong> (Add) ở góc trên bên phải màn hình để hoàn tất.
                  </p>
                </div>
              </div>

              {/* GHI CHÚ CHĂM SÓC KHÁCH HÀNG */}
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                <span className="text-base shrink-0">✨</span>
                <p className="leading-snug">
                  Icon <strong>Bếp Yến Ocean</strong> sẽ xuất hiện ngay cạnh Zalo trên màn hình iPhone, chạm nhẹ là xem mẻ chưng nóng 20 phút bồi bổ cả nhà!
                </p>
              </div>

              <div className="p-2 rounded-lg bg-stone-100 text-[10px] text-stone-500 text-center">
                💡 Nếu đang mở trong Zalo/Facebook, bấm dấu <strong>3 chấm</strong> góc trên chọn <strong>&quot;Mở bằng Safari&quot;</strong> trước nhé!
              </div>
            </div>

            {/* NÚT XÁC NHẬN ĐÃ HIỂU */}
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="tap-active w-full py-2.5 rounded-xl text-xs sm:text-sm font-black text-white shadow-md transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, var(--red-primary), var(--red-deep))",
              }}
            >
              Đã hiểu, tôi thao tác ngay
            </button>
          </div>
        </div>
      )}
    </>
  );
}
