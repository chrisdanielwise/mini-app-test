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
import { TrendingUp, Activity } from 'lucide-react';

interface ChartProps {
  data: {
    date: string;
    revenue: number;
  }[];
}

/**
 * 💹 REVENUE TELEMETRY NODE (Tier 2)
 * High-fidelity historical visualization for institutional liquidity tracking.
 */
export function RevenueChart({ data }: ChartProps) {
  // Calculate total for center/header context if needed
  const totalPeriodRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="h-[450px] w-full p-10 rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden group animate-in fade-in duration-1000">
      
      {/* --- INSTITUTIONAL HEADER --- */}
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-primary animate-pulse" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">
              Liquidity Flux // 30D
            </h3>
          </div>
          <p className="text-2xl font-black uppercase italic tracking-tighter leading-none">
            Revenue <span className="text-primary">Vector</span>
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Period Total</p>
          <p className="text-xl font-black italic tracking-tight text-primary">
            ${totalPeriodRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      
      {/* --- CHART INTERFACE --- */}
      <ResponsiveContainer width="100%" height="75%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            opacity={0.15} 
          />
          
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fontWeight: 900, fill: 'hsl(var(--muted-foreground))', letterSpacing: '0.1em' }}
            dy={20}
            className="uppercase"
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fontWeight: 900, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `$${value}`}
            dx={-10}
          />
          
          <Tooltip 
            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '6 6' }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              borderColor: 'hsl(var(--border))',
              borderRadius: '24px',
              borderWidth: '1px',
              padding: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
            itemStyle={{
              fontSize: '11px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'hsl(var(--primary))'
            }}
            labelStyle={{
              fontSize: '9px',
              fontWeight: 'bold',
              marginBottom: '4px',
              opacity: 0.5,
              textTransform: 'uppercase'
            }}
          />
          
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="hsl(var(--primary))" 
            strokeWidth={5}
            fillOpacity={1} 
            fill="url(#colorRev)" 
            animationDuration={2500}
            activeDot={{ 
              r: 6, 
              strokeWidth: 0, 
              fill: 'hsl(var(--primary))',
              className: "animate-pulse shadow-2xl" 
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Background Micro-Grid for that military terminal feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
    </div>
  );
}