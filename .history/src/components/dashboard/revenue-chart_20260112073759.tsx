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
import { Activity, Zap, Globe } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";

interface ChartProps {
  data: {
    date: string;
    revenue: number;
  }[];
  theme?: "emerald" | "amber"; // 🛡️ Role-based theme override
}

/**
 * 💹 REVENUE TELEMETRY NODE (Apex Tier)
 * Hardened: Memoized reduction logic to prevent 1M-user dashboard lag.
 * Optimized: React.memo prevents re-renders during sidebar/flavor transitions.
 */
const RevenueChartComponent = ({ data, theme }: ChartProps) => {
  const { flavor } = useLayout();
  
  // 🛰️ FLAVOR PROTOCOL
  const activeFlavor = theme || (flavor === "AMBER" ? "amber" : "emerald");
  const isStaff = activeFlavor === "amber";

  // 🚀 PERFORMANCE LOCK: Memoize expensive math and color mapping
  const { totalPeriodRevenue, strokeColor, stopColor } = useMemo(() => {
    return {
      totalPeriodRevenue: data.reduce((acc, curr) => acc + curr.revenue, 0),
      strokeColor: isStaff ? "#f59e0b" : "#10b981",
      stopColor: isStaff ? "#f59e0b" : "#10b981"
    };
  }, [data, isStaff]);

  return (
    <div className={cn(
      "relative flex flex-col min-h-[350px] md:h-[450px] w-full p-5 md:p-10 rounded-2xl md:rounded-[3rem] border backdrop-blur-3xl shadow-2xl overflow-hidden group animate-in fade-in duration-1000 transition-colors duration-700",
      isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-card/40 border-border/10"
    )}>
      
      {/* --- INSTITUTIONAL HEADER --- */}
      <div className="flex flex-row justify-between items-start mb-6 md:mb-10 relative z-10">
        <div className="space-y-1 md:space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 italic opacity-40">
            {isStaff ? (
              <Globe className="h-3 w-3 text-amber-500 animate-pulse shrink-0" />
            ) : (
              <Activity className="h-3 w-3 text-primary animate-pulse shrink-0" />
            )}
            <h3 className={cn(
              "text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] truncate",
              isStaff ? "text-amber-500" : "text-primary"
            )}>
              {isStaff ? "Global_Financial_Vector" : "Liquidity Flux // 30D"}
            </h3>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none truncate text-foreground">
            Revenue <span className={isStaff ? "text-amber-500" : "text-primary"}>Vector</span>
          </p>
        </div>
        
        <div className="text-right shrink-0 ml-4">
          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-30 italic">Period Total</p>
          <p className={cn(
            "text-lg md:text-xl font-black italic tracking-tight leading-none mt-1",
            isStaff ? "text-amber-500" : "text-primary"
          )}>
            ${totalPeriodRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      
      {/* --- CHART INTERFACE --- */}
      <div className="flex-1 w-full min-h-[200px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stopColor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={stopColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="4 4" 
              vertical={false} 
              stroke="currentColor" 
              className="text-border/10"
            />
            
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 8, fontWeight: 900, fill: 'currentColor', opacity: 0.3 }}
              dy={15}
              minTickGap={20}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 8, fontWeight: 900, fill: 'currentColor', opacity: 0.3 }}
              tickFormatter={(value) => `$${value}`}
              dx={-5}
            />
            
            <Tooltip 
              cursor={{ stroke: strokeColor, strokeWidth: 1, strokeDasharray: '6 6' }}
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                borderColor: isStaff ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                borderRadius: '16px',
                borderWidth: '1px',
                padding: '12px',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{
                fontSize: '10px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: strokeColor
              }}
            />
            
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke={strokeColor} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRev)" 
              animationDuration={2500}
              activeDot={{ 
                r: 5, 
                strokeWidth: 0, 
                fill: strokeColor,
                className: "animate-pulse" 
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* System Footer */}
      <div className="mt-4 flex items-center gap-2 opacity-20 italic">
        <Zap className={cn("h-2.5 w-2.5", isStaff && "text-amber-500")} />
        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-foreground">
          {isStaff ? "Universal_Oversight_Sync_Active" : "Node_History_Operational"}
        </span>
      </div>
    </div>
  );
};

// 🛡️ INSTITUTIONAL CACHING
export const RevenueChart = React.memo(RevenueChartComponent);