"use client";

import * as React from "react";
import { TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface SummaryData {
  today: number;
  week: number;
  month: number;
  growth: number;
}

/**
 * 🛰️ TRANSACTION_SUMMARY_CARD (Institutional v16.16.75)
 * Strategy: High-Density Analytical HUD & Tactical Radiance.
 * Mission: Real-time revenue telemetry for Merchant & Staff nodes.
 */
export function TransactionSummaryCard({ data }: { data: SummaryData }) {
  const { impact } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";

  if (!isReady) return <div className="h-40 w-full bg-white/[0.02] animate-pulse rounded-3xl border border-white/5" />;

  const stats = [
    { label: "Today_Settlement", value: data.today, icon: Zap },
    { label: "Rolling_7D_Mesh", value: data.week, icon: Activity },
    { label: "Monthly_Agg_Total", value: data.month, icon: TrendingUp },
  ];

  return (
    <div className={cn(
      "relative group w-full overflow-hidden transition-all duration-700 shadow-3xl",
      "rounded-[2.5rem] border backdrop-blur-3xl p-6 md:p-8",
      isStaffTheme ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-zinc-950/60 border-white/5"
    )}>
      
      {/* 🌫️ TACTICAL RADIANCE: Role-Aware Background Glow */}
      <div className={cn(
        "absolute -right-24 -bottom-24 size-64 blur-[120px] opacity-10 pointer-events-none transition-all duration-1000",
        isStaffTheme ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- HUD HEADER --- */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex flex-col gap-1.5 leading-none">
          <div className="flex items-center gap-2 opacity-30 italic">
            <Activity className={cn("size-3 animate-pulse", isStaffTheme ? "text-amber-500" : "text-primary")} />
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">Revenue_Oversight</span>
          </div>
          <h2 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter text-foreground">
            Liquidity <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Pulse</span>
          </h2>
        </div>

        {/* 🚀 GROWTH SIGNAL */}
        <div className={cn(
          "px-3 py-1.5 rounded-xl border flex items-center gap-2 transition-all",
          data.growth >= 0 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
            : "bg-rose-500/10 border-rose-500/20 text-rose-500"
        )}>
          {data.growth >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          <span className="text-[10px] font-black italic tabular-nums">{Math.abs(data.growth)}%</span>
        </div>
      </div>

      {/* --- TELEMETRY GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
        {stats.map((stat, i) => (
          <div 
            key={stat.label}
            onClick={() => impact("light")}
            className="flex flex-col p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer group/node"
          >
            <div className="flex items-center gap-2 mb-3 opacity-20 group-hover/node:opacity-50 transition-opacity">
              <stat.icon className="size-3" />
              <span className="text-[7.5px] font-black uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-1 leading-none">
              <span className="text-[10px] font-bold opacity-20">$</span>
              <span className="text-2xl md:text-3xl font-black italic tracking-tighter tabular-nums">
                {stat.value.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}