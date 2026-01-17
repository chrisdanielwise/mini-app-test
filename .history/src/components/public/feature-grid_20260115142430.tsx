"use client";

import * as React from "react";
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  BarChart3, 
  Globe, 
  RefreshCcw,
  Waves,
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

/**
 * 🛰️ PROTOCOL_MATRIX (Institutional Apex v16.16.30)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, safeArea).
 * Logic: Hardware-fluid protocol modules with subsurface kinetic ingress.
 */
export function FeatureGrid() {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";

  // 🛰️ DEVICE PHYSICS: Hardware Ingress
  const { 
    screenSize, 
    isTablet, 
    isDesktop, 
    isPortrait, 
    viewportWidth, 
    isReady 
  } = useDeviceContext();

  // 🛡️ HYDRATION GUARD
  if (!isReady) return <div className="min-h-[60vh] animate-pulse bg-white/[0.02] rounded-[3rem] mx-6" />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating grid geometry based on the 6-tier system.
   */
  const gridCols = (isDesktop || (isTablet && !isPortrait)) ? "lg:grid-cols-3 md:grid-cols-2" : "grid-cols-1";
  const sectionPadding = screenSize === 'xs' ? "py-16 px-5" : "py-[clamp(4rem,12vh,10rem)] px-6 md:px-10";

  return (
    <section id="infrastructure" className={cn("relative overflow-hidden transition-all duration-1000", sectionPadding)}>
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- SECTION HEADER: MORPHOLOGY SCALING --- */}
        <div className="mb-12 md:mb-20 space-y-4">
          <div className="flex items-center gap-3 italic">
             <Activity className={cn("size-3.5", isStaff ? "text-amber-500" : "text-primary")} />
             <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
               Technical_Specs_Protocol
             </span>
          </div>
          <h2 className={cn(
            "font-black uppercase italic tracking-tighter leading-none text-foreground",
            screenSize === 'xs' ? "text-4xl" : "text-5xl md:text-7xl"
          )}>
            Built for <span className={isStaff ? "text-amber-500" : "text-primary"}>Performance.</span>
          </h2>
        </div>

        {/* --- HARDWARE GRID: KINETIC BENTO --- */}
        <div className={cn("grid gap-5 md:gap-8", gridCols)}>
          {FEATURES.map((feature, idx) => (
            <div
              key={feature.title}
              onMouseEnter={() => impact("light")}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border backdrop-blur-3xl transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                "bg-white/[0.01] border-white/5 hover:border-white/10 hover:-translate-y-2",
                isStaff ? "hover:shadow-amber-500/5" : "hover:shadow-primary/5",
                "p-8 md:p-10"
              )}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* 🧪 SUBSURFACE TACTICAL GLOW: Scales with viewportWidth */}
              <div className={cn(
                "absolute -right-16 -top-16 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000",
                isStaff ? "bg-amber-500" : "bg-primary"
              )} style={{ width: `${viewportWidth * 0.15}px`, height: `${viewportWidth * 0.15}px` }} />

              <div className="relative z-10 space-y-8">
                <div className={cn(
                  "size-14 md:size-16 rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center border shadow-inner transition-all duration-1000 group-hover:rotate-6",
                  isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/5 border-primary/20 text-primary"
                )}>
                  <feature.icon className="size-7 md:size-8" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground/90 leading-none truncate">
                      {feature.title}
                    </h3>
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/10 group-hover:text-primary transition-colors duration-700">
                      {feature.tag}
                    </span>
                  </div>
                  <p className="text-[11px] md:text-sm font-bold uppercase tracking-[0.1em] leading-relaxed text-muted-foreground/40 italic max-w-full">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* ⚡ KINETIC PROGRESS BORDER */}
              <div className={cn(
                "absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-1000 group-hover:w-full",
                isStaff ? "bg-amber-500" : "bg-primary"
              )} />
            </div>
          ))}
        </div>
      </div>

      {/* 🏛️ BACKGROUND AURA: HARDWARE-AWARE FLOW */}
      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] bg-[url('/assets/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <Waves className="absolute bottom-0 left-0 w-full h-32 opacity-[0.03] animate-pulse text-primary" />
      </div>
    </section>
  );
}