"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/src/lib/utils";

/**
 * 🛰️ PORTFOLIO DISTRIBUTION NODE
 * Visualizes service category weight and cluster distribution.
 */

// institutional zipha palette
const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function CategoryChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-[350px] w-full p-6 rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl animate-in fade-in duration-1000">
      <div className="mb-4 px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">
          Cluster Weight
        </h3>
        <p className="text-sm font-black uppercase italic tracking-tighter leading-none mt-1">
          Category <span className="text-primary">Allocation</span>
        </p>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={65}
            outerRadius={90}
            paddingAngle={10}
            dataKey="value"
            stroke="none"
            animationBegin={0}
            animationDuration={1500}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                className="opacity-70 hover:opacity-100 transition-opacity cursor-crosshair outline-none shadow-xl" 
              />
            ))}
          </Pie>
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              borderColor: 'hsl(var(--border))', 
              borderRadius: '20px',
              borderWidth: '1px',
              padding: '12px'
            }}
            itemStyle={{ 
              color: 'hsl(var(--foreground))', 
              fontSize: '10px', 
              fontFamily: 'inherit',
              fontWeight: '900', 
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            iconSize={6}
            formatter={(value) => (
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors ml-1">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Label Overlay */}
      <div className="absolute top-[51%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none">Total</p>
        <p className="text-xl font-black italic tracking-tighter mt-0.5">
          {data.reduce((acc, curr) => acc + curr.value, 0)}
        </p>
      </div>
    </div>
  );
}