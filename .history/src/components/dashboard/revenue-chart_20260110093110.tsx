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

interface ChartProps {
  data: {
    date: string;
    revenue: number;
  }[];
}

/**
 * 💹 REVENUE VISUALIZATION NODE
 * Provides high-fidelity historical data for merchant liquidity.
 */
export function RevenueChart({ data }: ChartProps) {
  return (
    <div className="h-[400px] w-full p-8 rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl animate-in fade-in duration-1000">
      <div className="mb-6 px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          Liquidity Flow (30D)
        </h3>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fontWeight: 900, fill: 'hsl(var(--muted-foreground))' }}
            dy={15}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fontWeight: 900, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              borderColor: 'hsl(var(--border))',
              borderRadius: '20px',
              fontSize: '10px',
              fontWeight: '900',
              textTransform: 'uppercase',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="hsl(var(--primary))" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorRev)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}