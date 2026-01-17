"use client";

import * as React from "react";
import { StatsCard } from "./stats-card";
import { RevenueChart } from "./revenue-chart";
import { 
  AlertCircle, 
  Terminal, 
  TrendingUp, 
  Zap, 
  Globe, 
  Lock 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface AsyncRevenueCardProps {
  data: any;
  type?: "stats" | "chart";
  isGlobalOversight?: boolean;
}

/**
 * 🌊 FLUID REVENUE NODE (Institutional v16.16.12)
 * Logic: Momentum-based financial ingress with Oversight Radiance.
 * Scale: 1M+ User Optimized | Environment: Telegram Mini App
 */
export function AsyncRevenueCard({
  data,
  type = "stats",
  isGlobalOversight = false,
}: AsyncRevenueCardProps) {
  const { impact } = useHaptics();

  // 🛡️ SECURITY FALLBACK: Identity Node Missing
  if (!data) {
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
    const dailyData = data?.dailyData || [];
    
    return (
      <div 
        onPointerEnter={() => impact("light")}
        className={cn(
          "relative group overflow-hidden rounded-[3rem] border p-10 backdrop-blur-3xl shadow-2xl",
          "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "animate-in fade-in slide-in-from-bottom-8",
          isGlobalOversight 
            ? "bg-amber-500/[0.03] border-amber-500/20" 
            : "bg-card/30 border-white/5"
        )}
      >
        {/* 🌊 AMBIENT RADIANCE: Oversight Vector Glow */}
        <div className={cn(
          "absolute -right-24 -bottom-24 size-64 blur-[120px] opacity-20 transition-all duration-1000",
          isGlobalOversight ? "bg-amber-500" : "bg-primary"
        )} />

        <TrendingUp className="absolute -bottom-12 -left-12 size-64 opacity-[0.02] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="flex flex-row items-center justify-between mb-12 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3 italic">
              {isGlobalOversight 
                 ? <Globe className="size-3.5 text-amber-500 animate-pulse" /> 
                 : <Zap className="size-3.5 text-primary animate-pulse" />
              }
              <h3 className={cn(
                "text-[10px] font-black uppercase tracking-[0.4em]",
                isGlobalOversight ? "text-amber-500/60" : "text-primary/60"
              )}>
                {isGlobalOversight ? "Platform_Global_Vector" : "Cluster_Financial_Vector"}
              </h3>
            </div>
            <p className="text-3xl font-black uppercase italic tracking-tighter leading-none text-foreground">
              {isGlobalOversight ? "Global" : "Revenue"} <span className={isGlobalOversight ? "text-amber-500" : "text-primary"}>Trend</span>
            </p>
          </div>
          
          <div className={cn(
            "size-14 rounded-[1.5rem] border flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:rotate-6",
            isGlobalOversight 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
              : "bg-primary/10 border-primary/20 text-primary"
          )}>
             <TrendingUp className="size-7" />
          </div>
        </div>

        <div className="h-[300px] w-full relative z-10">
          <RevenueChart 
            data={dailyData} 
            theme={isGlobalOversight ? "amber" : "emerald"} 
          />
        </div>
      </div>
    );
  }

  const totalRev = parseFloat(data?.total || "0");
  const transCount = data?.transactionCount || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 w-full animate-in slide-in-from-bottom-6 duration-700">
      <StatsCard
        title={isGlobalOversight ? "Global Gross Revenue" : "Gross Revenue"}
        value={`$${totalRev.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        change={0.0}
        iconType="revenue"
        iconColor={isGlobalOversight ? "text-amber-500" : "text-emerald-500"}
      />
      <StatsCard
        title={isGlobalOversight ? "Global Tx Volume" : "Transaction Volume"}
        value={transCount.toLocaleString()}
        change={0.0}
        iconType="payments"
        iconColor={isGlobalOversight ? "text-amber-400" : "text-violet-500"}
      />
    </div>
  );
}