"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus, type LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  // Use LucideIcon type for proper component handling in Next.js 15 Client Components
  icon: LucideIcon; 
  iconColor?: string;
  className?: string;
}

/**
 * 📊 PRODUCTION STATS CARD
 * Designed for the Zipha V2 Command Center.
 * FIXED: Prop serialization for Next.js 15 Server-to-Client boundaries.
 */
export function StatsCard({
  title,
  value,
  change,
  changeLabel = "from last month",
  icon: Icon, // Destructure to 'Icon' for component-style rendering
  iconColor = "text-primary",
  className,
}: StatsCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-6 transition-all hover:shadow-md",
      className
    )}>
      {/* Decorative background element for premium aesthetic */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-110" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {title}
          </p>
          <div className={cn("rounded-2xl bg-muted/50 p-2.5", iconColor)}>
            {/* Render the icon component safely */}
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <h4 className="text-3xl font-black tracking-tighter text-foreground italic">
            {value}
          </h4>

          {change !== undefined && (
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter",
                isPositive && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                isNegative && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                isNeutral && "bg-muted text-muted-foreground"
              )}>
                {isPositive && <ArrowUpRight className="mr-0.5 h-3 w-3" />}
                {isNegative && <ArrowDownRight className="mr-0.5 h-3 w-3" />}
                {isNeutral && <Minus className="mr-0.5 h-3 w-3" />}
                {isPositive ? `+${change}%` : `${change}%`}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
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
 * 💀 STATS CARD SKELETON
 * Used as a fallback in Suspense boundaries to prevent layout shift.
 */
export function StatsCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-10 w-10 animate-pulse rounded-2xl bg-muted" />
      </div>

      <div className="mt-4 space-y-3">
        <div className="h-10 w-32 animate-pulse rounded-xl bg-muted/80" />
        <div className="flex items-center gap-2">
          <div className="h-5 w-14 animate-pulse rounded-lg bg-muted" />
          <div className="h-3 w-24 animate-pulse rounded bg-muted/50" />
        </div>
      </div>
    </div>
  );
}