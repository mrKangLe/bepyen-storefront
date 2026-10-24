"use client";

import Link from "next/link";

export default function StaticPoliciesBar() {
  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-1.5 select-none">
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
        <div className="py-1.5 px-2 rounded-xl bg-white/90 border border-amber-200/80 shadow-2xs flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold text-stone-900">
          <span>🚀</span>
          <span className="truncate">Freeship 100%</span>
        </div>
        <div className="py-1.5 px-2 rounded-xl bg-white/90 border border-amber-200/80 shadow-2xs flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold text-stone-900">
          <span>🛵</span>
          <span className="truncate">Giao Nóng 20–30P</span>
        </div>
        <Link
          href="/doi-vo"
          className="py-1.5 px-2 rounded-xl bg-emerald-50/90 border border-emerald-300/80 shadow-2xs hover:bg-emerald-100/90 transition flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-950 group"
        >
          <span>🫙</span>
          <span className="group-hover:underline truncate">10 Vỏ = 1 Hũ</span>
        </Link>
      </div>
    </div>
  );
}
