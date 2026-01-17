"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Activity, Globe, Zap, ShieldCheck, Cpu } from "lucide-react";
import { useLayout } from "@/context/layout-provider";

/**
 * 🌊 TRUST_WAVEFORM (Institutional v16.16.12)
 * Logic: Seamless horizontal telemetry loop.
 * Design: Institutional marquee with high-density status nodes.
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
    <section className="relative py-24 border-y border-white/5 bg-white/[0.01] overflow-hidden">
      {/* 🌊 AMBIENT GRADIENT SHROUD */}
      <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="space-y-16">
        {/* --- LIVE METRICS TAPE --- */}
        <div className="flex justify-center">
           <div className="flex items-center gap-12 md:gap-24 animate-in fade-in duration-1000">
             {METRICS.map((metric) => (
               <div key={metric.label} className="flex flex-col items-center gap-2 group">
                  <div className="flex items-center gap-3">
                    <metric.icon className={cn("size-3.5", isStaff ? "text-amber-500" : "text-primary")} />
                    <span className="text-xl md:text-2xl font-black italic tracking-tighter text-foreground group-hover:scale-110 transition-transform duration-500">
                      {metric.value}
                    </span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
                    {metric.label}
                  </span>
               </div>
             ))}
           </div>
        </div>

        {/* --- INFINITE INFRASTRUCTURE LOOP --- */}
        <div className="relative flex overflow-hidden">
          <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((partner, index) => (
              <div 
                key={`${partner}-${index}`}
                className="flex items-center gap-4 px-8 py-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl group hover:border-white/20 transition-colors"
              >
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 group-hover:text-foreground transition-colors italic">
                  {partner}
                </span>
                <span className="text-[8px] font-mono text-white/10">STABLE_NODE_{index}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🏛️ SUBSURFACE GRID */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.01] bg-[grid-white_40px] z-[-1]" />
    </section>
  );
}