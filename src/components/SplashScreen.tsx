"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Kiểm tra xem có cần bỏ qua không (chỉ bỏ qua nếu vừa thấy cách đây chưa đầy 30 giây trong cùng tab)
    const lastShown = sessionStorage.getItem("bepyen_intro_last_time");
    const now = Date.now();
    if (lastShown && now - parseInt(lastShown, 10) < 30000) {
      setVisible(false);
      return;
    }

    sessionStorage.setItem("bepyen_intro_last_time", now.toString());

    // Bắt đầu thanh tiến trình mượt mà
    const startProgress = setTimeout(() => {
      setProgress(100);
    }, 50);

    // Sau 2.8 giây bắt đầu mờ dần (đủ thời gian khách đọc kỹ thương hiệu & cam kết)
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2800);

    // Sau 3.4 giây gỡ bỏ hoàn toàn khỏi DOM
    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 3400);

    return () => {
      clearTimeout(startProgress);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none transition-all duration-700 cursor-pointer ${
        fading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: "radial-gradient(ellipse at center, #680E13 0%, #300507 60%, #140203 100%)",
      }}
    >
      {/* Khung viền hoa văn hoàng gia góc */}
      <div className="absolute inset-4 sm:inset-8 border border-amber-400/25 rounded-3xl pointer-events-none" />
      <div className="absolute inset-5 sm:inset-9 border border-amber-400/15 rounded-[22px] pointer-events-none" />

      {/* Nội dung trung tâm */}
      <div className="relative flex flex-col items-center text-center p-6 max-w-md w-full">
        {/* Vòng hào quang vàng kim và Logo */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-5">
          {/* Hào quang tỏa sáng */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 opacity-40 blur-lg animate-pulse" />

          {/* Logo Bếp Yến Icon */}
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] p-1 bg-[#460A0D]">
            <Image
              src="/icon-192.png"
              alt="Bếp Yến Ocean"
              fill
              priority
              className="object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Huy hiệu triện son */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[11px] font-black tracking-widest uppercase mb-3 shadow-xs">
          <span>✦ NGỰ CHẾ HOÀNG GIA ✦</span>
        </div>

        {/* Tên thương hiệu */}
        <h1
          className="text-3xl sm:text-4xl font-black font-heading tracking-wider"
          style={{
            backgroundImage: "linear-gradient(135deg, #FFF6D6, #F5DE98, #D4AF37)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          BẾP YẾN OCEAN
        </h1>

        {/* Định vị thương hiệu cốt lõi */}
        <p className="text-sm text-amber-100/90 mt-2 font-medium tracking-wide">
          Yến Chưng Tươi Giao Nóng 20 Phút · Ocean Park
        </p>

        {/* 3 Cam kết vàng (Khách dễ đọc và ghi nhớ vào đầu) */}
        <div className="grid grid-cols-3 gap-2 mt-5 w-full max-w-xs">
          <div className="p-2 rounded-xl bg-black/25 border border-amber-400/20 text-center">
            <span className="block text-base">♨️</span>
            <span className="text-[10px] font-bold text-amber-200 block mt-0.5">Giao 20 Phút</span>
          </div>
          <div className="p-2 rounded-xl bg-black/25 border border-amber-400/20 text-center">
            <span className="block text-base">🕊️</span>
            <span className="text-[10px] font-bold text-amber-200 block mt-0.5">100% Yến Tươi</span>
          </div>
          <div className="p-2 rounded-xl bg-black/25 border border-amber-400/20 text-center">
            <span className="block text-base">🌿</span>
            <span className="text-[10px] font-bold text-amber-200 block mt-0.5">Chưng Thủ Công</span>
          </div>
        </div>

        {/* Thanh loading vàng kim chạy đều trong 2.8 giây */}
        <div className="w-52 h-1.5 bg-amber-950/90 rounded-full mt-6 overflow-hidden border border-amber-500/40 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 rounded-full transition-all duration-[2800ms] ease-out shadow-xs"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[11px] text-amber-200/60 mt-3 font-normal">
          Chạm nhẹ bất kỳ đâu để vào ngay →
        </span>
      </div>
    </div>
  );
}
