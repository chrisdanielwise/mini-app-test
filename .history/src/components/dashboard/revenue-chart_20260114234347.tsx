"use client";

import * as React from 'react';
import { useMemo } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { Activity, Zap, Globe, Terminal } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface ChartProps {
  data: {
    date: string;
    revenue: number;
  }[];
  theme?: "emerald" | "amber";
}

/**
 * 🌊 FLUID REVENUE TELEMETRY (Institutional v16.16.12)
 * Logic: Haptic-synced data scrubbing with 700ms momentum.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
const RevenueChartComponent = ({ data, theme }: ChartProps) => {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  const activeFlavor = theme || (flavor === "AMBER" ? "amber" : "emerald");
  const isStaff = activeFlavor === "amber";

  const { totalPeriodRevenue, strokeColor, stopColor } = useMemo(() => {
    return {
      totalPeriodRevenue: data.reduce((acc, curr) => acc + curr.revenue, 0),
      strokeColor: isStaff ? "#f59e0b" : "#10b981",
      stopColor: isStaff ? "#f59e0b" : "#10b981"
    };
  }, [data, isStaff]);

  return (
    <div className={cn(
      "relative group flex flex-col min-h-[400px] md:h-[480px] w-full p-8 md:p-12",
      "rounded-[3rem] border backdrop-blur-3xl shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
      isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-card/30 border-white/5 shadow-black/20"
    )}>
      
      {/* 🌊 AMBIENT RADIANCE: Subsurface Energy Glow */}
      <div className={cn(
        "absolute -left-32 -top-32 size-64 blur-[120px] opacity-15 pointer-events-none transition-colors duration-1000",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      <Terminal className={cn(
        "absolute -bottom-10 -right-10 size-48 md:size-64 opacity-[0.02] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover:scale-110",
        isStaff ? "text-amber-500" : "text-primary"
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
              {isStaff ? "Platform_Global_Vector" : "Liquidity_Flux_Telemetry"}
            </h3>
          </div>
          <p className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-none truncate text-foreground">
            Revenue <span className={isStaff ? "text-amber-500" : "text-primary"}>Waveform</span>
          </p>
        </div>
        
        <div className="text-right shrink-0 ml-4">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">Period_Total</p>
          <p className={cn(
            "text-2xl md:text-3xl font-black italic tracking-tighter leading-none mt-2",
            isStaff ? "text-amber-500" : "text-foreground"
          )}>
            ${totalPeriodRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      
      {/* --- CHART INTERFACE --- */}
      <div className="flex-1 w-full min-h-[250px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onMouseMove={(state) => {
              if (state.activeTooltipIndex) impact("light");
            }}
          >
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stopColor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={stopColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="8 8" 
              vertical={false} 
              stroke="currentColor" 
              className="text-white/5"
            />
            
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 900, fill: 'currentColor', opacity: 0.2 }}
              dy={20}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 900, fill: 'currentColor', opacity: 0.2 }}
              tickFormatter={(v) => `$${v}`}
              dx={-10}
            />
            
            <Tooltip 
              cursor={{ stroke: strokeColor, strokeWidth: 1, strokeDasharray: '4 4' }}
              contentStyle={{ 
                backgroundColor: 'rgba(10, 10, 10, 0.95)', 
                borderColor: isStaff ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                borderWidth: '1px',
                padding: '16px',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
              }}
              itemStyle={{
                fontSize: '11px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontStyle: 'italic',
                color: strokeColor
              }}
            />
            
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke={strokeColor} 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorRev)" 
              animationDuration={2500}
              animationEasing="cubic-bezier(0.4, 0, 0.2, 1)"
              activeDot={{ 
                r: 6, 
                strokeWidth: 0, 
                fill: strokeColor,
                className: "animate-pulse" 
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Institutional Footer */}
      <div className="mt-8 flex items-center justify-between opacity-30 italic">
        <div className="flex items-center gap-3">
          <Zap className={cn("size-3.5", isStaff && "text-amber-500 animate-pulse")} />
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em]">
            {isStaff ? "Universal_Oversight_Sync_Active" : "Telemetry_Node_Operational"}
          </span>
        </div>
        <span className="text-[8px] font-mono">[30D_CYCLE]</span>
      </div>
    </div>
  );
};

export const RevenueChart = React.memo(RevenueChartComponent);