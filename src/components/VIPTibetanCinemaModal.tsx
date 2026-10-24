"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useOrder } from "@/context/OrderContext";
import { ZALO_PHONE, getZaloLink } from "@/lib/constants";
import { type VIPProduct } from "@/data/products";

interface VIPTibetanCinemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  vipProduct: VIPProduct;
  initialStep?: "trailer" | "order";
}

const CINEMA_SCENES = [
  {
    id: 1,
    tag: "CẢNH I · ĐỘ CAO 4.500M HIMALAYA",
    headline: "Vùng Băng Tuyết Ngàn Năm",
    subtext:
      "Trên những vách đá băng giá khắc nghiệt nhất của rặng tuyết sơn Tây Tạng... Nơi con người phải nằm sấp trên băng buốt giá, dùng tay không đào bới từng tấc đất để tìm kiếm mầm sống quý hơn vàng ròng.",
    quote: "— 100% Khai thác thủ công từ đỉnh tuyết sơn Tây Tạng —",
    accent: "from-sky-300 via-amber-200 to-yellow-300",
    image: "/images/tibet-himalaya-peaks.jpg",
    imageZoom: "scale-110",
  },
  {
    id: 2,
    tag: "CẢNH II · KỲ TÍCH ĐÔNG TRÙNG",
    headline: "Đông Là Côn Trùng · Hạ Hóa Thảo Dược",
    subtext:
      "Mùa đông giá rét, ấu trùng ngậm sương băng ngủ sâu dưới lòng đất tuyết, hút trọn linh khí đất trời ngàn năm. Mùa hạ tuyết tan, từ đầu ấu trùng vươn mầm nấm thảo dược kỳ diệu, đón trọn nhật nguyệt quang hoa.",
    quote: "— Kỳ tích sinh học duy nhất trong trời đất —",
    accent: "from-amber-300 via-yellow-200 to-amber-400",
    image: "/images/tibet-cordyceps-raw.jpg",
    imageZoom: "scale-115",
  },
  {
    id: 3,
    tag: "CẢNH III · ĐẠI BỔ NGUYÊN KHÍ",
    headline: "1 Con Sâu — Vạn Giọt Sinh Khí",
    subtext:
      "Hàm lượng Cordycepin và Adenosine tự nhiên đạt đỉnh cao nhất thế giới. Ngâm cùng yến chưng tươi cách thủy bốc khói: Bồi bổ nguyên khí thần tốc cho người phẫu thuật, phục hồi suy kiệt và là ngự phẩm ngoại giao vô giá.",
    quote: "— Đơn giá 400.000đ / Con sâu tự nhiên nguyên vẹn —",
    accent: "from-amber-200 via-yellow-300 to-amber-400",
    image: "/images/product-vip-sau.jpg",
    imageZoom: "scale-120",
  },
];

