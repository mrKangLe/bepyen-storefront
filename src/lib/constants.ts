export const ZALO_PHONE = process.env.NEXT_PUBLIC_ZALO_PHONE || "0942244994";
export const BRAND_NAME = "Bếp Yến Ocean";
export const TAGLINE = "Yến Chưng Tươi Thượng Hạng - Giao 30 Phút Vinhomes Ocean Park";

export const OCEAN_PARK_BUILDINGS = [
  "Sapphire 1 (S1.01 - S1.12)",
  "Sapphire 2 (S2.01 - S2.19)",
  "The Zenpark (R1.01 - R1.05)",
  "The Pavilion (P1 - P4)",
  "Masteri Waterfront (M1-M3, H1-H3)",
  "The Zurich (ZR1 - ZR3)",
  "Phân khu Biệt thự Ngọc Trai",
  "Phân khu Biệt thự Sao Biển",
  "Phân khu Biệt thự San Hô",
  "Phân khu Biệt thự Hải Âu",
  "Vinhomes Ocean Park 2 (The Empire)",
  "Vinhomes Ocean Park 3 (The Crown)",
  "Khu vực khác quanh Gia Lâm / Hà Nội",
];

export function getZaloLink(message?: string) {
  const cleanPhone = ZALO_PHONE.replace(/\D/g, "");
  if (!message) {
    return `https://zalo.me/${cleanPhone}`;
  }
  return `https://zalo.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
