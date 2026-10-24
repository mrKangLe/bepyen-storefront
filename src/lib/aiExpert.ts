import { PRODUCTS, VIP_PRODUCT, type Product } from "@/data/products";

export type ChatMessage = {
  id: string;
  sender: "bot" | "user";
  text: string;
  recommendedProducts?: Product[];
  recommendedVIP?: boolean;
  orderProposal?: {
    items: { title: string; qty: number; price: number }[];
    total: number;
    customer_name?: string;
    phone?: string;
    building?: string;
    apartment?: string;
    notes?: string;
    zalo_nickname?: string;
    isExchange?: boolean;
    jarCount?: number;
  };
  completedOrder?: {
    orderId: string;
    customer_name: string;
    phone: string;
    building: string;
    apartment?: string;
    notes?: string;
    zalo_nickname?: string;
    items: { title: string; qty: number; price: number }[];
    total: number;
    zaloLink: string;
  };
  timestamp: string;
};

// Chuẩn hóa Zalo Nickname với hậu tố định danh chuẩn: "Khách Yến" phục vụ gửi tin nhắn hàng loạt & CRM
export function generateZaloNickname(name?: string, building?: string, apartment?: string): string {
  const cleanName = (name || "Quý Cư Dân").trim();
  const addrParts = [apartment ? `Căn ${apartment}` : "", building].filter(Boolean).join(" ");
  if (addrParts) {
    return `${cleanName} - ${addrParts} - Khách Yến`;
  }
  return `${cleanName} - Khách Yến`;
}

