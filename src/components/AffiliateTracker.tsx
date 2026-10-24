"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { saveAffiliateCode, getStoredAffiliateCode } from "@/lib/affiliate";

function TrackerContent() {
  const searchParams = useSearchParams();
  const [activeCode, setActiveCode] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const refParam = searchParams.get("ref") || searchParams.get("aff");
    if (refParam) {
      const clean = refParam.trim();
      saveAffiliateCode(clean);
      setActiveCode(clean);
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    } else {
      const stored = getStoredAffiliateCode();
      if (stored) {
        setActiveCode(stored);
      }
    }
  }, [searchParams]);

  if (!showToast || !activeCode) return null;

  return (
    <aside
      aria-label="Thông báo ưu đãi người giới thiệu"
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-xl border flex items-center gap-2 text-xs font-bold animate-bounce"
      style={{
        background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
        color: "var(--red-deep)",
        borderColor: "var(--gold-dark)",
      }}
    >
      <span>🤝</span>
      <span>
        Ưu đãi đặc quyền được giới thiệu bởi: <span className="underline font-black">{activeCode}</span>
      </span>
      <button
        type="button"
        onClick={() => setShowToast(false)}
        className="ml-1 w-4 h-4 rounded-full bg-red-950/20 text-red-950 flex items-center justify-center text-[10px]"
        aria-label="Đóng thông báo"
      >
        ✕
      </button>
    </aside>
  );
}

export default function AffiliateTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerContent />
    </Suspense>
  );
}
