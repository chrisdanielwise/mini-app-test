"use client";

import * as React from "react";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: { value: number }[];
  color?: string;
  className?: string;
  trend?: "UP" | "DOWN" | "NEUTRAL";
}

/**
 * 🌊 FLUID SPARKLINE NODE (Institutional v16.16.12)
 * Logic: Low-latency directional telemetry for KPI nodes.
 * Design: 1.5px hard-vector line with subsurface glow.
 */
export function Sparkline({ data, color, className, trend }: SparklineProps) {
  // 🛡️ INSTITUTIONAL COLOR MAPPING
  const strokeColor = React.useMemo(() => {
    if (color) return color;
    if (trend === "UP") return "#10b981"; // Emerald-500
    if (trend === "DOWN") return "#f43f5e"; // Rose-500
    return "#94a3b8"; // Slate-400
  }, [color, trend]);

  return (
    <div className={cn("h-10 w-full min-w-[100px] opacity-0 animate-in fade-in duration-1000 delay-300", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={true}
            animationDuration={2000}
            animationEasing="ease-in-out"
            style={{
              filter: "url(#glow)",
              dropShadow: `0 0 8px ${strokeColor}44`,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}