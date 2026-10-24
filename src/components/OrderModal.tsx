"use client";

import { useState, useEffect } from "react";
import { useOrder } from "@/context/OrderContext";
import { OCEAN_PARK_BUILDINGS, ZALO_PHONE, getZaloLink } from "@/lib/constants";
import { submitOrder } from "@/lib/supabase";
import { getStoredAffiliateCode } from "@/lib/affiliate";
import ConfirmModal from "./ConfirmModal";

export default function OrderModal() {
  const {
    isOpen,
    items,
    totalPrice,
    totalItems,
    updateQty,
    removeItem,
    clearOrder,
    closeTray,
    dismissTray,
  } = useOrder();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [building, setBuilding] = useState("");
  const [room, setRoom] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<"items" | "info" | "done">("items");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [orderCode, setOrderCode] = useState("YEN88");
  const [returnJars, setReturnJars] = useState(false);
  const [returnJarCount, setReturnJarCount] = useState(5);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    setOrderCode("YEN" + Math.floor(10 + Math.random() * 90));
  }, []);

  const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "đ";

  // ── Tính toán ưu đãi cư dân Ocean Park (Ưu tiên số 4) ──
  const freshJarQty = items
    .filter((i) => !i.title.includes("Tổ Yến") && !i.title.includes("Set"))
    .reduce((sum, i) => sum + i.qty, 0);

  const hasNest = items.some((i) => i.title.includes("Tổ Yến"));

  // ── Tạo văn bản hóa đơn Zalo chuẩn chỉ (Ưu tiên số 3) ──
  const buildFullInvoiceText = () => {
    const lines = [
      `🫙 ĐƠN ĐẶT YẾN CHƯNG - BẾP YẾN OCEAN [#${orderCode}]`,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `👤 Khách hàng: ${name.trim()}`,
      `📞 Số điện thoại: ${phone.trim()}`,
      building ? `🏠 Tòa / Phân khu: ${building}` : "🏠 Khu vực: Vinhomes Ocean Park",
      room ? `🚪 Căn hộ / Địa chỉ: ${room.trim()}` : "",
      note ? `📝 Ghi chú khẩu vị: ${note.trim()}` : "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "📦 MÓN ĐÃ ĐẶT:",
      ...items.map(
        (item, i) =>
          `${i + 1}. ${item.title} (${item.volume})${item.extras ? " · " + item.extras : ""} × ${item.qty} = ${formatPrice(item.unitPrice * item.qty)}`
      ),
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "🎁 ĐẶC QUYỀN ƯU ĐÃI ÁP DỤNG:",
      "✦ Freeship 100% hỏa tốc nội khu Vinhomes Ocean Park (20–30 phút)",
      hasNest
        ? "✦ TẶNG KÈM: Thố sứ chưng hoàng gia + Hộp sơn mài đỏ + Táo đỏ, đường phèn & nhíp y tế"
        : "",
      returnJars
        ? `🌱 HÀNH ĐỘNG XANH: Quý cư dân gửi lại ${returnJarCount} vỏ hũ rỗng (${
            returnJarCount >= 10
              ? `BẾP KÍNH BIẾU THÊM ${Math.floor(returnJarCount / 10)} hũ yến tươi tri ân (10 vỏ = 1 hũ)!`
              : `Ghi nhận tích lũy hoàn vỏ (10 vỏ = 1 hũ)`
          })`
        : "",
      getStoredAffiliateCode()
        ? `🤝 Mã Người Giới Thiệu / CTV: ${getStoredAffiliateCode()}`
        : "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `💰 TỔNG THANH TOÁN: ${formatPrice(totalPrice)}`,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "💬 Nhờ Bếp xác nhận và nổi lửa chưng nóng giao sớm giúp mình nhé!",
    ]
      .filter(Boolean)
      .join("\n");
    return lines;
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);

    const fullInvoice = buildFullInvoiceText();
    const affCode = getStoredAffiliateCode();

    // 1. Lưu vào Database Bếp (CRM) để hiện ngay trên màn hình Bếp localhost:3001
    submitOrder({
      customer_name: name.trim(),
      phone: phone.trim(),
      building,
      apartment: room,
      notes: `[Mã: #${orderCode}] ${note || ""}${
        returnJars ? ` [Đổi ${returnJarCount} vỏ hũ rỗng (10 vỏ = 1 hũ)]` : ""
      }${affCode ? ` [CTV: ${affCode}]` : ""}`.trim(),
      items: items.map((i) => ({
        id: i.productId,
        title: i.title + (i.extras ? " · " + i.extras : ""),
        price: i.unitPrice,
        quantity: i.qty,
      })),
      total_price: totalPrice,
      order_source: "web_storefront_zalo_bridge",
      affiliate_code: affCode || undefined,
    }).catch(() => {});

    // 2. Tự động sao chép toàn bộ hóa đơn vào Clipboard
    try {
      await navigator.clipboard.writeText(fullInvoice);
      setCopied(true);
    } catch {
      // ignore
    }

    setLoading(false);
    setStep("done");

    // 3. Tự động mở cửa sổ Zalo với số điện thoại Bếp (Bắn thẳng sang Zalo Bố)
    const zaloUrl = getZaloLink(fullInvoice);
    setTimeout(() => {
      window.open(zaloUrl, "_blank");
    }, 400);
  };

  if (!isOpen) return null;

  if (items.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        style={{ background: "rgba(44,24,16,0.7)" }}
        onClick={closeTray}
      >
        <div
          className="bounce-in w-full max-w-md rounded-2xl p-8 text-center shadow-2xl relative"
          style={{ background: "var(--paper)", border: "1px solid var(--gold)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={closeTray}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold text-xs"
            title="Đóng khay"
          >
            ✕
          </button>
          <div className="text-5xl mb-3">🫙</div>
          <p className="font-bold mb-1" style={{ color: "var(--ink)" }}>Khay ngự thiện chưa có món</p>
          <p className="text-sm mb-4" style={{ color: "var(--ink-light)" }}>
            Mời bạn chọn vị yến bổ dưỡng phía dưới nhé!
          </p>
          <button
            type="button"
            onClick={closeTray}
            className="px-6 py-2.5 rounded-full text-sm font-bold"
            style={{ background: "var(--red-primary)", color: "#FFF8DC" }}
          >
            Xem thực đơn
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(44,24,16,0.75)" }}
      onClick={(e) => { if (e.target === e.currentTarget) closeTray(); }}
    >
      <div
        className="bounce-in w-full max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          background: "var(--paper)",
          border: "1px solid var(--gold)",
          maxHeight: "92vh",
        }}
      >
        {/* Header */}
        <div
          className="cloud-pattern flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ background: "var(--red-primary)" }}
        >
          <div>
            <p className="text-[10px] font-bold tracking-widest text-amber-200">
              {step === "items" ? "KHAY NGỰ THIỆN ĐÃ CHỌN" : step === "info" ? "THÔNG TIN GIAO NÓNG TẬN SẢNH" : "CHỐT ĐƠN BẮN QUA ZALO BẾP"}
            </p>
            <p className="text-sm font-bold mt-0.5" style={{ color: "#FFF8DC" }}>
              {totalItems} món · {formatPrice(totalPrice)}
            </p>
          </div>
          <button
            type="button"
            onClick={closeTray}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 bg-white/15 text-amber-100 hover:bg-white/25"
          >
            ✕
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex border-b flex-shrink-0 border-amber-800/15">
          {["items", "info", "done"].map((s, i) => (
            <div
              key={s}
              className="flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider"
              style={{
                color: step === s ? "var(--red-primary)" : "var(--ink-light)",
                borderBottom: step === s ? "2px solid var(--red-primary)" : "2px solid transparent",
              }}
            >
              {i + 1}. {s === "items" ? "Chọn món" : s === "info" ? "Địa chỉ" : "Bắn Zalo"}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto thin-scroll px-5 py-4">

          {/* ── STEP 1: Items ─────────────────────────────────── */}
          {step === "items" && (
            <div className="space-y-3">
              {/* Promo Banner inside Tray */}
              <div className="rounded-xl p-3 bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-red-900">
                  <span>🎁</span>
                  <span>Đặc Quyền Cư Dân Ocean Park:</span>
                </div>
                <p className="text-[11px] text-stone-700">
                  ✦ <strong>Freeship 100%</strong> mọi đơn hàng giao hỏa tốc tận cửa nội khu Ocean Park
                </p>
                <p className="text-[11px] text-stone-700">
                  ✦ <strong>Giao nóng 20–30 phút</strong> bốc khói theo mẻ chưng mới
                </p>
                <p className="text-[11px] text-emerald-800 font-semibold">
                  ✦ Chương trình <strong>10 vỏ rỗng đổi 1 hũ tươi mới ♻️</strong>
                </p>
              </div>

              {/* Header danh sách món + Nút xóa sạch khay */}
              <div className="flex items-center justify-between pt-1 px-1">
                <span className="text-xs font-bold text-stone-700">
                  Món đã chọn ({totalItems}):
                </span>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="tap-active text-[11px] font-bold text-red-700 hover:text-red-900 flex items-center gap-1 hover:underline px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 transition"
                  title="Hủy khay (Xóa hết món)"
                >
                  <span>🗑️</span>
                  <span>Hủy khay này</span>
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl p-3 flex items-center gap-3 bg-[#FFFDF8] border border-amber-900/15 shadow-2xs"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-tight truncate text-stone-900">
                      {item.title}
                    </p>
                    <p className="text-[10px] mt-0.5 text-stone-500">
                      {item.volume}{item.extras ? " · " + item.extras : ""}
                    </p>
                    <p className="text-xs font-bold mt-1 text-red-800">
                      {formatPrice(item.unitPrice)}
                    </p>
                  </div>

                  {/* Qty control */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQty(item.key, item.qty - 1)}
                      className="w-7 h-7 rounded-full border text-sm font-bold flex items-center justify-center border-amber-600/40 text-red-900 hover:bg-amber-100/50"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold w-4 text-center text-stone-900">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.key, item.qty + 1)}
                      className="w-7 h-7 rounded-full border text-sm font-bold flex items-center justify-center border-amber-600/40 text-red-900 hover:bg-amber-100/50"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="text-stone-400 hover:text-red-700 ml-1 text-xs"
                      title="Xóa món"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              {/* Price summary table */}
              <div className="pt-2 border-t border-amber-900/15 text-xs space-y-1.5 text-stone-700">
                <div className="flex justify-between">
                  <span>Tạm tính ({totalItems} món):</span>
                  <span className="font-bold text-stone-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Phí giao hỏa tốc 20-30p:</span>
                  <span className="font-bold">0đ (Freeship Ocean Park 100%)</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-1.5 border-t border-dashed border-amber-900/20 text-red-950">
                  <span>Tổng thanh toán:</span>
                  <span className="text-red-800">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Address info ──────────────────────────── */}
          {step === "info" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-amber-900">
                  Tên người nhận *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Chị Lan, Anh Hùng..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none bg-white border-[#DFD5C0] text-stone-900 focus:border-red-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-amber-900">
                  Số điện thoại nhận hàng *
                </label>
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none bg-white border-[#DFD5C0] text-stone-900 focus:border-red-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-amber-900">
                  Tòa / Khu (Vinhomes Ocean Park 1, 2, 3) *
                </label>
                <select
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none bg-white border-[#DFD5C0] text-stone-900 focus:border-red-800"
                >
                  <option value="">— Bấm chọn tòa nhà nhận nhanh —</option>
                  {OCEAN_PARK_BUILDINGS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-amber-900">
                  Số căn hộ / Tầng / Địa chỉ nhận
                </label>
                <input
                  type="text"
                  placeholder="VD: Căn 12A08 · giao tận cửa hoặc lễ tân sảnh"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none bg-white border-[#DFD5C0] text-stone-900 focus:border-red-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-amber-900">
                  Khẩu vị & Ghi chú cho Bếp (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="VD: Ít ngọt, giao nóng hổi, để ở sảnh..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none bg-white border-[#DFD5C0] text-stone-900 focus:border-red-800"
                />
              </div>

              {/* ── Tùy chọn Đổi vỏ lấy yến vì môi trường Ocean Park ── */}
              <div className="p-3 rounded-2xl bg-[#F3F9F4] border border-[#B7DFC5] transition-all">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={returnJars}
                    onChange={(e) => setReturnJars(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-emerald-700 accent-emerald-700 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <span>🌱</span>
                      <span>Gửi lại vỏ hũ rỗng (Hành động xanh vì Ocean Park)</span>
                    </span>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Shipper nhận lại vỏ hũ rỗng tại cửa và trao gửi phần yến biếu tặng tri ân.
                    </p>
                  </div>
                </label>

                {returnJars && (
                  <div className="mt-2.5 pt-2.5 border-t border-emerald-200/80 flex items-center justify-between text-xs">
                    <span className="text-emerald-900 font-semibold text-[11px]">Số lượng vỏ gửi lại:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setReturnJarCount((c) => Math.max(1, c - 1))}
                        className="w-7 h-7 rounded-lg border border-emerald-300 bg-white font-bold text-emerald-900 text-xs flex items-center justify-center shadow-2xs active:scale-95"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-extrabold text-emerald-950 text-xs">
                        {returnJarCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setReturnJarCount((c) => c + 1)}
                        className="w-7 h-7 rounded-lg border border-emerald-300 bg-white font-bold text-emerald-900 text-xs flex items-center justify-center shadow-2xs active:scale-95"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white shadow-2xs">
                      {returnJarCount >= 5
                        ? `🎁 Biếu tặng ${Math.floor(returnJarCount / 5)} hũ yến tươi`
                        : `Ghi nhận tích lũy`}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                <span className="text-sm">🛵</span>
                <span>Bếp nổi lửa chưng mẻ mới ngay khi nhận đơn · Giao hỏa tốc 15-20 phút tận nơi.</span>
              </div>
            </div>
          )}

          {/* ── STEP 3: Bắn Zalo Bố (Done) ────────────────────── */}
          {step === "done" && (
            <div className="py-2 space-y-4">
              {/* Order Code Banner */}
              <div
                className="rounded-2xl p-4 text-center relative overflow-hidden shadow-lg border-2 border-amber-400"
                style={{
                  background: "linear-gradient(135deg, #3D0000 0%, #7A0A0A 60%, #9E1A1A 100%)",
                }}
              >
                <span className="text-[10px] font-bold tracking-widest uppercase block mb-1 text-amber-200">
                  ✦ ĐƠN HÀNG ĐÃ SẴN SÀNG · MÃ ĐƠN ✦
                </span>
                <div className="text-3xl sm:text-4xl font-black my-1 tracking-wider text-amber-300 font-mono">
                  #{orderCode}
                </div>
                <p className="text-xs text-amber-100/90 italic">
                  Đơn đã được lưu vào hệ thống Bếp Yến Ocean!
                </p>
              </div>

              {/* Action instructions */}
              <div className="rounded-xl p-3.5 space-y-2.5 bg-amber-50/80 border border-amber-300/80 text-xs">
                <p className="leading-relaxed font-semibold text-stone-900">
                  📌 Đơn hàng và hóa đơn đã được tự động sao chép. Bấm nút dưới đây để <strong>mở Zalo Bếp và gửi đơn chốt ngay</strong>:
                </p>

                <div className="rounded-lg p-2 bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] flex items-center gap-1.5">
                  <span>✔</span>
                  <span>Đã tự động sao chép đầy đủ hóa đơn, địa chỉ & ưu đãi vào bộ nhớ tạm!</span>
                </div>
              </div>

              {/* Main CTA: Open Zalo directly */}
              <button
                type="button"
                onClick={() => {
                  const fullInvoice = buildFullInvoiceText();
                  window.open(getZaloLink(fullInvoice), "_blank");
                }}
                className="tap-active w-full py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.02] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-red-950 border border-amber-200"
              >
                <span className="text-lg">💬</span>
                <span>MỞ ZALO GỬI HÓA ĐƠN CHO BẾP</span>
              </button>

              {/* Secondary button: Copy invoice */}
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(buildFullInvoiceText());
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch {}
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold border border-amber-800/20 bg-white text-stone-800 hover:bg-stone-50 transition-all flex items-center justify-center gap-1.5"
              >
                <span>📋</span>
                <span>{copied ? "✓ Đã sao chép lại hóa đơn!" : "Sao chép lại nội dung hóa đơn"}</span>
              </button>

              {/* Order summary recap */}
              <div className="rounded-xl p-3 text-left space-y-1 text-xs bg-white border border-stone-200">
                <div className="flex justify-between font-bold text-stone-900">
                  <span>Khách: {name} · {phone}</span>
                  <span className="text-red-800">{formatPrice(totalPrice)}</span>
                </div>
                {building && (
                  <p className="text-[11px] text-stone-600">
                    🏠 {building} {room ? `· Căn: ${room}` : ""}
                  </p>
                )}
                <p className="text-[11px] text-stone-600">
                  📦 {items.map((i) => `${i.title} (x${i.qty})`).join(", ")}
                </p>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { clearOrder(); closeTray(); }}
                  className="text-xs underline text-stone-500 hover:text-stone-800"
                >
                  Hoàn tất & Đóng khay ngự thiện
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        {step !== "done" && (
          <div className="px-5 py-3.5 flex gap-2.5 flex-shrink-0 border-t border-amber-900/15 bg-[#FAF6EE]">
            {step === "info" && (
              <button
                type="button"
                onClick={() => setStep("items")}
                className="py-2.5 px-4 rounded-xl text-xs font-bold border border-amber-800/30 text-stone-700 bg-white hover:bg-stone-50"
              >
                ← Sửa món
              </button>
            )}
            {step === "items" && (
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={() => {
                    dismissTray();
                    closeTray();
                  }}
                  className="py-3 px-3.5 rounded-xl text-xs font-bold border border-amber-900/20 text-stone-700 bg-white hover:bg-stone-50 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                  title="Đóng và ẩn khay xuống cho đỡ vướng màn hình"
                >
                  <span>✕</span>
                  <span>Đổi ý, để sau</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep("info")}
                  className="tap-active flex-1 py-3 rounded-xl text-xs sm:text-sm font-extrabold shadow-md bg-gradient-to-r from-[#72161A] to-[#8C1D22] text-[#FFF8DC] hover:brightness-105 transition-all text-center"
                >
                  Tiếp theo → Điền địa chỉ nhận hàng
                </button>
              </div>
            )}
            {step === "info" && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!name.trim() || !phone.trim() || loading}
                className="tap-active flex-1 py-3 rounded-xl text-xs sm:text-sm font-black shadow-md disabled:opacity-50 transition-all bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-red-950 hover:brightness-105 active:scale-98"
              >
                {loading ? "⏳ Đang chuẩn bị..." : "Chốt Đơn & Bắn Sang Zalo Bếp →"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal xác nhận xóa chuẩn App */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Hủy Toàn Bộ Khay?"
        message="Các món đã chọn sẽ được xóa sạch và đóng cửa sổ này."
        confirmText="Xác nhận xóa"
        cancelText="Giữ lại khay"
        confirmStyle="danger"
        icon="🗑️"
        onConfirm={() => {
          clearOrder();
          closeTray();
          setShowConfirmModal(false);
        }}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}
