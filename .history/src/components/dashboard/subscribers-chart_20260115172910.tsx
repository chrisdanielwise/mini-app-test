"use client";

import * as React from "react";
import { useMemo, useCallback } from "react";
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
import { Activity, UserPlus, Zap, Globe, Terminal, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface SubscribersChartProps {
  data: { date: string; new: number; churned: number }[];
  className?: string;
  theme?: "emerald" | "amber";
}

/**
 * 🌊 GROWTH_TELEMETRY (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Transition | Vapour-Glass depth.
 * Logic: morphology-aware grid resolution with haptic-scrub telemetry.
 */
export function SubscribersChart({ data, className, theme }: SubscribersChartProps) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware-state consumption
  const { isReady, isMobile, screenSize } = useDeviceContext();
  
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

  const handleScrub = useCallback(() => {
    impact("light");
  }, [impact]);

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <div className="min-h-[400px] w-full bg-card/20 animate-pulse rounded-[3rem] border border-white/5" />;

  return (
    <div className={cn(
      "relative group flex flex-col w-full transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
      "rounded-[3rem] md:rounded-[4.5rem] border backdrop-blur-3xl shadow-apex",
      isMobile ? "p-8" : "p-10 md:p-14",
      isStaff ? "bg-amber-500/[0.04] border-amber-500/20" : "bg-card/30 border-white/5",
      className
    )}>
      
      {/* 🌫️ VAPOUR RADIANCE: Ambient subsurface wash */}
      <div className={cn(
        "absolute -left-32 -top-32 size-80 blur-[140px] opacity-10 pointer-events-none transition-colors duration-[2000ms]",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- INSTITUTIONAL HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 md:mb-16 relative z-10 gap-6">
        <div className="space-y-4 min-w-0">
          <div className="flex items-center gap-4 italic opacity-40">
            {isStaff ? (
              <Globe className="size-4 text-amber-500 animate-pulse shrink-0" />
            ) : (
              <Activity className="size-4 text-primary animate-pulse shrink-0" />
            )}
            <div className="flex flex-col">
              <h3 className={cn(
                "text-[10px] font-black uppercase tracking-[0.4em] truncate leading-none",
                isStaff ? "text-amber-500" : "text-foreground"
              )}>
                {isStaff ? "Global_Expansion_Vector" : "Growth_Flux_Telemetry"}
              </h3>
              <span className="text-[7px] font-black uppercase tracking-widest mt-1">Audit_Protocol_v16.31</span>
            </div>
          </div>
          <p className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none truncate text-foreground">
            User <span className={isStaff ? "text-amber-500" : "text-primary"}>Acquisition</span>
          </p>
        </div>

        <div className="shrink-0 md:text-right flex md:flex-col items-center md:items-end gap-4 md:gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className={cn(
            "flex items-center gap-2 opacity-30 italic",
            isStaff ? "text-amber-500" : "text-emerald-500"
          )}>
            <UserPlus className="size-4" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">
              Acquired
            </span>
          </div>
          <p className={cn(
            "text-2xl md:text-4xl font-black tracking-tighter italic leading-none tabular-nums",
            isStaff ? "text-amber-500" : "text-foreground"
          )}>
            {totalAcquired.toLocaleString()}
          </p>
        </div>
      </div>

      {/* --- CHART INTERFACE: Kinetic Volume --- */}
      <div className="flex-1 w-full min-h-[300px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: isMobile ? -30 : -10, bottom: 0 }}
            barGap={isMobile ? 4 : 8}
            onMouseMove={(state) => {
              if (state.activeTooltipIndex !== undefined) handleScrub();
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="12 12"
              stroke="currentColor"
              className="text-white/[0.03]"
            />

            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              hide={screenSize === 'xs'}
              tick={{ fontSize: 9, fontWeight: 900, fill: 'currentColor', opacity: 0.15, letterSpacing: '0.2em' }}
              dy={20}
              minTickGap={30}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 900, fill: 'currentColor', opacity: 0.15 }}
              dx={-10}
            />

            <Tooltip
              cursor={{ fill: primaryBarColor, opacity: 0.03 }}
              contentStyle={{
                backgroundColor: 'rgba(5, 5, 5, 0.9)', 
                borderColor: isStaff ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '20px',
                backdropFilter: 'blur(30px)',
                boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.9)",
              }}
              labelStyle={{
                fontWeight: "900",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                color: "rgba(255, 255, 255, 0.3)",
                marginBottom: "12px",
                fontStyle: "italic"
              }}
              itemStyle={{
                fontSize: "12px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontStyle: "italic",
                padding: "4px 0",
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                paddingBottom: "40px",
                fontSize: "9px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.4em",
                opacity: 0.2,
                fontStyle: "italic"
              }}
            />

            <Bar
              dataKey="new"
              name="Acquired"
              fill={primaryBarColor}
              radius={[4, 4, 0, 0]}
              barSize={isMobile ? 8 : 12}
              animationDuration={2500}
              animationEasing="cubic-bezier(0.2, 0.8, 0.2, 1)"
            />
            <Bar
              dataKey="churned"
              name="Churned"
              fill={churnBarColor}
              radius={[4, 4, 0, 0]}
              barSize={isMobile ? 8 : 12}
              animationDuration={2500}
              animationEasing="cubic-bezier(0.2, 0.8, 0.2, 1)"
              opacity={0.25}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* --- TELEMETRY FOOTER --- */}
      <div className="mt-12 flex items-center justify-between opacity-20 italic relative z-10">
        <div className="flex items-center gap-4">
          <Zap className={cn("size-4", isStaff && "text-amber-500 animate-pulse")} />
          <div className="flex flex-col">
             <span className="text-[9px] font-black uppercase tracking-[0.5em]">
               {isStaff ? "Universal_Oversight_Sync_Active" : "Node_Expansion_Operational"}
             </span>
             <span className="text-[7px] font-black uppercase tracking-widest mt-1">Growth_Cycle_Oversight_v16.31</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <BarChart3 className="size-3 text-primary animate-pulse" />
          <span className="text-[8px] font-mono tabular-nums">[30D_DELTA]</span>
        </div>
      </div>
    </div>
  );
}