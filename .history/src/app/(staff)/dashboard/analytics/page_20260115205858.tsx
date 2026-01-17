"use client";

import * as React from "react";
import { 
  TrendingUp, CreditCard, Activity, Users, 
  Ticket, Zap, PieChart as PieIcon, Globe, 
  ShieldCheck, Terminal, BarChart3, Cpu 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";

// 📊 Intelligence Components
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";

/**
 * 🌊 ANALYTICS_PAGE (Institutional Apex v16.31.12)
 * Architecture: Morphology-Aware Kinetic Membrane.
 * Interaction: Haptic-Ready | safeArea-Clamped.
 */
export default function AnalyticsPage({ stats, categoryData }: any) {
  const { flavor } = useLayout();
  const { 
    isReady, 
    isMobile, 
    isTablet,
    screenSize, 
    safeArea, 
    isPortrait,
    viewportHeight 
  } = useDeviceContext();

  const isPlatformStaff = flavor === "AMBER";
  const analytics = stats?.analytics;

  // 🛡️ HYDRATION SHIELD: Prevent Layout Shifting
  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="size-12 rounded-2xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div 
      className={cn(
        "max-w-[1800px] mx-auto transition-all duration-1000 ease-out",
        "animate-in fade-in slide-in-from-bottom-12",
        // 🧪 GRID MORPHOLOGY: Adjusting vertical rhythm based on device height
        viewportHeight < 700 ? "space-y-6" : "space-y-10 md:space-y-20"
      )}
      style={{ 
        paddingTop: isMobile ? `${safeArea.top}px` : "0px",
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 7rem)` : "4rem",
        paddingLeft: isMobile ? "1.25rem" : "3rem",
        paddingRight: isMobile ? "1.25rem" : "3rem"
      }}
    >
      {/* --- COMMAND HUD HEADER: Responsive Typography Matrix --- */}
      <div className={cn(
        "flex flex-col border-b border-white/5 pb-10 gap-8",
        !isMobile && !isPortrait ? "flex-row items-end justify-between" : "items-start"
      )}>
        <div className="space-y-4">
          <div className="flex items-center gap-3 italic opacity-30">
            <Globe className={cn("size-3.5", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-primary")} />
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] leading-none">
                {isPlatformStaff ? "Global_Intelligence_Grid" : "Node_Performance_Vector"}
              </span>
            </div>
          </div>
          
          <h1 className={cn(
            "font-black tracking-tighter uppercase italic leading-[0.8] text-foreground transition-all duration-700",
            screenSize === 'xs' ? "text-5xl" : "text-6xl md:text-8xl lg:text-9xl"
          )}>
            {isPlatformStaff ? "System" : "Growth"} <span className={isPlatformStaff ? "text-amber-500" : "text-primary"}>Intelligence</span>
          </h1>
        </div>

        {/* --- DYNAMIC STATUS NODE: Contextual Visibility --- */}
        <div className={cn(
          "flex items-center gap-5 border px-6 py-4 rounded-[1.75rem] backdrop-blur-3xl shadow-apex transition-all",
          isPlatformStaff ? "bg-amber-500/[0.04] border-amber-500/20" : "bg-white/[0.02] border-white/5",
          isMobile && "w-full justify-between"
        )}>
           <div className="text-right">
              <p className={cn("text-[10px] font-black uppercase tracking-[0.3em] italic leading-none", isPlatformStaff ? "text-amber-500" : "text-emerald-500")}>
                {isPlatformStaff ? "Oversight_Active" : "Telemetry_Stable"}
              </p>
              {screenSize !== 'xs' && <span className="text-[7px] font-mono opacity-20 uppercase tracking-widest mt-1 block">Latency: 24ms</span>}
           </div>
           <ShieldCheck className={cn("size-6 md:size-8", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-emerald-500")} />
        </div>
      </div>

      {/* --- METRIC GRID: Morphology-Aware Columns --- */}
      <div className={cn(
        "grid gap-4 md:gap-8 w-full",
        {
          "grid-cols-1": screenSize === 'xs',
          "grid-cols-2": screenSize === 'sm' || screenSize === 'md',
          "grid-cols-4": screenSize === 'lg' || screenSize === 'xl' || screenSize === 'xxl'
        }
      )}>
        <MetricNode title="Revenue" value={`$${Number(analytics?.totalRevenue || 0).toLocaleString()}`} icon={CreditCard} isAmber={isPlatformStaff} tier={screenSize} />
        <MetricNode title="Nodes" value={stats.activeSubscriptions} icon={Users} tier={screenSize} />
        <MetricNode title="Alerts" value={stats.pendingTickets} icon={Ticket} isWarning={stats.pendingTickets > 0} tier={screenSize} />
        <MetricNode title="Protocol" value="APEX_V2" icon={Zap} isAmber={isPlatformStaff} tier={screenSize} />
      </div>

      {/* --- VISUALIZATION LAYER: Fluid Chart Calibration --- */}
      <div className={cn(
        "grid gap-6 md:gap-12",
        isMobile ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-3"
      )}>
        {/* Revenue Velocity Chart */}
        <div className="xl:col-span-2 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-card/30 p-8 md:p-14 shadow-apex overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <BarChart3 className={cn("size-5 md:size-6", isPlatformStaff ? "text-amber-500" : "text-primary")} />
              <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">Growth_Velocity</h2>
            </div>
            {screenSize !== 'xs' && (
              <div className="flex items-center gap-3 opacity-10 italic">
                <Cpu className="size-4" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em]">Mesh_Processing_Active</span>
              </div>
            )}
          </div>
          <div 
            className="w-full rounded-[2rem] border border-white/5 bg-white/[0.01] p-2 md:p-6"
            style={{ height: isMobile ? "280px" : "480px" }}
          >
            <RevenueChart data={analytics?.chartData || []} theme={isPlatformStaff ? "amber" : "emerald"} />
          </div>
        </div>

        {/* Asset Spread Matrix */}
        <div className="rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-card/30 p-8 md:p-14 shadow-apex flex flex-col relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-10">
            <PieIcon className="size-5 md:size-6 text-emerald-500" />
            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">Network_Spread</h2>
          </div>
          <div 
            className="flex-1 flex items-center justify-center relative z-10"
            style={{ minHeight: isMobile ? "240px" : "340px" }}
          >
            <CategoryChart data={categoryData} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** 🧪 ATOMIC COMPONENT: METRIC NODE (Morphology-Aware) */
function MetricNode({ title, value, icon: Icon, isAmber, isWarning, tier }: any) {
  // Logic: Adjusting card height and padding based on hardware tier
  const isCompact = tier === 'xs' || tier === 'sm';
  
  return (
    <div className={cn(
      "rounded-[2rem] md:rounded-[2.5rem] border shadow-apex relative overflow-hidden group flex flex-col justify-between transition-all duration-700",
      isCompact ? "p-6 min-h-[140px]" : "p-10 min-h-[220px]",
      isAmber ? "border-amber-500/20 bg-amber-500/[0.04]" : "border-white/5 bg-white/[0.02]",
      isWarning && "border-rose-500/30 bg-rose-500/[0.04]"
    )}>
      <div className="flex justify-between items-start">
        <p className={cn("text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] italic opacity-40", isAmber && "text-amber-500 opacity-60")}>
          {title}
        </p>
        <Icon className={cn("size-5 md:size-6 opacity-40", isAmber ? "text-amber-500" : "text-primary")} />
      </div>
      <div className="space-y-2 md:space-y-4">
        <h3 className={cn(
          "font-black tracking-tighter italic leading-none tabular-nums transition-all",
          isCompact ? "text-3xl" : "text-5xl md:text-6xl",
          isWarning && "text-rose-500 animate-pulse"
        )}>
          {value}
        </h3>
        <div className="flex items-center gap-3 opacity-20 italic">
          <TrendingUp className="size-3" />
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">Telemetry_Live</span>
        </div>
      </div>
      {/* Vapour Highlight */}
      <div className="absolute -bottom-10 -right-10 size-40 bg-white/5 blur-[50px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
    </div>
  );
}