"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { Zap, Activity, Globe } from "lucide-react";

// 🏛️ Institutional Contexts & Device Telemetry
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

const EMERALD_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f43f5e", "#06b6d4"];
const AMBER_COLORS = ["#f59e0b", "#fbbf24", "#d97706", "#b45309", "#78350f"];

/**
 * 🛰️ CATEGORY_CHART (Institutional Apex v2026.1.20)
 * Strategy: Aperture Compression & Tactical Slim Geometry.
 * Fix: Reduced height (h-320) and high-density padding (p-6) prevents blowout.
 */
export function CategoryChart({ data = [] }: { data: { name: string; value: number }[] }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, screenSize, isMobile } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";
  const totalWeight = data?.reduce((acc, curr) => acc + (curr.value || 0), 0) || 0;
  const activePalette = isStaffTheme ? AMBER_COLORS : EMERALD_COLORS;

  // 🛡️ HYDRATION SHIELD: Prevents the "Bogus" layout snap
  if (!isReady) return (
    <div className="h-[320px] md:h-[400px] w-full bg-card/10 animate-pulse rounded-2xl border border-white/5" />
  );

  // 🕵️ TACTICAL CLAMPING: morphology-aware aperture
  const innerRadius = screenSize === 'xs' ? "65%" : "70%";
  const outerRadius = screenSize === 'xs' ? "85%" : "88%";

  return (
    <div className={cn(
      "relative group flex flex-col w-full transition-all duration-700 shadow-2xl",
      "rounded-3xl border backdrop-blur-3xl overflow-hidden",
      "h-[320px] md:h-[400px]", // Reduced h-500 -> h-400
      isStaffTheme ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/40 border-white/5",
      "p-6 md:p-7" // Reduced p-12 -> p-7
    )}>
      {/* 🌫️ VAPOUR DEPTH radiants */}
      <div className={cn(
        "absolute -left-24 -top-24 size-48 blur-[100px] opacity-10 pointer-events-none transition-all duration-1000",
        isStaffTheme ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- HEADER TELEMETRY: Compressed HUD --- */}
      <div className="mb-4 relative z-10 leading-none">
        <div className="flex items-center gap-2.5 italic opacity-30 mb-1.5">
          {isStaffTheme ? <Globe className="size-2.5 text-amber-500 animate-pulse" /> : <Activity className="size-2.5 text-primary" />}
          <div className="flex flex-col">
            <h3 className={cn(
              "text-[7.5px] font-black uppercase tracking-[0.4em] leading-none",
              isStaffTheme ? "text-amber-500" : "text-muted-foreground"
            )}>
              {isStaffTheme ? "Global_Allocation" : "Weight_Vector"}
            </h3>
          </div>
        </div>
        <p className="text-lg md:text-2xl font-black uppercase italic tracking-tighter leading-none text-foreground">
          Asset <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Spread</span>
        </p>
      </div>

      <div className="flex-1 w-full relative z-10 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={isMobile ? 4 : 6}
              dataKey="value"
              stroke="none"
              animationDuration={1000}
              onMouseEnter={() => impact("light")}
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={activePalette[index % activePalette.length]} 
                  className="opacity-70 hover:opacity-100 transition-all duration-500 cursor-pointer outline-none" 
                />
              ))}
            </Pie>
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                borderColor: isStaffTheme ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '12px',
                padding: '8px 12px',
                backdropFilter: 'blur(20px)',
              }}
              itemStyle={{ 
                color: '#fff', 
                fontSize: '8px', 
                fontWeight: '900', 
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontStyle: 'italic'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              iconSize={3}
              wrapperStyle={{
                paddingTop: '20px',
                opacity: 0.4
              }}
              formatter={(value) => (
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 italic ml-1">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* 🌊 APERTURE CENTER: Total Metric Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+10px)] pointer-events-none text-center">
          <p className="text-[6.5px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-20 leading-none mb-1">
            {isStaffTheme ? "Global" : "Volume"}
          </p>
          <p className={cn(
            "font-black italic tracking-tighter tabular-nums leading-none text-xl md:text-3xl",
            isStaffTheme ? "text-amber-500" : "text-foreground"
          )}>
            {totalWeight.toLocaleString()}
          </p>
        </div>
      </div>
      
      {/* --- FOOTER SIGNAL --- */}
      <div className="mt-4 flex items-center justify-between opacity-10 italic border-t border-white/5 pt-4">
        <div className="flex items-center gap-2">
          <Zap className={cn("size-2.5", isStaffTheme && "text-amber-500 animate-pulse")} />
          <span className="text-[7px] font-black uppercase tracking-[0.3em] text-foreground">
            {isStaffTheme ? "Cluster_Sync" : "Handshake_Stable"}
          </span>
        </div>
        <span className="text-[6.5px] font-mono tracking-widest opacity-40">[APEX_v16.31]</span>
      </div>
    </div>
  );
}