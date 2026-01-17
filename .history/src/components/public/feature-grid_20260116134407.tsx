"use client";

import * as React from "react";
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  BarChart3, 
  Globe, 
  RefreshCcw,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

const FEATURES = [
  {
    icon: Zap,
    title: "Low_Latency",
    description: "Proprietary sub-200ms signal relay architecture optimized for high-velocity TMA ingress.",
    tag: "SPEED_V4"
  },
  {
    icon: ShieldCheck,
    title: "Audit_Vault",
    description: "Transactions anchored to immutable ledgers with institutional-grade AES encryption.",
    tag: "SECURE_NODE"
  },
  {
    icon: Cpu,
    title: "Neural_AI",
    description: "Automated merchant logic that adapts to cluster congestion and optimizes routing.",
    tag: "AI_CORE"
  },
  {
    icon: BarChart3,
    title: "Telemetry",
    description: "Real-time analytics engine providing deep-level visibility into node performance.",
    tag: "DATA_SYNC"
  },
  {
    icon: Globe,
    title: "Global_Mesh",
    description: "Distributed infra across 12 geo-zones ensuring 99.99% operational uptime.",
    tag: "UPTIME_MAX"
  },
  {
    icon: RefreshCcw,
    title: "Settlement",
    description: "Instantaneous asset liquidation protocols with zero-friction handshake logic.",
    tag: "LIQUIDITY"
  }
];

/**
 * 🛰️ PROTOCOL_MATRIX (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density p-6 padding and h-11 trigger equivalents prevent blowout.
 */
export function FeatureGrid() {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";
  const { screenSize, isTablet, isDesktop, isPortrait, isReady } = useDeviceContext();

  if (!isReady) return <div className="h-64 animate-pulse bg-white/[0.02] rounded-2xl mx-6" />;

  const gridCols = (isDesktop || (isTablet && !isPortrait)) ? "lg:grid-cols-3 md:grid-cols-2" : "grid-cols-1";
  const sectionPadding = screenSize === 'xs' ? "py-10 px-5" : "py-16 md:py-20 px-6 md:px-8";

  return (
    <section id="infrastructure" className={cn("relative overflow-hidden transition-all duration-700", sectionPadding)}>
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* --- FIXED HUD: Stationary Header --- */}
        <div className="mb-10 md:mb-12 space-y-2 leading-none">
          <div className="flex items-center gap-2.5 italic opacity-30">
             <Activity className={cn("size-3", isStaff ? "text-amber-500" : "text-primary")} />
             <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">
               Technical_Specs_v16
             </span>
          </div>
          <h2 className={cn(
            "font-black uppercase italic tracking-tighter text-foreground",
            screenSize === 'xs' ? "text-3xl" : "text-4xl md:text-5xl"
          )}>
            Built for <span className={isStaff ? "text-amber-500" : "text-primary"}>Performance</span>
          </h2>
        </div>

        {/* --- HARDWARE GRID: Tactical Slim Bento --- */}
        <div className={cn("grid gap-3 md:gap-4", gridCols)}>
          {FEATURES.map((feature, idx) => (
            <div
              key={feature.title}
              onMouseEnter={() => impact("light")}
              className={cn(
                "group relative overflow-hidden rounded-xl md:rounded-2xl border backdrop-blur-3xl transition-all duration-500",
                "bg-zinc-950/40 border-white/5 hover:bg-white/[0.02]",
                "p-6 md:p-8" // Reduced p-10 -> p-8
              )}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="relative z-10 space-y-6 leading-none">
                <div className={cn(
                  "size-10 md:size-11 rounded-lg flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-6",
                  isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                )}>
                  <feature.icon className="size-5 md:size-5.5" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm md:text-base font-black uppercase italic tracking-tighter text-foreground/80 truncate">
                      {feature.title}
                    </h3>
                    <span className="text-[6.5px] font-black uppercase tracking-widest text-primary/20">
                      {feature.tag}
                    </span>
                  </div>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] leading-relaxed text-muted-foreground/30 italic">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* TACTICAL PROGRESS INDICATOR */}
              <div className={cn(
                "absolute bottom-0 left-0 h-[1.5px] w-0 transition-all duration-700 group-hover:w-full",
                isStaff ? "bg-amber-500/40" : "bg-primary/40"
              )} />
            </div>
          ))}
        </div>
      </div>

      {/* 🏛️ STATIONARY GRID ANCHOR */}
      <div className="absolute inset-0 pointer-events-none z-[-1] opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center" />
    </section>
  );
}