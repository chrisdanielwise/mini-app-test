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
 * 🛰️ SPARKLINE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Minimalist Vector Pathing.
 * Fix: Standardized h-8 profile prevents row height blowout in ledgers.
 */
export function Sparkline({ data, color, className, trend }: SparklineProps) {
  const { isReady, isMobile } = useDeviceContext();

  // 🛡️ ROLE-BASED CHROMA TOPOLOGY
  const strokeColor = React.useMemo(() => {
    if (color) return color;
    switch (trend) {
      case "UP": return "#10b981";    // Emerald (Growth)
      case "DOWN": return "#f43f5e";  // Rose (Correction)
      default: return "#3f3f46";      // Zinc (Stationary)
    }
  }, [color, trend]);

  const filterId = React.useId().replace(/:/g, "");

  if (!isReady) return <div className="h-6 w-full bg-white/5 animate-pulse rounded-md" />;

  return (
    <div className={cn(
      "h-6 md:h-8 w-full min-w-[100px] transition-all duration-700 ease-out",
      "animate-in fade-in slide-in-from-right-2",
      className
    )}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            {/* 🌫️ TACTICAL GLOW: Compressed radiance profile */}
            <filter id={`glow-${filterId}`} x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation={isMobile ? "0.8" : "1.2"} result="blur" />
              <feFlood floodColor={strokeColor} floodOpacity="0.2" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
          
          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
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