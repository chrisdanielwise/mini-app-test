"use client";

import React, { useMemo } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { Activity, Globe, TrendingUp } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// 🏛️ Institutional Contexts
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface ChartProps {
  data: any[]; // Changed to any[] to handle varied SQL output
  theme?: "emerald" | "amber";
}

const RevenueChartComponent = ({ data = [], theme }: ChartProps) => {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, isMobile, screenSize } = useDeviceContext();
  
  const activeFlavor = theme || (flavor === "AMBER" ? "amber" : "emerald");
  const isStaff = activeFlavor === "amber";

  /**
   * 🧹 DATA_NORMALIZATION
   * Fix: Maps SQL 'amount' or 'total' to the 'revenue' key required by the Waveform.
   * Fix: Formats ISO dates into human-readable tactical strings.
   */
  const normalizedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      // Logic: Prioritize 'revenue', fallback to 'amount', then 'total'.
      revenue: parseFloat(item.revenue || item.amount || item.total || 0),
      displayDate: item.date ? format(new Date(item.date), "MMM dd") : "N/A"
    }));
  }, [data]);

  const { totalPeriodRevenue, strokeColor, stopColor } = useMemo(() => ({
    totalPeriodRevenue: normalizedData.reduce((acc, curr) => acc + curr.revenue, 0),
    strokeColor: isStaff ? "#f59e0b" : "#10b981",
    stopColor: isStaff ? "#f59e0b" : "#10b981"
  }), [normalizedData, isStaff]);

  if (!isReady) return (
    <div className="h-[320px] md:h-[420px] w-full bg-white/[0.02] border border-white/5 animate-pulse rounded-[2rem]" />
  );

  return (
    <div className={cn(
      "relative group flex flex-col w-full transition-all duration-700 shadow-2xl",
      "rounded-[2rem] md:rounded-[3rem] border backdrop-blur-3xl overflow-hidden",
      "h-[320px] md:h-[420px]", 
      isStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/40 border-white/5",
      isMobile ? "p-6" : "p-10",
    )}>
      
      <div className={cn(
        "absolute -left-20 -top-20 size-48 blur-[100px] opacity-20 pointer-events-none transition-all duration-1000",
        isStaff ? "bg-amber-500/30" : "bg-primary/20"
      )} />

      <div className="flex flex-row justify-between items-start mb-6 md:mb-10 relative z-10">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2.5 italic opacity-30">
            {isStaff ? <Globe className="size-3 text-amber-500 animate-pulse" /> : <Activity className="size-3 text-primary animate-pulse" />}
            <h3 className="text-[7.5px] md:text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground">
              {isStaff ? "Global_Financial_Vector" : "Liquidity_Flux // 30D"}
            </h3>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground leading-none">
            Revenue <span className={isStaff ? "text-amber-500" : "text-primary"}>Waveform</span>
          </p>
        </div>
        
        <div className="text-right shrink-0 ml-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Total_Period</p>
          <p className={cn("text-lg md:text-xl font-black italic tracking-tighter tabular-nums", isStaff ? "text-amber-500" : "text-foreground")}>
            ${totalPeriodRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      
      <div className="flex-1 w-full relative z-10 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={normalizedData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stopColor} stopOpacity={0.25}/>
                <stop offset="95%" stopColor={stopColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="currentColor" className="text-white/[0.03]" />
            <XAxis 
              dataKey="displayDate" 
              hide={screenSize === 'xs'} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 7, fontWeight: 900, fill: 'currentColor', opacity: 0.1, letterSpacing: '0.1em' }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 7, fontWeight: 900, fill: 'currentColor', opacity: 0.1 }} 
              tickFormatter={(v) => `$${v}`} 
            />
            <Tooltip 
              cursor={{ stroke: strokeColor, strokeWidth: 1.5, strokeDasharray: '4 4' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-black/95 border border-white/10 rounded-xl p-3 backdrop-blur-xl shadow-2xl">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">{payload[0].payload.displayDate}</p>
                      <p className="text-xs font-black italic text-primary">${parseFloat(payload[0].value as string).toLocaleString()}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke={strokeColor} 
              strokeWidth={isMobile ? 2 : 3} 
              fillOpacity={1} 
              fill="url(#colorRev)" 
              animationDuration={1800} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex items-center justify-between opacity-10 italic border-t border-white/5 pt-4">
        <div className="flex items-center gap-2">
          <TrendingUp className={cn("size-3", isStaff && "text-amber-500 animate-pulse")} />
          <span className="text-[7px] font-black uppercase tracking-[0.4em]">Node_History_Operational</span>
        </div>
        <span className="text-[6.5px] font-mono tabular-nums">[v16.52_STABLE]</span>
      </div>
    </div>
  );
};

export const RevenueChart = React.memo(RevenueChartComponent);