"use client";

import * as React from "react";
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  BarChart3, 
  Globe, 
  RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 PROTOCOL_MATRIX (Institutional v16.16.14)
 * Logic: Kinetic hardware modules with subsurface hover-activation.
 * Refactor: Vertical compression & liquid scaling (v9.9.5).
 */

const FEATURES = [
  {
    icon: Zap,
    title: "Low_Latency_Execution",
    description: "Proprietary sub-200ms signal relay architecture optimized for high-velocity telegram environments.",
    tag: "SPEED_V4"
  },
  {
    icon: ShieldCheck,
    title: "Audit_Verified_Vault",
    description: "Every transaction is anchored to an immutable ledger with institutional-grade AES encryption.",
    tag: "SECURE_NODE"
  },
  {
    icon: Cpu,
    title: "Neural_Processing",
    description: "Automated merchant logic that adapts to cluster congestion and optimizes liquidity routing.",
    tag: "AI_CORE"
  },
  {
    icon: BarChart3,
    title: "Advanced_Telemetry",
    description: "Real-time analytics engine providing deep-level visibility into node performance metrics.",
    tag: "DATA_SYNC"
  },
  {
    icon: Globe,
    title: "Global_Mesh_Network",
    description: "Distributed infrastructure across 12 geo-zones ensuring 99.99% operational uptime.",
    tag: "UPTIME_MAX"
  },
  {
    icon: RefreshCcw,
    title: "Instant_Settlement",
    description: "Near-instantaneous asset liquidation protocols with zero-friction handshake logic.",
    tag: "LIQUIDITY"
  }
];

export function FeatureGrid() {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";

  return (
    <section id="infrastructure" className="relative py-[clamp(4rem,12vh,8rem)] px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- SECTION HEADER: COMPRESSED --- */}
        <div className="mb-12 md:mb-16 space-y-3">
          <div className="flex items-center gap-2.5">
             <div className={cn("h-px w-10", isStaff ? "bg-amber-500/30" : "bg-primary/30")} />
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">
               Technical_Specs_Protocol
             </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-foreground leading-none">
            Built for <span className={isStaff ? "text-amber-500" : "text-primary"}>Performance.</span>
          </h2>
        </div>

        {/* --- HARDWARE GRID: LIQUID BENTO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              onMouseEnter={() => impact("light")}
              className={cn(
                "group relative overflow-hidden p-6 md:p-8 rounded-[1.5rem] border backdrop-blur-3xl transition-all duration-500 ease-out",
                "bg-white/[0.01] border-white/5 hover:border-white/10 hover:-translate-y-1.5",
                isStaff ? "hover:shadow-[0_0_40px_rgba(245,158,11,0.03)]" : "hover:shadow-[0_0_40px_rgba(var(--primary),0.03)]"
              )}
            >
              {/* 🧪 SUBSURFACE TACTICAL GLOW */}
              <div className={cn(
                "absolute -right-12 -top-12 size-40 rounded-full blur-[70px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000",
                isStaff ? "bg-amber-500" : "bg-primary"
              )} />

              <div className="relative z-10 space-y-5">
                <div className={cn(
                  "size-12 rounded-xl flex items-center justify-center border shadow-inner transition-all duration-500 group-hover:scale-105",
                  isStaff ? "bg-amber-500/5 border-amber-500/10 text-amber-500" : "bg-primary/5 border-primary/10 text-primary"
                )}>
                  <feature.icon className="size-6" />
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black uppercase italic tracking-tighter text-foreground/90">
                      {feature.title}
                    </h3>
                    <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/20 group-hover:text-primary/40 transition-colors">
                      {feature.tag}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-muted-foreground/40 italic max-w-[90%]">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* ⚡ KINETIC PROGRESS BORDER */}
              <div className={cn(
                "absolute bottom-0 left-0 h-[1.5px] w-0 transition-all duration-500 group-hover:w-full",
                isStaff ? "bg-amber-500" : "bg-primary"
              )} />
            </div>
          ))}
        </div>
      </div>

      {/* 🏛️ BACKGROUND GRID: NORMALISED */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[grid-white_32px] md:bg-[grid-white_48px] z-[-1]" />
    </section>
  );
}