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
import { Activity, Zap, Globe, Terminal, Activity as ActivityIcon } from 'lucide-react';
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
 * 🌊 REVENUE_WAVEFORM (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Transition | Vapour-Glass depth.
 * Logic: morphology-aware grid resolution with haptic-scrub telemetry.
 */
const RevenueChartComponent = ({ data, theme }: ChartProps) => {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware-state consumption
  const { isReady, screenSize, isMobile, safeArea } = useDeviceContext();
  
  const activeFlavor = theme || (flavor === "AMBER" ? "amber" : "emerald");
  const isStaff = activeFlavor === "amber";

  const { totalPeriodRevenue, strokeColor, stopColor } = useMemo(() => {
    return {
      totalPeriodRevenue: data.reduce((acc, curr) => acc + curr.revenue, 0),
      strokeColor: isStaff ? "#f59e0b" : "#10b981",
      stopColor: isStaff ? "#f59e0b" : "#10b981"
    };
  }, [data, isStaff]);

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return <div className="min-h-[400px] w-full bg-card/20 animate-pulse rounded-[3rem]" />;

  return (
    <div className={cn(
      "relative group flex flex-col w-full transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
      "rounded-[3rem] md:rounded-[4.5rem] border backdrop-blur-3xl shadow-apex",
      isMobile ? "p-8" : "p-10 md:p-14",
      isStaff ? "bg-amber-500/[0.04] border-amber-500/20" : "bg-card/30 border-white/5"
    )}>
      
      {/* 🌫️ VAPOUR RADIANCE: Ambient subsurface wash */}
      <div className={cn(
        "absolute -left-32 -top-32 size-80 blur-[140px] opacity-10 pointer-events-none transition-colors duration-[2000ms]",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      <Terminal className={cn(
        "absolute -bottom-10 -right-10 size-48 md:size-80 opacity-[0.015] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover:scale-110",
        isStaff ? "text-amber-500" : "text-primary"
      )} />

      {/* --- INSTITUTIONAL HEADER --- */}
      <div className="flex flex-row justify-between items-start mb-12 md:mb-20 relative z-10">
        <div className="space-y-4 min-w-0">
          <div className="flex items-center gap-4 italic opacity-40">
            {isStaff ? (
              <Globe className="size-4 text-amber-500 animate-pulse shrink-0" />
            ) : (
              <ActivityIcon className="size-4 text-primary animate-pulse shrink-0" />
            )}
            <div className="flex flex-col">
              <h3 className={cn(
                "text-[10px] font-black uppercase tracking-[0.5em] truncate leading-none",
                isStaff ? "text-amber-500" : "text-foreground"
              )}>
                {isStaff ? "Platform_Global_Vector" : "Liquidity_Flux_Telemetry"}
              </h3>
              <span className="text-[7px] font-black uppercase tracking-widest mt-1">Audit_Protocol_v16.31</span>
            </div>
          </div>
          <p className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none truncate text-foreground">
            Revenue <span className={isStaff ? "text-amber-500" : "text-primary"}>Waveform</span>
          </p>
        </div>
        
        <div className="text-right shrink-0 ml-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Period_Total</p>
          <p className={cn(
            "text-2xl md:text-4xl font-black italic tracking-tighter leading-none mt-2 tabular-nums",
            isStaff ? "text-amber-500" : "text-foreground"
          )}>
            ${totalPeriodRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      
      {/* --- CHART INTERFACE: Kinetic Membrane --- */}
      <div className="flex-1 w-full min-h-[300px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data} 
            margin={{ top: 10, right: 10, left: isMobile ? -30 : -10, bottom: 0 }}
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
              strokeDasharray="12 12" 
              vertical={false} 
              stroke="currentColor" 
              className="text-white/[0.03]"
            />
            
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              hide={screenSize === 'xs'}
              tick={{ fontSize: 9, fontWeight: 900, fill: 'currentColor', opacity: 0.15, letterSpacing: '0.2em' }}
              dy={20}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 900, fill: 'currentColor', opacity: 0.15 }}
              tickFormatter={(v) => `$${v}`}
              dx={-10}
            />
            
            <Tooltip 
              cursor={{ stroke: strokeColor, strokeWidth: 2, strokeDasharray: '6 6' }}
              contentStyle={{ 
                backgroundColor: 'rgba(5, 5, 5, 0.9)', 
                borderColor: isStaff ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                borderWidth: '1px',
                padding: '20px',
                backdropFilter: 'blur(30px)',
                boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.9)'
              }}
              itemStyle={{
                fontSize: '12px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                fontStyle: 'italic',
                color: strokeColor
              }}
            />
            
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke={strokeColor} 
              strokeWidth={isMobile ? 3 : 5}
              fillOpacity={1} 
              fill="url(#colorRev)" 
              animationDuration={2500}
              animationEasing="cubic-bezier(0.2, 0.8, 0.2, 1)"
              activeDot={{ 
                r: isMobile ? 6 : 8, 
                strokeWidth: 0, 
                fill: strokeColor,
                className: "animate-pulse" 
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* --- TELEMETRY FOOTER --- */}
      <div className="mt-12 flex items-center justify-between opacity-20 italic relative z-10">
        <div className="flex items-center gap-4">
          <Zap className={cn("size-4", isStaff && "text-amber-500 animate-pulse")} />
          <div className="flex flex-col">
             <span className="text-[9px] font-black uppercase tracking-[0.5em]">
               {isStaff ? "Universal_Oversight_Sync_Active" : "Telemetry_Node_Operational"}
             </span>
             <span className="text-[7px] font-black uppercase tracking-widest mt-1">Institutional_Liquidity_Grid_v16.31</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Activity className="size-3 animate-pulse text-primary" />
          <span className="text-[8px] font-mono tabular-nums">[30D_CYCLE_MESH]</span>
        </div>
      </div>
    </div>
  );
};

export const RevenueChart = React.memo(RevenueChartComponent);