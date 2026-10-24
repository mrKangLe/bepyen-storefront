const CACHE_NAME = "bep-yen-ocean-v5";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/apple-touch-icon.png",
  "/apple-touch-icon-precomposed.png",
  "/icon-192.png",
  "/icon-512.png",
  "/favicon.ico",
  "/images/banner-hero.jpg",
  "/images/product-vip-sau.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    event.request.url.startsWith("chrome-extension") ||
    event.request.url.includes("/api/chat") ||
    event.request.url.includes("/api/orders")
  ) {
    return;
  }

  const url = new URL(event.request.url);

  // 1. TÀI NGUYÊN TĨNH BẤT BIẾN (Next.js Chunks, Fonts, Images, Icons)
  // Chiến lược: Cache-First (Tải tức thì 0ms từ đệm máy khách)
  const isStaticChunk = url.pathname.startsWith("/_next/static/");
  const isImageOrFont =
    url.pathname.startsWith("/images/") ||
    url.hostname.includes("fonts.gstatic.com") ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico");

  if (isStaticChunk || isImageOrFont) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          // Trả về ngay lập tức từ cache máy khách
          return cached;
        }
        return fetch(event.request)
          .then((networkRes) => {
            if (networkRes.ok) {
              const resClone = networkRes.clone();
              caches.open(CACHE_NAME).then((c) => c.put(event.request, resClone));
            }
            return networkRes;
          })
          .catch(() => cached || new Response("", { status: 404 }));
      })
    );
    return;
  }

  // 2. CÁC TRANG HTML & API DANH MỤC: Network-First (Luôn lấy mới, rớt mạng hoặc mạng chậm thì đọc từ Cache)
  event.respondWith(
    fetch(event.request)
      .then((networkRes) => {
        if (networkRes.ok && url.origin === self.location.origin) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, resClone));
        }
        return networkRes;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