// Knowledge base rules & responses
export function analyzeUserIntent(
  input: string,
  pendingProposal?: ChatMessage["orderProposal"]
): {
  text: string;
  recommendedProducts?: Product[];
  recommendedVIP?: boolean;
  orderProposal?: ChatMessage["orderProposal"];
  readyToSubmit?: boolean;
} {
  const q = input.toLowerCase().trim();

  // 1. If user sends contact details while there is a pending proposal
  if (pendingProposal && pendingProposal.items && pendingProposal.items.length > 0) {
    const contact = detectContactDetails(input);
    if (contact.phone) {
      const mergedName = contact.customer_name || pendingProposal.customer_name || "Quý Cư Dân";
      const mergedBuilding = contact.building || pendingProposal.building || "Ocean Park";
      const mergedApartment = contact.apartment || pendingProposal.apartment || "";
      const nickname = generateZaloNickname(mergedName, mergedBuilding, mergedApartment);

      const mergedProposal = {
        ...pendingProposal,
        customer_name: mergedName,
        phone: contact.phone || pendingProposal.phone,
        building: mergedBuilding,
        apartment: mergedApartment,
        notes: contact.notes || pendingProposal.notes || `[Zalo: ${nickname}]`,
        zalo_nickname: nickname,
      };

      if (pendingProposal.isExchange) {
        return {
          text: `🎉 Dạ tuyệt vời ạ! Em đã tạo phiếu tiếp nhận đổi ${mergedProposal.jarCount || 10} vỏ hũ rỗng lấy ${mergedProposal.items[0]?.title.replace("[Quà Tri Ân] ", "")} cho ${mergedProposal.customer_name} (${mergedProposal.phone} - ${mergedProposal.building} ${mergedProposal.apartment ? `Căn ` + mergedProposal.apartment : ""})!\n\n🏷️ Định danh Zalo CRM: **${nickname}**\n\nĐể shipper nội khu ghé đúng giờ và Bếp lưu liên hệ chăm sóc tốt nhất, **Quý cư dân vui lòng bấm nút Mở Zalo bên dưới để gửi tin nhắn cho Bếp trưởng trước một câu nhé ạ**!`,
          orderProposal: mergedProposal,
          readyToSubmit: true,
        };
      }

      return {
        text: `Dạ Bếp đã nhận được thông tin nhận hàng của ${mergedProposal.customer_name} (${mergedProposal.phone} - ${mergedProposal.building} ${mergedProposal.apartment ? `Căn ` + mergedProposal.apartment : ""})!\n\n🏷️ Định danh Zalo: **${nickname}**\n\nBếp đang tiến hành nổi lửa chưng tươi ngay đây ạ:`,
        orderProposal: mergedProposal,
        readyToSubmit: true,
      };
    }
  }

  // 1.5. Xử lý ý định Đổi Vỏ Lấy Yến Tri Ân (Tách vỏ, vị nhận, loại trừ sâu Tây Tạng & tạo Zalo nickname)
  const exchangeMatch = detectExchangeFromText(input, pendingProposal);
  if (exchangeMatch) {
    return exchangeMatch;
  }

  // 2. Check for ordering intent (e.g., "cho mình 2 hũ táo đỏ...")
  const orderMatch = detectOrderFromText(input);
  if (orderMatch) {
    return orderMatch;
  }

  // 0. Nhận diện Bố (thân mật gia đình)
  if (
    q.includes("bố đây") ||
    q.includes("bố nè") ||
    q.includes("bố ơi") ||
    q.includes("bố bảo") ||
    q.includes("bố hỏi") ||
    q.includes("alo bố") ||
    q.includes("alo con") ||
    q.includes("chào con") ||
    q.includes("con ơi") ||
    q === "bố"
  ) {
    return {
      text: "Dạ con chào bố ạ! Con đang túc trực bên Bếp Yến Ocean đây bố ơi. Bố đang muốn dặn dò bếp hay kiểm tra điều gì cho con không ạ?",
    };
  }

  // 0.1 Chào hỏi tự nhiên, lịch sự (nghe trước khi nói, không nhồi nhét bán hàng)
  const isGreeting =
    /^(alo|alô|hi|hello|ê|chào|chao)[\s!.,?~]*$/i.test(q) ||
    /^(chào|alo|alô)\s+(bạn|em|shop|ad|bếp|cả nhà|mọi người|ad)/i.test(q) ||
    /^(em ơi|shop ơi|ad ơi|bếp ơi|bạn ơi|alo em|alo shop|alo bếp|có ai không|cho mình hỏi|cho em hỏi|cho tôi hỏi|cho hỏi|cho bác hỏi|tư vấn giúp)[\s!.,?~]*$/i.test(q);

  if (isGreeting) {
    return {
      text: "Dạ Bếp Yến Ocean xin nghe ạ! Em có thể hỗ trợ gì cho mình hôm nay ạ?",
    };
  }

  // 0.2 Hỏi danh tính, hỏi thăm
  if (
    q.includes("bạn là ai") ||
    q.includes("ai đây") ||
    q.includes("ai đấy") ||
    q.includes("bot à") ||
    q.includes("người hay máy")
  ) {
    return {
      text: "Dạ em là trợ lý tư vấn trực tuyến của Bếp Yến Ocean ạ! Em trực tiếp hỗ trợ tư vấn chọn vị yến theo thể trạng, chỉnh độ ngọt, và lên đơn chưng tươi giao nóng bốc khói 15–20 phút tận căn hộ cho cư dân Ocean Park ạ. Anh/chị cần em hỗ trợ điều gì cứ nhắn em nhé!",
    };
  }

  // 0.3 Hỏi menu, giá cả tổng quan
  if (
    q.includes("bảng giá") ||
    q.includes("giá bao nhiêu") ||
    q.includes("giá cả") ||
    q.includes("nhiêu tiền") ||
    q.includes("có những vị nào") ||
    q.includes("menu có gì") ||
    q.includes("bán những gì")
  ) {
    return {
      text: "Dạ Bếp có các vị chưng tươi cách thủy mẻ nhỏ:\n• Yến Đường Phèn thanh mát: 80.000đ (70ml) – 150.000đ (hũ lớn 150ml)\n• Yến Táo Đỏ Hạt Sen an thần: 85.000đ – 95.000đ\n• Yến Đông Trùng Hạ Thảo đại bổ: 95.000đ – 185.000đ\n• Yến Kỷ Tử Nhãn Nhục bổ huyết: 90.000đ – 165.000đ\n• Hũ VIP Sâu Đông Trùng Tây Tạng nguyên con từ 480.000đ\n• Tổ Yến đảo nguyên tai từ 1.750.000đ – 4.600.000đ\n\nĐặc biệt đang có ưu đãi FREESHIP 100% nội khu Ocean Park, giao nóng 20–30 phút tận cửa căn hộ và chính sách 10 vỏ đổi 1 hũ tươi mới đấy ạ!",
    };
  }



  // 2. Người mới ốm dậy, sau phẫu thuật, suy kiệt
  if (
    q.includes("mới ốm") ||
    q.includes("ốm dậy") ||
    q.includes("phẫu thuật") ||
    q.includes("hồi phục") ||
    q.includes("suy nhược") ||
    q.includes("nằm viện") ||
    q.includes("suy kiệt") ||
    (/\b(ốm|bệnh|mổ)\b/i.test(q) && !q.includes("cho") && !q.includes("nhờ"))
  ) {
    const products = PRODUCTS.filter((p) => p.id === 6 || p.id === 4);
    return {
      text: "Dạ, với người mới ốm dậy hoặc sau phẫu thuật, cơ thể đang hao tổn khí huyết và chính khí suy giảm. Đông Y khuyên dùng Yến kết hợp Đông Trùng Hạ Thảo hoặc Táo Đỏ Hạt Sen:\n\n• Yến Đông Trùng Hạ Thảo: Tăng sinh lực, bổ phế ích thận, phục hồi thể trạng thần tốc.\n• Yến Táo Đỏ Hạt Sen: Dưỡng tâm an thần, bổ tỳ vị giúp người bệnh ăn ngon miệng và dễ ngủ hấp thu dinh dưỡng.\n• Đặc biệt, Bếp có Hũ VIP ngâm Sâu Đông Trùng nguyên con Tây Tạng (nguyên con tự nhiên) là cực phẩm bồi bổ nguyên khí nhanh nhất ạ!",
      recommendedProducts: products,
      recommendedVIP: true,
    };
  }

  // 3. Mất ngủ, căng thẳng, đau đầu, stress
  if (
    q.includes("mất ngủ") ||
    q.includes("khó ngủ") ||
    q.includes("stress") ||
    q.includes("căng thẳng") ||
    q.includes("đau đầu") ||
    q.includes("mệt mỏi") ||
    q.includes("tiền đình") ||
    q.includes("ngủ không sâu")
  ) {
    const products = PRODUCTS.filter((p) => p.id === 4 || p.id === 7);
    return {
      text: "Dạ, chứng mất ngủ và căng thẳng trong Đông Y thường do 'Tâm Tỳ lưỡng hư' hoặc khí huyết không dưỡng được tâm. Vị chuẩn nhất cho thể trạng này là:\n\n• Yến Táo Đỏ – Hạt Sen: Hạt sen thông tâm an thần, táo đỏ bổ khí dưỡng huyết, dùng nóng buổi tối trước khi ngủ 30 phút sẽ giúp giấc ngủ sâu và êm dịu.\n• Yến Kỷ Tử – Nhãn Nhục: Bổ can thận, sinh tân dịch, giảm hoa mắt chóng mặt và giảm căng thẳng sau ngày dài làm việc.",
      recommendedProducts: products,
    };
  }

  // 4. Mẹ bầu, phụ nữ mang thai & sau sinh
  if (
    q.includes("bầu") ||
    q.includes("mang thai") ||
    q.includes("thai kỳ") ||
    q.includes("sau sinh") ||
    q.includes("cho con bú") ||
    q.includes("ở cữ")
  ) {
    const products = PRODUCTS.filter((p) => p.id === 1 || p.id === 3);
    return {
      text: "Dạ chúc mừng mẹ và gia đình ạ! Về bồi bổ cho mẹ bầu và sau sinh:\n\n• Từ tháng thứ 4 trở đi: Mẹ dùng Yến Đường Phèn Thanh Mát hoặc Yến Táo Đỏ Hạt Sen rất lành tính, cung cấp 18 loại axit amin và collagen tự nhiên giúp ngừa rạn da, tăng đề kháng cho cả mẹ và thai nhi.\n• Lưu ý Đông Y: Mẹ bầu dưới 3 tháng hoặc đang nghén nặng nên dùng lượng nhỏ thanh nhẹ. Không nên tự ý dùng đông trùng hàm lượng cao khi đang mang thai.\n• Bếp chưng thủ công không chất bảo quản, độ ngọt thanh vừa phải rất dễ uống cho mẹ bầu ạ!",
      recommendedProducts: products,
    };
  }

  // 5. Trẻ em, trẻ nhỏ, biếng ăn, ho sổ mũi
  const isKids =
    q.includes("trẻ em") ||
    q.includes("trẻ nhỏ") ||
    q.includes("em bé") ||
    q.includes("cho bé") ||
    q.includes("bé nhà") ||
    q.includes("con nhỏ") ||
    q.includes("trẻ con") ||
    q.includes("con nít") ||
    q.includes("biếng ăn") ||
    q.includes("lười ăn") ||
    q.includes("sổ mũi") ||
    q.includes("ốm vặt") ||
    /\b(bị ho|viêm họng|ho đờm|ho khan|ho gió)\b/i.test(q) ||
    (/\bho\b/i.test(q) && !q.includes("cho") && !q.includes("học"));

  if (isKids) {
    const products = PRODUCTS.filter((p) => p.id === 1 || p.id === 3);
    return {
      text: "Dạ với các bé (từ 1 tuổi trở lên), hệ tiêu hóa còn non nớt nên nguyên tắc bồi bổ là 'thanh đạm - dễ hấp thu':\n\n• Yến Đường Phèn Thanh Mát: Vị ngọt thanh dịu từ đường phèn Quảng Ngãi, bổ phế, trừ ho gió ho khan, làm sạch đường hô hấp của bé rất tốt.\n• Yến Táo Đỏ Hạt Sen: Giúp bé ngủ ngon giấc hơn, không bị giật mình quấy khóc ban đêm, kích thích tỳ vị giúp bé ăn cơm ngon hơn.\n• Bếp khuyên cho bé dùng 1/2 hũ mỗi lần, cách ngày dùng 1 lần vào buổi sáng hoặc trước khi ngủ 30 phút ạ!",
      recommendedProducts: products,
    };
  }

  // 6. Tiểu đường, ăn kiêng, kiêng ngọt
  if (
    q.includes("tiểu đường") ||
    q.includes("đường huyết") ||
    q.includes("ăn kiêng") ||
    q.includes("không đường") ||
    q.includes("giảm cân") ||
    q.includes("ít ngọt") ||
    q.includes("nhạt")
  ) {
    const products = PRODUCTS.filter((p) => p.id === 1 || p.id === 5);
    return {
      text: "Dạ Bếp hiểu rất rõ lo lắng của các bác/cô chú có đường huyết cao ạ! Bếp có 2 giải pháp chưng tươi chuyên biệt:\n\n• Chưng hoàn toàn không đường (chỉ dùng tổ yến nguyên chất chưng nước tinh khiết kèm hạt sen hoặc đông trùng tự nhiên).\n• Hoặc chưng độ ngọt thanh cực nhẹ theo yêu cầu riêng của từng khách.\n\nKhi đặt món, bác/anh chị chỉ cần ghi chú 'Không đường' hoặc 'Ít ngọt' là Bếp sẽ chưng riêng chuẩn chỉ 100% ạ!",
      recommendedProducts: products,
    };
  }

  // 7. Quà biếu, tặng sếp, bố mẹ, đối tác
  if (
    q.includes("biếu") ||
    q.includes("tặng") ||
    q.includes("sếp") ||
    q.includes("quà") ||
    q.includes("bố mẹ") ||
    q.includes("ông bà") ||
    q.includes("sang") ||
    q.includes("set")
  ) {
    const products = PRODUCTS.filter((p) => p.id === 9 || p.id === 10);
    return {
      text: "Dạ tặng quà sức khỏe là món quà trang trọng và ý nghĩa nhất! Bếp xin gợi ý 2 lựa chọn quà biếu hoàng gia:\n\n• Set 6 Hũ Lục Vị Cung Đình (580k): Đầy đủ 6 phong vị bồi bổ, đóng hộp quà sơn mài đỏ son viền vàng kim kèm túi xách cao cấp.\n• Hũ Yến Thượng Hạng Ngâm Sâu Đông Trùng Nguyên Con (VIP): Cực kỳ đẳng cấp, sâu đông trùng nguyên con tự nhiên bồi bổ nguyên khí, tặng sếp hoặc bậc sinh thành thể hiện trọn vẹn lòng hiếu kính!",
      recommendedProducts: products,
      recommendedVIP: true,
    };
  }

  // 8. Vị VIP Sâu Đông Trùng
  if (
    q.includes("vip") ||
    q.includes("sâu") ||
    q.includes("thượng hạng") ||
    q.includes("con sâu") ||
    q.includes("đắt nhất") ||
    q.includes("cao cấp nhất")
  ) {
    return {
      text: "Dạ, hũ VIP Thượng Hạng là sản phẩm độc quyền tự hào nhất của Bếp Yến Ocean:\n\n• Sử dụng sâu đông trùng hạ thảo nguyên con tự nhiên ngâm trực tiếp cùng yến chưng tươi cách thủy.\n• Giá sâu: 400.000đ / con (bác/anh chị có thể chọn 1 con hoặc 2 con).\n• Tự do chọn 1 trong 10 vị cốt yến theo khẩu vị (như cốt hạt sen táo đỏ, cốt đường phèn, cốt đông trùng...). Bếp chưng nóng giao tận sảnh trong 20-30 phút ạ!",
      recommendedVIP: true,
    };
  }

  // 9. Thời gian giao hàng, địa chỉ, phí ship
  if (
    q.includes("giao") ||
    q.includes("ship") ||
    q.includes("bao lâu") ||
    q.includes("mấy phút") ||
    q.includes("ở đâu") ||
    q.includes("vinhomes") ||
    q.includes("sảnh")
  ) {
    return {
      text: "Dạ, Bếp Yến Ocean đặt ngay trong lòng đại đô thị Vinhomes Ocean Park:\n\n• Giao nhanh thần tốc trong 20–30 phút nóng hổi tận sảnh hoặc căn hộ toàn khu OCP1, OCP2, OCP3 (Sapphire, Zenpark, Pavilion, Masteri, Zurich, các phân khu Biệt thự).\n• Nhận đơn bếp mới nổi lửa chưng ngay, giao tới tay khách vẫn còn bốc khói ấm, giữ trọn 100% dinh dưỡng quý báu ạ!",
    };
  }

  // 10. Default friendly consultation – Lắng nghe tự nhiên, không nhét món bừa bãi
  return {
    text: "Dạ em đã nghe rồi ạ. Anh/chị có thể chia sẻ cụ thể hơn nhu cầu của mình (ví dụ: bồi bổ sức khỏe cho ai, hay cần tư vấn vị yến chưng nào) để em giải đáp chu đáo nhất cho mình nhé ạ!",
  };
}

