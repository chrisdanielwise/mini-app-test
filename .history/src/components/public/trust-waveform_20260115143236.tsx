"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Activity, Globe, Zap, ShieldCheck, Waves } from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

const PARTNERS = [
  "BINANCE_CLOUD", "TELEGRAM_PRO", "TON_NETWORK", "AWS_INSTITUTIONAL", 
  "SECURE_PAY", "NODE_OVERSIGHT", "QUANT_RELAY", "ALPHA_VENTURES"
];

const METRICS = [
  { label: "Active_Nodes", value: "1,240+", icon: Activity },
  { label: "Total_Throughput", value: "$420M+", icon: Zap },
  { label: "Uptime_Index", value: "99.99%", icon: ShieldCheck },
  { label: "Global_Latency", value: "240ms", icon: Globe },
];

/**
 * 🛰️ TRUST_WAVEFORM (Institutional Apex v16.16.30)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, safeArea).
 * Logic: morphology-aware telemetry loop with hardware-fluid radiance.
 */
export function TrustWaveform() {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";

  // 🛰️ DEVICE PHYSICS: Hardware Ingress
  const { 
    screenSize, 
    isMobile, 
    isTablet, 
    isDesktop, 
    isPortrait, 
    viewportWidth,
    isReady 
  } = useDeviceContext();

  // 🛡️ HYDRATION GUARD
  if (!isReady) return (
    <section className="h-32 bg-white/[0.01] animate-pulse border-y border-white/5" />
  );

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating tactical density based on the 6-tier hardware spectrum.
   */
  const metricsGap = screenSize === 'xs' ? "gap-6" : "gap-12 md:gap-24";
  const partnerGap = screenSize === 'xs' ? "gap-4" : "gap-8";
  const metricsScale = screenSize === 'xs' ? "flex-wrap justify-center" : "justify-center";

  return (
    <section className={cn(
      "relative py-[clamp(4rem,8vh,6rem)] border-y border-white/5 bg-white/[0.01] overflow-hidden transition-all duration-1000",
      "animate-in fade-in slide-in-from-bottom-8"
    )}>
      {/* 🌊 AMBIENT GRADIENT SHROUD: Hardware-Fluid Masking */}
      <div 
        className="absolute inset-y-0 left-0 z-10 pointer-events-none bg-gradient-to-r from-background via-background/80 to-transparent" 
        style={{ width: `${Math.max(80, viewportWidth * 0.15)}px` }}
      />
      <div 
        className="absolute inset-y-0 right-0 z-10 pointer-events-none bg-gradient-to-l from-background via-background/80 to-transparent" 
        style={{ width: `${Math.max(80, viewportWidth * 0.15)}px` }}
      />

      <div className="space-y-12 md:space-y-20">
        {/* --- LIVE METRICS TAPE: Morphology-Aware Density --- */}
        <div className="px-6 relative z-20">
           <div className={cn("flex items-center", metricsScale, metricsGap)}>
             {METRICS.map((metric) => (
               <div 
                 key={metric.label} 
                 onClick={() => impact("light")}
                 className="flex flex-col items-center gap-2 group cursor-pointer"
               >
                  <div className="flex items-center gap-3">
                    <metric.icon className={cn(
                      "transition-all duration-700",
                      screenSize === 'xs' ? "size-3" : "size-4",
                      isStaff ? "text-amber-500 group-hover:text-amber-400" : "text-primary group-hover:text-emerald-400"
                    )} />
                    <span className={cn(
                      "font-black italic tracking-tighter text-foreground group-hover:scale-110 transition-transform duration-700 tabular-nums leading-none",
                      screenSize === 'xs' ? "text-xl" : "text-2xl md:text-4xl"
                    )}>
                      {metric.value}
                    </span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic leading-none group-hover:opacity-100 transition-opacity">
                    {metric.label.replace(/_/g, " ")}
                  </span>
               </div>
             ))}
           </div>
        </div>

        {/* --- INFINITE INFRASTRUCTURE LOOP: Kinetic Flow --- */}
        <div className="relative flex overflow-hidden py-4">
          <div className={cn("flex items-center animate-marquee whitespace-nowrap", partnerGap)}>
            {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, index) => (
              <div 
                key={`${partner}-${index}`}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all duration-700 backdrop-blur-3xl group",
                  "bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.03]"
                )}
              >
                <div className="relative size-2">
                   <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
                   <div className="relative size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 group-hover:text-foreground transition-colors italic">
                  {partner}
                </span>
                <span className="text-[7px] font-mono text-white/5 tracking-tighter group-hover:opacity-20 transition-opacity">
                  NODE_STAMP_{index.toString().padStart(3, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🏛️ BACKGROUND PHYSICS: Hardware-Aware Flow */}
      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.01] bg-[url('/assets/grid.svg')] bg-center transition-opacity duration-1000" />
        <Waves className="absolute bottom-0 left-0 w-full h-12 opacity-[0.03] animate-pulse text-primary" />
      </div>
    </section>
  );
}