"use client";

import * as React from "react";
import { StatsCard } from "./stats-card";
import { SubscribersChart } from "./subscribers-chart";
import {
  AlertCircle,
  Loader2,
  Users,
  Terminal,
  Zap,
  Activity,
  Globe,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface AsyncSubscribersProps {
  growth: any;
  stats: any;
  type?: "stats" | "chart";
  isGlobalOversight?: boolean;
}

/**
 * 🌊 FLUID SUBSCRIBERS NODE (Institutional v16.16.12)
 * Logic: Momentum-based growth tracking with Oversight Radiance.
 * Handshake: Role-aware telemetry visualization.
 */
export default function AsyncSubscribersCard({
  growth,
  stats,
  type = "stats",
  isGlobalOversight = false,
}: AsyncSubscribersProps) {
  const { impact } = useHaptics();

  // 🛡️ SECURITY GATE: Identity Node Required
  if (!stats && !growth) {
    return (
      <div className="flex min-h-[250px] flex-col items-center justify-center rounded-[3rem] border border-white/5 bg-card/20 p-12 text-center backdrop-blur-3xl">
        <div className="mb-6 size-14 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10">
          <Lock className="size-6 text-muted-foreground/20" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
          Identity_Node_Required
        </p>
      </div>
    );
  }

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
    return (
      <div 
        onPointerEnter={() => impact("light")}
        className={cn(
          "relative group overflow-hidden rounded-[3rem] border p-10 backdrop-blur-3xl shadow-2xl",
          "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "animate-in fade-in slide-in-from-bottom-8",
          isGlobalOversight 
            ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" 
            : "bg-card/30 border-white/5"
        )}
      >
        {/* 🌊 AMBIENT RADIANCE: Global Sync Aura */}
        <div className={cn(
          "absolute -top-24 -left-24 size-64 blur-[120px] opacity-20 transition-all duration-1000",
          isGlobalOversight ? "bg-amber-500" : "bg-primary"
        )} />

        <Activity className="absolute -bottom-12 -right-12 size-64 opacity-[0.02] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />

        <div className="flex flex-row items-center justify-between mb-12 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3 italic opacity-40">
              {isGlobalOversight 
                ? <Globe className="size-3.5 text-amber-500 animate-pulse" /> 
                : <Users className="size-3.5 text-primary" />
              }
              <h3 className={cn(
                "text-[10px] font-black uppercase tracking-[0.4em]",
                isGlobalOversight ? "text-amber-500" : "text-primary"
              )}>
                {isGlobalOversight ? "Platform_Global_Sync" : "Network_Expansion"}
              </h3>
            </div>
            <p className="text-3xl font-black uppercase italic tracking-tighter leading-none text-foreground">
              {isGlobalOversight ? "Global" : "User"} <span className={isGlobalOversight ? "text-amber-500" : "text-primary"}>Growth</span>
            </p>
          </div>
          <div className={cn(
            "size-14 rounded-[1.5rem] border flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:rotate-12",
            isGlobalOversight 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
              : "bg-primary/10 border-primary/20 text-primary"
          )}>
            <Zap className="size-7" />
          </div>
        </div>

        <div className="h-[280px] w-full relative z-10">
          <SubscribersChart data={dailyData} theme={isGlobalOversight ? "amber" : "emerald"} />
        </div>
      </div>
    );
  }

  const activeCount = stats?.activeSubscriptions ?? 0;
  const ticketCount = stats?.pendingTickets ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 w-full animate-in slide-in-from-bottom-6 duration-700">
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