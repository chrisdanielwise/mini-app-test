"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { Zap, Activity, Terminal, Globe } from "lucide-react";

// 🏛️ Institutional Contexts & Device Telemetry
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 CATEGORY_ALLOCATION_NODE (Institutional Apex v2026.1.15)
 * Strategy: High-density data grid with morphology-aware font clamping.
 * Aesthetics: Obsidian-OLED Depth | Vapour-Glass Aperture.
 */

// Institutional Zipha Palette (v16.16.31 Hardened)
const EMERALD_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f43f5e", "#06b6d4"];
const AMBER_COLORS = ["#f59e0b", "#fbbf24", "#d97706", "#b45309", "#78350f"];

export function CategoryChart({ data = [] }: { data: { name: string; value: number }[] }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, screenSize, isMobile, safeArea } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";
  // 🛡️ DEFENSIVE DATA ACCESS: Prevent Super Admin node-sync crashes
  const totalWeight = data?.reduce((acc, curr) => acc + (curr.value || 0), 0) || 0;
  const activePalette = isStaffTheme ? AMBER_COLORS : EMERALD_COLORS;

  // 🛡️ HYDRATION SHIELD: Prevent "Bogus" Layout Snap during hardware handshake
  if (!isReady) return (
    <div className="h-[400px] md:h-[500px] w-full bg-card/10 animate-pulse rounded-[2.5rem] md:rounded-[3rem] border border-white/5" />
  );

  /**
   * 🕵️ TACTICAL CLAMPING: morphology-aware scaling
   * Prevents text and aperture geometry from distorting on high-DPI monitors.
   */
  const innerRadius = screenSize === 'xs' ? "65%" : "72%";
  const outerRadius = screenSize === 'xs' ? "85%" : "90%";
  const centerValueSize = screenSize === 'xs' ? "text-2xl" : "text-3xl md:text-5xl";

  return (
    <div className={cn(
      "relative group flex flex-col w-full transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
      "rounded-[2.5rem] md:rounded-[3.5rem] border backdrop-blur-3xl shadow-apex overflow-hidden",
      "min-h-[400px] md:min-h-[500px]",
      isStaffTheme ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-card/30 border-white/5",
      isMobile ? "p-8" : "p-10 md:p-12"
    )}>
      {/* 🌫️ VAPOUR DEPTH: Subsurface atmosphere */}
      <div className={cn(
        "absolute -left-32 -top-32 size-64 blur-[120px] opacity-10 pointer-events-none transition-all duration-[2000ms]",
        isStaffTheme ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- HEADER TELEMETRY: Clamped Clinical Design --- */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center gap-3 italic opacity-30 mb-2">
          {isStaffTheme ? <Globe className="size-3 text-amber-500 animate-pulse" /> : <Activity className="size-3 text-primary" />}
          <div className="flex flex-col">
            <h3 className={cn(
              "text-[9px] font-black uppercase tracking-[0.4em] leading-none",
              isStaffTheme ? "text-amber-500" : "text-muted-foreground"
            )}>
              {isStaffTheme ? "Platform_Global_Allocation" : "Node_Weight_Vector"}
            </h3>
            <span className="text-[7px] font-mono uppercase tracking-widest mt-1 opacity-50">Handshake_v16.31_Stable</span>
          </div>
        </div>
        <p className="text-xl md:text-3xl font-black uppercase italic tracking-tighter leading-none text-foreground">
          Category <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Allocation</span>
        </p>
      </div>

      <div className="flex-1 w-full relative z-10">
        {/* 🚀 LAMINAR CHART ENGINE: aspect-locked geometry */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={isMobile ? 5 : 8}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
              onMouseEnter={() => impact("light")} // 🏁 TACTILE SYNC
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={activePalette[index % activePalette.length]} 
                  className="opacity-80 hover:opacity-100 transition-all duration-500 cursor-pointer outline-none" 
                />
              ))}
            </Pie>
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.95)', 
                borderColor: isStaffTheme ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '16px',
                borderWidth: '1px',
                padding: '12px 16px',
                backdropFilter: 'blur(32px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
              itemStyle={{ 
                color: '#fff', 
                fontSize: '9px', 
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
              iconSize={4}
              wrapperStyle={{
                paddingTop: '32px',
                opacity: 0.5
              }}
              formatter={(value) => (
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 hover:text-foreground transition-all ml-2 italic">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* 🌊 APERTURE CENTER: Total Metric Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-20 leading-none mb-2">
            {isStaffTheme ? "Global_Weight" : "Node_Volume"}
          </p>
          <p className={cn(
            "font-black italic tracking-tighter tabular-nums leading-none",
            centerValueSize,
            isStaffTheme ? "text-amber-500" : "text-foreground"
          )}>
            {totalWeight.toLocaleString()}
          </p>
        </div>
      </div>
      
      {/* --- FOOTER SIGNAL: Tactical Handshake --- */}
      <div className="mt-8 flex items-center justify-between opacity-10 italic border-t border-white/5 pt-6">
        <div className="flex items-center gap-3">
          <Zap className={cn("size-3", isStaffTheme && "text-amber-500 animate-pulse")} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-foreground">
            {isStaffTheme ? "Cluster_Sync_Verified" : "Telemetry_Handshake_Stable"}
          </span>
        </div>
        <span className="text-[7px] font-mono tracking-widest opacity-40">[APEX_v16.31_STABLE]</span>
      </div>
    </div>
  );
}