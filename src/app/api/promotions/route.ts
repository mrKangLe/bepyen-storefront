import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function getPromotionsConfigPath(): string {
  const cwd = process.cwd();
  const path1 = path.resolve(cwd, "..", "data", "promotions_config.json");
  if (fs.existsSync(path1)) return path1;
  const path2 = path.resolve(cwd, "data", "promotions_config.json");
  if (fs.existsSync(path2)) return path2;
  return path1;
}

const DEFAULT_CONFIG = {
  static_policies: [
    {
      id: "policy_fresh_delivery",
      icon: "🛵",
      title: "Giao Nóng 20–30 Phút",
      subtitle: "Chưng nóng hổi theo đơn, giao bốc khói tận cửa căn hộ nội khu Ocean Park",
    },
    {
      id: "policy_bottle_exchange",
      icon: "🫙",
      title: "10 Vỏ = 1 Hũ Tươi",
      subtitle: "Tích lũy 10 vỏ hũ thủy tinh rỗng đổi ngay 1 hũ yến chưng tươi mới thanh mát",
    },
    {
      id: "policy_pure_nest",
      icon: "🌿",
      title: "100% Yến Tươi Thật",
      subtitle: "Sợi yến nở bung sần sật, chưng tươi cách thủy không chất bảo quản",
    },
  ],
  dynamic_campaign: {
    enabled: true,
    id: "freeship_ocean_park",
    badge: "CHỈ ÁP DỤNG",
    title: "FREESHIP NỘI KHU 100%",
    description: "Miễn phí vận chuyển hỏa tốc tận cửa căn hộ cho toàn bộ cư dân khu đô thị Vinhomes Ocean Park",
    highlight_marquee: "🔥 ƯU ĐÃI NỔI BẬT: FREESHIP 100% TẬN CỬA CĂN HỘ OCEAN PARK • GIAO NÓNG 20–30 PHÚT BỐC KHÓI • 10 VỎ RỖNG ĐỔI 1 HŨ TƯƠI 🫙",
    marquee_speed: "normal",
    style: "pulse_glow",
    strictly_forbidden_promos: [
      "Mua 5 tặng 1 (TUYỆT ĐỐI KHÔNG CÓ)",
      "Giảm giá % theo đơn",
      "Tặng hũ ngẫu nhiên không có trong cấu hình",
    ],
  },
};

export async function GET() {
  try {
    const file = getPromotionsConfigPath();
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, "utf8");
      return NextResponse.json(JSON.parse(content));
    }
  } catch (err) {
    console.error("Lỗi đọc promotions_config.json:", err);
  }
  return NextResponse.json(DEFAULT_CONFIG);
}
