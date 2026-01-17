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
 * 🌊 STATS_CARD (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Transition | Vapour-Glass depth.
 * Logic: morphology-aware safe-area clamping with kinetic telemetry ingress.
 */
const StatsCardComponent = ({
  title,
  value,
  change,
  changeLabel = "from previous epoch",
  iconType,
  iconColor,
  className,
  sparkData,
}: StatsCardProps) => {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware-state consumption
  const { isReady, screenSize, isMobile } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";
  const Icon = ICON_MAP[iconType] || Activity;

  // 🛡️ NULL-SAFE HANDSHAKE
  const safeValue = useMemo(() => {
    if (value === null || value === undefined) return "0.00";
    return value.toString();
  }, [value]);

  // 📈 TELEMETRY GENERATOR
  const displaySparkData = useMemo(() => {
    if (sparkData) return sparkData;
    return Array.from({ length: 12 }, (_, i) => ({
      value: Math.floor(Math.random() * 40) + 60,
    }));
  }, [sparkData]);

  const { isPositive, isNegative, isNeutral, activeIconColor } = useMemo(() => ({
    isPositive: change !== undefined && change > 0,
    isNegative: change !== undefined && change < 0,
    isNeutral: change !== undefined && change === 0,
    activeIconColor: iconColor || (isStaff ? "text-amber-500" : "text-primary")
  }), [change, iconColor, isStaff]);

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return (
    <div className="min-h-[240px] rounded-[3rem] bg-card/20 animate-pulse border border-white/5 shadow-inner" />
  );

  return (
    <div
      onClick={() => impact("light")}
      className={cn(
        "group relative overflow-hidden flex flex-col justify-between min-h-[240px] transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "rounded-[3rem] md:rounded-[3.5rem] border backdrop-blur-3xl shadow-apex",
        "hover:bg-white/[0.04] active:scale-[0.97] cursor-pointer",
        isStaff 
          ? "bg-amber-500/[0.04] border-amber-500/20" 
          : "bg-card/30 border-white/5",
        className
      )}
    >
      {/* 🌫️ VAPOUR RADIANCE: Ambient Subsurface Glow */}
      <div className={cn(
        "absolute -right-16 -top-16 size-48 blur-[80px] transition-all duration-1000 group-hover:scale-150 pointer-events-none",
        isStaff ? "bg-amber-500/10" : "bg-primary/10"
      )} />

      <div className={cn("relative z-10 w-full", isMobile ? "p-8 pb-4" : "p-10 pb-4")}>
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-3 min-w-0">
             <div className="flex items-center gap-3 italic opacity-40">
               {isStaff ? (
                 <Globe className="size-3.5 text-amber-500 animate-pulse" />
               ) : (
                 <Zap className="size-3.5 text-primary fill-current animate-pulse" />
               )}
               <p className="text-[10px] font-black uppercase tracking-[0.4em] truncate">
                 {title}
               </p>
             </div>
             <div className="flex items-center gap-2 opacity-10 group-hover:opacity-60 transition-opacity duration-1000">
               <span className={cn(
                 "text-[7px] font-black uppercase tracking-widest leading-none",
                 isStaff ? "text-amber-500" : "text-primary"
               )}>
                 {isStaff ? "Global_Telemetry_Active" : "Node_Vector_STABLE"}
               </span>
             </div>
          </div>
          
          <div className={cn(
            "size-14 md:size-16 shrink-0 rounded-2xl md:rounded-[1.4rem] flex items-center justify-center shadow-inner border transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110",
            isStaff ? "bg-amber-500/10 border-amber-500/10" : "bg-white/[0.03] border-white/5",
            activeIconColor
          )}>
            <Icon className="size-7 md:size-8" />
          </div>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          <h4 className={cn(
            "font-black tracking-tighter text-foreground italic leading-none truncate transition-all duration-1000 animate-in fade-in slide-in-from-bottom-2",
            safeValue.length > 8 ? "text-4xl md:text-5xl" : "text-5xl md:text-7xl"
          )}>
            {safeValue}
          </h4>

          {change !== undefined && (
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex items-center rounded-2xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border shadow-apex transition-colors duration-700",
                  isPositive && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5",
                  isNegative && "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5",
                  isNeutral && "bg-white/5 text-muted-foreground/40 border-white/10"
                )}
              >
                {isPositive && <ArrowUpRight className="mr-2 size-4" />}
                {isNegative && <ArrowDownRight className="mr-2 size-4" />}
                {isNeutral && <Minus className="mr-2 size-4" />}
                {isPositive ? `+${change}%` : `${change}%`}
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic truncate">
                {changeLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 🚀 KINETIC MOMENTUM: Subsurface Sparkline Waveform */}
      <div className="px-10 pb-8 mt-auto flex items-end justify-between gap-6 overflow-hidden">
        <div className="flex-1 h-14">
          <Sparkline 
            data={displaySparkData} 
            trend={isPositive ? "UP" : isNegative ? "DOWN" : "NEUTRAL"} 
            className="opacity-20 group-hover:opacity-100 transition-opacity duration-[1500ms]"
          />
        </div>
        <div className="shrink-0 mb-1 opacity-0 group-hover:opacity-40 transition-opacity duration-1000 flex flex-col items-end gap-1">
          <div className="h-px w-8 bg-white/20" />
          <span className="text-[7px] font-black uppercase tracking-[0.4em] text-foreground italic">
            Telemetry_24H
          </span>
        </div>
      </div>
    </div>
  );
};

export const StatsCard = React.memo(StatsCardComponent);