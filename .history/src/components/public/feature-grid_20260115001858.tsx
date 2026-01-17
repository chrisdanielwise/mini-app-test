"use client";

import * as React from "react";
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  BarChart3, 
  Globe, 
  Layers,
  Fingerprint,
  RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 PROTOCOL_MATRIX (Institutional v16.16.12)
 * Logic: Kinetic hardware modules with subsurface hover-activation.
 * Design: High-density glass grid with Squircle Morphology.
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
    <section id="infrastructure" className="relative py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* --- SECTION HEADER --- */}
        <div className="mb-20 space-y-4">
          <div className="flex items-center gap-3">
             <div className={cn("h-px w-12", isStaff ? "bg-amber-500/40" : "bg-primary/40")} />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/60 italic">
               Technical_Specs
             </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-foreground">
            Built for <span className={isStaff ? "text-amber-500" : "text-primary"}>Performance.</span>
          </h2>
        </div>

        {/* --- HARDWARE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              onMouseEnter={() => impact("light")}
              className={cn(
                "group relative overflow-hidden p-8 rounded-[2.5rem] border backdrop-blur-3xl transition-all duration-700",
                "bg-white/[0.02] border-white/5 hover:border-white/20 hover:-translate-y-2",
                isStaff ? "hover:shadow-amber-500/5" : "hover:shadow-primary/5"
              )}
            >
              {/* 🧪 SUBSURFACE HOVER GLOW */}
              <div className={cn(
                "absolute -right-16 -top-16 size-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000",
                isStaff ? "bg-amber-500" : "bg-primary"
              )} />

              <div className="relative z-10 space-y-6">
                <div className={cn(
                  "size-14 rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-700 group-hover:scale-110",
                  isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                )}>
                  <feature.icon className="size-7" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black uppercase italic tracking-tighter text-foreground">
                      {feature.title}
                    </h3>
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30 group-hover:text-primary/60 transition-colors">
                      {feature.tag}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed text-muted-foreground/60 italic">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* ⚡ KINETIC FOOTER BORDER */}
              <div className={cn(
                "absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-700 group-hover:w-full",
                isStaff ? "bg-amber-500" : "bg-primary"
              )} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}