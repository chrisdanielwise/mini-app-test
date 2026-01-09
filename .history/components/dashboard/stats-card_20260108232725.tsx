"use client"

import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, Minus, type LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  // value is string | number to handle stringified Decimals from the API
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  iconColor?: string
  className?: string
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel = "from last month",
  icon: Icon,
  iconColor = "text-primary",
  className,
}: StatsCardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0
  const isNeutral = change !== undefined && change === 0

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-md",
      className
    )}>
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-110" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            {title}
          </p>
          <div className={cn("rounded-lg bg-muted/50 p-2", iconColor)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <h4 className="text-3xl font-black tracking-tighter text-foreground italic">
            {value}
          </h4>

          {change !== undefined && (
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-tighter",
                isPositive && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                isNegative && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                isNeutral && "bg-muted text-muted-foreground"
              )}>
                {isPositive && <ArrowUpRight className="mr-0.5 h-3 w-3" />}
                {isNegative && <ArrowDownRight className="mr-0.5 h-3 w-3" />}
                {isNeutral && <Minus className="mr-0.5 h-3 w-3" />}
                {isPositive ? `+${change}%` : `${change}%`}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-70">
                {changeLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
