"use client"

import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { cn } from "@/src/lib/utils"

interface SubscribersChartProps {
  // PRISMA 7: Data arrives as stringified ISO dates from the server
  data: { date: string; new: number; churned: number }[]
  className?: string
}

export function SubscribersChart({ data, className }: SubscribersChartProps) {
  /**
   * Memoized data transformation
   * Prevents re-parsing date strings on every render cycle
   */
  const formattedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }))
  }, [data])

  return (
    <div className={cn("rounded-xl border border-border bg-card shadow-sm overflow-hidden", className)}>
      <div className="border-b border-border p-6">
        <h3 className="text-lg font-bold tracking-tight">Subscriber Growth</h3>
        <p className="text-sm text-muted-foreground">Daily acquisition vs. churn rate</p>
      </div>

      <div className="h-72 w-full p-6 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={8}
          >
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
            />

            <Tooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ fontWeight: "bold", marginBottom: "4px", fontSize: "12px" }}
              itemStyle={{ fontSize: "12px", fontWeight: "600" }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: "20px", fontSize: "12px", fontWeight: "600" }}
            />

            <Bar
              dataKey="new"
              name="New Joins"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
              barSize={12}
              animationDuration={1500}
            />
            <Bar
              dataKey="churned"
              name="Churned"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
              barSize={12}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}