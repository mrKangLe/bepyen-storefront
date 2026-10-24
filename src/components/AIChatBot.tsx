"use client";

import { useState, useRef, useEffect } from "react";
import { useOrder } from "@/context/OrderContext";
import { ZALO_PHONE, getZaloLink, OCEAN_PARK_BUILDINGS } from "@/lib/constants";
import { analyzeUserIntent, type ChatMessage } from "@/lib/aiExpert";
import { PRODUCTS, type Product } from "@/data/products";
import { getStoredAffiliateCode } from "@/lib/affiliate";
import { BotAvatar } from "@/components/BotAvatar";

const TOPICS = [
  {
    id: "recovery",
    glyph: "✦",
    title: "Bồi bổ khí huyết, phục hồi thể trạng",
    desc: "Bồi bổ nguyên khí, hồi phục thể trạng",
    prompt: "Em ơi, người mới ốm dậy hoặc cơ thể suy nhược thì nên dùng vị yến Đông Y nào để mau hồi phục khí huyết?",
  },
  {
    id: "sleep",
    glyph: "✦",
    title: "Dưỡng tâm an thần, ngủ sâu giấc",
    desc: "Thanh nhiệt, an thần, giúp ngủ sâu giấc",
    prompt: "Em ơi, mình hay bị mất ngủ, ngủ chập chờn và đau đầu thì nên chọn vị yến dưỡng tâm nào?",
  },
  {
    id: "kids",
    glyph: "✦",
    title: "Nhuận phế, trừ ho (Trẻ nhỏ)",
    desc: "Thanh mát nhuận phế, giúp bé tiêu hóa tốt",
    prompt: "Em ơi, bé nhà mình hay bị ho gió và biếng ăn thì có vị yến nào thanh dịu phù hợp không?",
  },
  {
    id: "mom",
    glyph: "✦",
    title: "Bổ âm dưỡng huyết (Mẹ bầu)",
    desc: "Bổ âm ích huyết, dưỡng nhan tự nhiên",
    prompt: "Em ơi, mẹ bầu và phụ nữ sau sinh cần bồi bổ khí huyết thì nên dùng vị yến chưng nào an toàn và bổ nhất?",
  },
  {
    id: "vip",
    glyph: "✦",
    title: "Ngự Phẩm Đông Trùng Tây Tạng",
    desc: "Đại bổ nguyên khí tột đỉnh",
    prompt: "Em tư vấn giúp mình hũ Yến Thượng Hạng ngâm sâu đông trùng nguyên con Tây Tạng nhé!",
  },
  {
    id: "doi-vo",
    glyph: "✦",
    title: "Gửi lại vỏ hũ đổi yến mới",
    desc: "10 vỏ rỗng đổi 1 hũ chưng tươi nóng hổi",
    prompt: "Em ơi, hướng dẫn mình cách gửi lại 10 vỏ hũ thủy tinh rỗng để đổi lấy hũ yến chưng tươi mới với!",
  },
];

type AIChatBotProps = {
  customTooltip?: string;
  defaultPrompt?: string;
};

