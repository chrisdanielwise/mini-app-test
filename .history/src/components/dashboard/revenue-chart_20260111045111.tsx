"use client";

import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { TrendingUp, Activity, Zap } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ChartProps {
  data: {
    date: string;
    revenue: number;
  }[];
}

/**
 * 💹 REVENUE TELEMETRY NODE (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Fixed: Responsive scaling for financial vectors to eliminate clipping on mobile.
 */
export function RevenueChart({ data }: ChartProps) {
  const totalPeriodRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="relative flex flex-col min-h-[350px] md:h-[450px] w-full p-5 md:p-10 rounded-2xl md:rounded-[3rem] border border-border/10 bg-card/40 backdrop-blur-3xl shadow-2xl overflow-hidden group animate-in fade-in duration-1000">
      
      {/* --- INSTITUTIONAL HEADER --- */}
      <div className="flex flex-row justify-between items-start mb-6 md:mb-10 relative z-10">
        <div className="space-y-1 md:space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 italic opacity-40">
            <Activity className="h-3 w-3 text-primary animate-pulse shrink-0" />
            <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] truncate">
              Liquidity Flux // 30D
            </h3>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none truncate">
            Revenue <span className="text-primary">Vector</span>
          </p>
        </div>
        
        <div className="text-right shrink-0 ml-4">
          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-30 italic">Period Total</p>
          <p className="text-lg md:text-xl font-black italic tracking-tight text-primary leading-none mt-1">
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
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="4 4" 
              vertical={false} 
              stroke="hsl(var(--border))" 
              opacity={0.1} 
            />
            
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 8, fontWeight: 900, fill: 'hsl(var(--muted-foreground))', opacity: 0.5 }}
              dy={15}
              minTickGap={20}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 8, fontWeight: 900, fill: 'hsl(var(--muted-foreground))', opacity: 0.5 }}
              tickFormatter={(value) => `$${value}`}
              dx={-5}
            />
            
            <Tooltip 
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '6 6' }}
              contentStyle={{ 
                backgroundColor: 'rgba(var(--card), 0.8)', 
                borderColor: 'rgba(var(--border), 0.2)',
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
                color: 'hsl(var(--primary))'
              }}
              labelStyle={{
                fontSize: '8px',
                fontWeight: 'bold',
                marginBottom: '4px',
                opacity: 0.4,
                textTransform: 'uppercase'
              }}
            />
            
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRev)" 
              animationDuration={2500}
              activeDot={{ 
                r: 5, 
                strokeWidth: 0, 
                fill: 'hsl(var(--primary))',
                className: "animate-pulse" 
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Background Terminal Micro-Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
      
      {/* System Footer */}
      <div className="mt-4 flex items-center gap-2 opacity-20 italic">
        <Zap className="h-2.5 w-2.5" />
        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em]">Node_History_Operational</span>
      </div>
    </div>
  );
}