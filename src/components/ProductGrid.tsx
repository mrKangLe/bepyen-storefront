"use client";

import { useState, useEffect } from "react";
import { PRODUCTS, type Product } from "@/data/products";
import ProductCard from "./ProductCard";

const BENEFIT_FILTERS = [
  { key: "all", label: "Tất Cả", glyph: "✦" },
  { key: "sang-mat", label: "Bổ Mắt & Não", glyph: "👁️" },
  { key: "thanh-nhiet", label: "Làm Mát & Thanh Lọc", glyph: "🌿" },
  { key: "ngu-ngon", label: "Ngủ Ngon & Bổ Huyết", glyph: "🌙" },
  { key: "tang-luc", label: "Tăng Thể Lực & Phổi Thận", glyph: "⚡" },
  { key: "dep-da", label: "Giữ Dáng & Đẹp Da", glyph: "✨" },
];

type Props = {
  activeCategory: string;
  onCategory: (cat: string) => void;
  mode?: "fresh" | "gift";
};

export default function ProductGrid({
  activeCategory,
  onCategory,
  mode = "fresh",
}: Props) {
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.products && Array.isArray(data.products) && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch(() => {
        // Fallback to static PRODUCTS
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (mode === "gift") {
    const giftProducts = productList.filter((p) => p.category === "Set quà biếu");

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs" style={{ color: "var(--ink-light)" }}>
            Bộ sưu tập quà tặng tôn quý ({giftProducts.length} set)
          </p>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-100/60 border border-amber-300/60 px-2 py-0.5 rounded-full">
            ✦ Hộp Quà Gấm & Nhung Hoàng Gia
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {giftProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }

  // mode === "fresh"
  const freshJarProducts = productList.filter(
    (p) => p.category !== "Yến tổ thượng hạng" && p.category !== "Set quà biếu"
  );

  const filterByBenefit = (product: Product, key: string): boolean => {
    if (key === "all" || key === "Tất cả") return true;
    const textToSearch = [
      product.title,
      product.subtitle,
      product.description,
      product.category,
      ...(product.benefits || []),
      ...(product.tags || []),
      ...(product.benefitIcons?.map((b) => b.label) || []),
    ]
      .join(" ")
      .toLowerCase();

    if (key === "sang-mat") {
      return (
        textToSearch.includes("mắt") ||
        textToSearch.includes("kỷ tử") ||
        textToSearch.includes("não") ||
        textToSearch.includes("minh mẫn") ||
        textToSearch.includes("can thận")
      );
    }
    if (key === "thanh-nhiet") {
      return (
        textToSearch.includes("thanh nhiệt") ||
        textToSearch.includes("thanh lọc") ||
        textToSearch.includes("hạt chia") ||
        textToSearch.includes("giải độc") ||
        textToSearch.includes("tiêu hóa")
      );
    }
    if (key === "ngu-ngon") {
      return (
        textToSearch.includes("ngủ ngon") ||
        textToSearch.includes("ngủ sâu") ||
        textToSearch.includes("hạt sen") ||
        textToSearch.includes("táo đỏ") ||
        textToSearch.includes("bổ huyết") ||
        textToSearch.includes("an thần")
      );
    }
    if (key === "tang-luc") {
      return (
        textToSearch.includes("đông trùng") ||
        textToSearch.includes("sinh lực") ||
        textToSearch.includes("thể lực") ||
        textToSearch.includes("thận") ||
        textToSearch.includes("phổi") ||
        textToSearch.includes("12%")
      );
    }
    if (key === "dep-da") {
      return (
        textToSearch.includes("đẹp da") ||
        textToSearch.includes("dáng") ||
        textToSearch.includes("collagen") ||
        textToSearch.includes("hồng hào") ||
        textToSearch.includes("dưỡng nhan")
      );
    }
    // Fallback: compare with product.category
    return product.category === key;
  };

  const filtered = freshJarProducts.filter((p) =>
    filterByBenefit(p, activeCategory)
  );

  return (
    <div>
      {/* Sub-category filter theo CÔNG DỤNG BỒI BỔ – horizontal scroll on mobile */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
            <span>✨</span>
            <span>Chọn Theo Công Dụng Bồi Bổ:</span>
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 snap-x scrollbar-hide">
          {BENEFIT_FILTERS.map((c) => {
            const active =
              activeCategory === c.key ||
              (c.key === "all" && activeCategory === "Tất cả");
            return (
              <button
                type="button"
                key={c.key}
                onClick={() => onCategory(c.key)}
                className="tap-active flex-shrink-0 snap-start flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                style={{
                  background: active
                    ? "linear-gradient(135deg, var(--red-deep), var(--red-primary))"
                    : "#FFFDF9",
                  borderColor: active ? "var(--gold)" : "#DFD5C0",
                  color: active ? "#FFF8DC" : "var(--ink)",
                  boxShadow: active
                    ? "0 3px 10px rgba(114, 22, 26, 0.3)"
                    : "0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-serif font-black ${
                    active
                      ? "bg-amber-400 text-red-950"
                      : "bg-red-900/10 text-red-900"
                  }`}
                >
                  {c.glyph}
                </span>
                <span className="tracking-wide">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs mb-3 text-stone-600">
        Hiển thị <span className="font-bold text-red-900">{filtered.length}</span> hũ chưng tươi phù hợp
      </p>

      {/* Grid – Luôn cố định 2 cột theo chuẩn app di động */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-3xl mb-2">🫙</div>
          <p className="text-xs text-stone-500">Không có sản phẩm trong danh mục này</p>
        </div>
      )}
    </div>
  );
}
