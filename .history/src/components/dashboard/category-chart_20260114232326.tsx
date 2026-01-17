"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { Zap, Activity, Terminal, Globe } from "lucide-react";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID CATEGORY NODE (Institutional v16.16.12)
 * Logic: Role-Aware visual telemetry with haptic-synced centering.
 * Design: v9.9.1 Hardened Glassmorphism.
 */

// Institutional Zipha Palette (v16.16.12 Hardened)
const EMERALD_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f43f5e", "#06b6d4"];
const AMBER_COLORS = ["#f59e0b", "#fbbf24", "#d97706", "#b45309", "#78350f"];

export function CategoryChart({ data }: { data: { name: string; value: number }[] }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";
  
  const totalWeight = data.reduce((acc, curr) => acc + curr.value, 0);
  const activePalette = isStaff ? AMBER_COLORS : EMERALD_COLORS;

  return (
    <div className={cn(
      "relative group flex flex-col min-h-[400px] md:h-[480px] w-full p-8 md:p-10",
      "rounded-[3rem] border backdrop-blur-3xl shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
      isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-card/30 border-white/5 shadow-black/20"
    )}>
      {/* 🌊 AMBIENT RADIANCE: flavor-synced subsurface glow */}
      <div className={cn(
        "absolute -left-24 -top-24 size-64 blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* Blueprint Subliminal Branding */}
      <Terminal className={cn(
        "absolute -bottom-10 -right-10 h-32 md:h-52 md:w-52 opacity-[0.02] -rotate-12 pointer-events-none",
        isStaff ? "text-amber-500" : "text-primary"
      )} />

      <div className="mb-8 md:mb-10 px-2 relative z-10">
        <div className="flex items-center gap-3 italic opacity-40 mb-2">
          {isStaff ? <Globe className="size-3.5 text-amber-500 animate-pulse" /> : <Activity className="size-3.5 text-primary" />}
          <h3 className={cn(
            "text-[10px] font-black uppercase tracking-[0.4em]",
            isStaff ? "text-amber-500" : "text-muted-foreground"
          )}>
            {isStaff ? "Platform_Global_Vector" : "Cluster_Weight_Metrics"}
          </h3>
        </div>
        <p className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none text-foreground">
          Category <span className={isStaff ? "text-amber-500" : "text-primary"}>Allocation</span>
        </p>
      </div>

      <div className="flex-1 w-full relative z-10 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="48%"
              innerRadius="68%"
              outerRadius="92%"
              paddingAngle={10}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
              onMouseEnter={() => impact("light")} // 🏁 TACTILE SYNC: Micro-tick on segment hover
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={activePalette[index % activePalette.length]} 
                  className="opacity-90 hover:opacity-100 transition-all duration-500 cursor-pointer outline-none" 
                  style={{ filter: `drop-shadow(0 0 10px ${activePalette[index % activePalette.length]}33)` }}
                />
              ))}
            </Pie>
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: isStaff ? 'rgba(20, 20, 20, 0.95)' : 'rgba(var(--card), 0.9)', 
                borderColor: isStaff ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '20px',
                borderWidth: '1px',
                padding: '16px',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)'
              }}
              itemStyle={{ 
                color: '#fff', 
                fontSize: '11px', 
                fontWeight: '900', 
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontStyle: 'italic'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                paddingTop: '32px',
                fontSize: '10px'
              }}
              formatter={(value) => (
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 hover:text-foreground transition-all ml-2 italic">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* 🌊 CENTER APERTURE: Fluid Summary */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center animate-in zoom-in-90 duration-1000">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-30 leading-none mb-2">
            {isStaff ? "Global_Weight" : "Node_Total"}
          </p>
          <p className={cn(
            "text-3xl md:text-5xl font-black italic tracking-tighter",
            isStaff ? "text-amber-500" : "text-foreground"
          )}>
            {totalWeight.toLocaleString()}
          </p>
        </div>
      </div>
      
      {/* Footer Meta: Institutional Branding */}
      <div className="mt-6 flex items-center justify-between opacity-30">
        <div className="flex items-center gap-3 italic">
          <Zap className={cn("size-3.5", isStaff && "text-amber-500 animate-pulse")} />
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-foreground">
            {isStaff ? "Multi_Cluster_Sync_Active" : "Telemetry_Node_Engaged"}
          </span>
        </div>
        <span className="text-[8px] font-mono">[v16.16.12]</span>
      </div>
    </div>
  );
}