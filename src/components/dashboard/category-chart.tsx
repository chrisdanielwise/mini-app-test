"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { Zap, Activity, Terminal, Globe } from "lucide-react";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛰️ PORTFOLIO DISTRIBUTION NODE
 * Logic: Role-Aware visual telemetry. 
 * Optimized: Adaptive centering and flavor-synced palettes.
 */

// Institutional Zipha Palette (Emerald & Amber flavors)
const EMERALD_COLORS = ["#10b981", "#0ea5e9", "#8b5cf6", "#6366f1", "#06b6d4"];
const AMBER_COLORS = ["#f59e0b", "#d97706", "#b45309", "#92400e", "#fbbf24"];

export function CategoryChart({ data }: { data: { name: string; value: number }[] }) {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";
  
  const totalWeight = data.reduce((acc, curr) => acc + curr.value, 0);
  const activePalette = isStaff ? AMBER_COLORS : EMERALD_COLORS;

  return (
    <div className={cn(
      "relative flex flex-col min-h-[350px] md:h-[450px] w-full p-5 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border backdrop-blur-3xl shadow-2xl animate-in fade-in duration-1000 overflow-hidden transition-colors duration-700",
      isStaff ? "bg-amber-500/[0.03] border-amber-500/20" : "bg-card/40 border-border/10"
    )}>
      {/* Background Watermark */}
      <Terminal className={cn(
        "absolute -bottom-10 -right-10 h-32 w-32 md:h-48 md:w-48 opacity-[0.02] -rotate-12 pointer-events-none transition-colors",
        isStaff ? "text-amber-500" : "text-primary"
      )} />

      <div className="mb-6 md:mb-8 px-1 md:px-2 relative z-10">
        <div className="flex items-center gap-2 italic opacity-40 mb-1">
          {isStaff ? <Globe className="h-3 w-3 text-amber-500" /> : <Activity className="h-3 w-3 text-primary" />}
          <h3 className={cn(
            "text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]",
            isStaff ? "text-amber-500" : "text-muted-foreground"
          )}>
            {isStaff ? "Platform_Global_Vector" : "Cluster Weight"}
          </h3>
        </div>
        <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none mt-1 text-foreground">
          Category <span className={isStaff ? "text-amber-500" : "text-primary"}>Allocation</span>
        </p>
      </div>

      <div className="flex-1 w-full relative z-10 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="48%"
              innerRadius="65%"
              outerRadius="90%"
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={activePalette[index % activePalette.length]} 
                  className="opacity-80 hover:opacity-100 transition-opacity cursor-crosshair outline-none" 
                />
              ))}
            </Pie>
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: 'rgba(var(--card), 0.9)', 
                borderColor: isStaff ? 'rgba(245, 158, 11, 0.2)' : 'rgba(var(--border), 0.2)', 
                borderRadius: '16px',
                borderWidth: '1px',
                padding: '12px',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ 
                color: 'hsl(var(--foreground))', 
                fontSize: '9px', 
                fontWeight: '900', 
                textTransform: 'uppercase',
                letterSpacing: '0.15em'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              iconSize={6}
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '9px'
              }}
              formatter={(value) => (
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors ml-1">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label Overlay */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
          <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-30 leading-none">
            {isStaff ? "Global_Total" : "Total"}
          </p>
          <p className={cn(
            "text-xl md:text-3xl font-black italic tracking-tighter mt-1",
            isStaff ? "text-amber-500" : "text-foreground"
          )}>
            {totalWeight.toLocaleString()}
          </p>
        </div>
      </div>
      
      {/* Footer Meta */}
      <div className="mt-4 flex items-center gap-2 opacity-20 italic">
        <Zap className={cn("h-2.5 w-2.5", isStaff && "text-amber-500")} />
        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-foreground">
          {isStaff ? "Multi_Cluster_Sync_Active" : "Node_Weight_Active"}
        </span>
      </div>
    </div>
  );
}