export default function AIChatBot({ customTooltip, defaultPrompt }: AIChatBotProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  // Chỉ bung tooltip khi có customTooltip (dành riêng cho trang đọc tin tức / bài viết)
  const [showTooltip, setShowTooltip] = useState(() => Boolean(customTooltip));

  useEffect(() => {
    setShowTooltip(Boolean(customTooltip));
  }, [customTooltip]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemKey, setAddedItemKey] = useState<string | null>(null);

  // Auto-selling active draft proposal
  const [activeProposal, setActiveProposal] = useState<ChatMessage["orderProposal"] | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { addItem, openTray, totalItems } = useOrder();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Lắng nghe sự kiện mở chat từ trang Đổi Vỏ hoặc nơi khác
  useEffect(() => {
    const handleOpenChatEvent = (e: any) => {
      handleOpen();
      if (e.detail?.prompt) {
        setTimeout(() => {
          handleSend(e.detail.prompt);
        }, 350);
      }
    };
    window.addEventListener("open-ai-chat", handleOpenChatEvent);
    return () => {
      window.removeEventListener("open-ai-chat", handleOpenChatEvent);
    };
  }, []);

  // Handle open bot
  const handleOpen = () => {
    setShowTooltip(false);
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: "Dạ Bếp Yến Hoàng Gia kính chào Quý Cư Dân ạ!\nEm là Nhung — Trưởng Bếp Yến Ocean.\n\nBếp em đang đỏ lửa chưng tươi cách thủy mẻ mới bốc khói. Bác & Anh/Chị đang quan tâm vị bồi bổ cho ai (mẹ bầu, người lớn tuổi mất ngủ, bé nhỏ biếng ăn hay người mới ốm dậy) để em tư vấn chuẩn vị và giao nóng 20–30 phút tận cửa căn hộ nhà mình nhé ạ! 🫙✨",
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  // Handle click on a topic
  const handleSelectTopic = (prompt: string) => {
    handleSend(prompt);
  };

  // Execute order submission to CRM
  const executeOrderSubmission = async (proposal: NonNullable<ChatMessage["orderProposal"]>) => {
    if (!proposal.phone || proposal.phone.trim().length < 8) {
      alert("Dạ Bếp xin số điện thoại để liên hệ phục vụ chu đáo đến Quý cư dân nhé ạ!");
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const isExchange = Boolean(proposal.isExchange);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: proposal.customer_name?.trim() || "Quý Cư Dân",
          phone: proposal.phone.trim(),
          building: proposal.building || "Ocean Park",
          apartment: proposal.apartment || "",
          notes: proposal.notes || "",
          zalo_nickname: proposal.zalo_nickname,
          items: proposal.items.map((it) => ({
            title: it.title,
            price: it.price,
            quantity: it.qty,
          })),
          total_price: proposal.total,
          order_source: isExchange ? "doi_vo_xanh_ai" : "ai_chatbot",
          affiliate_code: getStoredAffiliateCode() || undefined,
          health_profile: isExchange
            ? `Quý cư dân gửi lại ${proposal.jarCount || 10} vỏ hũ. Tên Zalo định danh: ${proposal.zalo_nickname || ""}`
            : "Đặt qua Trợ lý Bếp Yến Ocean (AI Auto-Selling)",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const orderId = data.order?.id || "OCP-" + Math.floor(1000 + Math.random() * 9000);
        const itemsSummary = proposal.items.map((it) => `${it.qty}x ${it.title}`).join(", ");
        const addressSummary = `${proposal.apartment ? `Căn ` + proposal.apartment + `, ` : ""}${proposal.building || "Vinhomes Ocean Park"}`;

        const zaloConfirmText = isExchange
          ? `🌱 TIẾP NHẬN VỎ HŨ & TRAO YẾN TRI ÂN [MÃ: #${orderId}]
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Quý cư dân: ${proposal.customer_name || "Quý cư dân"}
📞 Số điện thoại: ${proposal.phone}
🏠 Địa chỉ căn hộ: ${addressSummary}
♻️ Số lượng vỏ gửi lại: ${proposal.jarCount || 10} vỏ hũ rỗng
🎁 Phần quà Bếp kính biếu: ${itemsSummary} (Miễn phí)
🏷️ Tên danh bạ gợi ý: ${proposal.zalo_nickname || ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 Nhờ Bếp sắp xếp shipper ghé căn hộ tiếp nhận vỏ và trao yến tri ân giúp mình nhé!`
          : `Chào Bếp Yến Ocean! Mình vừa đặt đơn qua AI [Mã: #${orderId}] gồm: ${itemsSummary}. Giao đến ${addressSummary} cho ${proposal.customer_name || "mình"} (SĐT: ${proposal.phone}). Bếp nổi lửa giao nóng giúp mình nhé!`;

        const completedMsg: ChatMessage = {
          id: "order-ok-" + Date.now(),
          sender: "bot",
          text: isExchange
            ? `🌿 ĐÃ TIẾP NHẬN YÊU CẦU ĐỔI VỎ THÀNH CÔNG!\nBếp Yến Ocean đã ghi nhận thông tin của ${proposal.customer_name || "Quý cư dân"} vào hệ thống.\n\n🏷️ Tên Zalo định danh: **${proposal.zalo_nickname || ""}**\n\nQuý cư dân vui lòng bấm nút bên dưới để gửi tin nhắn sang Zalo Bếp trưởng trước một câu nhé ạ! Bếp sẽ lưu liên hệ và xếp lịch shipper ghé tận nơi thuận tiện nhất!`
            : `🎉 ĐÃ NỔI LỬA CHƯNG NÓNG THÀNH CÔNG!\nBếp Yến Ocean đã lưu đơn của ${proposal.customer_name || "bạn"} vào hệ thống và bắt đầu chưng cách thủy ngay. Bạn vui lòng bấm nút bên dưới để gửi mã xác nhận sang Zalo Bếp trưởng nhé ạ:`,
          completedOrder: {
            orderId,
            customer_name: proposal.customer_name || "Quý Cư Dân",
            phone: proposal.phone,
            building: proposal.building || "Ocean Park",
            apartment: proposal.apartment,
            notes: proposal.notes,
            zalo_nickname: proposal.zalo_nickname,
            items: proposal.items,
            total: proposal.total,
            zaloLink: getZaloLink(zaloConfirmText),
          },
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, completedMsg]);
        setActiveProposal(null);
        setIsSubmittingOrder(false);
        return;
      }
    } catch (e) {
      console.error("Lỗi submit đơn từ Chatbot:", e);
    }
    setIsSubmittingOrder(false);
    alert("Có lỗi khi lưu đơn, bạn có thể gọi hotline hoặc chat trực tiếp Zalo 0942244994 để Bếp phục vụ ngay nhé!");
  };

  // Handle send message
  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          pendingProposal: activeProposal,
          history: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (res.ok) {
        const data = await res.json();

        // If ready to submit directly from chat text!
        if (data.readyToSubmit && data.orderProposal && data.orderProposal.phone) {
          setIsTyping(false);
          await executeOrderSubmission(data.orderProposal);
          return;
        }

        const botMsg: ChatMessage = {
          id: "b-" + Date.now(),
          sender: "bot",
          text: data.text,
          recommendedProducts: data.recommendedProducts,
          recommendedVIP: data.recommendedVIP,
          orderProposal: data.orderProposal,
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        };

        if (data.orderProposal) {
          setActiveProposal(data.orderProposal);
        }

        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        return;
      }
    } catch (e) {
      console.warn("Lỗi gọi /api/chat, dùng fallback:", e);
    }

    // Fallback nếu API lỗi
    const response = analyzeUserIntent(query, activeProposal || undefined);
    if (response.readyToSubmit && response.orderProposal && response.orderProposal.phone) {
      setIsTyping(false);
      await executeOrderSubmission(response.orderProposal);
      return;
    }

    const botMsg: ChatMessage = {
      id: "b-" + Date.now(),
      sender: "bot",
      text: response.text,
      recommendedProducts: response.recommendedProducts,
      recommendedVIP: response.recommendedVIP,
      orderProposal: response.orderProposal,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };
    if (response.orderProposal) {
      setActiveProposal(response.orderProposal);
    }
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleAddProduct = (product: Product) => {
    addItem({
      key: String(product.id),
      productId: product.id,
      title: product.title,
      volume: product.volume,
      unitPrice: product.price,
    });
    setAddedItemKey(String(product.id));
    setTimeout(() => setAddedItemKey(null), 1200);
  };

  // Quick order 1 product directly into chat
  const handleQuickOrderProduct = (product: Product) => {
    const proposal: NonNullable<ChatMessage["orderProposal"]> = {
      items: [{ title: product.title, qty: 1, price: product.price }],
      total: product.price,
      customer_name: "",
      phone: "",
      building: OCEAN_PARK_BUILDINGS[0],
      apartment: "",
      notes: "",
    };
    setActiveProposal(proposal);

    const botMsg: ChatMessage = {
      id: "b-" + Date.now(),
      sender: "bot",
      text: `Dạ Bếp đã tiếp nhận món [${product.title}]! Bạn chỉ cần điền nhanh thông tin nhận hàng bên dưới để Bếp nổi lửa giao nóng trong 20–30 phút nhé ạ:`,
      orderProposal: proposal,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, botMsg]);
  };

  // Update item quantity in proposal
  const handleUpdateProposalQty = (itemIndex: number, delta: number) => {
    if (!activeProposal) return;
    const nextItems = [...activeProposal.items];
    const target = nextItems[itemIndex];
    if (!target) return;

    const newQty = target.qty + delta;
    if (newQty <= 0) {
      nextItems.splice(itemIndex, 1);
    } else {
      nextItems[itemIndex] = { ...target, qty: newQty };
    }

    const nextTotal = nextItems.reduce((sum, it) => sum + it.price * it.qty, 0);
    const updated = {
      ...activeProposal,
      items: nextItems,
      total: nextTotal,
    };
    setActiveProposal(updated);

    // Also update current bot message proposal
    setMessages((prev) =>
      prev.map((msg) =>
        msg.orderProposal ? { ...msg, orderProposal: updated } : msg
      )
    );
  };

  // Copy code helper
  const handleCopyCode = (code: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "đ";
  const zaloLink = getZaloLink("Chào Bếp Yến Ocean! Cho mình hỏi về sản phẩm ạ 🫙");

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          1. FLOATING BUTTON & TOOLTIP (TỐI GIẢN - SANG TRỌNG)
          ══════════════════════════════════════════════════════════ */}
      {!isOpen && (
        <div
          className={`fixed right-3 sm:right-4 z-40 flex items-center gap-2.5 transition-all duration-300 ${
            totalItems > 0
              ? "bottom-[calc(56px+env(safe-area-inset-bottom,0px)+62px)] sm:bottom-6"
              : "bottom-[calc(56px+env(safe-area-inset-bottom,0px)+12px)] sm:bottom-6"
          }`}
        >
          {/* Tooltip gây chú ý (Ẩn khi khách đã có món trong khay để không che nút đặt hàng trên mobile) */}
          {showTooltip && totalItems === 0 && (
            <div
              className="flex items-center gap-1.5 sm:gap-2 pl-3 pr-2 py-1.5 sm:py-2 rounded-2xl shadow-xl border animate-bounce max-w-[210px] sm:max-w-none text-left"
              style={{
                background: "var(--paper)",
                borderColor: "var(--gold)",
                color: "var(--ink)",
                boxShadow: "0 6px 20px rgba(44,24,16,0.18)",
              }}
            >
              <div
                onClick={() => {
                  handleOpen();
                  if (defaultPrompt) {
                    setTimeout(() => handleSend(defaultPrompt), 350);
                  }
                }}
                className="text-[11px] sm:text-xs font-bold cursor-pointer hover:underline flex items-center gap-1.5 leading-snug"
                style={{ color: "var(--red-primary)" }}
              >
                <span className="text-amber-800 text-xs font-black shrink-0">✦</span>
                <span className="line-clamp-2">
                  {customTooltip || "Em Nhung: Dạ Bác & Anh/Chị cần em tư vấn vị yến bồi bổ hay giao nóng 20P ạ? 🫙"}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 shrink-0"
                title="Đóng gợi ý"
              >
                ✕
              </button>
            </div>
          )}

          {/* Nút Bot Avatar Hoàng Gia chân trang (54px) viền vàng kim có hào quang nhấp nháy */}
          <button
            type="button"
            onClick={handleOpen}
            className="tap-active group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            style={{
              filter: "drop-shadow(0 6px 18px rgba(180, 83, 9, 0.45))",
            }}
            title="Bếp Trưởng Nhung — Bếp Yến Hoàng Gia (Tư vấn chu đáo & Giao nóng 20P)"
          >
            {/* Vòng hào quang vàng kim nhấp nháy thu hút sự chú ý */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 opacity-70 blur-xs animate-pulse group-hover:opacity-100 transition-opacity" />

            {/* Avatar Icon Hoàng Gia */}
            <BotAvatar size={54} showOnlineDot />

            {/* Badge chữ Bếp Trưởng nhỏ dưới chân nút */}
            <span
              className="absolute -bottom-2 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight shadow-md border"
              style={{
                background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
                borderColor: "var(--gold-light)",
                color: "var(--red-deep)",
              }}
            >
              Bếp Trưởng
            </span>
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          2. CỬA SỔ TRỢ LÝ (HUB / CHAT WINDOW)
          ══════════════════════════════════════════════════════════ */}
      {isOpen && (
        <div
          className="fixed z-50 inset-x-2 bottom-[calc(56px+env(safe-area-inset-bottom,0px)+8px)] top-14 sm:inset-auto sm:bottom-5 sm:right-4 sm:w-[390px] sm:h-[600px] sm:max-h-[88vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border-[1.5px] transition-all"
          style={{
            background: "var(--paper)",
            borderColor: "var(--gold)",
            boxShadow: "0 12px 48px rgba(44,24,16,0.35), 0 0 24px rgba(201,168,76,0.2)",
          }}
        >
          {/* ── HEADER ─────────────────────────────────────────── */}
          <div
            className="cloud-pattern px-4 py-3 flex items-center justify-between flex-shrink-0 select-none"
            style={{ background: "var(--red-primary)", borderBottom: "1px solid var(--gold)" }}
          >
            <div className="flex items-center gap-2.5">
              <BotAvatar size={40} showOnlineDot />

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm font-heading leading-tight" style={{ color: "#FFF8DC" }}>
                    Bếp Trưởng Nhung
                  </h3>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/40">
                    AI Hoàng Gia
                  </span>
                </div>
                <p className="text-[10px] text-amber-200/90 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Tư vấn Đông Y dưỡng sinh • Giao nóng 20–30P</span>
                </p>
              </div>
            </div>

            {/* Nút đóng */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all tap-active"
              style={{ background: "rgba(255,255,255,0.18)", color: "#FFF8DC" }}
              title="Đóng"
            >
              ✕
            </button>
          </div>

          {/* ── GIAO DIỆN HỘI THOẠI TRỰC TIẾP (KHÔNG CHẶN BỞI MENU) ──────── */}
          <>
            {/* Messages Body */}
              <div className="flex-1 overflow-y-auto thin-scroll p-3.5 space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-start gap-2 max-w-[92%] sm:max-w-[85%]">
                      {m.sender === "bot" && (
                        <BotAvatar size={28} className="mt-0.5" />
                      )}

                      <div
                        className="rounded-2xl p-3 text-xs leading-relaxed shadow-sm"
                        style={{
                          background: m.sender === "user" ? "var(--red-primary)" : "var(--paper)",
                          color: m.sender === "user" ? "#FFF8DC" : "var(--ink)",
                          border: m.sender === "user" ? "none" : "1px solid rgba(201,168,76,0.35)",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {m.text}

                        {/* Thẻ món được AI gợi ý (Mini Product Cards) */}
                        {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-amber-900/10 space-y-2">
                            <p
                              className="text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1"
                              style={{ color: "var(--gold)" }}
                            >
                              <span>🫙</span>
                              <span>Vị yến gợi ý thích hợp nhất:</span>
                            </p>

                            <div className="grid grid-cols-1 gap-2">
                              {m.recommendedProducts.map((p) => {
                                const isAdded = addedItemKey === String(p.id);
                                return (
                                  <div
                                    key={p.id}
                                    className="rounded-xl p-2.5 flex items-center justify-between gap-2 border transition-all"
                                    style={{
                                      background: p.color,
                                      borderColor: "rgba(201,168,76,0.4)",
                                    }}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="text-2xl flex-shrink-0">{p.emoji}</span>
                                      <div className="min-w-0">
                                        <h5
                                          className="font-bold text-[11px] leading-tight line-clamp-1 font-heading"
                                          style={{ color: "var(--ink)" }}
                                        >
                                          {p.title}
                                        </h5>
                                        <p className="text-[10px] font-extrabold" style={{ color: "var(--red-primary)" }}>
                                          {formatPrice(p.price)}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => handleAddProduct(p)}
                                        className="tap-active text-[10px] font-bold px-2 py-1 rounded-full shadow-2xs transition-all border"
                                        style={{
                                          background: isAdded ? "#16A34A" : "var(--paper)",
                                          borderColor: "var(--gold)",
                                          color: isAdded ? "#FFF8DC" : "var(--red-primary)",
                                        }}
                                        title="Thêm vào khay để gom nhiều vị"
                                      >
                                        {isAdded ? "✓ Đã thêm" : "+ Khay"}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleQuickOrderProduct(p)}
                                        className="tap-active text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs transition-all"
                                        style={{
                                          background: "linear-gradient(135deg, var(--red-primary), var(--red-light))",
                                          color: "#FFF8DC",
                                        }}
                                        title="Đặt vị này chưng nóng giao ngay"
                                      >
                                        🔥 Đặt vị này
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Nếu có gợi ý món VIP */}
                        {m.recommendedVIP && (
                          <div
                            className="mt-2 p-2 rounded-xl text-[11px] border flex items-center justify-between gap-2"
                            style={{
                              background: "linear-gradient(135deg, #3D0000, #5C0A0A)",
                              borderColor: "var(--gold)",
                              color: "var(--gold-light)",
                            }}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-sm font-bold text-amber-300">✦</span>
                              <div className="min-w-0">
                                <p className="font-bold text-[10px] truncate">Hũ VIP Sâu Đông Trùng Nguyên Con</p>
                                <p className="text-[9px] opacity-80">Ngâm 1-2 con sâu · Bồi bổ cực phẩm</p>
                              </div>
                            </div>
                            <a
                              href="#products"
                              onClick={() => setIsOpen(false)}
                              className="text-[9px] font-extrabold px-2 py-1 rounded-full text-red-950 flex-shrink-0"
                              style={{ background: "var(--gold-light)" }}
                            >
                              Xem ở đầu trang ↑
                            </a>
                          </div>
                        )}

                        {/* Thẻ chốt đơn trực tiếp (Interactive Auto-Selling Order Card) */}
                        {m.orderProposal && !m.completedOrder && (
                          <div
                            className="mt-3 p-3.5 rounded-2xl border space-y-3 shadow-sm"
                            style={{
                              background: "rgba(255, 250, 240, 0.95)",
                              borderColor: "var(--gold)",
                              boxShadow: "0 4px 16px rgba(201,168,76,0.18)",
                            }}
                          >
                            <div
                              className="flex items-center justify-between border-b pb-2"
                              style={{ borderColor: "rgba(201,168,76,0.3)" }}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-amber-800">✦</span>
                                <span
                                  className="font-extrabold text-[11px] uppercase tracking-wider"
                                  style={{ color: "var(--red-deep)" }}
                                >
                                  {(activeProposal?.isExchange || m.orderProposal.isExchange)
                                    ? "TIẾP NHẬN ĐỔI VỎ TRI ÂN"
                                    : "ĐƠN NỔI LỬA CHƯNG NÓNG"}
                                </span>
                              </div>
                              <span className="font-extrabold text-xs" style={{ color: "var(--red-primary)" }}>
                                {(activeProposal?.isExchange || m.orderProposal.isExchange)
                                  ? "0đ (Miễn Phí)"
                                  : formatPrice(activeProposal?.total || m.orderProposal.total)}
                              </span>
                            </div>

                            {/* Danh sách món & Tăng giảm số lượng */}
                            <div className="space-y-1.5">
                              {(activeProposal?.items || m.orderProposal.items).map((it, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-[11px] bg-white/70 p-2 rounded-xl border border-amber-900/10"
                                >
                                  <div className="min-w-0 pr-2">
                                    <p className="font-bold text-stone-800 line-clamp-1">{it.title}</p>
                                    <p className="text-[10px] text-amber-900/70 font-semibold">
                                      {formatPrice(it.price)} / hũ
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateProposalQty(idx, -1)}
                                      className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs bg-stone-200 hover:bg-stone-300 text-stone-800"
                                      title="Giảm 1"
                                    >
                                      -
                                    </button>
                                    <span className="font-bold text-xs w-4 text-center">{it.qty}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateProposalQty(idx, 1)}
                                      className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white"
                                      title="Tăng 1"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Form nhập thông tin nhận hàng trực tiếp */}
                            <div className="space-y-2 pt-1 border-t" style={{ borderColor: "rgba(201,168,76,0.25)" }}>
                              <p
                                className="text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1"
                                style={{ color: "var(--gold)" }}
                              >
                                <span>📍</span>
                                <span>Thông tin nhận hàng tại Ocean Park:</span>
                              </p>

                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="Tên của bạn (VD: Chị Mai)"
                                  value={activeProposal?.customer_name || m.orderProposal.customer_name || ""}
                                  onChange={(e) => {
                                    const updated = {
                                      ...(activeProposal || m.orderProposal!),
                                      customer_name: e.target.value,
                                    };
                                    setActiveProposal(updated);
                                  }}
                                  className="text-[11px] px-2.5 py-1.5 rounded-xl border bg-white focus:outline-none"
                                  style={{ borderColor: "rgba(201,168,76,0.5)" }}
                                />
                                <input
                                  type="tel"
                                  placeholder="SĐT nhận hàng (*)"
                                  value={activeProposal?.phone || m.orderProposal.phone || ""}
                                  onChange={(e) => {
                                    const updated = {
                                      ...(activeProposal || m.orderProposal!),
                                      phone: e.target.value,
                                    };
                                    setActiveProposal(updated);
                                  }}
                                  className="text-[11px] px-2.5 py-1.5 rounded-xl border bg-white focus:outline-none font-bold"
                                  style={{ borderColor: "var(--gold)", color: "var(--red-primary)" }}
                                  required
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <select
                                  value={activeProposal?.building || m.orderProposal.building || OCEAN_PARK_BUILDINGS[0]}
                                  onChange={(e) => {
                                    const updated = {
                                      ...(activeProposal || m.orderProposal!),
                                      building: e.target.value,
                                    };
                                    setActiveProposal(updated);
                                  }}
                                  className="text-[10px] px-2 py-1.5 rounded-xl border bg-white focus:outline-none truncate"
                                  style={{ borderColor: "rgba(201,168,76,0.5)" }}
                                >
                                  {OCEAN_PARK_BUILDINGS.map((b) => (
                                    <option key={b} value={b}>
                                      {b}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="text"
                                  placeholder="Căn hộ / Tầng (VD: 1204)"
                                  value={activeProposal?.apartment || m.orderProposal.apartment || ""}
                                  onChange={(e) => {
                                    const updated = {
                                      ...(activeProposal || m.orderProposal!),
                                      apartment: e.target.value,
                                    };
                                    setActiveProposal(updated);
                                  }}
                                  className="text-[11px] px-2.5 py-1.5 rounded-xl border bg-white focus:outline-none"
                                  style={{ borderColor: "rgba(201,168,76,0.5)" }}
                                />
                              </div>

                              <input
                                type="text"
                                placeholder="Ghi chú khẩu vị (VD: chưng ít ngọt, giao nóng hổi...)"
                                value={activeProposal?.notes || m.orderProposal.notes || ""}
                                onChange={(e) => {
                                  const updated = {
                                    ...(activeProposal || m.orderProposal!),
                                    notes: e.target.value,
                                  };
                                  setActiveProposal(updated);
                                }}
                                className="w-full text-[10px] px-2.5 py-1.5 rounded-xl border bg-white focus:outline-none"
                                style={{ borderColor: "rgba(201,168,76,0.3)" }}
                              />
                            </div>

                            {/* Nút bấm Nổi Lửa Chốt Đơn hoặc Tiếp Nhận Đổi Vỏ */}
                            <button
                              type="button"
                              disabled={isSubmittingOrder || (activeProposal?.items || m.orderProposal.items).length === 0}
                              onClick={() => executeOrderSubmission(activeProposal || m.orderProposal!)}
                              className="tap-active w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-[1.02] disabled:opacity-50"
                              style={{
                                background: (activeProposal?.isExchange || m.orderProposal.isExchange)
                                  ? "linear-gradient(135deg, #15803D, #166534)"
                                  : "linear-gradient(135deg, var(--red-primary), var(--red-deep))",
                                color: "#FFF8DC",
                                border: "1px solid var(--gold)",
                              }}
                            >
                              <span>✦</span>
                              <span>
                                {isSubmittingOrder
                                  ? "Đang lưu thông tin tiếp nhận..."
                                  : (activeProposal?.isExchange || m.orderProposal.isExchange)
                                  ? "Xác Nhận Đổi Vỏ & Lưu Hệ Thống (Miễn Phí) →"
                                  : `Xác Nhận Chưng Nóng & Lưu Đơn (${formatPrice(activeProposal?.total || m.orderProposal.total)}) →`}
                              </span>
                            </button>

                            <p className="text-[9px] text-stone-500 italic text-center">
                              ✦ Quý cư dân có thể nhắn trực tiếp Tên - SĐT - Số căn hộ vào ô chat để Bếp tiếp nhận ngay ạ.
                            </p>
                          </div>
                        )}

                        {/* Thẻ Đơn Hàng Thành Công (Completed Order Receipt) */}
                        {m.completedOrder && (
                          <div
                            className="mt-3 p-3.5 rounded-2xl border space-y-2.5 shadow-lg"
                            style={{
                              background: "linear-gradient(135deg, #1C0505, #2C0C0C)",
                              borderColor: "var(--gold)",
                              color: "#FFF8DC",
                              boxShadow: "0 6px 24px rgba(44,24,16,0.35)",
                            }}
                          >
                            <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                <span className="font-black text-xs uppercase tracking-wider text-amber-300">
                                  {m.completedOrder.total === 0 ? "TIẾP NHẬN ĐỔI VỎ THÀNH CÔNG" : "ĐÃ TIẾP NHẬN ĐƠN CHƯNG NÓNG"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-mono font-black text-xs text-amber-400">
                                  #{m.completedOrder.orderId}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyCode(m.completedOrder!.orderId)}
                                  className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 border border-amber-600/40 text-amber-300 hover:bg-amber-900"
                                  title="Sao chép mã đơn"
                                >
                                  {copiedCode === m.completedOrder.orderId ? "✓ Đã chép" : "Chép"}
                                </button>
                              </div>
                            </div>

                            {/* Tóm tắt người nhận & món */}
                            <div className="text-[11px] space-y-1.5 text-amber-100/90 bg-black/30 p-2.5 rounded-xl border border-amber-500/20">
                              <div className="flex justify-between">
                                <span className="text-amber-300/80">Khách nhận:</span>
                                <span className="font-bold">
                                  {m.completedOrder.customer_name} · {m.completedOrder.phone}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-amber-300/80">Địa chỉ:</span>
                                <span className="font-bold text-right truncate max-w-[200px]">
                                  {m.completedOrder.apartment ? `Căn ${m.completedOrder.apartment}, ` : ""}
                                  {m.completedOrder.building}
                                </span>
                              </div>
                              {m.completedOrder.zalo_nickname && (
                                <div className="flex justify-between items-center bg-amber-400/15 border border-amber-400/30 px-2 py-1 rounded-lg">
                                  <span className="text-amber-300 text-[10px] font-bold">🏷️ Tên Zalo định danh:</span>
                                  <span className="font-mono font-black text-amber-200 text-[10px]">
                                    {m.completedOrder.zalo_nickname}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between pt-1 border-t border-amber-500/20">
                                <span className="text-amber-300/80">Thực đơn:</span>
                                <span className="font-bold text-right">
                                  {m.completedOrder.items.map((it) => `${it.qty}x ${it.title}`).join(", ")}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs pt-1 border-t border-amber-500/20">
                                <span className="text-amber-300 font-bold">Tổng thanh toán:</span>
                                <span className="font-black text-amber-400">
                                  {m.completedOrder.total === 0 ? "0đ (Miễn Phí Tri Ân)" : formatPrice(m.completedOrder.total)}
                                </span>
                              </div>
                              <div className="flex justify-between text-[10px] text-emerald-400">
                                <span>Thời gian giao:</span>
                                <span>Shipper nội khu phục vụ trong 20–30 phút</span>
                              </div>
                            </div>

                            {/* Nút gửi Zalo xác nhận ngay */}
                            <a
                              href={m.completedOrder.zaloLink}
                              target="_blank"
                              rel="noreferrer"
                              className="tap-active w-full py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
                              style={{
                                background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
                                color: "var(--red-deep)",
                              }}
                            >
                              <span>💬</span>
                              <span>
                                {m.completedOrder.total === 0
                                  ? `Mở Zalo Gửi Bếp Trưởng (${ZALO_PHONE}) Để Ưu Tiên Tiếp Nhận ↗`
                                  : `Gửi Mã #${m.completedOrder.orderId} qua Zalo Bếp Trưởng (${ZALO_PHONE}) ↗`}
                              </span>
                            </a>

                            <div className="flex items-center justify-between gap-2 pt-1">
                              <a
                                href={`tel:${ZALO_PHONE}`}
                                className="tap-active flex-1 py-1.5 px-2 rounded-lg bg-stone-900 border border-amber-500/30 text-[10px] font-bold text-center text-amber-200"
                              >
                                📞 Hotline: {ZALO_PHONE}
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveProposal(null);
                                }}
                                className="tap-active flex-1 py-1.5 px-2 rounded-lg bg-amber-950 border border-amber-500/40 text-[10px] font-bold text-center text-amber-300"
                              >
                                + Đặt thêm món khác
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[9px] mt-0.5 px-1 text-stone-400">{m.timestamp}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2">
                    <BotAvatar size={26} />
                    <div
                      className="rounded-2xl px-3 py-2 text-xs flex items-center gap-1 shadow-2xs border"
                      style={{ background: "var(--paper)", borderColor: "rgba(201,168,76,0.3)" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce" />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      />
                      <span className="text-[10px] text-stone-500 ml-1">Em Nhung đang soạn câu trả lời...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div
                className="p-2.5 border-t flex-shrink-0"
                style={{
                  background: "var(--paper)",
                  borderColor: "rgba(201,168,76,0.25)",
                }}
              >
                {/* Gợi ý chủ đề nhanh (Chạm là hỏi) */}
                <div className="flex gap-1.5 overflow-x-auto pb-2 px-1 scrollbar-hide">
                  {TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleSend(topic.prompt)}
                      className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300/80 text-amber-950 hover:bg-amber-100 transition-all flex items-center gap-1 shadow-2xs"
                    >
                      <span>{topic.glyph}</span>
                      <span>{topic.title}</span>
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập câu hỏi hoặc yêu cầu cho Bếp..."
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-full border focus:outline-none transition-all"
                    style={{
                      background: "var(--parchment)",
                      borderColor: "rgba(201,168,76,0.4)",
                      color: "var(--ink)",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="tap-active w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all disabled:opacity-40"
                    style={{
                      background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
                      color: "var(--red-deep)",
                    }}
                    title="Gửi câu hỏi"
                  >
                    ➔
                  </button>
                </form>

                {/* Sub-footer link */}
                <div className="flex items-center justify-between text-[10px] mt-2 px-1 text-stone-500">
                  <span className="text-[10px] text-stone-400">
                    Bếp Yến Ocean luôn túc trực
                  </span>
                  <a
                    href={zaloLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline"
                    style={{ color: "var(--red-primary)" }}
                  >
                    Chat Zalo Bếp Trưởng ({ZALO_PHONE}) ↗
                  </a>
                </div>
              </div>
          </>
        </div>
      )}
    </>
  );
}
