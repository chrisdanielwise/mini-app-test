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
  { label: "Throughput", value: "$420M+", icon: Zap },
  { label: "Uptime", value: "99.99%", icon: ShieldCheck },
  { label: "Latency", value: "240ms", icon: Globe },
];

/**
 * 🛰️ TRUST_WAVEFORM (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: Reduced py-8/10 footprint and stationary tape prevents layout blowout.
 */
export function TrustWaveform() {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";

  // 🛰️ DEVICE PHYSICS: Hardware Ingress
  const { 
    screenSize, 
    isMobile, 
    viewportWidth,
    isReady 
  } = useDeviceContext();

  if (!isReady) return <section className="h-24 bg-white/[0.01] animate-pulse border-y border-white/5" />;

  const metricsGap = screenSize === 'xs' ? "gap-4" : "gap-10 md:gap-16";
  const partnerGap = screenSize === 'xs' ? "gap-2" : "gap-4";

  return (
    <section className={cn(
      "relative py-8 md:py-10 border-y border-white/5 bg-zinc-950/20 overflow-hidden transition-all duration-700",
      "animate-in fade-in"
    )}>
      {/* 🌫️ TACTICAL GRADIENT MASKS */}
      <div 
        className="absolute inset-y-0 left-0 z-10 pointer-events-none bg-gradient-to-r from-background via-background/60 to-transparent" 
        style={{ width: `${Math.max(60, viewportWidth * 0.1)}px` }}
      />
      <div 
        className="absolute inset-y-0 right-0 z-10 pointer-events-none bg-gradient-to-l from-background via-background/60 to-transparent" 
        style={{ width: `${Math.max(60, viewportWidth * 0.1)}px` }}
      />

      <div className="space-y-8 md:space-y-10">
        {/* --- LIVE METRICS: Tactical Slim --- */}
        <div className="px-6 relative z-20">
           <div className={cn("flex items-center justify-center", metricsGap)}>
             {METRICS.map((metric) => (
               <div 
                 key={metric.label} 
                 onClick={() => impact("light")}
                 className="flex flex-col items-center gap-1.5 group cursor-pointer"
               >
                  <div className="flex items-center gap-2">
                    <metric.icon className={cn(
                      "transition-all",
                      screenSize === 'xs' ? "size-2.5" : "size-3.5",
                      isStaff ? "text-amber-500" : "text-primary/60 group-hover:text-primary"
                    )} />
                    <span className={cn(
                      "font-black italic tracking-tighter text-foreground tabular-nums leading-none",
                      screenSize === 'xs' ? "text-lg" : "text-xl md:text-2xl"
                    )}>
                      {metric.value}
                    </span>
                  </div>
                  <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-muted-foreground/10 italic leading-none">
                    {metric.label.replace(/_/g, " ")}
                  </span>
               </div>
             ))}
           </div>
        </div>

        {/* --- INFINITE PARTNER LOOP: High Density --- */}
        <div className="relative flex overflow-hidden py-2">
          <div className={cn("flex items-center animate-marquee whitespace-nowrap", partnerGap)}>
            {[...PARTNERS, ...PARTNERS].map((partner, index) => (
              <div 
                key={`${partner}-${index}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg border transition-all",
                  "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                )}
              >
                <div className="relative size-1.5">
                   <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-10" />
                   <div className="relative size-1.5 rounded-full bg-emerald-500/40" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">
                  {partner}
                </span>
                <span className="text-[6px] font-mono text-white/5 tracking-tighter">
                  STAMP_{index.toString().padStart(3, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🏛️ STATIONARY GRID ANCHOR */}
      <div className="absolute inset-0 pointer-events-none z-[-1] opacity-[0.01] bg-[url('/assets/grid.svg')] bg-center" />
    </section>
  );
}