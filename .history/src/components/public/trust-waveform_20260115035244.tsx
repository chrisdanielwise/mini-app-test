"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Activity, Globe, Zap, ShieldCheck } from "lucide-react";
import { useLayout } from "@/context/layout-provider";

/**
 * 🌊 TRUST_WAVEFORM (Institutional v16.16.14)
 * Logic: Seamless horizontal telemetry loop.
 * Refactor: Vertical compression & normalized metric density (v9.9.5).
 */

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

export function TrustWaveform() {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  return (
    <section className="relative py-[clamp(3rem,8vh,5rem)] border-y border-white/5 bg-white/[0.01] overflow-hidden">
      {/* 🌊 AMBIENT GRADIENT SHROUD: NORMALIZED */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="space-y-12 md:space-y-16">
        {/* --- LIVE METRICS TAPE: TACTICAL DENSITY --- */}
        <div className="flex justify-center px-6">
           <div className="flex items-center gap-8 md:gap-20 animate-in fade-in duration-1000">
             {METRICS.map((metric) => (
               <div key={metric.label} className="flex flex-col items-center gap-1.5 group">
                  <div className="flex items-center gap-2.5">
                    <metric.icon className={cn("size-3", isStaff ? "text-amber-500" : "text-primary")} />
                    <span className="text-lg md:text-xl font-black italic tracking-tighter text-foreground group-hover:scale-105 transition-transform duration-500 tabular-nums">
                      {metric.value}
                    </span>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic leading-none">
                    {metric.label}
                  </span>
               </div>
             ))}
           </div>
        </div>

        {/* --- INFINITE INFRASTRUCTURE LOOP: COMPRESSED --- */}
        <div className="relative flex overflow-hidden">
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((partner, index) => (
              <div 
                key={`${partner}-${index}`}
                className="flex items-center gap-3 px-6 py-3 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-xl group hover:border-white/10 transition-colors"
              >
                <div className="size-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 group-hover:text-foreground/80 transition-colors italic">
                  {partner}
                </span>
                <span className="text-[7px] font-mono text-white/5 tracking-tighter">NODE_{index.toString().padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🏛️ SUBSURFACE GRID: TIGHTENED */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.01] bg-[grid-white_32px] md:bg-[grid-white_48px] z-[-1]" />
    </section>
  );
}