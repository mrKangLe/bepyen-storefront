import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Đường dẫn file data/products_catalog.json từ web-storefront
function getCatalogPath(): string {
  const cwd = process.cwd();
  const path1 = path.resolve(cwd, "..", "data", "products_catalog.json");
  if (fs.existsSync(path1)) return path1;
  const path2 = path.resolve(cwd, "data", "products_catalog.json");
  if (fs.existsSync(path2)) return path2;
  return path1;
}

export async function GET() {
  try {
    const file = getCatalogPath();
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, "utf8");
      const data = JSON.parse(content);
      return NextResponse.json(data);
    }
  } catch (err) {
    console.error("Lỗi đọc products_catalog.json:", err);
  }
  return NextResponse.json({ products: [], vip_product: null });
}
