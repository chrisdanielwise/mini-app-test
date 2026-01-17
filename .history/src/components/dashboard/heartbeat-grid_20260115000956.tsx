"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Activity, ShieldCheck, Zap, AlertCircle } from "lucide-react";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface ServiceNode {
  id: string;
  name: string;
  status: "HEALTHY" | "LATENT" | "DEGRADED" | "OFFLINE";
  uptime: string;
}

/**
 * 🌊 FLUID HEARTBEAT GRID (Institutional v16.16.12)
 * Logic: Real-time visual cluster telemetry.
 * Design: high-density squircle grid with kinetic status pulses.
 */
export function HeartbeatGrid({ services }: { services: ServiceNode[] }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";

  return (
    <div className={cn(
      "relative overflow-hidden rounded-[3rem] border p-8 md:p-12 transition-all duration-1000",
      isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-card/30 border-white/5 shadow-2xl"
    )}>
      
      {/* --- TELEMETRY HEADER --- */}
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 italic opacity-40">
            <Activity className={cn("size-4 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Cluster_Health</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-foreground">
            Node <span className={isStaff ? "text-amber-500" : "text-primary"}>Heartbeat</span>
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" />
            <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Latent</span>
          </div>
        </div>
      </div>

      {/* --- KINETIC GRID --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {services.map((node) => (
          <div
            key={node.id}
            onMouseEnter={() => impact("light")}
            className={cn(
              "group relative flex flex-col items-center justify-center aspect-square rounded-[2rem] border transition-all duration-700 cursor-help",
              "hover:scale-105 hover:bg-white/[0.03]",
              node.status === "HEALTHY" && "border-primary/20 bg-primary/[0.02]",
              node.status === "LATENT" && "border-amber-500/20 bg-amber-500/[0.02]",
              node.status === "DEGRADED" && "border-rose-500/20 bg-rose-500/[0.02]"
            )}
          >
            {/* 💓 STATUS PULSE */}
            <div className="relative size-12 mb-4 flex items-center justify-center">
              <div className={cn(
                "absolute inset-0 rounded-full animate-ping opacity-20",
                node.status === "HEALTHY" && "bg-primary",
                node.status === "LATENT" && "bg-amber-500",
                node.status === "DEGRADED" && "bg-rose-500"
              )} />
              <div className={cn(
                "relative size-8 rounded-xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-12",
                node.status === "HEALTHY" && "bg-primary/10 border-primary/40 text-primary",
                node.status === "LATENT" && "bg-amber-500/10 border-amber-500/40 text-amber-500",
                node.status === "DEGRADED" && "bg-rose-500/10 border-rose-500/40 text-rose-500"
              )}>
                {node.status === "HEALTHY" && <ShieldCheck className="size-4" />}
                {node.status === "LATENT" && <Zap className="size-4" />}
                {node.status === "DEGRADED" && <AlertCircle className="size-4" />}
              </div>
            </div>

            <p className="text-[10px] font-black uppercase tracking-widest text-foreground text-center px-2 truncate w-full">
              {node.name}
            </p>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mt-1 italic">
              {node.uptime} UP
            </p>
            
            {/* 🛰️ HOVER TELEMETRY */}
            <div className="absolute inset-x-0 -bottom-2 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:bottom-4 flex justify-center">
               <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[7px] font-black uppercase tracking-widest text-white shadow-2xl">
                 Node_{node.id.slice(0, 4)} // {node.status}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}