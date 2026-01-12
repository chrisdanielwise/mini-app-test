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
import { Activity, UserPlus, Zap, Globe } from "lucide-react";
import { useLayout } from "@/context/layout-provider";

interface SubscribersChartProps {
  data: { date: string; new: number; churned: number }[];
  className?: string;
  theme?: "emerald" | "amber"; // 🛡️ Role-based theme override
}

/**
 * 🛰️ SUBSCRIBER TELEMETRY NODE
 * Logic: Synchronized with Theme Flavors (Amber for Staff, Emerald for Merchants).
 * Adaptive: Bar geometry and color vectors shift based on operator clearance.
 */
export function SubscribersChart({ data, className, theme }: SubscribersChartProps) {
  const { flavor } = useLayout();
  
  // Logic: Priority to explicit theme prop, fallback to global layout flavor
  const activeFlavor = theme || (flavor === "AMBER" ? "amber" : "emerald");
  const isStaff = activeFlavor === "amber";

  /** 🏁 DATA HYDRATION SYNC */
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
  
  // Institutional Color Mapping
  const primaryBarColor = isStaff ? "#f59e0b" : "#10b981";
  const churnBarColor = "#ef4444"; // Consistent Rose-500 for Churn/Loss

  return (
    <div
      className={cn(
        "relative flex flex-col min-h-[380px] md:h-[450px] w-full p-5 md:p-8 lg:p-10",
        "rounded-2xl md:rounded-[3rem] border backdrop-blur-3xl shadow-2xl overflow-hidden group animate-in fade-in duration-1000",
        isStaff ? "bg-amber-500/[0.03] border-amber-500/20" : "bg-card/40 border-border/10",
        className
      )}
    >
      {/* --- INSTITUTIONAL HEADER --- */}
      <div className="flex flex-row justify-between items-start mb-6 md:mb-10 relative z-10">
        <div className="space-y-1 md:space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 italic opacity-40">
            {isStaff ? (
              <Globe className="h-3 w-3 text-amber-500 animate-pulse shrink-0" />
            ) : (
              <Activity className="h-3 w-3 text-primary animate-pulse shrink-0" />
            )}
            <h3 className={cn(
              "text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] truncate",
              isStaff ? "text-amber-500" : "text-muted-foreground"
            )}>
              {isStaff ? "Global_Expansion_Vector" : "Growth Flux // 30D"}
            </h3>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none truncate text-foreground">
            User <span className={isStaff ? "text-amber-500" : "text-primary"}>Acquisition</span>
          </p>
        </div>

        <div className="shrink-0 ml-4 text-right">
          <div className={cn(
            "flex items-center justify-end gap-1.5 opacity-60 italic",
            isStaff ? "text-amber-500" : "text-emerald-500"
          )}>
            <UserPlus className="h-2.5 w-2.5 md:h-3 md:w-3" />
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">
              Acquired
            </span>
          </div>
          <p className={cn(
            "text-lg md:text-xl font-black tracking-tighter italic leading-none mt-1",
            isStaff ? "text-amber-500" : "text-foreground"
          )}>
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
              cursor={{ fill: primaryBarColor, opacity: 0.05 }}
              contentStyle={{
                backgroundColor: "rgba(var(--card), 0.8)",
                border: isStaff ? "1px solid rgba(245, 158, 11, 0.2)" : "1px solid rgba(var(--border), 0.2)",
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
              fill={primaryBarColor}
              radius={[2, 2, 0, 0]}
              barSize={8}
              animationDuration={2000}
            />
            <Bar
              dataKey="churned"
              name="Churned"
              fill={churnBarColor}
              radius={[2, 2, 0, 0]}
              barSize={8}
              animationDuration={2000}
              opacity={0.4}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* System Footer Protocol */}
      <div className="mt-4 flex items-center gap-2 opacity-20 italic">
        <Zap className={cn("h-2.5 w-2.5", isStaff && "text-amber-500")} />
        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-foreground">
          {isStaff ? "Universal_Oversight_Sync_Active" : "Node_Expansion_Operational"}
        </span>
      </div>
    </div>
  );
}