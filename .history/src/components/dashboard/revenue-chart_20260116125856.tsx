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
import { Zap, Globe, Terminal, Activity as ActivityIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface ChartProps {
  data: {
    date: string;
    revenue: number;
  }[];
  theme?: "emerald" | "amber";
}

/**
 * 🛰️ REVENUE_CHART (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: Reduced height (h-420) and high-density padding (p-7) prevents blowout.
 */
const RevenueChartComponent = ({ data, theme }: ChartProps) => {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, screenSize, isMobile } = useDeviceContext();
  
  const activeFlavor = theme || (flavor === "AMBER" ? "amber" : "emerald");
  const isStaff = activeFlavor === "amber";

  const { totalPeriodRevenue, strokeColor, stopColor } = useMemo(() => ({
    totalPeriodRevenue: data.reduce((acc, curr) => acc + curr.revenue, 0),
    strokeColor: isStaff ? "#f59e0b" : "#10b981",
    stopColor: isStaff ? "#f59e0b" : "#10b981"
  }), [data, isStaff]);

  // 🛡️ HYDRATION SHIELD: Prevents the "Bogus" layout snap
  if (!isReady) return <div className="h-[320px] md:h-[420px] w-full bg-card/10 animate-pulse rounded-2xl border border-white/5" />;

  return (
    <div className={cn(
      "relative group flex flex-col w-full transition-all duration-700 shadow-2xl",
      "rounded-3xl border backdrop-blur-3xl overflow-hidden",
      "h-[320px] md:h-[420px]", // Reduced h-500 -> h-420
      isMobile ? "p-6" : "p-7 md:p-8", // Reduced p-14 -> p-8
      isStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/40 border-white/5"
    )}>
      
      {/* 🌫️ VAPOUR RADIANCE */}
      <div className={cn(
        "absolute -left-24 -top-24 size-48 blur-[100px] opacity-10 pointer-events-none transition-all duration-1000",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Header --- */}
      <div className="flex flex-row justify-between items-start mb-6 md:mb-8 relative z-10 leading-none">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2.5 italic opacity-30">
            {isStaff ? (
              <Globe className="size-3 text-amber-500 animate-pulse shrink-0" />
            ) : (
              <ActivityIcon className="size-3 text-primary animate-pulse shrink-0" />
            )}
            <div className="flex flex-col">
              <h3 className={cn(
                "text-[7.5px] font-black uppercase tracking-[0.4em] truncate",
                isStaff ? "text-amber-500" : "text-foreground"
              )}>
                {isStaff ? "Global_Vector" : "Flux_Telemetry"}
              </h3>
            </div>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground truncate">
            Revenue <span className={isStaff ? "text-amber-500" : "text-primary"}>Waveform</span>
          </p>
        </div>
        
        <div className="text-right shrink-0 ml-4 p-3 rounded-xl bg-white/[0.01] border border-white/5">
          <p className="text-[6.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Total</p>
          <p className={cn(
            "text-lg md:text-2xl font-black italic tracking-tighter mt-1 tabular-nums",
            isStaff ? "text-amber-500" : "text-foreground"
          )}>
            ${totalPeriodRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      
      {/* --- CHART INTERFACE: Compressed Volume --- */}
      <div className="flex-1 w-full relative z-10 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data} 
            margin={{ top: 5, right: 0, left: -25, bottom: 0 }}
            onMouseMove={(state) => { if (state.activeTooltipIndex) impact("light"); }}
          >
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stopColor} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={stopColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="currentColor" className="text-white/[0.02]" />
            <XAxis dataKey="date" hide={screenSize === 'xs'} axisLine={false} tickLine={false} tick={{ fontSize: 7, fontWeight: 900, fill: 'currentColor', opacity: 0.1, letterSpacing: '0.1em' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 7, fontWeight: 900, fill: 'currentColor', opacity: 0.1 }} tickFormatter={(v) => `$${v}`} dx={-5} />
            <Tooltip 
              cursor={{ stroke: strokeColor, strokeWidth: 1.5, strokeDasharray: '4 4' }}
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                borderColor: isStaff ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '10px 14px',
                backdropFilter: 'blur(10px)',
              }}
              itemStyle={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic', color: strokeColor }}
            />
            <Area type="monotone" dataKey="revenue" stroke={strokeColor} strokeWidth={isMobile ? 2 : 3} fillOpacity={1} fill="url(#colorRev)" animationDuration={1500} animationEasing="ease-out" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* --- TACTICAL FOOTER --- */}
      <div className="mt-6 flex items-center justify-between opacity-10 italic relative z-10 border-t border-white/5 pt-4">
        <div className="flex items-center gap-2">
          <Zap className={cn("size-3", isStaff && "text-amber-500 animate-pulse")} />
          <span className="text-[7px] font-black uppercase tracking-[0.3em]">Telemetry_Operational</span>
        </div>
        <span className="text-[6.5px] font-mono tabular-nums">[v16.31_STABLE]</span>
      </div>
    </div>
  );
};

export const RevenueChart = React.memo(RevenueChartComponent);