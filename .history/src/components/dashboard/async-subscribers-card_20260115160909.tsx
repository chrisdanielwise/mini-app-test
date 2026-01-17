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
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface AsyncSubscribersProps {
  growth: any;
  stats: any;
  type?: "stats" | "chart";
  isGlobalOversight?: boolean;
}

/**
 * 🌊 FLUID_SUBSCRIBERS_NODE (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Growth Ingress | Vapour-Glass Depth.
 * Logic: Morphology-aware grid resolution with Oversight Radiance.
 */
export default function AsyncSubscribersCard({
  growth,
  stats,
  type = "stats",
  isGlobalOversight = false,
}: AsyncSubscribersProps) {
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware-state consumption
  const { isReady, screenSize, isMobile, isPortrait } = useDeviceContext();

  // 🛡️ SECURITY GATE: Identity Node Required
  if (!isReady) return <div className="min-h-[250px] w-full bg-card/20 animate-pulse rounded-[3rem]" />;

  if (!stats && !growth) {
    return (
      <div className="flex min-h-[250px] flex-col items-center justify-center rounded-[3rem] border border-white/5 bg-card/20 p-12 text-center backdrop-blur-3xl transition-all duration-1000">
        <div className="mb-6 size-16 rounded-[1.8rem] bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
          <Lock className="size-6 text-muted-foreground/10 animate-pulse" />
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/40 italic">
            Identity_Node_Required
          </p>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">
            Handshake_Protocol_v16.31
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
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[3rem] border border-white/5 bg-card/20 backdrop-blur-3xl">
          <Loader2 className="size-8 animate-spin text-primary opacity-40" />
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic">
            Syncing_Growth_Data...
          </p>
        </div>
      );
    }

    const dailyData = growth?.dailyData || [];
    const chartHeight = screenSize === 'xs' ? 260 : 320;

    return (
      <div 
        onPointerEnter={() => impact("light")}
        className={cn(
          "relative group overflow-hidden border backdrop-blur-3xl shadow-apex transition-all duration-1000",
          "rounded-[3rem] md:rounded-[4rem]",
          screenSize === 'xs' ? "p-6" : "p-10 md:p-14",
          isGlobalOversight 
            ? "bg-amber-500/[0.04] border-amber-500/20 shadow-amber-500/5" 
            : "bg-card/30 border-white/5"
        )}
      >
        {/* 🌫️ VAPOUR RADIANCE: Global Sync Aura */}
        <div className={cn(
          "absolute -top-32 -left-32 size-80 blur-[140px] opacity-10 transition-colors duration-[2000ms] pointer-events-none",
          isGlobalOversight ? "bg-amber-500" : "bg-primary"
        )} />

        <Activity className="absolute -bottom-20 -right-20 size-80 opacity-[0.01] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover:rotate-0" />

        <div className="flex flex-row items-center justify-between mb-12 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4 italic">
              {isGlobalOversight 
                ? <Globe className="size-4 text-amber-500 animate-pulse" /> 
                : <Users className="size-4 text-primary" />
              }
              <div className="flex flex-col">
                <h3 className={cn(
                  "text-[10px] font-black uppercase tracking-[0.4em] leading-none",
                  isGlobalOversight ? "text-amber-500/60" : "text-primary/60"
                )}>
                  {isGlobalOversight ? "Platform_Global_Sync" : "Network_Expansion"}
                </h3>
                <span className="text-[8px] opacity-20 font-black uppercase tracking-widest mt-1">Live_Node_Ingress</span>
              </div>
            </div>
            <p className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-foreground">
              {isGlobalOversight ? "Global" : "User"} <span className={isGlobalOversight ? "text-amber-500" : "text-primary"}>Growth</span>
            </p>
          </div>
          <div className={cn(
            "size-14 md:size-20 rounded-2xl md:rounded-[2rem] border flex items-center justify-center shrink-0 shadow-inner transition-all duration-1000 group-hover:rotate-12",
            isGlobalOversight 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
              : "bg-primary/10 border-primary/20 text-primary"
          )}>
            <Zap className="size-7 md:size-10" />
          </div>
        </div>

        <div 
          className="w-full relative z-10 animate-in fade-in duration-1000 delay-300" 
          style={{ height: `${chartHeight}px` }}
        >
          <SubscribersChart data={dailyData} theme={isGlobalOversight ? "amber" : "emerald"} />
        </div>
      </div>
    );
  }

  /**
   * 📊 USER STATS: Morphology-Aware Grid
   */
  const activeCount = stats?.activeSubscriptions ?? 0;
  const ticketCount = stats?.pendingTickets ?? 0;

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
          ticketCount > 0 && "border-primary/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)]"
        )}
      />
    </div>
  );
}