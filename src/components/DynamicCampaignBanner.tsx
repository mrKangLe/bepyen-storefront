"use client";

import { useEffect, useState } from "react";

export interface DynamicCampaign {
  enabled: boolean;
  id: string;
  badge: string;
  title: string;
  description: string;
  highlight_marquee: string;
}

export default function DynamicCampaignBanner() {
  const [campaign, setCampaign] = useState<DynamicCampaign | null>({
    enabled: true,
    id: "freeship_ocean_park",
    badge: "CHỈ HÔM NAY",
    title: "Miễn phí 100% ship nội khu Vinhomes Ocean Park",
    description: "Freeship hỏa tốc tận cửa căn hộ",
    highlight_marquee: "🔥 CHỈ HÔM NAY: Miễn phí 100% ship nội khu Vinhomes Ocean Park",
  });

  useEffect(() => {
    let isMounted = true;
    fetch("/api/promotions")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && data.dynamic_campaign) {
          setCampaign(data.dynamic_campaign);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  if (!campaign || !campaign.enabled) {
    return null;
  }

  const badgeText = campaign.badge || "CHỈ HÔM NAY";
  const mainText = campaign.title || "Miễn phí 100% ship nội khu Vinhomes Ocean Park";

  return (
    <div
      className="w-full py-1.5 px-3 select-none text-center relative z-40 border-b border-amber-400/30 shadow-xs"
      style={{
        background: "linear-gradient(90deg, #4A080B 0%, #72161A 50%, #4A080B 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold leading-tight">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>
        <span className="text-amber-300 font-extrabold uppercase tracking-wide shrink-0">
          🔥 {badgeText}:
        </span>
        <span className="text-white drop-shadow-xs truncate">
          {mainText}
        </span>
        <span className="hidden sm:inline-block text-amber-200/80 font-normal shrink-0">
          • Giao nóng 20–30P tận cửa
        </span>
      </div>
    </div>
  );
}
