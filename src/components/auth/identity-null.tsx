"use client";

import * as React from "react";
import { Lock, RefreshCcw, ShieldAlert, Globe, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ IDENTITY_NULL_TERMINAL (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Stationary Horizon HUD.
 * Fix: Standardized h-11 button and shrunken aperture prevents viewport blowout.
 */
export function IdentityNull() {
  const { impact } = useHaptics();
  const { safeArea, screenSize, isMobile } = useDeviceContext();

  const handleResync = () => {
    impact("heavy");
    window.location.reload();
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[var(--vh,100dvh)] w-full bg-black px-6 text-center overflow-hidden"
      style={{ 
        paddingTop: `calc(${safeArea.top}px + 1rem)`, 
        paddingBottom: `calc(${safeArea.bottom}px + 1.5rem)` 
      }}
    >
      {/* 🌫️ TACTICAL RADIANCE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[30%] bg-rose-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative space-y-8 max-w-sm animate-in fade-in zoom-in-95 duration-700">
        
        {/* 🔒 COMPRESSED LOCK APERTURE */}
        <div className="relative mx-auto group">
          <div className="absolute inset-0 bg-rose-500/10 blur-2xl rounded-full" />
          <div className="relative size-16 md:size-20 rounded-xl md:rounded-2xl bg-zinc-950 border border-rose-500/20 flex items-center justify-center shadow-2xl">
            <Lock className="size-8 md:size-10 text-rose-500 animate-pulse" />
          </div>
          
          <div className="absolute -top-1 -right-1 size-7 rounded-lg bg-black border border-rose-500/30 flex items-center justify-center shadow-xl">
             <ShieldAlert className="size-3.5 text-rose-500" />
          </div>
        </div>

        {/* --- TELEMETRY TEXT --- */}
        <div className="space-y-3 leading-none">
          <div className="flex items-center justify-center gap-2.5 opacity-30 italic">
            <Activity className="size-3 text-rose-500" />
            <span className="text-[7.5px] font-black uppercase tracking-[0.3em] text-rose-500">
              Identity_Mismatch_Isolated
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-foreground">
            Access <span className="text-rose-500/60">Restricted</span>
          </h1>
          <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.15em] leading-relaxed italic max-w-[260px] mx-auto pt-2">
            Signature invalid or de-provisioned. Re-launch terminal via official bot to establish a new handshake.
          </p>
        </div>

        {/* --- ACTION NODE: Tactical Slim h-11 --- */}
        <Button 
          onClick={handleResync}
          className="w-full h-11 md:h-11 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black uppercase italic tracking-[0.2em] text-[9px] shadow-lg transition-all active:scale-95 group"
        >
          <div className="flex items-center gap-3 relative z-10">
            <RefreshCcw className="size-3.5 group-active:animate-spin" />
            <span>Initiate_Identity_Resync</span>
          </div>
        </Button>

        {/* --- SYSTEM FOOTER --- */}
        <div className="pt-6 flex flex-col items-center gap-3 opacity-10 italic">
           <Globe className="size-4" />
           <p className="text-[6.5px] font-black uppercase tracking-[0.4em]">
             Institutional_Guard_v16.31 // NODE_{screenSize.toUpperCase()}
           </p>
        </div>
      </div>
    </div>
  );
}