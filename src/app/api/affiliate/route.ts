import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function getSettingsPath(): string {
  const cwd = process.cwd();
  const p1 = path.resolve(cwd, "..", "data", "affiliate_settings.json");
  if (fs.existsSync(p1)) return p1;
  const p2 = path.resolve(cwd, "data", "affiliate_settings.json");
  if (fs.existsSync(p2)) return p2;
  return p1;
}

const DEFAULT_SETTINGS = {
  enabled: true,
  commission_rate: 0.08,
  campaign_season: "ocean_park",
  campaign_badge: "🌸 ĐẶC QUYỀN CƯ DÂN VINHOMES OCEAN PARK",
  campaign_title: "Chương Trình Cư Dân Lan Tỏa · Nhận Hoa Hồng Tri Ân",
  campaign_headline: "Chia Sẻ Món Yến Này – Nhận Hoa Hồng Tri Ân",
  campaign_desc: "Mỗi lượt giới thiệu cho hàng xóm, đồng nghiệp hoặc người thân đặt món này qua link của bạn, Bếp Yến Ocean kính gửi hoa hồng tri ân {commission_percent}% (hoặc quy đổi ra hũ yến chưng tươi miễn phí giao nóng tận cửa).",
  reward_note: "Chuyển khoản trực tiếp qua STK / Zalo Pay hoặc quy đổi thành hũ yến chưng nóng",
  contact_zalo: "0942244994",
  contact_name: "Bếp Trưởng Yến Ocean",
  steps: [
    {
      step: 1,
      title: "Nhập Tên / SĐT Nhận Mã",
      desc: "Điền tên hoặc SĐT Zalo (VD: lan_s201 hoặc 0912...) vào ô bên dưới để tạo link chia sẻ độc quyền trong 1 giây.",
      icon: "🔑"
    },
    {
      step: 2,
      title: "Gửi Link Cho Bạn Bè & Cư Dân",
      desc: "Bấm 'Chép Link' hoặc 'Gửi Qua Zalo' vào nhóm tòa nhà, bạn bè, người thân khi họ cần bồi bổ sức khỏe.",
      icon: "📲"
    },
    {
      step: 3,
      title: "Bếp Giao Hỏa Tốc & Ghi Nhận",
      desc: "Bếp Yến Ocean chưng nóng thủ công, giao hỏa tốc 20 phút. Hệ thống tự động ghi nhận hoa hồng theo mã của bạn.",
      icon: "🛵"
    },
    {
      step: 4,
      title: "Nhận Hoa Hồng Tức Thì",
      desc: "Nhận tiền chuyển khoản qua STK/Zalo Pay hàng tuần hoặc trừ thẳng vào đơn yến chưng nóng giao cho gia đình.",
      icon: "💰"
    }
  ],
  faq: [
    {
      q: "Tôi có phải bỏ vốn hay ôm hàng không?",
      a: "Hoàn toàn 0đ vốn! Bạn chỉ cần chia sẻ link. Bếp Yến Ocean đảm nhận từ khâu chưng tươi cách thủy, đóng gói ngự thiện đến giao hỏa tốc 20 phút tận căn hộ."
    },
    {
      q: "Hoa hồng được tính như thế nào?",
      a: "Hoa hồng tính theo % giá trị đơn hàng đặt thành công qua link của bạn. Khách mua 1 hũ hay nhiều hũ bạn đều nhận trọn vẹn hoa hồng."
    },
    {
      q: "Làm sao để đối soát và nhận tiền?",
      a: "Sau khi người quen nhận hàng, bạn chỉ cần bấm nút chat Zalo trực tiếp với Bếp Trưởng (0942.244.994) để nhận chuyển khoản ngay trong ngày hoặc quy đổi hũ yến."
    }
  ],
  updated_at: new Date().toISOString(),
};

export async function GET() {
  try {
    const file = getSettingsPath();
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, "utf8"));
      return NextResponse.json({ ...DEFAULT_SETTINGS, ...data });
    }
  } catch (err) {
    console.error("Lỗi đọc affiliate_settings.json:", err);
  }
  return NextResponse.json(DEFAULT_SETTINGS);
}
