"use client";

import * as React from "react";
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
import { Activity, UserPlus, Zap, Globe, Terminal } from "lucide-react";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface SubscribersChartProps {
  data: { date: string; new: number; churned: number }[];
  className?: string;
  theme?: "emerald" | "amber";
}

/**
 * 🌊 FLUID GROWTH TELEMETRY (Institutional v16.16.12)
 * Logic: Haptic-synced data scrubbing with 700ms momentum.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
export function SubscribersChart({ data, className, theme }: SubscribersChartProps) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  const activeFlavor = theme || (flavor === "AMBER" ? "amber" : "emerald");
  const isStaff = activeFlavor === "amber";

  const formattedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      displayDate: new Date(item.date)
        .toLocaleDateString("en-US", { month: "short", day: "numeric" })
        .toUpperCase(),
    }));
  }, [data]);

  const totalAcquired = useMemo(() => 
    data.reduce((acc, curr) => acc + curr.new, 0), 
  [data]);
  
  const primaryBarColor = isStaff ? "#f59e0b" : "#10b981";
  const churnBarColor = "#f43f5e"; // Rose-500 Institutional Standard for Loss

  return (
    <div className={cn(
      "relative group flex flex-col min-h-[400px] md:h-[480px] w-full p-8 md:p-12",
      "rounded-[3rem] border backdrop-blur-3xl shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
      isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-card/30 border-white/5 shadow-black/20",
      className
    )}>
      
      {/* 🌊 AMBIENT RADIANCE: Subsurface Energy Glow */}
      <div className={cn(
        "absolute -left-32 -top-32 size-64 blur-[120px] opacity-15 pointer-events-none transition-colors duration-1000",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- INSTITUTIONAL HEADER --- */}
      <div className="flex flex-row justify-between items-start mb-10 md:mb-14 relative z-10">
        <div className="space-y-3 min-w-0">
          <div className="flex items-center gap-3 italic opacity-40">
            {isStaff ? (
              <Globe className="size-4 text-amber-500 animate-pulse shrink-0" />
            ) : (
              <Activity className="size-4 text-primary animate-pulse shrink-0" />
            )}
            <h3 className={cn(
              "text-[10px] font-black uppercase tracking-[0.4em] truncate",
              isStaff ? "text-amber-500" : "text-foreground"
            )}>
              {isStaff ? "Global_Expansion_Vector" : "Growth_Flux_Telemetry"}
            </h3>
          </div>
          <p className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-none truncate text-foreground">
            User <span className={isStaff ? "text-amber-500" : "text-primary"}>Acquisition</span>
          </p>
        </div>

        <div className="shrink-0 ml-4 text-right">
          <div className={cn(
            "flex items-center justify-end gap-2 opacity-30 italic",
            isStaff ? "text-amber-500" : "text-emerald-500"
          )}>
            <UserPlus className="size-3.5" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">
              Acquired
            </span>
          </div>
          <p className={cn(
            "text-2xl md:text-3xl font-black tracking-tighter italic leading-none mt-2",
            isStaff ? "text-amber-500" : "text-foreground"
          )}>
            {totalAcquired.toLocaleString()}
          </p>
        </div>
      </div>

      {/* --- CHART INTERFACE --- */}
      <div className="flex-1 w-full min-h-[250px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={6}
            onMouseMove={(state) => {
              if (state.activeTooltipIndex !== undefined) impact("light");
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="8 8"
              stroke="currentColor"
              className="text-white/5"
            />

            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 900, fill: 'currentColor', opacity: 0.2 }}
              dy={20}
              minTickGap={25}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 900, fill: 'currentColor', opacity: 0.2 }}
              dx={-10}
            />

            <Tooltip
              cursor={{ fill: primaryBarColor, opacity: 0.05 }}
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 10, 0.95)', 
                borderColor: isStaff ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '16px',
                backdropFilter: 'blur(24px)',
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
              }}
              labelStyle={{
                fontWeight: "900",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "rgba(255, 255, 255, 0.3)",
                marginBottom: "8px"
              }}
              itemStyle={{
                fontSize: "11px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontStyle: "italic",
                padding: "2px 0",
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                paddingBottom: "30px",
                fontSize: "9px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                opacity: 0.3,
                fontStyle: "italic"
              }}
            />

            <Bar
              dataKey="new"
              name="Acquired"
              fill={primaryBarColor}
              radius={[4, 4, 0, 0]}
              barSize={10}
              animationDuration={2500}
              animationEasing="cubic-bezier(0.4, 0, 0.2, 1)"
            />
            <Bar
              dataKey="churned"
              name="Churned"
              fill={churnBarColor}
              radius={[4, 4, 0, 0]}
              barSize={10}
              animationDuration={2500}
              animationEasing="cubic-bezier(0.4, 0, 0.2, 1)"
              opacity={0.3}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Institutional Footer */}
      <div className="mt-8 flex items-center justify-between opacity-30 italic">
        <div className="flex items-center gap-3">
          <Zap className={cn("size-3.5", isStaff && "text-amber-500 animate-pulse")} />
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em]">
            {isStaff ? "Universal_Oversight_Sync_Active" : "Node_Expansion_Operational"}
          </span>
        </div>
        <span className="text-[8px] font-mono">[30D_CYCLE]</span>
      </div>
    </div>
  );
}