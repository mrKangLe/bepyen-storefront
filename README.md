# 🕊️ Bếp Yến Ocean — Giao Diện Web Đặt Hàng (Deploy Vercel)

Giao diện bán yến chưng tươi trực tuyến phục vụ cư dân Vinhomes Ocean Park, tối ưu hóa 100% để triển khai lên **Vercel (Serverless)** với tốc độ cao, hỗ trợ PWA và bảo mật SSL HTTPS.

---

## 🚀 Hướng Dẫn Đẩy Lên Vercel (1 Phút)

### Bước 1: Khởi tạo Git & Đẩy lên GitHub
Mở Terminal tại thư mục này (`bepyen-storefront-vercel`):
```bash
git init
git add .
git commit -m "Deploy Bep Yen Storefront to Vercel"
# Đổi link GitHub của Bố vào bên dưới:
git remote add origin https://github.com/<tai-khoan-github-cua-bo>/bepyen-storefront.git
git branch -M main
git push -u origin main
```

### Bước 2: Kết nối Vercel
1. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng GitHub.
2. Bấm **Add New** -> **Project**.
3. Chọn repo `bepyen-storefront`.
4. Trong mục **Environment Variables** (Biến môi trường), thêm các giá trị:
   - `NEXT_PUBLIC_ZALO_PHONE`: `0942244994` (Số Zalo của Bếp)
   - `BACKEND_API_URL`: Điền đường link Cloudflare Tunnel từ máy Ubuntu (ví dụ: `https://xxx.trycloudflare.com`)
   - `BACKEND_API_KEY`: `bepyen_secret_key_88888888`
   - `DEEPSEEK_API_KEY`: `your_deepseek_api_key_here` (AI tư vấn)
5. Bấm **Deploy**. Vercel sẽ tự động cấp phát tên miền `https://bepyen-storefront.vercel.app` miễn phí vĩnh viễn!

---

## 🛍️ Tính Năng Nổi Bật
- **Menu 34 Món Yến Chưng Tươi**: Cung đình, thượng hạng, bổ phổi, an thần, cho mẹ bầu và bé yêu.
- **Nút Zalo Floating & Đặt Nhanh**: Khách chọn món là tự động sinh tin nhắn Zalo kèm tên món & địa chỉ căn hộ.
- **Form Đặt Hàng Thông Minh**: Tự nhận diện căn hộ (S1, S2, Masteri, Zenpark...), tự đồng bộ về Backend máy Ubuntu tại nhà.
- **Trợ Lý AI Yến Nhung**: Tư vấn loại yến phù hợp theo thời tiết và thể trạng sức khỏe cư dân.
