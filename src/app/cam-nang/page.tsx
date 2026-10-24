import { Metadata } from "next";
import ArticlesIndexClient from "./ArticlesIndexClient";

export const metadata: Metadata = {
  title: "Cẩm Nang Dưỡng Sinh & Phân Biệt Yến Thật | Bếp Yến Ocean",
  description:
    "Tổng hợp kiến thức phân biệt yến thật giả, bí quyết bồi bổ sức khỏe cho gia đình và địa chỉ mua yến chưng tươi giao nóng 20 phút tại Vinhomes Ocean Park.",
  keywords: [
    "cẩm nang yến sào",
    "phân biệt yến thật giả",
    "yến chưng vinhomes ocean park",
    "mua yến ở ocean park",
    "thời tiết giao mùa ăn yến gì",
    "quà biếu yến sào hà nội",
  ],
};

export default function ArticlesIndexPage() {
  return <ArticlesIndexClient />;
}
