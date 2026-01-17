"use client";

import * as React from "react";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";

interface SparklineProps {
  data: { value: number }[];
  color?: string;
  className?: string;
  trend?: "UP" | "DOWN" | "NEUTRAL";
}

/**
 * 🌊 SPARKLINE_NODE (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Pathing | Vapour-Glass Radiance.
 * Logic: Low-latency directional telemetry with hardware-safe ingress.
 */
export function Sparkline({ data, color, className, trend }: SparklineProps) {
  const { isReady, isMobile } = useDeviceContext();

  // 🛡️ INSTITUTIONAL COLOR TOPOLOGY
  const strokeColor = React.useMemo(() => {
    if (color) return color;
    switch (trend) {
      case "UP": return "#10b981";    // Emerald_500 (Growth)
      case "DOWN": return "#f43f5e";  // Rose_500 (Latency/Drop)
      default: return "#64748b";      // Slate_500 (Stable)
    }
  }, [color, trend]);

  // 🧪 LAMINAR ID: Unique filter ID to prevent SVG collision in grid
  const filterId = React.useId().replace(/:/g, "");

  if (!isReady) return <div className="h-10 w-full bg-white/5 animate-pulse rounded-full" />;

  return (
    <div className={cn(
      "h-10 w-full min-w-[120px] transition-all duration-1000 ease-out",
      "animate-in fade-in slide-in-from-right-4",
      className
    )}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            {/* 🌫️ VAPOUR GLOW: Subsurface vector radiance */}
            <filter id={`glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation={isMobile ? "1.5" : "2.5"} result="blur" />
              <feFlood floodColor={strokeColor} floodOpacity="0.4" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
          
          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={isMobile ? 1.5 : 2}
            dot={false}
            isAnimationActive={true}
            animationDuration={2500}
            animationEasing="cubic-bezier(0.2, 0.8, 0.2, 1)"
            strokeLinecap="round"
            style={{
              filter: `url(#glow-${filterId})`,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}