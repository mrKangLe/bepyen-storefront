// Quản lý Affiliate / Mã Giới Thiệu Cư Dân Bếp Yến Ocean
export const AFFILIATE_STORAGE_KEY = "yocp_affiliate_code";
export const COMMISSION_RATE = 0.08; // 8% hoa hồng tri ân cho cư dân giới thiệu
export const PRODUCTION_DOMAIN = "https://bepyen.ocean";

export function getStoredAffiliateCode(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(AFFILIATE_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function saveAffiliateCode(code: string): void {
  if (typeof window === "undefined") return;
  const clean = code.trim();
  if (!clean) return;
  try {
    localStorage.setItem(AFFILIATE_STORAGE_KEY, clean);
    // Lưu cookie 30 ngày để server hoặc các tab khác đều nhận diện được
    const maxAge = 30 * 24 * 60 * 60;
    document.cookie = `${AFFILIATE_STORAGE_KEY}=${encodeURIComponent(clean)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch {}
}

/**
 * Tạo link chia sẻ sản phẩm.
 * Mặc định dùng domain chuẩn (PRODUCTION_DOMAIN) để SSR và Hydration đồng nhất tuyệt đối,
 * tránh lỗi hydration mismatch giữa localhost và domain chính.
 */
export function buildProductShareUrl(
  slug: string,
  refCode?: string,
  customOrigin?: string
): string {
  const origin = customOrigin || PRODUCTION_DOMAIN;
  const base = `${origin}/san-pham/${slug}`;
  const code = (refCode || "").trim();
  if (code) {
    return `${base}?ref=${encodeURIComponent(code)}`;
  }
  return base;
}

export function calculateCommission(price: number): number {
  return Math.round(price * COMMISSION_RATE);
}
