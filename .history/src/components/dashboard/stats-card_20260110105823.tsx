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

/**
 * 🛠️ PROTOCOL REGISTRY
 * Maps string keys to institutional icons to bypass server-client serialization lag.
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
 * 📊 KPI TELEMETRY NODE (Tier 2)
 * High-resiliency data visualization for Zipha V2 Command Center.
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
      className={cn(
        "group relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/40 p-8 backdrop-blur-xl transition-all duration-500",
        "hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1",
        className
      )}
    >
      {/* 🔮 Background Aura Glow */}
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-transform duration-700 group-hover:scale-150 group-hover:bg-primary/10" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">
               {title}
             </p>
             <div className="flex items-center gap-1.5 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
               <Zap className="h-2.5 w-2.5 text-primary fill-current" />
               <span className="text-[7px] font-black uppercase tracking-widest text-primary">Live Sync</span>
             </div>
          </div>
          
          <div className={cn(
            "h-12 w-12 rounded-2xl bg-muted/30 flex items-center justify-center shadow-inner transition-colors group-hover:bg-primary/10",
            iconColor
          )}>
            <Icon className="h-6 w-6 transition-transform group-hover:scale-110" />
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-3">
          <h4 className="text-4xl font-black tracking-tighter text-foreground italic leading-none">
            {value}
          </h4>

          {change !== undefined && (
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "flex items-center rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm",
                  isPositive && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                  isNegative && "bg-rose-500/10 text-rose-500 border border-rose-500/20",
                  isNeutral && "bg-muted/50 text-muted-foreground border border-border/40"
                )}
              >
                {isPositive && <ArrowUpRight className="mr-1 h-3 w-3" />}
                {isNegative && <ArrowDownRight className="mr-1 h-3 w-3" />}
                {isNeutral && <Minus className="mr-1 h-3 w-3" />}
                {isPositive ? `+${change}%` : `${change}%`}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-40 italic">
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
 * 🦴 SYSTEM SKELETON: STATS
 */
export function StatsCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/20 p-8 backdrop-blur-md">
      <div className="flex items-center justify-between mb-8">
        <div className="h-3 w-32 animate-pulse rounded bg-muted/40" />
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-muted/40 shadow-inner" />
      </div>

      <div className="space-y-4">
        <div className="h-12 w-48 animate-pulse rounded-2xl bg-muted/60" />
        <div className="flex items-center gap-2">
          <div className="h-6 w-16 animate-pulse rounded-lg bg-muted/40" />
          <div className="h-3 w-28 animate-pulse rounded bg-muted/20" />
        </div>
      </div>
    </div>
  );
}