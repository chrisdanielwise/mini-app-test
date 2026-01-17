"use client";

import * as React from "react";
import { StatsCard } from "./stats-card";
import { SubscribersChart } from "./subscribers-chart";
import {
  Loader2,
  Users,
  Zap,
  Activity,
  Globe,
  Lock,
  Terminal,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ PROPS_INTERFACE: Identity Handshake Fix
 */
interface AsyncSubscribersProps {
  merchantId: string | null; // ✅ FIXED: Explicitly allow merchantId ingress
  growth: any;
  stats: any;
  type?: "stats" | "chart";
  isGlobalOversight?: boolean;
}

/**
 * 🌊 ASYNC_SUBSCRIBERS_NODE (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Growth Ingress | Obsidian-OLED Depth.
 * Logic: morphology-aware safe-area clamping with Hardware-Pulse sync.
 */
export default function AsyncSubscribersCard({
  merchantId, // ✅ FIXED: Destructured for local scope usage
  growth,
  stats,
  type = "stats",
  isGlobalOversight = false,
}: AsyncSubscribersProps) {
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware-state consumption
  const { isReady, screenSize, isMobile, isPortrait, safeArea } = useDeviceContext();

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <div className="min-h-[250px] w-full bg-card/20 animate-pulse rounded-[3rem]" />;

  // 🛡️ SECURITY GATE: Identity Node Required
  if (!stats && !growth) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[3.5rem] border border-dashed border-white/5 bg-card/10 p-12 text-center backdrop-blur-3xl animate-in fade-in duration-1000">
        <div className="mb-8 size-16 rounded-[2rem] bg-white/[0.03] flex items-center justify-center border border-white/10 shadow-apex transition-transform hover:rotate-12">
          <Lock className="size-8 text-muted-foreground/10 animate-pulse" />
        </div>
        <div className="space-y-2">
          <p className="text-[12px] font-black uppercase tracking-[0.5em] text-foreground/40 italic leading-none">
            {merchantId ? `Node_${merchantId.slice(0, 8)}_Isolated` : "Identity_Node_Required"}
          </p>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/10 leading-none">
            Protocol_Handshake_v16.31
          </p>
        </div>
      </div>
    );
  }

  /**
   * 📈 GROWTH MEMBRANE: Adaptive Expansion Vector
   */
  if (type === "chart") {
    if (!growth) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[3rem] border border-white/5 bg-card/20 backdrop-blur-3xl">
          <div className="relative">
            <Loader2 className="size-10 animate-spin text-primary opacity-40" />
            <Activity className="absolute inset-0 size-10 animate-pulse opacity-10" />
          </div>
          <p className="mt-8 text-[11px] font-black uppercase tracking-[0.4em] opacity-30 italic">
            Syncing_Growth_Mesh...
          </p>
        </div>
      );
    }

    const dailyData = growth?.dailyData || [];
    const chartHeight = screenSize === 'xs' ? 280 : 380;

    return (
      <div 
        onPointerEnter={() => impact("light")}
        className={cn(
          "relative group overflow-hidden border backdrop-blur-3xl shadow-apex transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          "rounded-[3.5rem] md:rounded-[4.5rem]",
          screenSize === 'xs' ? "p-8" : "p-14",
          isGlobalOversight 
            ? "bg-amber-500/[0.04] border-amber-500/20 shadow-apex-amber" 
            : "bg-card/30 border-white/5",
          "animate-in fade-in slide-in-from-bottom-10"
        )}
      >
        <div className={cn(
          "absolute -top-32 -left-32 size-96 blur-[140px] opacity-10 transition-colors duration-[2000ms] pointer-events-none",
          isGlobalOversight ? "bg-amber-500" : "bg-primary"
        )} />

        <Activity className="absolute -bottom-24 -right-24 size-96 opacity-[0.015] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover:scale-110" />

        <div className="flex flex-row items-center justify-between mb-16 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4 italic opacity-40">
              {isGlobalOversight 
                ? <Globe className="size-4 text-amber-500 animate-pulse" /> 
                : <Users className="size-4 text-primary" />
              }
              <div className="flex flex-col">
                <h3 className={cn(
                  "text-[10px] font-black uppercase tracking-[0.5em] leading-none",
                  isGlobalOversight ? "text-amber-500" : "text-primary"
                )}>
                  {isGlobalOversight ? "Platform_Global_Sync" : "Network_Expansion"}
                </h3>
                <span className="text-[7px] font-black uppercase tracking-widest mt-1">Institutional_Oversight_v16.31</span>
              </div>
            </div>
            <p className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-foreground">
              {isGlobalOversight ? "Global" : "User"} <span className={isGlobalOversight ? "text-amber-500" : "text-primary"}>Growth</span>
            </p>
          </div>
          <div className={cn(
            "size-16 md:size-20 rounded-[1.8rem] md:rounded-[2.2rem] border flex items-center justify-center shrink-0 shadow-inner transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110",
            isGlobalOversight 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
              : "bg-primary/10 border-primary/20 text-primary"
          )}>
            <Zap className="size-8 md:size-10" />
          </div>
        </div>

        <div 
          className="w-full relative z-10 animate-in fade-in duration-1000 delay-300" 
          style={{ height: `${chartHeight}px` }}
        >
          <SubscribersChart data={dailyData} theme={isGlobalOversight ? "amber" : "emerald"} />
        </div>

        {!isMobile && (
          <div className="mt-10 flex items-center justify-between opacity-10 italic border-t border-white/5 pt-8">
            <div className="flex items-center gap-4">
               <Cpu className="size-4" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">Mesh_Nodes_Online</span>
            </div>
            <div className="flex items-center gap-3">
               <ShieldCheck className="size-3 text-primary" />
               <span className="text-[8px] font-mono tabular-nums">[AUTH_SYNC_STABLE]</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-6 md:gap-10 w-full animate-in slide-in-from-bottom-8 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
      isMobile && isPortrait ? "grid-cols-1" : "grid-cols-2"
    )}>
      <StatsCard
        title={isGlobalOversight ? "Total Platform Users" : "Active Subscribers"}
        value={activeCount.toLocaleString()}
        change={0.0}
        iconType="users"
        iconColor={isGlobalOversight ? "text-amber-500" : "text-blue-500"}
      />
      <StatsCard
        title={isGlobalOversight ? "System-Wide Tickets" : "Open Tickets"}
        value={ticketCount.toString()}
        iconType="tickets"
        iconColor={isGlobalOversight ? "text-amber-600" : "text-orange-500"}
        changeLabel={isGlobalOversight ? "Oversight Required" : "Attention Required"}
        className={cn(
          ticketCount > 0 && "border-rose-500/20 shadow-apex-rose"
        )}
      />
    </div>
  );
}