"use client";

import * as React from "react";
import { Lock, RefreshCcw, ShieldAlert, Waves, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ IDENTITY_NULL_TERMINAL (Apex v16.16.29)
 * Priority: Full DeviceState Integration (xs -> xxl, safeArea).
 * Logic: Hardened fallback for unverified or de-provisioned nodes.
 */
export function IdentityNull() {
  const { impact } = useHaptics();
  const { safeArea, screenSize, isPortrait } = useDeviceContext();

  const handleResync = () => {
    impact("heavy");
    window.location.reload();
  };

  // Adjust padding based on hardware safe areas
  const paddingTop = `calc(${safeArea.top}px + 4rem)`;
  const paddingBottom = `calc(${safeArea.bottom}px + 2rem)`;

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[var(--vh,100dvh)] w-full bg-background px-8 text-center"
      style={{ paddingTop, paddingBottom }}
    >
      {/* 🌊 RADIANCE BLOOM: Subsurface Rose Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="relative space-y-10 max-w-sm animate-in fade-in zoom-in-95 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
        
        {/* 🔒 KINETIC LOCK APERTURE */}
        <div className="relative mx-auto group">
          <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative size-24 md:size-32 rounded-[2.5rem] md:rounded-[3.5rem] bg-card border border-rose-500/20 flex items-center justify-center shadow-apex backdrop-blur-3xl">
            <Lock className="size-10 md:size-14 text-rose-500 animate-pulse" />
          </div>
          
          {/* Signal Interruption Badges */}
          <div className="absolute -top-2 -right-2 size-10 rounded-2xl bg-black border border-rose-500/30 flex items-center justify-center shadow-2xl">
             <ShieldAlert className="size-5 text-rose-500" />
          </div>
        </div>

        {/* --- TELEMETRY TEXT --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 opacity-30 italic">
            <ShieldAlert className="size-3.5 text-rose-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">
              Identity_Mismatch_Detected
            </span>
          </div>
          <h1 className="text-[var(--fluid-h1)] font-black uppercase italic tracking-tighter leading-none text-foreground">
            Access <span className="text-rose-500/60">Restricted</span>
          </h1>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-relaxed opacity-40 italic max-w-[280px] mx-auto">
            Your identity signature is invalid or the node session has been de-provisioned. Re-launch the terminal via the official bot to establish a new handshake.
          </p>
        </div>

        {/* --- ACTION NODE --- */}
        <Button 
          onClick={handleResync}
          className="w-full h-16 md:h-20 rounded-2xl md:rounded-[2rem] bg-rose-500 hover:bg-rose-600 text-white font-black uppercase italic tracking-[0.2em] text-[11px] shadow-apex transition-all duration-700 active:scale-95 group"
        >
          <div className="flex items-center gap-4">
            <RefreshCcw className="size-5 group-active:animate-spin" />
            <span>Initiate_Identity_Resync</span>
          </div>
        </Button>

        {/* --- SYSTEM FOOTNOTE --- */}
        <div className="pt-8 flex flex-col items-center gap-4 opacity-20 italic">
           <Globe className="size-5" />
           <p className="text-[8px] font-black uppercase tracking-[0.5em] text-center">
             Institutional_Guard_v16.29 // Signal_State: {screenSize.toUpperCase()}_OFFLINE
           </p>
           <Waves className="size-6 animate-pulse" />
        </div>
      </div>
    </div>
  );
}