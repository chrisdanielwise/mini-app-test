"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Activity, ShieldCheck, Zap, AlertCircle, Cpu, Terminal } from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * ✅ FIX: Defined strict interface for Node Telemetry
 */
interface ServiceNode {
  id: string;
  name: string;
  status: "HEALTHY" | "LATENT" | "DEGRADED" | "OFFLINE";
  uptime: string;
}

/**
 * 🛰️ HEARTBEAT_GRID (Hardened v16.16.56)
 * Strategy: High-Density Telemetry & Viewport Economy.
 */
export function HeartbeatGrid({ services = [] }: { services?: ServiceNode[] }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, screenSize } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD: Prevents layout collapse during sync
  if (!isReady) return (
    <div className="h-64 w-full bg-zinc-900/10 animate-pulse rounded-[2rem] border border-white/5" />
  );

  /**
   * 🕵️ TOPOLOGY MAPPING
   * ✅ FIX: Explicitly typing the lookup table to prevent indexing errors
   */
  const gridCols: Record<string, string> = {
    xs: "grid-cols-2",
    sm: "grid-cols-3",
    md: "grid-cols-4",
    lg: "grid-cols-6",
    xl: "grid-cols-8",
  };

  const activeCols = gridCols[screenSize] || "grid-cols-4";

  return (
    <div className={cn(
      "relative flex flex-col w-full transition-all duration-700 shadow-3xl",
      "rounded-[2.5rem] md:rounded-[3rem] border backdrop-blur-3xl overflow-hidden",
      isStaffTheme ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-zinc-950/60 border-white/5",
      "p-6 md:p-10"
    )}>
      
      {/* 🌫️ TACTICAL RADIANCE */}
      <div className={cn(
        "absolute -left-24 -top-24 size-64 blur-[120px] opacity-10 pointer-events-none transition-all duration-1000",
        isStaffTheme ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- TELEMETRY HEADER: Compressed HUD --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 relative z-10 leading-none">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 italic opacity-30">
            <Activity className={cn("size-3 animate-pulse", isStaffTheme ? "text-amber-500" : "text-primary")} />
            <div className="flex items-center gap-2">
              <span className="text-[7.5px] font-black uppercase tracking-[0.4em]">Cluster_Sync</span>
              <span className="text-[6.5px] font-mono uppercase opacity-40">v16.56_Stable</span>
            </div>
          </div>
          <h2 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter text-foreground">
            System <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Heartbeat</span>
          </h2>
        </div>
        
        {/* 🏧 Legend Node */}
        <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
          <LegendNode color="bg-emerald-500" label="Healthy" />
          <LegendNode color="bg-amber-500" label="Latent" />
          <LegendNode color="bg-rose-500" label="Down" />
        </div>
      </div>

      {/* --- KINETIC TACTICAL GRID: High Density --- */}
      <div className={cn("grid gap-3 relative z-10", activeCols)}>
        {services.map((node: ServiceNode, index: number) => (
          <div
            key={node.id}
            onMouseEnter={() => { if (impact) impact("light"); }}
            style={{ animationDelay: `${index * 30}ms` }}
            className={cn(
              "group relative flex flex-col items-center justify-center py-5 rounded-2xl border transition-all duration-500",
              "hover:bg-white/[0.03] hover:border-white/10 animate-in fade-in slide-in-from-bottom-2",
              node.status === "HEALTHY" && "border-emerald-500/10 bg-emerald-500/[0.01]",
              (node.status === "LATENT" || node.status === "OFFLINE") && "border-amber-500/10 bg-amber-500/[0.01]",
              node.status === "DEGRADED" && "border-rose-500/10 bg-rose-500/[0.01]"
            )}
          >
            {/* 💓 STATUS PULSE */}
            <div className="relative size-8 mb-3 flex items-center justify-center">
              <div className={cn(
                "absolute inset-0 rounded-full animate-ping opacity-5",
                node.status === "HEALTHY" ? "bg-emerald-500" : "bg-amber-500"
              )} />
              <div className={cn(
                "relative size-7 rounded-lg flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110",
                node.status === "HEALTHY" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                node.status === "LATENT" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                node.status === "DEGRADED" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
              )}>
                {node.status === "HEALTHY" && <ShieldCheck className="size-3.5" />}
                {node.status === "LATENT" && <Zap className="size-3.5" />}
                {node.status === "DEGRADED" && <AlertCircle className="size-3.5" />}
              </div>
            </div>

            <div className="space-y-1 text-center px-2 w-full">
               <p className="text-[8px] font-black uppercase tracking-widest text-foreground/70 truncate">
                {node.name}
              </p>
              <div className="flex items-center justify-center gap-1.5 opacity-20">
                <Cpu className="size-2.5 text-primary" />
                <p className="text-[6.5px] font-mono tracking-tighter uppercase leading-none tabular-nums">
                  {node.uptime}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div className="mt-8 flex items-center justify-between opacity-10 italic border-t border-white/5 pt-5 relative z-10">
        <div className="flex items-center gap-3">
          <Terminal className="size-3" />
          <span className="text-[7.5px] font-black uppercase tracking-[0.4em]">
            {isStaffTheme ? "Cluster_Oversight_Active" : "Mesh_Telemetry_Terminal"}
          </span>
        </div>
        <span className="text-[7px] font-mono tracking-widest">[SIGNAL_STABLE]</span>
      </div>
    </div>
  );
}

function LegendNode({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("size-1.5 rounded-full animate-pulse", color)} />
      <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-40 italic">{label}</span>
    </div>
  );
}