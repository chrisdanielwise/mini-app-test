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
import { Activity, UserPlus, Zap, Globe, BarChart3 } from "lucide-react";
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
 * 🛰️ GROWTH_TELEMETRY (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: Morphology-aware bars (size 6 vs 8) prevent "smearing" on mobile.
 */
export function SubscribersChart({ data, className, theme }: SubscribersChartProps) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
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
  const churnBarColor = "#f43f5e"; 

  const handleScrub = useCallback(() => impact("light"), [impact]);

  // 🛡️ HYDRATION_SHIELD: Prevents "Bogus" layout snaps during mobile ingress
  if (!isReady) return (
    <div className="h-[320px] md:h-[420px] w-full bg-white/[0.02] border border-white/5 animate-pulse rounded-2xl" />
  );

  return (
    <div className={cn(
      "relative group flex flex-col w-full transition-all duration-700 shadow-2xl",
      "rounded-3xl border backdrop-blur-3xl overflow-hidden",
      "h-[320px] md:h-[420px]", 
      isMobile ? "p-6" : "p-7 md:p-8", 
      isStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/40 border-white/5",
      className
    )}>
      
      {/* 🌫️ VAPOUR RADIANCE: Ambient status wash */}
      <div className={cn(
        "absolute -left-24 -top-24 size-48 blur-[100px] opacity-10 pointer-events-none transition-all duration-1000",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- 🛡️ FIXED HUD: Strategic Header --- */}
      <div className="flex flex-row justify-between items-start mb-6 md:mb-8 relative z-10 leading-none">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2.5 italic opacity-30">
            {isStaff ? (
              <Globe className="size-3 text-amber-500 animate-pulse shrink-0" />
            ) : (
              <Activity className="size-3 text-primary animate-pulse shrink-0" />
            )}
            <h3 className={cn(
              "text-[7.5px] md:text-[8px] font-black uppercase tracking-[0.3em] truncate",
              isStaff ? "text-amber-500" : "text-foreground"
            )}>
              {isStaff ? "Global_Expansion_Vector" : "Growth_Telemetry // 30D"}
            </h3>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground truncate">
            User <span className={isStaff ? "text-amber-500" : "text-primary"}>Acquisition</span>
          </p>
        </div>

        <div className="shrink-0 text-right p-3 rounded-xl bg-white/[0.01] border border-white/5">
          <div className={cn("flex items-center gap-1.5 opacity-30 mb-1 justify-end", isStaff ? "text-amber-500" : "text-emerald-500")}>
            <UserPlus className="size-2.5" />
            <span className="text-[6.5px] font-black uppercase tracking-[0.2em]">Acquired</span>
          </div>
          <p className={cn(
            "text-lg md:text-2xl font-black italic tracking-tighter tabular-nums",
            isStaff ? "text-amber-500" : "text-foreground"
          )}>
            {totalAcquired.toLocaleString()}
          </p>
        </div>
      </div>

      {/* --- CHART INTERFACE: Compressed Volume --- */}
      <div className="flex-1 w-full relative z-10 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 5, right: 0, left: -25, bottom: 0 }}
            barGap={4}
            onMouseMove={(state) => {
              if (state.activeTooltipIndex !== undefined) handleScrub();
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="8 8" stroke="currentColor" className="text-white/[0.02]" />

            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              hide={screenSize === 'xs'}
              tick={{ fontSize: 7, fontWeight: 900, fill: 'currentColor', opacity: 0.1, letterSpacing: '0.1em' }}
              dy={10}
            />

            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 7, fontWeight: 900, fill: 'currentColor', opacity: 0.1 }} dx={-5} />

            <Tooltip
              cursor={{ fill: primaryBarColor, opacity: 0.02 }}
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.95)', 
                borderColor: isStaff ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '10px 14px',
                backdropFilter: 'blur(10px)',
              }}
              labelStyle={{ fontWeight: "900", fontSize: "8px", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.2)", marginBottom: "4px" }}
              itemStyle={{ fontSize: "9px", fontWeight: "900", textTransform: "uppercase", padding: "2px 0" }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={6}
              wrapperStyle={{ paddingBottom: "20px", fontSize: "7px", fontWeight: "900", textTransform: "uppercase", opacity: 0.2, fontStyle: "italic" }}
            />

            <Bar dataKey="new" name="Acquired" fill={primaryBarColor} radius={[2, 2, 0, 0]} barSize={isMobile ? 6 : 8} animationDuration={1500} />
            <Bar dataKey="churned" name="Churned" fill={churnBarColor} radius={[2, 2, 0, 0]} barSize={isMobile ? 6 : 8} opacity={0.2} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* --- TACTICAL FOOTER: System Status --- */}
      <div className="mt-6 flex items-center justify-between opacity-10 italic relative z-10 border-t border-white/5 pt-4">
        <div className="flex items-center gap-2">
          <Zap className={cn("size-3", isStaff && "text-amber-500 animate-pulse")} />
          <span className="text-[7px] font-black uppercase tracking-[0.3em]">{isStaff ? "Universal_Oversight_Active" : "Node_Growth_Sync_Ok"}</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="size-2.5" />
          <span className="text-[6.5px] font-mono">[v16.31_STABLE]</span>
        </div>
      </div>
    </div>
  );
}