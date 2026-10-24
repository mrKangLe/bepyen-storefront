"use client";

import { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import OrderModal from "./OrderModal";
import ConfirmModal from "./ConfirmModal";

export default function OrderTrayButton() {
  const {
    totalItems,
    totalPrice,
    isOpen,
    openTray,
    clearOrder,
    isDismissed,
    dismissTray,
    showTray,
  } = useOrder();

  const [showConfirm, setShowConfirm] = useState(false);

  const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "đ";

  if (totalItems === 0) return null;

  return (
    <>
      {/* ── TRƯỜNG HỢP 1: KHÁCH ĐÃ BẤM ẨN CHO ĐỠ VƯỚNG (GỌN GÀNG GÓC DƯỚI) ── */}
      {isDismissed ? (
        <div className="fixed bottom-[calc(56px+env(safe-area-inset-bottom,0px)+10px)] sm:bottom-6 left-3 z-40 animate-fade-in flex items-center gap-1 select-none">
          <button
            type="button"
            onClick={showTray}
            className="tap-active flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg border border-amber-300 text-[#FFF8DC] text-xs font-bold transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #72161A, #460A0D)",
              boxShadow: "0 4px 16px rgba(70, 10, 13, 0.4)",
            }}
            title="Bấm để mở lại khay ngự thiện"
          >
            <span>🫙</span>
            <span>Khay ({totalItems})</span>
            <span className="text-amber-300 font-extrabold text-[11px] ml-0.5">
              {formatPrice(totalPrice)}
            </span>
          </button>

          {/* Nút hủy khay nhanh khi đang thu gọn */}
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="tap-active w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-stone-300 hover:text-white bg-black/40 hover:bg-red-800 transition border border-white/10"
            title="Hủy khay (Xóa hết)"
          >
            ✕
          </button>
        </div>
      ) : (
        /* ── TRƯỜNG HỢP 2: THANH NỔI CON NHỘNG ĐẦY ĐỦ (THU HÚT SỰ CHÚ Ý CỰC CAO) ── */
        <div
          className="fixed bottom-[calc(56px+env(safe-area-inset-bottom,0px)+10px)] sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-full shadow-2xl border border-amber-300 text-[#FFF8DC] backdrop-blur-md animate-slide-up select-none max-w-[calc(100vw-20px)] sm:max-w-none"
          style={{
            background: "linear-gradient(135deg, rgba(114, 22, 26, 0.98), rgba(70, 10, 13, 0.98))",
            boxShadow: "0 8px 32px rgba(70, 10, 13, 0.5), inset 0 0 10px rgba(197, 155, 39, 0.3)",
          }}
        >
          {/* Vùng bấm mở khay */}
          <button
            type="button"
            onClick={openTray}
            className="tap-active flex items-center gap-2 text-left"
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-sm flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #F5DE98, #D4AF37)", color: "#3A080B" }}
            >
              {totalItems}
            </span>
            <div className="leading-tight truncate max-w-[120px] sm:max-w-none">
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wide uppercase block text-amber-200 truncate">
                Khay Yến Đã Chọn
              </span>
              <span className="text-xs sm:text-sm font-black text-white">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <span className="text-xs text-amber-300 font-bold ml-1 bg-white/15 px-2.5 py-1 rounded-full hover:bg-white/25 transition flex-shrink-0">
              Xem Khay & Đặt →
            </span>
          </button>

          {/* Vạch ngăn nhẹ */}
          <div className="w-[1px] h-5 bg-amber-400/30 mx-0.5" />

          {/* Nút Hủy toàn bộ khay / Đổi ý không mua (Mở ConfirmModal chuẩn App) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            className="tap-active w-7 h-7 rounded-full flex items-center justify-center text-xs text-amber-200 hover:text-white bg-black/30 hover:bg-red-800 transition border border-amber-400/20 flex-shrink-0"
            title="Đổi ý, hủy sạch khay này"
          >
            🗑️
          </button>

          {/* Nút Ẩn thanh xuống cho đỡ vướng màn hình */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              dismissTray();
            }}
            className="tap-active w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-amber-200/80 hover:text-white bg-black/30 hover:bg-black/50 transition border border-white/10 flex-shrink-0"
            title="Thu gọn cho đỡ vướng mắt"
          >
            ✕
          </button>
        </div>
      )}

      {/* Modal xác nhận hủy chuẩn App xịn xò (Không dùng thông báo Windows) */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Hủy Khay Ngự Thiện?"
        message="Toàn bộ các vị yến đã chọn sẽ được xóa sạch để khay trống thoáng đãng cho bạn chọn lại sau."
        confirmText="Xác nhận xóa"
        cancelText="Giữ lại khay"
        confirmStyle="danger"
        icon="🗑️"
        onConfirm={() => {
          clearOrder();
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />

      {/* Modal chi tiết giỏ hàng */}
      {isOpen && <OrderModal />}
    </>
  );
}