export default function VIPTibetanCinemaModal({
  isOpen,
  onClose,
  vipProduct,
  initialStep = "trailer",
}: VIPTibetanCinemaModalProps) {
  const [currentStep, setCurrentStep] = useState<"trailer" | "order">(initialStep);
  const [sceneIndex, setSceneIndex] = useState(0); // 0, 1, 2
  const [sceneProgress, setSceneProgress] = useState(0); // 0 -> 100% per scene
  const [isPaused, setIsPaused] = useState(false);
  const [selectedFlavorId, setSelectedFlavorId] = useState<number>(1);
  const [worms, setWorms] = useState<1 | 2>(1);
  const [added, setAdded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addItem, openTray } = useOrder();

  const SCENE_DURATION_MS = 4500; // Mỗi cảnh 4.5 giây

  // Reset khi mở modal
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialStep);
      setSceneIndex(0);
      setSceneProgress(0);
      setIsPaused(false);
    }
  }, [isOpen, initialStep]);

  // Bộ đếm thời gian cho từng cảnh (Scene Timer)
  useEffect(() => {
    if (!isOpen || currentStep !== "trailer" || isPaused) return;

    const intervalMs = 50;
    const increment = (intervalMs / SCENE_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setSceneProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          // Sang cảnh tiếp theo hoặc kết thúc phim
          if (sceneIndex < CINEMA_SCENES.length - 1) {
            setSceneIndex((s) => s + 1);
            return 0;
          } else {
            // Hết cảnh cuối -> Chuyển sang đặt hàng
            clearInterval(timer);
            setTimeout(() => setCurrentStep("order"), 300);
            return 100;
          }
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, currentStep, isPaused, sceneIndex]);

  // Hiệu ứng Canvas Bụi Vàng & Bông Tuyết Rơi 60fps (Cinematic Snow & Golden Dust)
  useEffect(() => {
    if (!isOpen || currentStep !== "trailer") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 700);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", onResize);

    // Tạo các hạt bụi vàng & bông tuyết
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedY: Math.random() * 0.7 + 0.3,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.3,
      gold: Math.random() > 0.4, // Hạt vàng hoặc tuyết trắng
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y > height) {
          p.y = -5;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(255, 215, 0, ${p.opacity})`
          : `rgba(255, 255, 255, ${p.opacity * 0.8})`;
        ctx.shadowBlur = p.gold ? 6 : 2;
        ctx.shadowColor = p.gold ? "#F59E0B" : "#FFFFFF";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const vipImage = vipProduct.image || "/images/product-vip-sau.jpg";
  const currentScene = CINEMA_SCENES[sceneIndex];

  const selectedFlavor =
    vipProduct.baseFlavors.find((f) => f.id === selectedFlavorId) ||
    vipProduct.baseFlavors[0] ||
    { id: 1, name: "Đường Phèn Thanh Mát", price: 80000 };
  const wormPrice = vipProduct.wormPrice || 400000;
  const wormTotal = worms * wormPrice;
  const unitPrice = selectedFlavor.price + wormTotal;

  const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "đ";

  const handleNextScene = () => {
    if (sceneIndex < CINEMA_SCENES.length - 1) {
      setSceneIndex((prev) => prev + 1);
      setSceneProgress(0);
    } else {
      setCurrentStep("order");
    }
  };

  const handlePrevScene = () => {
    if (sceneIndex > 0) {
      setSceneIndex((prev) => prev - 1);
      setSceneProgress(0);
    }
  };

  const handleSkipToOrder = () => {
    setCurrentStep("order");
  };

  const handleAddToCart = () => {
    const key = `vip-${selectedFlavorId}-${worms}`;
    const extras = `Sâu Tây Tạng tự nhiên × ${worms} con (+${formatPrice(wormTotal)})`;
    addItem({
      key,
      productId: 0,
      title: `Hũ VIP Sâu Tây Tạng · ${selectedFlavor.name}`,
      volume: "Hũ Ngự Phẩm VIP",
      unitPrice,
      extras,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      openTray();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-2xl transition-all animate-in fade-in duration-300 select-none">
      {/* ── HỘP ĐIỆN ẢNH CHÍNH (THEATER CONTAINER) ───────────── */}
      <div
        className="relative w-full max-w-lg h-[92vh] max-h-[740px] rounded-3xl overflow-hidden flex flex-col border border-amber-400/80 shadow-[0_0_60px_rgba(217,119,6,0.35)]"
        style={{
          background: "radial-gradient(ellipse at 50% 10%, #200407 0%, #0D0103 60%, #000000 100%)",
        }}
      >
        {/* ── BƯỚC 1: RẠP PHIM ĐIỆN ẢNH (CINEMA THEATER) ──────── */}
        {currentStep === "trailer" && (
          <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
            {/* 1. LỚP NỀN HÌNH ẢNH ĐIỆN ẢNH ĐA DẠNG THEO TỪNG CẢNH (KEN BURNS ZOOM & CROSSFADE) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden bg-black">
              {CINEMA_SCENES.map((scene, idx) => {
                const isActive = idx === sceneIndex;
                return (
                  <div
                    key={scene.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      isActive ? "opacity-60 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <div
                      className={`w-full h-full relative transition-transform duration-[4500ms] ease-out ${
                        isActive ? scene.imageZoom : "scale-100"
                      }`}
                    >
                      <Image
                        src={scene.image}
                        alt={scene.headline}
                        fill
                        priority={idx === 0}
                        className="object-cover object-center"
                      />
                    </div>
                  </div>
                );
              })}

              {/* Lớp phủ điện ảnh (Cinematic Vignette) */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/50 to-black/80 pointer-events-none" />
              <div className="absolute inset-0 z-10 bg-radial from-transparent via-black/40 to-black pointer-events-none" />
            </div>

            {/* 2. CANVAS BỤI VÀNG & TUYẾT RƠI */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none z-10"
            />

            {/* 3. THANH ĐIỀU HƯỚNG TỪNG PHÂN ĐOẠN (STORY SEGMENT BAR) */}
            <div className="relative z-30 pt-3 px-4 flex flex-col gap-2 bg-gradient-to-b from-black/80 to-transparent">
              {/* 3 Thanh thời lượng (Như Story Instagram/Trailer Netflix) */}
              <div className="grid grid-cols-3 gap-1.5 w-full">
                {CINEMA_SCENES.map((s, idx) => {
                  let fill = 0;
                  if (idx < sceneIndex) fill = 100;
                  else if (idx === sceneIndex) fill = sceneProgress;
                  return (
                    <div
                      key={s.id}
                      className="h-1 rounded-full bg-white/20 overflow-hidden"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-75"
                        style={{ width: `${fill}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Thanh tiêu đề & Nút Bỏ qua mua ngay */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-amber-300 font-heading">
                    {currentScene.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSkipToOrder}
                    className="tap-active px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-red-950 shadow-md border border-amber-300 hover:scale-105 transition cursor-pointer"
                  >
                    Bỏ qua trailer • Mua ngay ➔
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-white/10 hover:bg-white/20 text-stone-300 border border-white/10 transition cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* 4. KHU VỰC CHẠM CHUYỂN CẢNH TRÁI / PHẢI */}
            <div
              className="absolute inset-0 z-20 flex"
              onMouseDown={() => setIsPaused(true)}
              onMouseUp={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              <div
                className="w-1/3 h-full cursor-w-resize"
                onClick={handlePrevScene}
                title="Bấm để xem lại cảnh trước"
              />
              <div
                className="w-2/3 h-full cursor-e-resize"
                onClick={handleNextScene}
                title="Bấm để xem cảnh tiếp theo"
              />
            </div>

            {/* 5. NỘI DUNG CHỮ ĐIỆN ẢNH (CINEMATIC TYPOGRAPHY) GIỮA MÀN HÌNH */}
            <div
              key={sceneIndex}
              className="relative z-30 px-6 sm:px-8 my-auto text-center space-y-4 animate-in fade-in zoom-in-95 duration-700 pointer-events-none"
            >
              {/* Biểu tượng ngọn lửa / bông sen vàng */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-amber-400/50 bg-amber-950/60 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                <span className="text-xl animate-pulse">👑</span>
              </div>

              {/* Tiêu đề phân cảnh mạ vàng phát sáng */}
              <h2
                className={`text-2xl sm:text-3xl font-black font-heading leading-tight tracking-tight bg-gradient-to-r ${currentScene.accent} bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]`}
              >
                {currentScene.headline}
              </h2>

              {/* Lời dẫn truyện hào hùng */}
              <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-serif font-light text-justify sm:text-center drop-shadow-md">
                "{currentScene.subtext}"
              </p>

              {/* Trích dẫn ngọc son */}
              <div className="pt-2">
                <span className="inline-block text-xs font-bold text-amber-300/90 font-serif tracking-wider bg-black/60 px-3 py-1 rounded-full border border-amber-500/30">
                  {currentScene.quote}
                </span>
              </div>
            </div>

            {/* 6. THANH HÀNH ĐỘNG DƯỚI ĐÁY CINEMA */}
            <div className="relative z-30 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between gap-3">
              <div className="text-left">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">
                  Cực Phẩm Tây Tạng
                </span>
                <span className="text-base sm:text-lg font-black text-amber-300 font-heading">
                  400.000đ / Con Sâu
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaused((p) => !p)}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-stone-300 border border-white/10 transition cursor-pointer"
                  title={isPaused ? "Tiếp tục" : "Tạm dừng để đọc"}
                >
                  {isPaused ? "▶ Tiếp tục" : "⏸ Dừng"}
                </button>

                <button
                  type="button"
                  onClick={handleSkipToOrder}
                  className="tap-active px-5 py-2.5 rounded-xl text-xs font-black shadow-xl border border-amber-400 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-red-950 transition hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Đặt Mua Ngay ➔</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── BƯỚC 2: BẢNG ĐẶT HÀNG HOÀNG GIA (ORDER CONFIGURATION) ── */}
        {currentStep === "order" && (
          <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-5 overflow-y-auto thin-scroll space-y-4 animate-in fade-in duration-300">
            {/* Header tóm tắt */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/30">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-amber-400 shadow-md shrink-0">
                  <Image
                    src={vipImage}
                    alt={vipProduct.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-900 text-amber-200 border border-amber-400/50">
                    👑 CỰC PHẨM NGỰ THIỆN
                  </span>
                  <h3 className="text-base font-bold font-heading text-amber-100 truncate mt-0.5">
                    {vipProduct.title}
                  </h3>
                  <p className="text-xs text-amber-300 font-bold">
                    400.000đ / Con Sâu Tây Tạng Tự Nhiên
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep("trailer");
                  setSceneIndex(0);
                  setSceneProgress(0);
                }}
                className="tap-active text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-500/30 transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>🎬 Xem lại phim</span>
              </button>
            </div>

            {/* 1. Chọn vị cốt chưng kèm */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <span>1.</span>
                <span>Chọn Vị Cốt Yến Chưng Kèm:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(vipProduct.baseFlavors || []).map((f) => {
                  const isSel = selectedFlavorId === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFlavorId(f.id)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                        isSel
                          ? "bg-amber-400/20 border-amber-400 text-amber-100 font-bold shadow-xs"
                          : "bg-white/5 border-white/10 text-stone-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-xs leading-tight">{f.name}</span>
                      <span className="text-xs font-bold text-amber-300 shrink-0 ml-1">
                        {formatPrice(f.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Chọn số lượng sâu Tây Tạng */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <span>2.</span>
                <span>Số Lượng Sâu Tây Tạng Ngâm Thêm:</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setWorms(1)}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    worms === 1
                      ? "bg-gradient-to-b from-amber-400/25 to-amber-500/10 border-amber-400 text-amber-100 shadow-md font-bold"
                      : "bg-white/5 border-white/10 text-stone-300 hover:bg-white/10"
                  }`}
                >
                  <span className="block text-xs font-black uppercase text-amber-200">
                    🐛 1 Con Nguyên Vẹn
                  </span>
                  <span className="text-sm font-extrabold text-amber-300 block mt-1">
                    +{formatPrice(wormPrice)}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    Hồi phục thể trạng êm dịu
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setWorms(2)}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer relative overflow-hidden ${
                    worms === 2
                      ? "bg-gradient-to-b from-amber-400/25 to-amber-500/10 border-amber-400 text-amber-100 shadow-md font-bold"
                      : "bg-white/5 border-white/10 text-stone-300 hover:bg-white/10"
                  }`}
                >
                  <span className="absolute top-0 right-0 bg-red-700 text-white text-[8px] font-black px-1.5 py-0.2 rounded-bl">
                    ĐẠI BỔ VIP
                  </span>
                  <span className="block text-xs font-black uppercase text-amber-200">
                    🐛🐛 2 Con Đại Bổ
                  </span>
                  <span className="text-sm font-extrabold text-amber-300 block mt-1">
                    +{formatPrice(wormPrice * 2)}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    Phục hồi sau đại phẫu / Biếu VIP
                  </span>
                </button>
              </div>
            </div>

            {/* Cam kết giao nóng & Hotline Bếp trưởng */}
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200/90 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <span>♨️</span>
                <span>Chưng cách thủy mẻ riêng — Giao nóng 20–30 phút bốc khói tận căn hộ!</span>
              </div>
              <p className="text-stone-300 text-[10px]">
                Cần xem video trực tiếp sâu Tây Tạng thật trước khi chưng? Nhắn ngay Zalo Bếp Trưởng:{" "}
                <a
                  href={getZaloLink(`Chào Bếp Trưởng, tôi muốn xem video con sâu Tây Tạng ngâm hũ yến trước khi đặt.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold underline text-amber-300"
                >
                  {ZALO_PHONE} (Nhấn để gọi/chat) ↗
                </a>
              </p>
            </div>

            {/* Dòng Tổng Tiền & Nút Chốt Ngay */}
            <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between gap-3 mt-auto">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">
                  Tổng đơn hũ VIP:
                </span>
                <span className="text-xl sm:text-2xl font-black text-amber-300 font-heading">
                  {formatPrice(unitPrice)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-stone-300 border border-white/10 transition cursor-pointer"
                >
                  Đóng
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`tap-active px-5 py-2.5 rounded-xl text-xs font-black shadow-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-red-950 hover:scale-105"
                  }`}
                >
                  <span>{added ? "✓ Đã Thêm Hũ VIP!" : "🛵 Đặt Giao Nóng ➔"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
