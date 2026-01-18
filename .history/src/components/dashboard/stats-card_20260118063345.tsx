"use client";

import * as React from "react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Users,
  MessageSquare,
  DollarSign,
  CreditCard,
  Activity,
  Zap,
  Globe
} from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { Sparkline } from "@/components/dashboard/sparkline";

const ICON_MAP = {
  users: Users,
  tickets: MessageSquare,
  revenue: DollarSign,
  payments: CreditCard,
  telemetry: Activity,
};

interface StatsCardProps {
  title: string;
  value: string | number | undefined | null;
  change?: number;
  changeLabel?: string;
  iconType: keyof typeof ICON_MAP;
  iconColor?: string;
  className?: string;
  sparkData?: { value: number }[];
}

/**
 * 🛰️ STATS_CARD (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: Standardized h-[200px] prevents dashboard "drift" on mobile.
 */
const StatsCardComponent = ({
  title,
  value,
  change,
  changeLabel = "vs last epoch",
  iconType,
  iconColor,
  className,
  sparkData,
}: StatsCardProps) => {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";
  const Icon = ICON_MAP[iconType] || Activity;

  const safeValue = useMemo(() => {
    if (value === null || value === undefined) return "0.00";
    return value.toString();
  }, [value]);

  // 📈 GENERATE_PULSE: Sparkline data for kinetic feedback
  const displaySparkData = useMemo(() => {
    if (sparkData) return sparkData;
    return Array.from({ length: 12 }, () => ({
      value: Math.floor(Math.random() * 40) + 60,
    }));
  }, [sparkData]);

  const { isPositive, isNegative, isNeutral, activeIconColor } = useMemo(() => ({
    isPositive: change !== undefined && change > 0,
    isNegative: change !== undefined && change < 0,
    isNeutral: change !== undefined && change === 0,
    activeIconColor: iconColor || (isStaff ? "text-amber-500" : "text-primary")
  }), [change, iconColor, isStaff]);

  // 🛡️ HYDRATION_SHIELD: Prevents "Bogus" layout snaps during ingress
  if (!isReady) return (
    <div className="h-[200px] rounded-[2.5rem] bg-card/10 animate-pulse border border-white/5" />
  );

  return (
    <div
      onClick={() => impact("light")}
      className={cn(
        "group relative overflow-hidden flex flex-col justify-between h-[200px] transition-all duration-700",
        "rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl",
        "hover:bg-white/[0.02] active:scale-[0.98] cursor-pointer",
        isStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/40 border-white/5",
        className
      )}
    >
      {/* 🌫️ TACTICAL RADIANCE */}
      <div className={cn(
        "absolute -right-12 -top-12 size-32 blur-[60px] opacity-10 transition-all group-hover:opacity-20 pointer-events-none",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      <div className={cn("relative z-10 w-full leading-none", isMobile ? "p-5" : "p-6")}>
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1.5 min-w-0">
             <div className="flex items-center gap-2.5 italic opacity-30">
               {isStaff ? (
                 <Globe className="size-3 text-amber-500 animate-pulse" />
               ) : (
                 <Zap className="size-3 text-primary fill-current animate-pulse" />
               )}
               <p className="text-[7.5px] font-black uppercase tracking-[0.3em] truncate">
                 {title}
               </p>
             </div>
             <span className={cn(
               "text-[6px] font-black uppercase tracking-widest opacity-10 group-hover:opacity-40",
               isStaff ? "text-amber-500" : "text-primary"
             )}>
               {isStaff ? "Global_Sync_Ok" : "Node_Vector_Ok"}
             </span>
          </div>
          
          <div className={cn(
            "size-9 md:size-10 shrink-0 rounded-xl flex items-center justify-center border transition-all shadow-inner",
            isStaff ? "bg-amber-500/10 border-amber-500/10" : "bg-white/[0.02] border-white/5",
            activeIconColor
          )}>
            <Icon className="size-4.5 md:size-5 transition-transform group-hover:scale-110" />
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-0">
          <h4 className={cn(
            "font-black tracking-tighter text-foreground italic leading-none truncate transition-all tabular-nums",
            safeValue.length > 8 ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"
          )}>
            {safeValue}
          </h4>

          {change !== undefined && (
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex items-center rounded-lg px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.1em] border italic",
                  isPositive && "bg-emerald-500/5 text-emerald-500 border-emerald-500/10",
                  isNegative && "bg-rose-500/5 text-rose-500 border-rose-500/10",
                  isNeutral && "bg-white/5 text-muted-foreground/20 border-white/5"
                )}
              >
                {isPositive && <ArrowUpRight className="mr-1 size-3" />}
                {isNegative && <ArrowDownRight className="mr-1 size-3" />}
                {isPositive ? `+${change}%` : `${change}%`}
              </div>
              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground/10 italic truncate">
                {changeLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 🚀 KINETIC MOMENTUM: Compressed Sparkline Reservoir */}
      <div className="px-6 pb-4 mt-auto flex items-end justify-between gap-4 overflow-hidden">
        <div className="flex-1 h-8">
          <Sparkline 
            data={displaySparkData} 
            trend={isPositive ? "UP" : isNegative ? "DOWN" : "NEUTRAL"} 
            className="opacity-5 group-hover:opacity-40 transition-opacity duration-1000"
          />
        </div>
        <span className="text-[6px] font-black uppercase tracking-[0.3em] text-foreground/5 italic mb-1">
          24H_TX
        </span>
      </div>
    </div>
  );
};

export const StatsCard = React.memo(StatsCardComponent);