"use client";

import React, { useState } from "react";

export interface AffiliateStep {
  step: number;
  title: string;
  desc: string;
  icon: string;
}

export interface AffiliateFAQ {
  q: string;
  a: string;
}

export interface AffiliateSettingsData {
  enabled: boolean;
  commission_rate: number;
  campaign_season?: string;
  campaign_badge?: string;
  campaign_title?: string;
  campaign_headline?: string;
  campaign_desc?: string;
  reward_note?: string;
  contact_zalo?: string;
  contact_name?: string;
  steps?: AffiliateStep[];
  faq?: AffiliateFAQ[];
}

interface AffiliateGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AffiliateSettingsData;
  onSelectInput?: () => void;
}

export default function AffiliateGuideModal({
  isOpen,
  onClose,
  settings,
  onSelectInput,
}: AffiliateGuideModalProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const commissionPercent = Math.round((settings.commission_rate || 0.08) * 100);
  const zaloPhone = settings.contact_zalo || "0942244994";
  const zaloUrl = `https://zalo.me/${zaloPhone}`;

  const defaultSteps: AffiliateStep[] = [
    {
      step: 1,
      title: "Nhập Tên / SĐT Nhận Mã",
      desc: "Điền tên hoặc SĐT Zalo vào ô mã giới thiệu bên dưới trang sản phẩm. Hệ thống tạo link độc quyền trong 1 giây mà không cần thủ tục rườm rà.",
      icon: "🔑",
    },
    {
      step: 2,
      title: "Gửi Link Cho Cư Dân & Bạn Bè",
      desc: "Bấm 'Chép Link' hoặc 'Gửi Qua Zalo' gửi vào nhóm cư dân tòa nhà, bạn bè, người thân khi họ cần bồi bổ sức khỏe.",
      icon: "📲",
    },
    {
      step: 3,
      title: "Bếp Giao Nóng & Ghi Nhận",
      desc: "Bếp Yến Ocean chưng tươi cách thủy, giao nóng hổi 20 phút tận căn hộ. Đơn đặt qua link của bạn tự động được hệ thống ghi nhận hoa hồng.",
      icon: "🛵",
    },
    {
      step: 4,
      title: "Nhận Thưởng Linh Hoạt",
      desc: "Nhận tiền chuyển khoản qua STK/Zalo Pay hàng tuần hoặc quy đổi thành các hũ yến chưng nóng hổi giao tận cửa cho gia đình bồi bổ.",
      icon: "💰",
    },
  ];

  const steps = settings.steps && settings.steps.length > 0 ? settings.steps : defaultSteps;

  const defaultFaq: AffiliateFAQ[] = [
    {
      q: "Tôi có phải bỏ vốn hay nhập hàng không?",
      a: "Hoàn toàn 0đ vốn! Bạn chỉ cần chia sẻ link. Bếp Yến Ocean đảm nhận từ việc tuyển chọn tổ yến, chưng nóng thủ công, đóng gói ngự thiện đến giao hỏa tốc 20 phút tận căn hộ.",
    },
    {
      q: "Hoa hồng được tính như thế nào?",
      a: `Mỗi đơn hàng thành công qua link giới thiệu, bạn nhận ${commissionPercent}% giá trị đơn hàng. Khách mua 1 hũ hay nhiều set quà biếu, bạn đều nhận đủ hoa hồng.`,
    },
    {
      q: "Làm sao để đối soát và nhận tiền?",
      a: `Bạn chỉ cần nhắn tin Zalo tới số Bếp Trưởng (${zaloPhone}) kèm mã giới thiệu của mình để đối soát đơn hàng và nhận chuyển khoản ngay trong tuần hoặc nhận hũ yến chưng tươi.`,
    },
  ];

  const faqList = settings.faq && settings.faq.length > 0 ? settings.faq : defaultFaq;

  const handleStartNow = () => {
    onClose();
    if (onSelectInput) {
      setTimeout(() => onSelectInput(), 200);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="bounce-in w-full max-w-lg max-h-[90vh] overflow-y-auto parchment-card rounded-3xl shadow-2xl relative border flex flex-col text-stone-800"
        style={{
          background: "linear-gradient(135deg, #FFFDF9 0%, #FAF5EA 100%)",
          borderColor: "var(--gold)",
          boxShadow: "0 20px 50px rgba(45, 20, 8, 0.45)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* NÚT ĐÓNG NHANH GÓC TRÊN */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-stone-500 hover:text-stone-900 bg-amber-100/70 hover:bg-amber-200 transition-colors shadow-2xs"
          title="Đóng cửa sổ"
        >
          ✕
        </button>

        {/* HEADER HOÀNG GIA */}
        <div
          className="p-5 sm:p-6 pb-4 border-b border-amber-900/15 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #3A1509 0%, #5C2210 50%, #3A1509 100%)",
            color: "var(--gold-light)",
          }}
        >
          {/* Badge mùa / chiến dịch */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase bg-amber-500/20 text-amber-200 border border-amber-400/40 shadow-xs mb-2">
            <span>✨</span>
            <span>{settings.campaign_badge || "ĐẶC QUYỀN CƯ DÂN VINHOMES OCEAN PARK"}</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black font-heading text-white leading-snug">
            {settings.campaign_title || "Thể Lệ & Hướng Dẫn Tham Gia Đại Sứ Lan Tỏa"}
          </h2>

          <p className="text-xs text-amber-100/85 mt-1.5 leading-relaxed">
            Đồng hành cùng Bếp Yến Ocean trao gửi yến chưng tươi cách thủy đến cộng đồng – Nhận hoa hồng tri ân{" "}
            <strong className="text-amber-300 font-black text-sm">{commissionPercent}%</strong> hoặc quy đổi yến bồi bổ mỗi ngày!
          </p>
        </div>

        {/* NỘI DUNG CHÍNH (SCROLLABLE) */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          {/* 1. ĐẶC QUYỀN "3 KHÔNG" CHO CỘNG TÁC VIÊN */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-red-950 font-heading mb-2 flex items-center gap-1.5">
              <span>👑</span>
              <span>Đặc Quyền 3 Không – Khởi Đầu Thu Nhập 0 Đồng</span>
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-2xl bg-white border border-amber-900/10 shadow-2xs text-center flex flex-col items-center justify-center">
                <span className="text-xl mb-1">🚫💰</span>
                <span className="text-[11px] font-bold text-stone-900 block leading-tight">0đ Bỏ Vốn</span>
                <span className="text-[9px] text-stone-500 mt-0.5">Không cọc, không phí</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white border border-amber-900/10 shadow-2xs text-center flex flex-col items-center justify-center">
                <span className="text-xl mb-1">📦❌</span>
                <span className="text-[11px] font-bold text-stone-900 block leading-tight">0 Ôm Hàng</span>
                <span className="text-[9px] text-stone-500 mt-0.5">Bếp chưng tươi theo đơn</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white border border-amber-900/10 shadow-2xs text-center flex flex-col items-center justify-center">
                <span className="text-xl mb-1">🛵⚡</span>
                <span className="text-[11px] font-bold text-stone-900 block leading-tight">0 Lo Ship</span>
                <span className="text-[9px] text-stone-500 mt-0.5">Giao nóng 20p tận cửa</span>
              </div>
            </div>
          </div>

          {/* 2. CÁC BƯỚC THAM GIA ĐƠN GIẢN */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-red-950 font-heading mb-2.5 flex items-center gap-1.5">
              <span>🚀</span>
              <span>4 Bước Tham Gia Siêu Dễ (Trong 1 Phút)</span>
            </h3>
            <div className="space-y-2.5">
              {steps.map((st) => (
                <div
                  key={st.step}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-white/90 border border-amber-900/10 shadow-2xs hover:border-amber-400/50 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-black shadow-xs border"
                    style={{
                      background: "linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)",
                      color: "#451A03",
                      borderColor: "rgba(180, 83, 9, 0.3)",
                    }}
                  >
                    <span>{st.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                        Bước {st.step}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 truncate">{st.title}</h4>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. CÁCH THỨC NHẬN TIỀN HOA HỒNG */}
          <div
            className="p-3.5 rounded-2xl border"
            style={{
              background: "linear-gradient(135deg, #FFF8ED 0%, #FEF3C7 100%)",
              borderColor: "rgba(217, 119, 6, 0.4)",
            }}
          >
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs mb-1">
              <span>🎁</span>
              <span>Hình Thức Quyết Toán Linh Hoạt:</span>
            </div>
            <ul className="text-xs text-stone-700 space-y-1 pl-1">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  <strong>Chuyển khoản trực tiếp:</strong> Nhận tiền mặt qua STK ngân hàng hoặc Zalo Pay đối soát mỗi tuần.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  <strong>Quy đổi hũ yến chưng tươi:</strong> Trừ thẳng vào giá trị đơn yến chưng nóng bồi bổ cho gia đình, bố mẹ.
                </span>
              </li>
            </ul>
          </div>

          {/* 4. CÂU HỎI THƯỜNG GẶP (FAQ ACCORDION) */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-red-950 font-heading mb-2 flex items-center gap-1.5">
              <span>❓</span>
              <span>Câu Hỏi Thường Gặp</span>
            </h3>
            <div className="space-y-1.5">
              {faqList.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-amber-900/10 rounded-xl overflow-hidden bg-white shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-2.5 text-xs font-bold text-stone-800 flex items-center justify-between gap-2 hover:bg-amber-50/50 transition-colors"
                    >
                      <span className="flex-1">{item.q}</span>
                      <span className="text-stone-400 text-xs shrink-0">{isOpen ? "▲" : "▼"}</span>
                    </button>
                    {isOpen && (
                      <div className="p-2.5 pt-0 text-[11px] text-stone-600 leading-relaxed border-t border-amber-900/5 bg-amber-50/20">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 sm:p-5 pt-3 border-t border-amber-900/15 bg-amber-50/60 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={handleStartNow}
            className="tap-active w-full sm:flex-1 py-3 px-4 rounded-2xl text-xs font-black text-white shadow-md flex items-center justify-center gap-2 transition hover:brightness-105 active:scale-98 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #B91C1C 0%, #7F1D1D 100%)",
              boxShadow: "0 6px 18px rgba(185, 28, 28, 0.35)",
            }}
          >
            <span>✨ Tạo Link Giới Thiệu Ngay</span>
            <span>→</span>
          </button>

          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-active w-full sm:w-auto py-3 px-4 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <span>💬</span>
            <span>Chat Zalo Bếp Trưởng ({zaloPhone})</span>
          </a>
        </div>
      </div>
    </div>
  );
}
