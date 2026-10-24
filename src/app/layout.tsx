import type { Metadata, Viewport } from "next";
import "./globals.css";
import { OrderProvider } from "@/context/OrderContext";
import { PWAProvider } from "@/context/PWAContext";
import SplashScreen from "@/components/SplashScreen";
import AffiliateTracker from "@/components/AffiliateTracker";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#72161A",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bepyen.ocean"),
  title: "Bếp Yến Ocean – Yến Chưng Tươi Giao 20 Phút Vinhomes Ocean Park",
  description:
    "Yến chưng tươi nóng hổi giao nhanh 20 phút tại Vinhomes Ocean Park. 100% tổ yến nguyên chất chưng thủ công không chất bảo quản. Đặt qua Zalo hoặc Hotline Bếp Yến Ocean.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bếp Yến Ocean",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon-precomposed.png", sizes: "180x180", type: "image/png" },
    ],
  },
  keywords: [
    "yến chưng tươi ocean park",
    "yến sào ocean park",
    "bếp yến ocean",
    "yến chưng vinhomes ocean park",
    "đặt yến zalo ocean park",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full antialiased overflow-x-hidden max-w-[100vw]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/apple-touch-icon-precomposed.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Bếp Yến Ocean" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__deferredPrompt = null;
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.__deferredPrompt = e;
              });
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-body overflow-x-hidden max-w-[100vw] w-full">
        <SplashScreen />
        <PWAProvider>
          <OrderProvider>
            <AffiliateTracker />
            {children}
          </OrderProvider>
        </PWAProvider>
      </body>
    </html>
  );
}
