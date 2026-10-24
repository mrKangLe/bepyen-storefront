import { NextRequest, NextResponse } from "next/server";
import { analyzeUserIntent } from "@/lib/aiExpert";
import { PRODUCTS, type Product } from "@/data/products";
import fs from "fs";
import path from "path";

function loadCatalog(): Product[] {
  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, "..", "data", "products_catalog.json"),
    path.resolve(cwd, "data", "products_catalog.json"),
    path.resolve(cwd, "src", "data", "products_catalog.json"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
      try {
        const raw = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ p, "utf-8"));
        if (Array.isArray(raw.products) && raw.products.length > 0) {
          return raw.products;
        }
      } catch (e) {
        // ignore & fallback
      }
    }
  }
  return PRODUCTS;
}

function loadPromotionsConfig(): any {
  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, "..", "data", "promotions_config.json"),
    path.resolve(cwd, "data", "promotions_config.json"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
      try {
        return JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ p, "utf-8"));
      } catch (e) {
        // ignore & fallback
      }
    }
  }
  return null;
}

function buildSystemPrompt(catalog: Product[], promos: any): string {
  const menuLines = catalog.map((p) => {
    let priceText = `${p.price?.toLocaleString("vi-VN")}đ`;
    if (p.volumeOptions && p.volumeOptions.length > 0) {
      priceText = p.volumeOptions
        .map((v) => `${v.volume}: ${v.price.toLocaleString("vi-VN")}đ`)
        .join(", ");
    }
    const benefits = p.benefits?.slice(0, 2).join("; ") || p.subtitle || "";
    return `• [ID ${p.id}] ${p.title} (${p.category}) - ${priceText} | Công dụng: ${benefits}`;
  }).join("\n");

  const promoActive = promos?.dynamic_campaign?.enabled;
  const promoTitle = promos?.dynamic_campaign?.title || "FREESHIP NỘI KHU 100%";
  const promoDesc = promos?.dynamic_campaign?.description || "Miễn phí vận chuyển hỏa tốc nội khu Vinhomes Ocean Park";

  return `Bạn là "Chị Nhung — Trưởng Bếp Yến Sào Hoàng Gia Ocean Park", túc trực tư vấn cho cư dân tại đại đô thị Vinhomes Ocean Park 1, 2, 3 (Hà Nội).

PHONG THÁI & TÍNH CÁCH:
- Xưng hô: Em xưng là "Em" hoặc "Bếp", gọi khách là "Anh/Chị", "Bác/Cô/Chú" (nếu khách lớn tuổi) hoặc "Quý Cư Dân". Rất nhã nhặn, lễ phép, tôn kính.
- Tính cách: Thông minh, xởi lởi, khéo léo, am hiểu tường tận kiến thức Đông Y bồi bổ dưỡng sinh và ẩm thực cung đình. Nói năng tự nhiên, duyên dáng như một người bếp trưởng lành nghề, KHÔNG máy móc, KHÔNG rập khuôn.
- CÁCH TRÌNH BÀY (ĐẶC BIỆT QUAN TRỌNG):
  + Phải xuống dòng thoáng đãng, ngắt nhịp tự nhiên giữa các ý.
  + Dùng gạch đầu dòng rõ ràng, mạch lạc.
  + TUYỆT ĐỐI KHÔNG viết thành một khối văn dính chùm hay líu díu chữ vào nhau khiến khách đọc mệt mắt.
  + Ngắn gọn, ấm áp, trọng tâm (khoảng 3 đến 6 câu chất lượng).

CHÍNH SÁCH BẾP YẾN:
1. Giao nóng 20–30 phút bốc khói tận cửa căn hộ nội khu Ocean Park (chưng cách thủy mẻ nhỏ ngay khi khách đặt).
2. Chính sách đổi vỏ hũ: Tích lũy 10 vỏ hũ thủy tinh rỗng đổi 1 hũ yến tươi mới thanh mát bất kỳ (trừ sâu Đông Trùng VIP). Shipper thu vỏ tận nơi.
3. Chương trình khuyến mãi hiện hành: ${
    promoActive
      ? `ĐANG ÁP DỤNG: ${promoTitle} — ${promoDesc}.`
      : "Hiện áp dụng giao nóng hỏa tốc và chính sách 10 vỏ đổi 1 hũ tươi."
  }
4. NGUYÊN TẮC BẢO VỆ CHÍNH SÁCH: TUYỆT ĐỐI CẤM nhắc đến hoặc hứa hẹn chương trình "Mua 5 tặng 1" (Bếp KHÔNG có chương trình này). Không tự bịa giảm giá % ngoài cấu hình.

DANH MỤC SẢN PHẨM REAL-TIME CỦA BẾP:
${menuLines}

CỰC PHẨM VIP ĐẶC BIỆT:
• Hũ VIP Sâu Đông Trùng Tây Tạng nguyên con: 400.000đ/con sâu Tây Tạng ngâm trong hũ yến vị cốt tự chọn. Đại bổ nguyên khí cho người phẫu thuật, suy kiệt hoặc quà biếu ngoại giao.

NGUYÊN TẮC TƯ VẤN ĐÔNG Y:
- Mất ngủ, ngủ chập chờn, đau đầu, stress: Tư vấn Yến Táo Đỏ – Hạt Sen (dưỡng tâm an thần) hoặc Kỷ Tử Nhãn Nhục, khuyên dùng nóng trước khi ngủ 30 phút.
- Người mới ốm dậy, sau phẫu thuật, cơ thể suy kiệt: Tư vấn Yến Đông Trùng Hạ Thảo hoặc Hũ VIP Sâu Đông Trùng nguyên con Tây Tạng để phục hồi chính khí thần tốc.
- Mẹ bầu (từ tháng thứ 4 trở đi) & phụ nữ sau sinh: Tư vấn Đường Phèn Thanh Mát hoặc Táo Đỏ Hạt Sen rất lành, bổ sung collagen và axit amin.
- Trẻ nhỏ biếng ăn, hay ho sổ mũi: Tư vấn Đường Phèn Thanh Mát hoặc Táo Đỏ Sen Nước Lá Nếp (hũ nhỏ 75ml hoặc 100ml thanh nhẹ).
- Người tiểu đường / kiêng ngọt: Bếp có nhận chưng riêng KHÔNG ĐƯỜNG hoặc dùng đường ăn kiêng Isomalt tự nhiên.

HƯỚNG DẪN GỢI Ý MÓN BẰNG TAG:
Khi câu trả lời có gợi ý sản phẩm cụ thể, ở dòng cuối cùng của câu trả lời, hãy thêm tag theo đúng cú pháp:
[GỢI Ý: id1, id2] (ví dụ: [GỢI Ý: 1, 4] hoặc [GỢI Ý: 6])
Hệ thống sẽ tự động bắt tag này để hiển thị thẻ món cho khách bấm chọn ngay trên màn hình. Nếu chỉ là câu chào hoặc giải đáp không cần hiển thị thẻ món thì không cần ghi tag này.`;
}

