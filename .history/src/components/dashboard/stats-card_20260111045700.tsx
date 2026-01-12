"use client";

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
  Zap
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
 * Normalized: Fluid typography scales to prevent horizontal numeric clipping.
 * Optimized: Adaptive padding and touch-safe interaction nodes for mobile staff.
 */
export function StatsCard({
  title,
  value,
  change,
  changeLabel = "from previous epoch",
  iconType,
  iconColor = "text-primary",
  className,
}: StatsCardProps) {
  const Icon = ICON_MAP[iconType] || Activity;

  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  return (
    <div
      onClick={() => hapticFeedback("light")}
      className={cn(
        "group relative overflow-hidden flex flex-col justify-between min-h-[160px] md:min-h-[180px]",
        "rounded-[2rem] md:rounded-[2.5rem] border border-border/40 bg-card/40",
        "p-5 md:p-8 backdrop-blur-3xl transition-all duration-500",
        "hover:border-primary/30 hover:shadow-2xl active:scale-[0.98] cursor-default shadow-lg",
        className
      )}
    >
      {/* 🔮 Background Aura Glow */}
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-transform duration-700 group-hover:scale-150 group-hover:bg-primary/10 pointer-events-none" />

      <div className="relative z-10 w-full min-w-0">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="space-y-1 min-w-0">
             <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground opacity-60 truncate">
               {title}
             </p>
             <div className="flex items-center gap-1.5 opacity-30 md:opacity-10 md:group-hover:opacity-100 transition-opacity duration-500 italic">
               <Zap className="h-2.5 w-2.5 text-primary fill-current animate-pulse" />
               <span className="text-[7px] font-black uppercase tracking-widest text-primary">Live Sync</span>
             </div>
          </div>
          
          <div className={cn(
            "h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl md:rounded-2xl bg-muted/30 flex items-center justify-center shadow-inner transition-colors group-hover:bg-primary/10",
            iconColor
          )}>
            <Icon className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110" />
          </div>
        </div>

        <div className="flex flex-col gap-2 md:gap-3 min-w-0">
          <h4 className={cn(
            "font-black tracking-tighter text-foreground italic leading-none truncate",
            // FLUID TYPOGRAPHY: Clamps size based on value length and viewport
            value.toString().length > 8 
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
}

/**
 * 🦴 SYSTEM SKELETON: STATS (Apex Tier)
 */
export function StatsCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-border/40 bg-card/20 p-5 md:p-8 backdrop-blur-md h-[160px] md:h-[180px]">
      <div className="flex items-center justify-between mb-8">
        <div className="h-3 w-24 md:w-32 animate-pulse rounded bg-muted/40" />
        <div className="h-10 w-10 md:h-12 md:w-12 animate-pulse rounded-xl md:rounded-2xl bg-muted/40 shadow-inner" />
      </div>

      <div className="space-y-4">
        <div className="h-8 md:h-12 w-32 md:w-48 animate-pulse rounded-xl bg-muted/60" />
        <div className="flex items-center gap-2">
          <div className="h-5 w-12 animate-pulse rounded-lg bg-muted/40" />
          <div className="h-3 w-20 md:w-28 animate-pulse rounded bg-muted/20" />
        </div>
      </div>
    </div>
  );
}