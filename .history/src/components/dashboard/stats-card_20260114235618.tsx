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
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID STATS NODE (Institutional v16.16.12)
 * Logic: Haptic-synced KPI telemetry with 700ms momentum.
 * Design: v9.9.1 Hardened Glassmorphism.
 */

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
}

const StatsCardComponent = ({
  title,
  value,
  change,
  changeLabel = "from previous epoch",
  iconType,
  iconColor,
  className,
}: StatsCardProps) => {
  const { flavor, mounted } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";
  
  const Icon = ICON_MAP[iconType] || Activity;

  // 🛡️ NULL-SAFE HANDSHAKE
  const safeValue = useMemo(() => {
    if (value === null || value === undefined) return "0.00";
    return value.toString();
  }, [value]);

  const { isPositive, isNegative, isNeutral, activeIconColor } = useMemo(() => ({
    isPositive: change !== undefined && change > 0,
    isNegative: change !== undefined && change < 0,
    isNeutral: change !== undefined && change === 0,
    activeIconColor: iconColor || (isStaff ? "text-amber-500" : "text-primary")
  }), [change, iconColor, isStaff]);

  // 🛡️ HYDRATION GUARD: Shimmering Placeholder
  if (!mounted) return (
    <div className="min-h-[180px] rounded-[2.5rem] bg-white/[0.03] border border-white/5 animate-pulse" />
  );

  return (
    <div
      onClick={() => impact("light")} // 🏁 TACTILE SYNC: Micro-tick on interaction
      className={cn(
        "group relative overflow-hidden flex flex-col justify-between min-h-[180px]",
        "rounded-[2.5rem] border backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:shadow-2xl active:scale-[0.98] cursor-pointer shadow-black/20",
        isStaff 
          ? "bg-amber-500/[0.03] border-amber-500/20 hover:border-amber-500/40" 
          : "bg-card/30 border-white/5 hover:border-primary/30",
        className
      )}
    >
      {/* 🌊 AMBIENT RADIANCE: Subsurface Focus Glow */}
      <div className={cn(
        "absolute -right-12 -top-12 size-32 rounded-full blur-[60px] transition-all duration-700 group-hover:scale-150 pointer-events-none",
        isStaff ? "bg-amber-500/10" : "bg-primary/10"
      )} />

      <div className="relative z-10 w-full p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2 min-w-0">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">
               {title}
             </p>
             <div className="flex items-center gap-2 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
               {isStaff ? (
                 <Globe className="size-3 text-amber-500 animate-pulse" />
               ) : (
                 <Zap className="size-3 text-primary fill-current animate-pulse" />
               )}
               <span className={cn(
                 "text-[8px] font-black uppercase tracking-widest italic",
                 isStaff ? "text-amber-500" : "text-primary"
               )}>
                 {isStaff ? "Global_Sync" : "Node_Active"}
               </span>
             </div>
          </div>
          
          <div className={cn(
            "size-12 md:size-14 shrink-0 rounded-[1.25rem] md:rounded-2xl flex items-center justify-center shadow-inner border transition-all duration-500",
            isStaff ? "bg-amber-500/10 border-amber-500/10" : "bg-white/5 border-white/5",
            activeIconColor
          )}>
            <Icon className="size-6 md:size-7 transition-transform group-hover:scale-110 group-hover:rotate-3" />
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-0">
          <h4 className={cn(
            "font-black tracking-tighter text-foreground italic leading-none truncate transition-all",
            safeValue.length > 8 ? "text-3xl" : "text-4xl md:text-5xl"
          )}>
            {safeValue}
          </h4>

          {change !== undefined && (
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex items-center rounded-xl px-3 py-1 text-[9px] font-black uppercase tracking-widest border shadow-sm",
                  isPositive && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                  isNegative && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                  isNeutral && "bg-white/5 text-muted-foreground border-white/10"
                )}
              >
                {isPositive && <ArrowUpRight className="mr-1.5 size-3.5" />}
                {isNegative && <ArrowDownRight className="mr-1.5 size-3.5" />}
                {isNeutral && <Minus className="mr-1.5 size-3.5" />}
                {isPositive ? `+${change}%` : `${change}%`}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 italic truncate">
                {changeLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const StatsCard = React.memo(StatsCardComponent);