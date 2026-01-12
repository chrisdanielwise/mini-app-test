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
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { Activity, UserPlus, Zap } from "lucide-react";

interface SubscribersChartProps {
  data: { date: string; new: number; churned: number }[];
  className?: string;
}

/**
 * 🛰️ SUBSCRIBER TELEMETRY NODE (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive bar geometry and safe-zones for high-resiliency growth tracking.
 */
export function SubscribersChart({ data, className }: SubscribersChartProps) {
  /**
   * 🏁 DATA HYDRATION SYNC
   * Memoized date parsing for high-velocity rendering clusters.
   */
  const formattedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      displayDate: new Date(item.date)
        .toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
        .toUpperCase(),
    }));
  }, [data]);

  const totalAcquired = data.reduce((acc, curr) => acc + curr.new, 0);

  return (
    <div
      className={cn(
        "relative flex flex-col min-h-[380px] md:h-[450px] w-full p-5 md:p-8 lg:p-10",
        "rounded-2xl md:rounded-[3rem] border border-border/10 bg-card/40 backdrop-blur-3xl",
        "shadow-2xl overflow-hidden group animate-in fade-in duration-1000",
        className
      )}
    >
      {/* --- INSTITUTIONAL HEADER --- */}
      <div className="flex flex-row justify-between items-start mb-6 md:mb-10 relative z-10">
        <div className="space-y-1 md:space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 italic opacity-40">
            <Activity className="h-3 w-3 text-primary animate-pulse shrink-0" />
            <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] truncate">
              Growth Flux // 30D
            </h3>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none truncate">
            User <span className="text-primary">Acquisition</span>
          </p>
        </div>

        <div className="shrink-0 ml-4 text-right">
          <div className="flex items-center justify-end gap-1.5 text-emerald-500 opacity-60 italic">
            <UserPlus className="h-2.5 w-2.5 md:h-3 md:w-3" />
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">
              Acquired
            </span>
          </div>
          <p className="text-lg md:text-xl font-black tracking-tighter italic leading-none mt-1">
            {totalAcquired.toLocaleString()}
          </p>
        </div>
      </div>

      {/* --- CHART INTERFACE --- */}
      <div className="flex-1 w-full min-h-[220px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="hsl(var(--border))"
              strokeOpacity={0.1}
            />

            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "hsl(var(--muted-foreground))",
                fontSize: 8,
                fontWeight: 900,
                opacity: 0.5
              }}
              dy={15}
              minTickGap={25}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "hsl(var(--muted-foreground))",
                fontSize: 8,
                fontWeight: 900,
                opacity: 0.5
              }}
              dx={-5}
            />

            <Tooltip
              cursor={{ fill: "hsl(var(--primary))", opacity: 0.05 }}
              contentStyle={{
                backgroundColor: "rgba(var(--card), 0.8)",
                border: "1px solid rgba(var(--border), 0.2)",
                borderRadius: "16px",
                padding: "12px",
                backdropFilter: "blur(16px)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
              labelStyle={{
                fontWeight: "900",
                marginBottom: "6px",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "hsl(var(--muted-foreground))",
                opacity: 0.5
              }}
              itemStyle={{
                fontSize: "9px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                padding: "1px 0",
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={6}
              wrapperStyle={{
                paddingBottom: "20px",
                fontSize: "8px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                opacity: 0.4,
              }}
            />

            <Bar
              dataKey="new"
              name="Acquired"
              fill="hsl(var(--primary))"
              radius={[2, 2, 0, 0]}
              barSize={8}
              animationDuration={2000}
            />
            <Bar
              dataKey="churned"
              name="Churned"
              fill="hsl(var(--rose-500))"
              radius={[2, 2, 0, 0]}
              barSize={8}
              animationDuration={2000}
              opacity={0.4}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Background Micro-Grid for tactical terminal aesthetic */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
      
      {/* System Footer Protocol */}
      <div className="mt-4 flex items-center gap-2 opacity-20 italic">
        <Zap className="h-2.5 w-2.5 text-primary" />
        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em]">Node_Expansion_Operational</span>
      </div>
    </div>
  );
}