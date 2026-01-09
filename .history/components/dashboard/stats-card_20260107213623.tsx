import { cn } from "@/lib/utils"
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  iconColor?: string
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel = "vs last period",
  icon: Icon,
  iconColor = "text-primary",
}: StatsCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className={cn("h-5 w-5", iconColor)} />
      </div>

      <div className="mt-4">
        <p className="text-3xl font-bold">{value}</p>

        {change !== undefined && (
          <div className="mt-2 flex items-center gap-1 text-sm">
            {isPositive && (
              <>
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500">+{change}%</span>
              </>
            )}
            {isNegative && (
              <>
                <ArrowDown className="h-4 w-4 text-red-500" />
                <span className="text-red-500">{change}%</span>
              </>
            )}
            {change === 0 && <span className="text-muted-foreground">0%</span>}
            <span className="text-muted-foreground">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}