// Detailed contact parser
export function detectContactDetails(text: string): {
  customer_name?: string;
  phone?: string;
  building?: string;
  apartment?: string;
  notes?: string;
} {
  // Extract phone (VN format: 10 digits starting with 03, 05, 07, 08, 09 or +84)
  const phoneMatch = text.match(/(?:\+84|0)[35789]\d{8}/);
  const phone = phoneMatch ? phoneMatch[0].replace("+84", "0") : undefined;

  // Extract name: e.g. "Chị Mai", "Anh Tuấn", "Em Hà", "Cô Nga", "Bác Hùng", "mình là Hương"
  const nameMatch = text.match(/(?:chị|anh|cô|bác|em|mình là|tên là|tôi là)\s+([A-Za-zÀ-ỹ]+(?:\s+[A-Za-zÀ-ỹ]+)?)/i);
  let customer_name = nameMatch ? nameMatch[0].trim() : undefined;
  if (customer_name) {
    customer_name = customer_name.replace(/^(mình là|tên là|tôi là)\s*/i, "");
  }

  // Extract building: S1.01 to S3.19, Masteri, Zenpark, Pavilion, Zurich, Sao Biển, Hải Âu, San Hô, Ngọc Trai
  const buildingMatch = text.match(/(s[1-3]\.[0-2][0-9]|r[1-3]\.[0-2][0-9]|zr[1-3]|p[1-4]|m[1-3]|zenpark|pavilion|masteri|zurich|ngọc trai|sao biển|hải âu|san hô|chà là|đảo dừa|kinh đô|ocp[1-3])/i);
  const building = buildingMatch ? buildingMatch[0].toUpperCase() : undefined;

  // Extract apartment: "căn 12A08", "căn 1204", "p.502", "phòng 803"
  const roomMatch = text.match(/(?:căn|p\.|phòng|phong)\s*([0-9]{1,2}[A-Za-z]?[0-9]{2,3}|[0-9]{3,4})/i);
  const apartment = roomMatch ? roomMatch[1].toUpperCase() : undefined;

  // Extract notes: ít ngọt, không đường, giao nóng, v.v.
  let notes: string | undefined;
  if (/không đường|khong duong/i.test(text)) notes = "Chưng không đường";
  else if (/ít ngọt|it ngot/i.test(text)) notes = "Chưng ít ngọt";
  else if (/giao nóng|nong/i.test(text)) notes = "Giao nóng hổi";

  return { customer_name, phone, building, apartment, notes };
}

