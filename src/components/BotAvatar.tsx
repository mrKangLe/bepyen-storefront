import React from "react";
import Image from "next/image";

interface BotAvatarProps {
  size?: number; // size in px, default 40
  className?: string;
  showOnlineDot?: boolean;
}

export function BotAvatar({ size = 40, className = "", showOnlineDot = false }: BotAvatarProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full flex-shrink-0 select-none ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className="w-full h-full rounded-full overflow-hidden shadow-md border-[1.5px] relative"
        style={{
          borderColor: "var(--gold)",
          background: "radial-gradient(circle, #7F1D1D 0%, #450A0A 100%)",
        }}
      >
        <Image
          src="/images/bot-avatar.svg"
          alt="Bếp Trưởng Nhung — Bếp Yến Hoàng Gia"
          width={size}
          height={size}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {showOnlineDot && (
        <span
          className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 z-10"
          title="Bếp Trưởng đang online sẵn sàng phục vụ"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white shadow-xs" />
        </span>
      )}
    </div>
  );
}
