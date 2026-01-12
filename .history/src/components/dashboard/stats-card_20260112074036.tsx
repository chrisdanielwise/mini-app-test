"use client";

import React, { useMemo } from "react";
import { useLayout } from "@/context/layout-provider";
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
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛠️ PROTOCOL REGISTRY
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
  value: string | number;
  change?: number;
  changeLabel?: string;
  iconType: keyof typeof ICON_MAP;
  iconColor?: string;
  className?: string;
}

/**
 * 📊 KPI TELEMETRY NODE (Apex Tier)
 * Hardened: React.memo prevents re-renders during global layout state shifts.
 * Optimized: Adaptive typography scaling to prevent container bleed at 1M user volume.
 */
const StatsCardComponent = ({
  title,
  value,
  change,
  changeLabel = "from previous epoch",
  iconType,
  iconColor,
  className,
}: StatsCardProps) => {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";
  
  const Icon = ICON_MAP[iconType] || Activity;

  // 🚀 PERFORMANCE: Memoize logical states to prevent repeated string parsing
  const { isPositive, isNegative, isNeutral, activeIconColor } = useMemo(() => ({
    isPositive: change !== undefined && change > 0,
    isNegative: change !== undefined && change < 0,
    isNeutral: change !== undefined && change === 0,
    activeIconColor: iconColor || (isStaff ? "text-amber-500" : "text-primary")
  }), [change, iconColor, isStaff]);

  return (
    <div
      onClick={() => hapticFeedback("light")}
      className={cn(
        "group relative overflow-hidden flex flex-col justify-between min-h-[160px] md:min-h-[180px]",
        "rounded-[2rem] md:rounded-[2.5rem] border backdrop-blur-3xl transition-all duration-500",
        "hover:shadow-2xl active:scale-[0.98] cursor-default shadow-lg",
        isStaff 
          ? "bg-amber-500/[0.03] border-amber-500/20 hover:border-amber-500/40" 
          : "bg-card/40 border-border/40 hover:border-primary/30",
        className
      )}
    >
      {/* 🔮 Role-Aware Background Aura Glow */}
      <div className={cn(
        "absolute -right-6 -top-6 h-32 w-32 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-150 pointer-events-none",
        isStaff ? "bg-amber-500/5 group-hover:bg-amber-500/10" : "bg-primary/5 group-hover:bg-primary/10"
      )} />

      <div className="relative z-10 w-full min-w-0 p-5 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="space-y-1 min-w-0">
             <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground opacity-60 truncate">
               {title}
             </p>
             <div className="flex items-center gap-1.5 opacity-30 md:opacity-10 md:group-hover:opacity-100 transition-opacity duration-500 italic">
               {isStaff ? (
                 <Globe className="h-2.5 w-2.5 text-amber-500 animate-pulse" />
               ) : (
                 <Zap className="h-2.5 w-2.5 text-primary fill-current animate-pulse" />
               )}
               <span className={cn(
                 "text-[7px] font-black uppercase tracking-widest",
                 isStaff ? "text-amber-500" : "text-primary"
               )}>
                 {isStaff ? "Global_Sync" : "Live Sync"}
               </span>
             </div>
          </div>
          
          <div className={cn(
            "h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner transition-colors",
            isStaff ? "bg-amber-500/10 group-hover:bg-amber-500/20" : "bg-muted/30 group-hover:bg-primary/10",
            activeIconColor
          )}>
            <Icon className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110" />
          </div>
        </div>

        <div className="flex flex-col gap-2 md:gap-3 min-w-0">
          <h4 className={cn(
            "font-black tracking-tighter text-foreground italic leading-none truncate",
            value.toString().length > 10
              ? "text-lg sm:text-xl md:text-2xl"
              : value.toString().length > 8 
                ? "text-xl sm:text-2xl md:text-3xl" 
                : "text-2xl sm:text-3xl md:text-4xl"
          )}>
            {value}
          </h4>

          {change !== undefined && (
            <div className="flex items-center gap-2 md:gap-2.5 flex-wrap">
              <div
                className={cn(
                  "flex items-center rounded-lg px-2 py-0.5 md:px-2.5 md:py-1 text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-sm border",
                  isPositive && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                  isNegative && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                  isNeutral && "bg-muted/50 text-muted-foreground border-border/40"
                )}
              >
                {isPositive && <ArrowUpRight className="mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />}
                {isNegative && <ArrowDownRight className="mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />}
                {isNeutral && <Minus className="mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />}
                {isPositive ? `+${change}%` : `${change}%`}
              </div>
              <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-30 italic truncate max-w-[100px]">
                {changeLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 🛡️ INSTITUTIONAL CACHING
export const StatsCard = React.memo(StatsCardComponent);