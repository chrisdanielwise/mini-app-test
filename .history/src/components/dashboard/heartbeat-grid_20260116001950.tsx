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
 * 🌊 HEARTBEAT_GRID (Institutional Apex v2026.1.15)
 * Strategy: High-density clinical telemetry with morphology-aware clamping.
 * Fix: Standardized grid logic and typography to prevent "bogus" oversized distortion.
 */
export function HeartbeatGrid({ services }: { services: ServiceNode[] }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, screenSize, isMobile } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD: Prevents layout snap during hardware handshake
  if (!isReady) return <div className="min-h-[300px] w-full bg-card/10 animate-pulse rounded-[2rem] border border-white/5" />;

  /**
   * 🕵️ TACTICAL CLAMPING: Morphology-aware grid resolution
   * Fix: Capping columns to ensure high-density "Pro" feel.
   */
  const gridCols = {
    xs: "grid-cols-2",
    sm: "grid-cols-3",
    md: "grid-cols-4",
    lg: "grid-cols-5",
    xl: "grid-cols-6",
    xxl: "grid-cols-8"
  }[screenSize] || "grid-cols-4";

  return (
    <div className={cn(
      "relative group flex flex-col w-full transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
      "rounded-[2.5rem] md:rounded-[3rem] border backdrop-blur-3xl shadow-apex overflow-hidden",
      isMobile ? "p-6" : "p-8 md:p-10",
      isStaffTheme ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-card/30 border-white/5"
    )}>
      
      {/* 🌫️ VAPOUR DEPTH: Subsurface flavor-synced atmosphere */}
      <div className={cn(
        "absolute -left-32 -top-32 size-64 blur-[120px] opacity-10 pointer-events-none transition-all duration-[2000ms]",
        isStaffTheme ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- TELEMETRY HEADER: Clamped Institutional Style --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 italic opacity-30">
            <Activity className={cn("size-3 animate-pulse", isStaffTheme ? "text-amber-500" : "text-primary")} />
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] leading-none">Cluster_Telemetry</span>
              <span className="text-[7px] font-mono uppercase tracking-widest mt-1 opacity-50">Handshake_v16.31_Stable</span>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Node <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Heartbeat</span>
          </h2>
        </div>
        
        {/* Hardware Status Legend: Tactical Scale */}
        <div className="flex items-center gap-5 p-3 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
          <LegendNode color="bg-emerald-500" label="Healthy" />
          <LegendNode color="bg-amber-500" label="Latent" />
          <LegendNode color="bg-rose-500" label="Degraded" />
        </div>
      </div>

      {/* --- KINETIC TACTICAL GRID --- */}
      <div className={cn("grid gap-3 md:gap-4 relative z-10", gridCols)}>
        {services.map((node, index) => (
          <div
            key={node.id}
            onMouseEnter={() => impact("light")}
            style={{ animationDelay: `${index * 30}ms` }}
            className={cn(
              "group relative flex flex-col items-center justify-center aspect-square rounded-[1.8rem] border transition-all duration-500",
              "hover:bg-white/[0.03] hover:border-white/10",
              node.status === "HEALTHY" && "border-emerald-500/10 bg-emerald-500/[0.02]",
              node.status === "LATENT" && "border-amber-500/10 bg-amber-500/[0.02]",
              node.status === "DEGRADED" && "border-rose-500/10 bg-rose-500/[0.02]"
            )}
          >
            {/* 💓 STATUS PULSE: Clamped Scaling */}
            <div className="relative size-8 md:size-10 mb-3 flex items-center justify-center">
              <div className={cn(
                "absolute inset-0 rounded-full animate-ping opacity-10",
                node.status === "HEALTHY" && "bg-emerald-500",
                node.status === "LATENT" && "bg-amber-500",
                node.status === "DEGRADED" && "bg-rose-500"
              )} />
              <div className={cn(
                "relative size-7 md:size-8 rounded-lg md:rounded-xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-6 duration-500",
                node.status === "HEALTHY" && "bg-emerald-500/10 border-emerald-500/40 text-emerald-500 shadow-emerald-500/10",
                node.status === "LATENT" && "bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-amber-500/10",
                node.status === "DEGRADED" && "bg-rose-500/10 border-rose-500/40 text-rose-500 shadow-rose-500/10"
              )}>
                {node.status === "HEALTHY" && <ShieldCheck className="size-3.5 md:size-4" />}
                {node.status === "LATENT" && <Zap className="size-3.5 md:size-4" />}
                {node.status === "DEGRADED" && <AlertCircle className="size-3.5 md:size-4" />}
              </div>
            </div>

            <div className="space-y-1 text-center px-2 w-full">
               <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-foreground/80 truncate">
                {node.name}
              </p>
              <div className="flex items-center justify-center gap-1.5 opacity-20">
                <Cpu className="size-2 text-primary" />
                <p className="text-[7px] font-mono tracking-tighter uppercase italic leading-none">
                  {node.uptime}
                </p>
              </div>
            </div>
            
            {/* 🛰️ HOVER TELEMETRY: Injected Glass Membrane */}
            <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:-bottom-1 flex justify-center pointer-events-none">
               <span className="px-2 py-1 rounded-lg bg-black border border-white/10 text-[6px] font-black uppercase tracking-[0.2em] text-white shadow-2xl">
                 #{node.id.slice(0, 4)}
               </span>
            </div>
          </div>
        ))}
      </div>

      {/* --- FOOTER SIGNAL: Tactical Handshake --- */}
      <div className="mt-8 flex items-center justify-between opacity-10 italic border-t border-white/5 pt-6 relative z-10">
        <div className="flex items-center gap-3">
          <Terminal className="size-3" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-foreground">
            {isStaffTheme ? "Platform_MultiCluster_Oversight" : "Mesh_Node_Telemetry_Engaged"}
          </span>
        </div>
        <span className="text-[7px] font-mono tracking-widest">[v16.31_STABLE]</span>
      </div>
    </div>
  );
}

/** 🛠️ ATOMIC: LEGEND_NODE */
function LegendNode({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2 group/legend">
      <div className={cn("size-1.5 rounded-full animate-pulse shadow-sm", color)} />
      <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-40 group-hover/legend:opacity-80 transition-opacity italic">{label}</span>
    </div>
  );
}