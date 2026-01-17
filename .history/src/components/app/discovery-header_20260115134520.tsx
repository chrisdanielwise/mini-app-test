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

interface DiscoveryHeaderProps {
  companyName?: string;
  merchantId?: string;
  isStaff?: boolean;
}

/**
 * 🌊 DISCOVERY_HEADER (Institutional Apex v16.16.30)
 * Priority: Full DeviceState Integration (xs -> xxl, safeArea).
 * Logic: Sticky orientation node with hardware-fluid padding.
 */
export function DiscoveryHeader({ companyName, merchantId, isStaff }: DiscoveryHeaderProps) {
  const { impact } = useHaptics();
  const { safeArea, isMobile, screenSize } = useDeviceContext();

  // 🕵️ MORPHOLOGY RESOLUTION
  // Adjusts vertical breathing room based on the hardware's safe area (Notch/Dynamic Island)
  const paddingTop = `calc(${safeArea.top}px + 1rem)`;
  
  return (
    <header 
      className={cn(
        "sticky top-0 z-[50] w-full border-b backdrop-blur-3xl transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "rounded-b-[2.5rem] md:rounded-b-[3.5rem] shadow-apex",
        isStaff ? "bg-amber-500/[0.04] border-amber-500/20" : "bg-card/60 border-white/5"
      )}
      style={{ paddingTop, paddingBottom: "1.5rem" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        
        {/* --- INGRESS ANCHOR --- */}
        <Link href="/home" onClick={() => impact("light")}>
          <div className="flex size-11 md:size-13 items-center justify-center rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-90">
            <ChevronLeft className="size-6 opacity-40" />
          </div>
        </Link>

        {/* --- TELEMETRY CLUSTER --- */}
        <div className="flex flex-col items-center text-center min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5 opacity-30 italic">
            {isStaff ? (
              <Terminal className="size-3 text-amber-500" />
            ) : (
              <Fingerprint className="size-3 text-primary" />
            )}
            <span className={cn(
              "text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] leading-none",
              isStaff && "text-amber-500"
            )}>
              {isStaff ? "Universal_Oversight" : "Mesh_Discovery_Link"}
            </span>
          </div>
          
          <div className="flex items-center gap-3 min-w-0 max-w-full">
            <h1 className={cn(
              "font-black uppercase italic tracking-tighter leading-none truncate",
              screenSize === 'xs' ? "text-lg" : "text-xl md:text-3xl"
            )}>
              {companyName || "ROOT_NODE"}
            </h1>
            {!isMobile && (
              <ShieldCheck className={cn(
                "size-5 shrink-0",
                isStaff ? "text-amber-500" : "text-emerald-500"
              )} />
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Activity className="size-3 text-emerald-500 animate-pulse" />
            <p className="text-[8px] font-mono font-bold text-muted-foreground/30 uppercase tracking-[0.2em] leading-none truncate">
              ID_{merchantId?.slice(0, 12) || "NULL_VECTOR"}
            </p>
          </div>
        </div>

        {/* --- HARDWARE STATUS --- */}
        <div className="hidden sm:flex size-11 md:size-13 items-center justify-center rounded-2xl bg-white/5 border border-white/5">
          <Cpu className={cn("size-6 opacity-20", isStaff && "text-amber-500 opacity-60")} />
        </div>
        
        {/* Mobile Spacer to keep title centered */}
        <div className="sm:hidden size-11" />
      </div>

      {/* 🌊 RADIANCE BLOOM: Active Signal Horizon */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-20",
        isStaff ? "text-amber-500" : "text-primary"
      )} />
    </header>
  );
}