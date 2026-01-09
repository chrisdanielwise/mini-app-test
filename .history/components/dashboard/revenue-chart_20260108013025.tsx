"use client"

import { useMemo } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { cn } from "@/lib/utils"

interface RevenueChartProps {
  // PRISMA 7: amount comes from the service layer as a string
  data: { date: string; amount: string }[] 
  className?: string
}

export function RevenueChart({ data, className }: RevenueChartProps) {
  /**
   * Memoized data formatting to prevent unnecessary re-renders
   * Converts Decimal strings back to numbers for Recharts processing
   */
  const formattedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      // Parse for Recharts (y-axis)
      numericAmount: parseFloat(item.amount), 
      // Format for X-axis (e.g., "Jan 8")
      displayDate: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }))
  }, [data])

  return (
    <div className={cn("rounded-xl border border-border bg-card shadow-sm overflow-hidden", className)}>
      <div className="border-b border-border p-6">
        <h3 className="text-lg font-bold tracking-tight">Revenue Performance</h3>
        <p className="text-sm text-muted-foreground">Daily earnings trend over the last 30 days</p>
      </div>

      <div className="h-72 w-full p-6 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="3 3" 
              stroke="hsl(var(--muted-foreground))" 
              strokeOpacity={0.1} 
            />

            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
              tickFormatter={(value) => `$${value}`}
              dx={-10}
            />

            <Tooltip
              cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4" }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ fontWeight: "bold", marginBottom: "4px", fontSize: "12px" }}
              itemStyle={{ fontSize: "12px", color: "hsl(var(--primary))", fontWeight: "600" }}
              formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, "Daily Revenue"]}
            />

            <Area
              type="monotone"
              dataKey="numericAmount"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}