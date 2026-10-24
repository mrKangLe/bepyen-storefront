"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const STORAGE_KEY_INSTALLED = "bepyen_pwa_installed";
const STORAGE_KEY_PROMPT_DISMISSED = "bepyen_pwa_prompt_dismissed";

interface PWAContextType {
  isInstalled: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  showGuideModal: boolean;
  setShowGuideModal: (show: boolean) => void;
  showAutoPrompt: boolean;
  dismissAutoPrompt: () => void;
  triggerInstall: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType | null>(null);

export function PWAProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showAutoPrompt, setShowAutoPrompt] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Nhận diện chính xác thiết bị Android / iOS (bao gồm cả iPadOS)
    const ua = navigator.userAgent || "";
    const android = /android/i.test(ua);
    const ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsAndroid(android);
    setIsIOS(ios);

    // 2. Kiểm tra xem thiết bị đã cài đặt App hay chưa
    const checkStandalone = (): boolean => {
      // Chế độ Standalone khi chạy PWA độc lập (Android, iOS Safari, Desktop)
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes("android-app://");

      if (isStandaloneMode) return true;

      // Cờ lưu trữ từ lần cài đặt trước
      if (localStorage.getItem(STORAGE_KEY_INSTALLED) === "true") {
        return true;
      }

      return false;
    };

    const alreadyInstalled = checkStandalone();
    setIsInstalled(alreadyInstalled);

    // 3. Đăng ký Service Worker lưu đệm máy khách siêu tốc
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("PWA Service Worker active"))
        .catch((err) => console.log("SW error:", err));
    }

    if (alreadyInstalled) {
      // Đã cài đặt rồi thì đảm bảo không hiển thị bất kỳ popup nào
      setShowAutoPrompt(false);
      return;
    }

    // 4. Bắt sự kiện beforeinstallprompt từ window
    const checkPrompt = () => {
      const early = (window as unknown as { __deferredPrompt?: BeforeInstallPromptEvent }).__deferredPrompt;
      if (early) {
        setDeferredPrompt(early);
      }
    };
    checkPrompt();
    const timer = setInterval(checkPrompt, 500);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      (window as unknown as { __deferredPrompt?: BeforeInstallPromptEvent }).__deferredPrompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowAutoPrompt(false);
      setShowGuideModal(false);
      localStorage.setItem(STORAGE_KEY_INSTALLED, "true");
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    // 5. Logic kiểm tra hiển thị popup tự động đúng 1 LẦN DUY NHẤT trên điện thoại
    const dismissed = localStorage.getItem(STORAGE_KEY_PROMPT_DISMISSED) === "true";
    if (!dismissed && (android || ios)) {
      // Chờ 8 giây sau khi khách lướt xem thực đơn mới hiện lời mời nhẹ nhàng
      const autoPromptTimer = setTimeout(() => {
        // Kiểm tra lại trạng thái
        if (!checkStandalone() && localStorage.getItem(STORAGE_KEY_PROMPT_DISMISSED) !== "true") {
          setShowAutoPrompt(true);
        }
      }, 8000);

      return () => {
        clearTimeout(autoPromptTimer);
        clearInterval(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }

    return () => {
      clearInterval(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Đóng thông báo tự động và ghi nhớ không bao giờ tự mở lại
  const dismissAutoPrompt = useCallback(() => {
    setShowAutoPrompt(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_PROMPT_DISMISSED, "true");
    }
  }, []);

  // Kích hoạt cài đặt ứng dụng: Phân tách rõ ràng Android (1 chạm) vs iPhone (Bắt buộc hướng dẫn)
  const triggerInstall = useCallback(async () => {
    // Đóng auto prompt nếu đang mở
    dismissAutoPrompt();

    // 1. NẾU LÀ IPHONE / IPAD (iOS):
    // Apple không hỗ trợ API tự động cài đặt qua web -> Mở bảng hướng dẫn trực quan 3 bước Safari
    if (isIOS) {
      setShowGuideModal(true);
      return;
    }

    // 2. NẾU LÀ ANDROID:
    // Tuyệt đối không hiển thị modal hướng dẫn dài dòng! Gọi trực tiếp lệnh cài đặt 1 chạm native
    const promptEvent =
      deferredPrompt || (typeof window !== "undefined" && (window as unknown as { __deferredPrompt?: BeforeInstallPromptEvent }).__deferredPrompt);

    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice && choice.outcome === "accepted") {
          setIsInstalled(true);
          localStorage.setItem(STORAGE_KEY_INSTALLED, "true");
        }
        setDeferredPrompt(null);
        if (typeof window !== "undefined") {
          (window as unknown as { __deferredPrompt?: BeforeInstallPromptEvent }).__deferredPrompt = undefined;
        }
      } catch (err) {
        console.error("Install prompt error:", err);
      }
    } else {
      // Không mở guide modal! Chỉ thông báo nhẹ nhàng nếu đã cài hoặc đang chuẩn bị prompt
      if (typeof window !== "undefined") {
        if (isInstalled) {
          alert("Ứng dụng Bếp Yến Ocean đã được cài đặt trên màn hình chính của bạn!");
        } else {
          alert("Trình duyệt đang khởi tạo cài đặt tự động... Bác chạm lại nút một lần nữa nhé!");
        }
      }
    }
  }, [isIOS, isInstalled, deferredPrompt, dismissAutoPrompt]);

  return (
    <PWAContext.Provider
      value={{
        isInstalled,
        isAndroid,
        isIOS,
        showGuideModal,
        setShowGuideModal,
        showAutoPrompt,
        dismissAutoPrompt,
        triggerInstall,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error("usePWA must be used within a PWAProvider");
  }
  return context;
}
