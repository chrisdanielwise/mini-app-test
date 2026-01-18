"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { Zap, Activity, Terminal, Globe } from "lucide-react";

// 🏛️ Institutional Contexts & Device Telemetry
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

const EMERALD_COLORS = ["#10b981", "#0ea5e9", "#8b5cf6", "#6366f1", "#06b6d4"];
const AMBER_COLORS = ["#f59e0b", "#d97706", "#b45309", "#92400e", "#fbbf24"];

/**
 * 🛰️ CATEGORY_CHART (Institutional Apex v2026.1.20)
 * Strategy: Aperture Compression & Morphological Clamping.
 * Fix: Optical centering logic accounts for mobile legend height.
 */
export function CategoryChart({ data = [] }: { data: { name: string; value: number }[] }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, screenSize, isMobile } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";
  const totalWeight = data.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const activePalette = isStaff ? AMBER_COLORS : EMERALD_COLORS;

  // 🛡️ HYDRATION SHIELD: Prevents layout snap during handshake
  if (!isReady) return (
    <div className="h-[350px] md:h-[450px] w-full bg-card/10 animate-pulse rounded-[2.5rem] border border-white/5" />
  );

  // 🕵️ TACTICAL CLAMPING: morphology-aware aperture
  const innerRadius = screenSize === 'xs' ? "65%" : "70%";
  const outerRadius = screenSize === 'xs' ? "85%" : "90%";

  return (
    <div className={cn(
      "relative flex flex-col min-h-[350px] md:h-[450px] w-full p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border backdrop-blur-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-1000 overflow-hidden transition-all",
      isStaff ? "bg-amber-500/[0.03] border-amber-500/20" : "bg-card/40 border-white/5"
    )}>
      {/* 🌫️ VAPOUR RADIANCE: Background depth */}
      <div className={cn(
        "absolute -left-24 -top-24 size-64 blur-[100px] opacity-10 pointer-events-none transition-all duration-1000",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* Background Watermark */}
      <Terminal className={cn(
        "absolute -bottom-10 -right-10 h-32 w-32 md:h-48 md:w-48 opacity-[0.02] -rotate-12 pointer-events-none",
        isStaff ? "text-amber-500" : "text-primary"
      )} />

      {/* --- HEADER TELEMETRY: Compressed HUD --- */}
      <div className="mb-6 relative z-10 leading-none">
        <div className="flex items-center gap-2 italic opacity-40 mb-1.5">
          {isStaff ? <Globe className="h-3 w-3 text-amber-500 animate-pulse" /> : <Activity className="h-3 w-3 text-primary" />}
          <h3 className={cn(
            "text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]",
            isStaff ? "text-amber-500" : "text-muted-foreground"
          )}>
            {isStaff ? "Platform_Global_Vector" : "Cluster_Weight"}
          </h3>
        </div>
        <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none text-foreground">
          Asset <span className={isStaff ? "text-amber-500" : "text-primary"}>Spread</span>
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
              paddingAngle={isMobile ? 5 : 8}
              dataKey="value"
              stroke="none"
              animationDuration={1500}
              onMouseEnter={() => impact("light")}
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={activePalette[index % activePalette.length]} 
                  className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer outline-none" 
                />
              ))}
            </Pie>
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                borderColor: isStaff ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '16px',
                padding: '12px',
                backdropFilter: 'blur(20px)',
              }}
              itemStyle={{ 
                color: '#fff', 
                fontSize: '9px', 
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
              iconSize={4}
              wrapperStyle={{
                paddingTop: '20px',
                opacity: 0.4
              }}
              formatter={(value) => (
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground italic ml-1">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* 🌊 APERTURE CENTER: Optical Centering Fix */}
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 pointer-events-none text-center",
          isMobile ? "-translate-y-[calc(50%+20px)]" : "-translate-y-[calc(50%+15px)]"
        )}>
          <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-30 leading-none mb-1">
            {isStaff ? "Global_Total" : "Node_Volume"}
          </p>
          <p className={cn(
            "text-2xl md:text-3xl font-black italic tracking-tighter tabular-nums leading-none",
            isStaff ? "text-amber-500" : "text-foreground"
          )}>
            {totalWeight.toLocaleString()}
          </p>
        </div>
      </div>
      
      {/* --- FOOTER SIGNAL --- */}
      <div className="mt-4 flex items-center gap-2 opacity-20 italic">
        <Zap className={cn("h-2.5 w-2.5", isStaff && "text-amber-500 animate-pulse")} />
        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-foreground">
          {isStaff ? "Multi_Cluster_Sync_Active" : "Handshake_Stable"}
        </span>
      </div>
    </div>
  );
}