"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function CategoryChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="opacity-80 hover:opacity-100 transition-opacity outline-none" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
            itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
          />
          <Legend 
            verticalAlign="bottom" 
            formatter={(value) => <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}