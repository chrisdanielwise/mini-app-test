"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { Zap, Activity, Terminal, Globe } from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 CATEGORY_ALLOCATION_NODE (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Centering | Vapour-Glass depth.
 * Logic: Morphology-aware aperture scaling with haptic-synced hover nodes.
 */

// Institutional Zipha Palette (v16.16.31 Hardened)
const EMERALD_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f43f5e", "#06b6d4"];
const AMBER_COLORS = ["#f59e0b", "#fbbf24", "#d97706", "#b45309", "#78350f"];

export function CategoryChart({ data }: { data: { name: string; value: number }[] }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, screenSize, isMobile } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";
  const totalWeight = data.reduce((acc, curr) => acc + curr.value, 0);
  const activePalette = isStaff ? AMBER_COLORS : EMERALD_COLORS;

  if (!isReady) return <div className="min-h-[400px] w-full bg-card/20 animate-pulse rounded-[3rem]" />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating Aperture & Text scale based on hardware tier.
   */
  const innerRadius = screenSize === 'xs' ? "60%" : "70%";
  const outerRadius = screenSize === 'xs' ? "85%" : "92%";
  const centerValueSize = screenSize === 'xs' ? "text-4xl" : "text-6xl";

  return (
    <div className={cn(
      "relative group flex flex-col w-full transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
      "rounded-[3rem] md:rounded-[4rem] border backdrop-blur-3xl shadow-apex",
      screenSize === 'xs' ? "p-6 min-h-[420px]" : "p-10 md:p-14 min-h-[500px]",
      isStaff ? "bg-amber-500/[0.04] border-amber-500/20" : "bg-card/30 border-white/5"
    )}>
      {/* 🌫️ VAPOUR RADIANCE: Subsurface flavor-synced glow */}
      <div className={cn(
        "absolute -left-32 -top-32 size-80 blur-[140px] opacity-10 pointer-events-none transition-colors duration-[2000ms]",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* Blueprint Subliminal Branding */}
      <Terminal className={cn(
        "absolute -bottom-16 -right-16 size-80 opacity-[0.01] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover:rotate-0",
        isStaff ? "text-amber-500" : "text-primary"
      )} />

      {/* --- HEADER TELEMETRY --- */}
      <div className="mb-10 relative z-10">
        <div className="flex items-center gap-4 italic opacity-40 mb-3">
          {isStaff ? <Globe className="size-4 text-amber-500 animate-pulse" /> : <Activity className="size-4 text-primary" />}
          <div className="flex flex-col">
            <h3 className={cn(
              "text-[10px] font-black uppercase tracking-[0.4em] leading-none",
              isStaff ? "text-amber-500" : "text-muted-foreground"
            )}>
              {isStaff ? "Platform_Global_Vector" : "Cluster_Weight_Metrics"}
            </h3>
            <span className="text-[7px] font-black uppercase tracking-widest mt-1">Allocation_Handshake_v16.31</span>
          </div>
        </div>
        <p className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-foreground">
          Category <span className={isStaff ? "text-amber-500" : "text-primary"}>Allocation</span>
        </p>
      </div>

      <div className="flex-1 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={isMobile ? 6 : 10}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1800}
              onMouseEnter={() => impact("light")} // 🏁 TACTILE SYNC
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={activePalette[index % activePalette.length]} 
                  className="opacity-90 hover:opacity-100 transition-all duration-500 cursor-pointer outline-none" 
                  style={{ filter: `drop-shadow(0 0 12px ${activePalette[index % activePalette.length]}44)` }}
                />
              ))}
            </Pie>
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: isStaff ? 'rgba(20, 20, 20, 0.95)' : 'rgba(10, 10, 10, 0.95)', 
                borderColor: isStaff ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '24px',
                borderWidth: '1px',
                padding: '18px',
                backdropFilter: 'blur(32px)',
                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.8)'
              }}
              itemStyle={{ 
                color: '#fff', 
                fontSize: '10px', 
                fontWeight: '900', 
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                fontStyle: 'italic'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              iconSize={6}
              wrapperStyle={{
                paddingTop: '40px',
                opacity: 0.6
              }}
              formatter={(value) => (
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-foreground transition-all ml-2 italic">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* 🌊 APERTURE CENTER: Total Metric Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center animate-in zoom-in-75 duration-1000">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-20 leading-none mb-3">
            {isStaff ? "Global_Weight" : "Node_Total"}
          </p>
          <p className={cn(
            "font-black italic tracking-tighter tabular-nums leading-none",
            centerValueSize,
            isStaff ? "text-amber-500" : "text-foreground"
          )}>
            {totalWeight.toLocaleString()}
          </p>
        </div>
      </div>
      
      {/* --- FOOTER SIGNAL --- */}
      <div className="mt-8 flex items-center justify-between opacity-30 italic">
        <div className="flex items-center gap-3">
          <Zap className={cn("size-3.5", isStaff && "text-amber-500 animate-pulse")} />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground">
            {isStaff ? "Multi_Cluster_Sync_Active" : "Telemetry_Node_Engaged"}
          </span>
        </div>
        <span className="text-[8px] font-mono tracking-widest opacity-40">[APEX_V16.31]</span>
      </div>
    </div>
  );
}