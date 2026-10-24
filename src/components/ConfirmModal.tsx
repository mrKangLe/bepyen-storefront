"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmStyle?: "danger" | "primary";
  icon?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Đồng ý",
  cancelText = "Giữ lại",
  confirmStyle = "danger",
  icon = "🗑️",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in select-none"
      onClick={onCancel}
    >
      <div
        className="bounce-in w-full max-w-xs rounded-3xl p-5 shadow-2xl relative text-center text-stone-800"
        style={{
          background: "linear-gradient(135deg, #FFFDF9, #FBF6EC)",
          border: "1.5px solid var(--gold)",
          boxShadow: "0 12px 36px rgba(70, 10, 13, 0.45)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng nhanh góc trên */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-stone-400 hover:text-stone-800 bg-stone-100 transition-colors"
          title="Đóng"
        >
          ✕
        </button>

        {/* Biểu tượng tròn phong cách hoàng gia */}
        <div
          className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-xl mb-3 shadow-inner border"
          style={{
            background:
              confirmStyle === "danger"
                ? "linear-gradient(135deg, #FFF0F0, #FFE0E0)"
                : "linear-gradient(135deg, #FFF8DC, #F5DE98)",
            borderColor:
              confirmStyle === "danger"
                ? "rgba(180, 40, 40, 0.3)"
                : "var(--gold)",
            color: "var(--red-primary)",
          }}
        >
          {icon}
        </div>

        <h3 className="font-extrabold text-sm sm:text-base font-heading text-red-950">
          {title}
        </h3>

        <p className="text-xs text-stone-600 mt-1.5 leading-relaxed px-1">
          {message}
        </p>

        {/* 2 Nút lựa chọn chuẩn App */}
        <div className="grid grid-cols-2 gap-2.5 mt-5">
          <button
            type="button"
            onClick={onCancel}
            className="tap-active py-2.5 px-3 rounded-xl text-xs font-bold border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 transition-all shadow-2xs"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="tap-active py-2.5 px-3 rounded-xl text-xs font-extrabold text-white shadow-md transition-all hover:brightness-105 active:scale-98"
            style={{
              background:
                confirmStyle === "danger"
                  ? "linear-gradient(135deg, #A81C22, #72161A)"
                  : "linear-gradient(135deg, #C59B27, #8C6B1A)",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
