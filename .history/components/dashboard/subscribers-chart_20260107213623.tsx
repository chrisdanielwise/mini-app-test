"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

interface SubscribersChartProps {
  data: { date: string; new: number; churned: number }[]
}

export function SubscribersChart({ data }: SubscribersChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }))

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-semibold">Subscriber Growth</h3>
        <p className="text-sm text-muted-foreground">New vs Churned</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="new" name="New" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="churned" name="Churned" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