export async function POST(req: NextRequest) {
  try {
    const { message, pendingProposal, history } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Tin nhắn trống" }, { status: 400 });
    }

    // 1. Phân tích nội bộ (Rule-based NLP để bắt thẻ món, contact & đề xuất đơn hàng)
    const localAnalysis = analyzeUserIntent(message, pendingProposal);

    // Nếu khách hàng đã chốt thông tin hoặc đang trong luồng gửi form đơn hàng -> ưu tiên localAnalysis để chốt đơn nhanh
    if (localAnalysis.readyToSubmit) {
      return NextResponse.json({
        text: localAnalysis.text,
        recommendedProducts: localAnalysis.recommendedProducts,
        recommendedVIP: localAnalysis.recommendedVIP,
        orderProposal: localAnalysis.orderProposal,
        readyToSubmit: true,
      });
    }

    // Nhận diện Bố thân mật (ưu tiên phản hồi nhanh như con trong nhà)
    const qLower = message.toLowerCase().trim();
    if (
      qLower.includes("bố đây") ||
      qLower.includes("bố nè") ||
      qLower.includes("bố ơi") ||
      qLower.includes("alo bố") ||
      qLower.includes("bố bảo") ||
      qLower === "bố"
    ) {
      return NextResponse.json({
        text: "Dạ con chào bố ạ! Con là Chị Nhung — Trưởng Bếp Yến Ocean đây bố ơi. Bố đang muốn dặn dò bếp hay kiểm tra điều gì cho con không ạ? Con túc trực sẵn sàng phục vụ bố ngay đây ạ!",
      });
    }

    // 2. Tải danh mục sản phẩm và chính sách khuyến mãi thực tế (Dynamic, không fix cứng)
    const catalog = loadCatalog();
    const promos = loadPromotionsConfig();
    const systemPrompt = buildSystemPrompt(catalog, promos);

    // 3. Gọi DeepSeek API với phong cách Chị Nhung - Trưởng Bếp Hoàng Gia
    const apiKey = process.env.DEEPSEEK_API_KEY || "";
    let finalAnswer = localAnalysis.text;
    let finalRecommendedProducts = localAnalysis.recommendedProducts || [];
    let finalRecommendedVIP = localAnalysis.recommendedVIP || false;

    if (apiKey) {
      try {
        // Chuẩn bị hội thoại bao gồm lịch sử gần nhất nếu có
        const messagesPayload: any[] = [{ role: "system", content: systemPrompt }];

        if (Array.isArray(history) && history.length > 0) {
          const recentHistory = history.slice(-5);
          for (const h of recentHistory) {
            messagesPayload.push({
              role: h.sender === "user" ? "user" : "assistant",
              content: h.text,
            });
          }
        }

        messagesPayload.push({ role: "user", content: message });

        const deepseekRes = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: messagesPayload,
            max_tokens: 650,
            temperature: 0.75,
          }),
          signal: AbortSignal.timeout(10000), // Cho phép 10s để DeepSeek hoàn thành đầy đủ
        });

        if (deepseekRes.ok) {
          const dsData = await deepseekRes.json();
          const rawReply = dsData.choices?.[0]?.message?.content;
          if (rawReply && rawReply.trim()) {
            let cleanedReply = rawReply.trim();

            // Trích xuất tag [GỢI Ý: id1, id2]
            const matchTag = cleanedReply.match(/\[GỢI\s*Ý:\s*([^\]]+)\]/i);
            if (matchTag) {
              const idsString = matchTag[1];
              const parsedIds = idsString
                .split(/[,;\s]+/)
                .map((idStr: string) => parseInt(idStr.trim(), 10))
                .filter((n: number) => !isNaN(n));

              if (parsedIds.length > 0) {
                const matchedProducts = catalog.filter((p) => parsedIds.includes(p.id));
                if (matchedProducts.length > 0) {
                  finalRecommendedProducts = matchedProducts;
                }
              }

              // Xóa tag gợi ý khỏi văn bản trả về để người dùng không thấy cú pháp kỹ thuật
              cleanedReply = cleanedReply.replace(/\[GỢI\s*Ý:\s*([^\]]+)\]/gi, "").trim();
            }

            // Kiểm tra xem có gợi ý sâu Tây Tạng VIP không
            if (
              cleanedReply.toLowerCase().includes("sâu đông trùng") ||
              cleanedReply.toLowerCase().includes("tây tạng") ||
              cleanedReply.toLowerCase().includes("hũ vip")
            ) {
              finalRecommendedVIP = true;
            }

            finalAnswer = cleanedReply;
          }
        }
      } catch (e) {
        console.warn("DeepSeek chat error hoặc timeout, fallback về rule Đông Y:", e);
      }
    }

    return NextResponse.json({
      text: finalAnswer,
      recommendedProducts: finalRecommendedProducts,
      recommendedVIP: finalRecommendedVIP,
      orderProposal: localAnalysis.orderProposal,
      readyToSubmit: localAnalysis.readyToSubmit,
    });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