// ── Parser chuyên trách xử lý ý định ĐỔI VỎ LẤY YẾN TRI ÂN ──────────────────
export function detectExchangeFromText(
  text: string,
  pendingProposal?: ChatMessage["orderProposal"]
): {
  text: string;
  orderProposal?: ChatMessage["orderProposal"];
  readyToSubmit?: boolean;
} | null {
  const t = text.toLowerCase();
  const isExchangeKeyword =
    t.includes("đổi vỏ") ||
    t.includes("doi vo") ||
    t.includes("thu vỏ") ||
    t.includes("thu vo") ||
    t.includes("vỏ hũ") ||
    t.includes("vo hu") ||
    t.includes("vỏ chai") ||
    t.includes("hũ rỗng") ||
    t.includes("hu rong") ||
    t.includes("vỏ trắng") ||
    t.includes("vo trang") ||
    t.includes("đổi yến") ||
    t.includes("doi yen") ||
    t.includes("đổi quà") ||
    t.includes("đổi sp") ||
    (t.includes("vỏ") && (t.includes("đổi") || t.includes("lấy") || t.includes("tặng") || t.includes("bao nhiêu") || t.includes("mấy")));

  if (!isExchangeKeyword && !pendingProposal?.isExchange) {
    return null;
  }

  // 1. Quy tắc loại trừ: Hũ VIP Sâu Đông Trùng Tây Tạng nguyên con không áp dụng đổi vỏ
  if (
    t.includes("sâu") ||
    t.includes("sau dong trung") ||
    t.includes("tây tạng") ||
    t.includes("tay tang") ||
    t.includes("vip")
  ) {
    return {
      text: "Dạ riêng hũ VIP Sâu Đông Trùng Tây Tạng nguyên con tự nhiên hảo hạng thì Bếp chưa áp dụng trong chính sách tri ân đổi vỏ ạ. 🙏\n\n🌿 Nhưng với 10 vỏ hũ thủy tinh rỗng, Quý cư dân có thể chọn **bất kỳ vị yến tươi nào khác trong thực đơn** (Táo Đỏ Hạt Sen, Đông Trùng Hoa Vàng, Kỷ Tử Long Nhãn, Hạt Chia Hữu Cơ, Đường Phèn...) hoàn toàn miễn phí nhé ạ!\n\nQuý cư dân muốn chọn vị yến nào để em hỗ trợ lên lịch shipper ghé trao quà tận nơi ạ?",
    };
  }

  // 2. Tìm số lượng vỏ hũ rỗng
  let jarCount = pendingProposal?.jarCount || 0;
  const jarMatch = text.match(/(\d+)\s*(vỏ|vo|hũ|hu|cái|lọ)/i) || text.match(/(?:có|gửi|đổi|tích|được)\s*(\d+)/i);
  if (jarMatch) {
    jarCount = parseInt(jarMatch[1], 10);
  } else if (!jarCount) {
    if (t.includes("10 hũ") || t.includes("10 hu") || t.includes("mười vỏ") || t.includes("mười hũ") || t.includes("10")) {
      jarCount = 10;
    } else if (t.includes("5 hũ") || t.includes("năm vỏ") || t.includes("5 vỏ") || t.includes("5")) {
      jarCount = 5;
    } else if (t.includes("20")) {
      jarCount = 20;
    }
  }

  // 3. Xác định vị yến muốn nhận theo quy tắc:
  // - 10 hũ trắng đổi được 1 hũ bất kỳ trừ sâu đông trùng
  // - 5 hũ đổi 1 hũ đường phèn hoặc hạt chia
  // - 20 hũ đổi 2 hũ hoặc set quà
  let rewardName = "1 Hũ Yến Chưng Tươi Thượng Hạng (Tự chọn vị)";
  if (t.includes("táo đỏ") || t.includes("hạt sen") || t.includes("tao do") || t.includes("hat sen")) {
    rewardName = "1 Hũ Yến Chưng Táo Đỏ Hạt Sen";
  } else if (t.includes("đông trùng") || t.includes("dong trung")) {
    rewardName = "1 Hũ Yến Chưng Đông Trùng Hạ Thảo";
  } else if (t.includes("kỷ tử") || t.includes("nhãn") || t.includes("ky tu") || t.includes("long nhãn")) {
    rewardName = "1 Hũ Yến Chưng Kỷ Tử Nhãn Nhục";
  } else if (t.includes("chia") || t.includes("hạt chia")) {
    rewardName = "1 Hũ Yến Chưng Hạt Chia Hữu Cơ";
  } else if (t.includes("đường phèn") || t.includes("duong phen")) {
    rewardName = "1 Hũ Yến Chưng Đường Phèn";
  } else if (jarCount >= 20) {
    rewardName = "Set Quà Tam Hoa Hoàng Gia (3 hũ ngự thiện)";
  } else if (jarCount >= 10) {
    rewardName = "1 Hũ Yến Chưng Tươi Bất Kỳ (trừ sâu Tây Tạng)";
  } else if (jarCount >= 5) {
    rewardName = "1 Hũ Yến Chưng Đường Phèn Thanh Mát";
  }

  // 4. Bóc tách thông tin liên hệ cư dân
  const contact = detectContactDetails(text);
  const mergedName = contact.customer_name || pendingProposal?.customer_name;
  const mergedPhone = contact.phone || pendingProposal?.phone;
  const mergedBuilding = contact.building || pendingProposal?.building;
  const mergedApartment = contact.apartment || pendingProposal?.apartment;

  const effectiveJarCount = jarCount || 10;
  const nickname = generateZaloNickname(mergedName, mergedBuilding, mergedApartment);

  const proposal: ChatMessage["orderProposal"] = {
    items: [
      {
        title: `[Quà Tri Ân] ${rewardName} (${effectiveJarCount} vỏ hũ)`,
        qty: 1,
        price: 0,
      },
    ],
    total: 0,
    customer_name: mergedName || "Quý Cư Dân",
    phone: mergedPhone,
    building: mergedBuilding || "Ocean Park",
    apartment: mergedApartment || "",
    notes: `[TRI ÂN ĐỔI VỎ - ${effectiveJarCount} VỎ HŨ] Định danh Zalo: ${nickname}`,
    zalo_nickname: nickname,
    isExchange: true,
    jarCount: effectiveJarCount,
  };

  const hasPhoneAndAddress = Boolean(mergedPhone && (mergedBuilding || mergedApartment));

  // Nếu đã đủ số điện thoại và địa chỉ căn hộ -> Ready to Submit!
  if (hasPhoneAndAddress) {
    return {
      text: `🎉 Dạ tuyệt vời ạ! Em đã tạo phiếu tiếp nhận đổi ${effectiveJarCount} vỏ hũ rỗng lấy ${rewardName} cho ${proposal.customer_name} (${proposal.phone} - ${proposal.building} ${proposal.apartment ? `Căn ` + proposal.apartment : ""})!\n\n🏷️ Định danh Zalo CRM: **${nickname}**\n\nĐể shipper nội khu ghé đúng giờ và Bếp lưu liên hệ chăm sóc tốt nhất, **Quý cư dân vui lòng bấm nút Mở Zalo bên dưới để gửi tin nhắn cho Bếp trưởng trước một câu nhé ạ**!`,
      orderProposal: proposal,
      readyToSubmit: true,
    };
  }

  // Nếu chưa có số lượng vỏ cụ thể
  if (!jarCount) {
    return {
      text: `Dạ Bếp Yến Ocean có chính sách tri ân cư dân xanh cực kỳ ưu đãi ạ:\n\n🌿 **Cứ 10 vỏ hũ thủy tinh rỗng = Kính biếu 1 hũ yến chưng tươi bất kỳ trong thực đơn** (Táo đỏ hạt sen, Đông trùng hoa vàng, Hạt chia hữu cơ, Kỷ tử long nhãn, Đường phèn...). *(Riêng hũ VIP sâu đông trùng Tây Tạng không áp dụng)*.\n🌿 **Tích 5 vỏ hũ**: Đổi 1 hũ Yến Chưng Đường Phèn thanh mát.\n\nQuý cư dân đang có bao nhiêu vỏ hũ và muốn nhận vị yến nào để em hỗ trợ lên lịch shipper ghé nhận vỏ tận cửa căn hộ ạ?`,
      orderProposal: proposal,
      readyToSubmit: false,
    };
  }

  // Đã có số lượng vỏ, khéo léo xin thông tin khách để lưu CRM
  return {
    text: `Dạ tuyệt vời ạ! Với ${effectiveJarCount} vỏ hũ rỗng, Bếp trân trọng kính biếu Quý cư dân **${rewardName}** nóng hổi hoàn toàn miễn phí ạ! 🌿\n\nĐể shipper nội khu ghé tận cửa căn hộ tiếp nhận vỏ và trao yến nóng tận tay, Quý cư dân cho em xin **Tên, Số điện thoại và Số căn/Tòa nhà** của mình nhé ạ (Ví dụ: Chị Lan, 0912xxx, Căn 1204 S2.01)!`,
    orderProposal: proposal,
    readyToSubmit: false,
  };
}

