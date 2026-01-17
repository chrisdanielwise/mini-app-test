"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Activity, ShieldCheck, Zap, AlertCircle, Cpu, Terminal } from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface ServiceNode {
  id: string;
  name: string;
  status: "HEALTHY" | "LATENT" | "DEGRADED" | "OFFLINE";
  uptime: string;
}

/**
 * 🌊 HEARTBEAT_GRID (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Pulse | Vapour-Glass depth.
 * Logic: morphology-aware grid resolution with kinetic telemetry ingress.
 */
export function HeartbeatGrid({ services }: { services: ServiceNode[] }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, screenSize, isMobile } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return <div className="min-h-[400px] w-full bg-card/20 animate-pulse rounded-[3rem]" />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating grid columns and padding based on hardware tier.
   */
  const gridCols = {
    xs: "grid-cols-2",
    sm: "grid-cols-3",
    md: "grid-cols-4",
    lg: "grid-cols-5",
    xl: "grid-cols-6",
    xxl: "grid-cols-8"
  }[screenSize];

  return (
    <div className={cn(
      "relative group flex flex-col w-full transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
      "rounded-[3rem] md:rounded-[4rem] border backdrop-blur-3xl shadow-apex",
      isMobile ? "p-6" : "p-10 md:p-14",
      isStaff ? "bg-amber-500/[0.04] border-amber-500/20" : "bg-card/30 border-white/5"
    )}>
      
      {/* 🌫️ VAPOUR RADIANCE: Subsurface flavor-synced glow */}
      <div className={cn(
        "absolute -left-32 -top-32 size-80 blur-[140px] opacity-10 pointer-events-none transition-colors duration-[2000ms]",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- TELEMETRY HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-4 italic opacity-40">
            <Activity className={cn("size-4 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] leading-none">Cluster_Telemetry</span>
              <span className="text-[7px] font-black uppercase tracking-widest mt-1">Live_Mesh_Analysis_v16.31</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Node <span className={isStaff ? "text-amber-500" : "text-primary"}>Heartbeat</span>
          </h2>
        </div>
        
        {/* Hardware Status Legend */}
        <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
          <LegendNode color="bg-primary" label="Healthy" />
          <LegendNode color="bg-amber-500" label="Latent" />
          <LegendNode color="bg-rose-500" label="Degraded" />
        </div>
      </div>

      {/* --- KINETIC GRID --- */}
      <div className={cn("grid gap-4 md:gap-6 relative z-10", gridCols)}>
        {services.map((node, index) => (
          <div
            key={node.id}
            onMouseEnter={() => impact("light")}
            style={{ animationDelay: `${index * 40}ms` }}
            className={cn(
              "group relative flex flex-col items-center justify-center aspect-square rounded-[2.2rem] border transition-all duration-700 cursor-none",
              "hover:bg-white/[0.04] hover:border-white/10",
              node.status === "HEALTHY" && "border-primary/10 bg-primary/[0.02]",
              node.status === "LATENT" && "border-amber-500/10 bg-amber-500/[0.02]",
              node.status === "DEGRADED" && "border-rose-500/10 bg-rose-500/[0.02]"
            )}
          >
            {/* 💓 STATUS PULSE: Water-Ease Expansion */}
            <div className="relative size-10 md:size-14 mb-4 flex items-center justify-center">
              <div className={cn(
                "absolute inset-0 rounded-full animate-ping opacity-10",
                node.status === "HEALTHY" && "bg-primary",
                node.status === "LATENT" && "bg-amber-500",
                node.status === "DEGRADED" && "bg-rose-500"
              )} />
              <div className={cn(
                "relative size-8 md:size-10 rounded-xl md:rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-12 duration-700",
                node.status === "HEALTHY" && "bg-primary/10 border-primary/40 text-primary shadow-primary/10",
                node.status === "LATENT" && "bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-amber-500/10",
                node.status === "DEGRADED" && "bg-rose-500/10 border-rose-500/40 text-rose-500 shadow-rose-500/10"
              )}>
                {node.status === "HEALTHY" && <ShieldCheck className="size-4 md:size-5" />}
                {node.status === "LATENT" && <Zap className="size-4 md:size-5" />}
                {node.status === "DEGRADED" && <AlertCircle className="size-4 md:size-5" />}
              </div>
            </div>

            <div className="space-y-1 text-center px-4 w-full">
               <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-foreground truncate">
                {node.name}
              </p>
              <div className="flex items-center justify-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <Cpu className="size-2" />
                <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest italic leading-none">
                  {node.uptime} UP
                </p>
              </div>
            </div>
            
            {/* 🛰️ HOVER TELEMETRY: Injected Glass Membrane */}
            <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:-bottom-2 flex justify-center pointer-events-none">
               <span className="px-3 py-1.5 rounded-xl bg-background border border-white/10 text-[7px] font-black uppercase tracking-[0.3em] text-white shadow-apex scale-90 group-hover:scale-100 transition-transform">
                 ID:{node.id.slice(0, 6)}
               </span>
            </div>
          </div>
        ))}
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div className="mt-10 flex items-center justify-between opacity-20 italic relative z-10">
        <div className="flex items-center gap-3">
          <Terminal className="size-3.5" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground">
            {isStaff ? "Platform_MultiCluster_Oversight" : "Mesh_Node_Telemetry_Engaged"}
          </span>
        </div>
        <span className="text-[8px] font-mono">[v16.16.31_STABLE]</span>
      </div>
    </div>
  );
}

/** 🛠️ ATOMIC: LEGEND_NODE */
function LegendNode({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-3 group/legend cursor-help">
      <div className={cn("size-2 rounded-full animate-pulse shadow-lg", color)} />
      <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 group-hover/legend:opacity-100 transition-opacity italic">{label}</span>
    </div>
  );
}