"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Fingerprint, 
  ShieldCheck, 
  Terminal, 
  Activity,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ DISCOVERY_HEADER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density padding and shrunken typography prevent viewport blowout.
 */
export function DiscoveryHeader({ companyName, merchantId, isStaff }: DiscoveryHeaderProps) {
  const { impact } = useHaptics();
  const { safeArea, isMobile, screenSize, isReady } = useDeviceContext();

  // 🛡️ HYDRATION SHIELD: Prevents Notch/Island layout snaps
  if (!isReady) return <div className="h-14 w-full bg-white/5 animate-pulse border-b border-white/5" />;

  const paddingTop = `calc(${safeArea.top}px + 0.5rem)`;
  
  return (
    <header 
      className={cn(
        "sticky top-0 z-[50] w-full border-b backdrop-blur-xl transition-all duration-700 h-14 md:h-16 flex items-center",
        "bg-zinc-950/60 border-white/5 shadow-2xl",
        isStaff && "bg-amber-500/[0.01] border-amber-500/10"
      )}
      style={{ paddingTop }}
    >
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between w-full relative z-10 leading-none">
        
        {/* --- 🛡️ INGRESS ANCHOR: Compressed size-9 --- */}
        <Link href="/home" onClick={() => impact("light")}>
          <div className="flex size-9 items-center justify-center rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-90">
            <ChevronLeft className="size-4.5 opacity-40" />
          </div>
        </Link>

        {/* --- 🛰️ TELEMETRY CLUSTER: Tactical Horizon --- */}
        <div className="flex flex-col items-center text-center min-w-0 flex-1 px-4">
          <div className="flex items-center gap-2 mb-1 opacity-10 italic">
            {isStaff ? (
              <Terminal className="size-2.5 text-amber-500" />
            ) : (
              <Fingerprint className="size-2.5" />
            )}
            <span className={cn(
              "text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em]",
              isStaff && "text-amber-500"
            )}>
              {isStaff ? "Universal_Oversight" : "Mesh_Discovery"}
            </span>
          </div>
          
          <div className="flex items-center gap-2 min-w-0 max-w-full">
            <h1 className={cn(
              "font-black uppercase italic tracking-tighter text-foreground truncate",
              screenSize === 'xs' ? "text-sm" : "text-base md:text-lg"
            )}>
              {companyName || "ROOT_NODE"}
            </h1>
            {!isMobile && (
              <ShieldCheck className={cn(
                "size-3.5 shrink-0",
                isStaff ? "text-amber-500" : "text-emerald-500"
              )} />
            )}
          </div>

          <div className="flex items-center gap-2 mt-1.5 opacity-20">
            <Activity className="size-2.5 text-emerald-500 animate-pulse" />
            <p className="text-[6.5px] font-mono uppercase tracking-[0.2em] truncate">
              ID_{merchantId?.slice(0, 8) || "NULL"}
            </p>
          </div>
        </div>

        {/* --- HARDWARE STATUS --- */}
        <div className="hidden sm:flex size-9 items-center justify-center rounded-lg bg-white/5 border border-white/5">
          <Cpu className={cn("size-4 opacity-10", isStaff && "text-amber-500 opacity-40")} />
        </div>
        
        <div className="sm:hidden size-9" />
      </div>

      {/* 🌊 RADIANCE BLOOM: Active Signal Horizon */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 h-[1.5px] w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-10",
        isStaff ? "text-amber-500" : "text-primary"
      )} />
    </header>
  );
}