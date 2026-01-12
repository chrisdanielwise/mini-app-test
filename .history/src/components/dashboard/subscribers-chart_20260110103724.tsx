"use client";

import { useMemo } from "react";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from "recharts";
import { cn } from "@/src/lib/utils";
import { Activity, UserPlus, UserMinus } from "lucide-react";

interface SubscribersChartProps {
  // PRISMA 7: Data arrives as stringified ISO dates from the server
  data: { date: string; new: number; churned: number }[]
  className?: string
}

/**
 * 🛰️ SUBSCRIBER TELEMETRY NODE (Tier 2)
 * High-resiliency growth visualization tracking Acquisition vs Churn protocols.
 */
export function SubscribersChart({ data, className }: SubscribersChartProps) {
  /**
   * 🏁 DATA HYDRATION SYNC
   * Memoized date parsing for high-velocity rendering clusters.
   */
  const formattedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }).toUpperCase(),
    }))
  }, [data])

  return (
    <div className={cn(
      "rounded-[3rem] border border-border/40 bg-card/40 p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group animate-in fade-in duration-1000",
      className
    )}>
      
      {/* --- INSTITUTIONAL HEADER --- */}
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-primary animate-pulse" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">
              Growth Flux // 30D
            </h3>
          </div>
          <p className="text-2xl font-black uppercase italic tracking-tighter leading-none">
            User <span className="text-primary">Acquisition</span>
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="text-right">
             <div className="flex items-center justify-end gap-1.5 text-emerald-500">
                <UserPlus className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">Acquired</span>
             </div>
             <p className="text-lg font-black tracking-tighter italic leading-none mt-1">
               {data.reduce((acc, curr) => acc + curr.new, 0)}
             </p>
          </div>
        </div>
      </div>

      {/* --- CHART INTERFACE --- */}
      <div className="h-80 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={6}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="hsl(var(--border))"
              strokeOpacity={0.2}
            />

            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9, fontWeight: 900, letterSpacing: '0.1em' }}
              dy={15}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9, fontWeight: 900 }}
              dx={-10}
            />

            <Tooltip
              cursor={{ fill: "hsl(var(--primary))", opacity: 0.05 }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "20px",
                padding: "16px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
              labelStyle={{ 
                fontWeight: "900", 
                marginBottom: "8px", 
                fontSize: "10px", 
                textTransform: "uppercase", 
                letterSpacing: "0.2em",
                color: "hsl(var(--muted-foreground))" 
              }}
              itemStyle={{ 
                fontSize: "10px", 
                fontWeight: "900", 
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                padding: "2px 0"
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={6}
              wrapperStyle={{ 
                paddingBottom: "30px", 
                fontSize: "9px", 
                fontWeight: "900", 
                textTransform: "uppercase", 
                letterSpacing: "0.2em",
                opacity: 0.5
              }}
            />

            <Bar
              dataKey="new"
              name="Acquired"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              barSize={10}
              animationDuration={2000}
            />
            <Bar
              dataKey="churned"
              name="Churned"
              fill="hsl(var(--rose-500))"
              radius={[4, 4, 0, 0]}
              barSize={10}
              animationDuration={2000}
              opacity={0.6}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Background Terminal Micro-Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
    </div>
  )
}