// Simple parser for direct ordering via chat
export function detectOrderFromText(text: string): {
  text: string;
  orderProposal: ChatMessage["orderProposal"];
  recommendedProducts?: Product[];
  readyToSubmit?: boolean;
} | null {
  const t = text.toLowerCase();

  // Trigger words for ordering
  const isOrder =
    t.includes("lấy") ||
    t.includes("đặt") ||
    t.includes("cho mình") ||
    t.includes("cho chị") ||
    t.includes("cho anh") ||
    t.includes("cho em") ||
    t.includes("cho cô") ||
    t.includes("cho bác") ||
    t.includes("mua") ||
    t.includes("giao") ||
    t.includes("order");

  if (!isOrder) return null;

  const foundItems: { title: string; qty: number; price: number }[] = [];

  // Match items
  if (t.includes("đường phèn") || t.includes("duong phen")) {
    const qty = extractQty(t, "đường phèn") || 1;
    const prod = PRODUCTS.find((p) => p.id === 1)!;
    foundItems.push({ title: prod.title, qty, price: prod.price });
  }
  if (t.includes("táo đỏ") || t.includes("hạt sen") || t.includes("tao do") || t.includes("hat sen")) {
    const qty = extractQty(t, "táo") || extractQty(t, "sen") || 1;
    const prod = PRODUCTS.find((p) => p.id === 3)!;
    foundItems.push({ title: prod.title, qty, price: prod.price });
  }
  if (t.includes("đông trùng") || t.includes("dong trung")) {
    const qty = extractQty(t, "đông trùng") || 1;
    const prod = PRODUCTS.find((p) => p.id === 5)!;
    foundItems.push({ title: prod.title, qty, price: prod.price });
  }
  if (t.includes("kỷ tử") || t.includes("nhãn") || t.includes("ky tu")) {
    const qty = extractQty(t, "kỷ tử") || 1;
    const prod = PRODUCTS.find((p) => p.id === 7)!;
    foundItems.push({ title: prod.title, qty, price: prod.price });
  }
  if (t.includes("tam hoa")) {
    const qty = 1;
    const prod = PRODUCTS.find((p) => p.id === 9)!;
    foundItems.push({ title: prod.title, qty, price: prod.price });
  }
  if (t.includes("lục vị") || t.includes("set 6")) {
    const qty = 1;
    const prod = PRODUCTS.find((p) => p.id === 10)!;
    foundItems.push({ title: prod.title, qty, price: prod.price });
  }
  if (t.includes("sâu") || t.includes("vip")) {
    const qty = 1;
    foundItems.push({ title: "Yến Thượng Hạng VIP Ngâm Sâu Đông Trùng", qty, price: 495000 });
  }

  if (foundItems.length === 0) return null;

  const contact = detectContactDetails(text);
  const total = foundItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const nickname = generateZaloNickname(contact.customer_name, contact.building, contact.apartment);

  const proposal: ChatMessage["orderProposal"] = {
    items: foundItems,
    total,
    customer_name: contact.customer_name || "Quý Cư Dân",
    phone: contact.phone,
    building: contact.building || "Ocean Park",
    apartment: contact.apartment || "",
    notes: contact.notes || "",
    zalo_nickname: nickname,
  };

  const ready = Boolean(contact.phone && (contact.building || contact.apartment));

  return {
    text: ready
      ? `Dạ Bếp nhận đơn chưng nóng giao tận nơi cho ${proposal.customer_name} (${proposal.phone})! Bếp đang tiến hành nổi lửa chưng tươi ngay ạ:`
      : `Dạ Bếp đã tiếp nhận món bạn chọn! Bạn xác nhận nhanh thông tin nhận hàng bên dưới để Bếp nổi lửa chưng tươi giao nóng trong 20–30 phút nhé ạ:`,
    orderProposal: proposal,
    readyToSubmit: ready,
  };
}

function extractQty(text: string, keyword: string): number {
  const regex = new RegExp(`(\\d+)\\s*(hũ|lọ|suất|chén|phần)?\\s*(${keyword})|(${keyword})\\s*(\\d+)`, "i");
  const match = text.match(regex);
  if (match) {
    return parseInt(match[1] || match[5] || "1", 10);
  }
  return 1;
}
