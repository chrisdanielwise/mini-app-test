"use client";

import * as React from "react";
import { 
  TrendingUp, CreditCard, Activity, Users, 
  Ticket, Zap, PieChart as PieIcon, Globe, 
  ShieldCheck, Terminal, BarChart3, Cpu 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";

// 📊 Intelligence Components
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";

export default function AnalyticsPage({ stats, categoryData, session }: any) {
  const { flavor } = useLayout();
  const { isReady, isMobile, screenSize, safeArea } = useDeviceContext();

  // 🛡️ ROLE RESOLUTION
  const isPlatformStaff = flavor === "AMBER";
  const analytics = stats?.analytics;

  // 🛡️ HYDRATION GUARD: Prevents layout snapping
  if (!isReady) return <div className="min-h-screen bg-background animate-pulse" />;

  return (
    <div 
      className={cn(
        "max-w-[1600px] mx-auto space-y-8 md:space-y-16 transition-all duration-1000",
        "animate-in fade-in slide-in-from-bottom-12 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      )}
      style={{ 
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 6rem)` : "4rem",
        paddingLeft: isMobile ? "1.5rem" : "2.5rem",
        paddingRight: isMobile ? "1.5rem" : "2.5rem"
      }}
    >
      {/* --- COMMAND HUD HEADER: Adaptive Scaling --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-12 relative group">
        <div className="space-y-6">
          <div className="flex items-center gap-4 italic opacity-40">
            <Globe className={cn("size-4", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-primary/60")} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] leading-none">
                {isPlatformStaff ? "Global_Intelligence_Grid" : "Node_Performance_Vector"}
              </span>
              <span className="text-[7px] font-black uppercase tracking-widest mt-1 opacity-50">v16.31_STABLE</span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2.5rem,10vw,6rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            {isPlatformStaff ? "System" : "Growth"} <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Intelligence</span>
          </h1>
        </div>

        {/* --- DYNAMIC STATUS NODE: Only shows detail on larger tiers --- */}
        <div className={cn(
          "flex items-center gap-6 border px-8 py-5 rounded-[2rem] backdrop-blur-3xl shadow-apex",
          isPlatformStaff ? "bg-amber-500/[0.04] border-amber-500/20" : "bg-white/[0.02] border-white/5"
        )}>
           <div className="text-right">
              <p className={cn("text-[11px] font-black uppercase tracking-[0.4em] italic leading-none", isPlatformStaff ? "text-amber-500" : "text-emerald-500")}>
                {isPlatformStaff ? "Oversight_Active" : "Node_Stable"}
              </p>
              {!isMobile && <span className="text-[7px] font-mono opacity-20 uppercase tracking-widest mt-1 block">Mesh: Operational</span>}
           </div>
           <ShieldCheck className={cn("size-8", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-emerald-500")} />
        </div>
      </div>

      {/* --- METRIC GRID: Morphology-Aware Distribution --- */}
      <div className={cn(
        "grid gap-6 w-full",
        screenSize === "xs" ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
      )}>
        <MetricNode 
          title="Revenue" 
          value={`$${Number(analytics?.totalRevenue || 0).toLocaleString()}`}
          icon={CreditCard}
          isAmber={isPlatformStaff}
          isMobile={isMobile}
        />
        <MetricNode title="Subscribers" value={stats.activeSubscriptions} icon={Users} isMobile={isMobile} />
        <MetricNode title="Fault_Inquiries" value={stats.pendingTickets} icon={Ticket} isWarning={stats.pendingTickets > 0} isMobile={isMobile} />
        <MetricNode title="Node_Status" value="v2_APEX" icon={Zap} isAmber={isPlatformStaff} isMobile={isMobile} />
      </div>

      {/* --- VISUALIZATION LAYER: Adaptive Height Scaling --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-12">
        <div className="xl:col-span-2 rounded-[3.5rem] border border-white/5 bg-card/30 p-8 md:p-16 shadow-apex overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-5">
              <BarChart3 className={cn("size-6", isPlatformStaff ? "text-amber-500" : "text-primary")} />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Revenue_Velocity</h2>
            </div>
            {!isMobile && (
              <div className="flex items-center gap-3 opacity-10 italic">
                <Cpu className="size-4" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Processing_Mesh</span>
              </div>
            )}
          </div>
          <div 
            className="w-full rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-4 md:p-8"
            style={{ height: isMobile ? "300px" : "500px" }}
          >
            <RevenueChart data={analytics?.chartData || []} theme={isPlatformStaff ? "amber" : "emerald"} />
          </div>
        </div>

        <div className="rounded-[3.5rem] border border-white/5 bg-card/30 p-10 md:p-16 shadow-apex flex flex-col relative overflow-hidden group">
          <div className="flex items-center gap-5 mb-12">
            <PieIcon className="size-6 text-emerald-500" />
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Asset_Spread</h2>
          </div>
          <div 
            className="flex-1 flex items-center justify-center relative z-10"
            style={{ minHeight: isMobile ? "250px" : "350px" }}
          >
            <CategoryChart data={categoryData} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** 🧪 ATOMIC COMPONENT: METRIC NODE */
function MetricNode({ title, value, icon: Icon, isAmber, isWarning, isMobile }: any) {
  return (
    <div className={cn(
      "rounded-[2.5rem] border shadow-apex relative overflow-hidden group flex flex-col justify-between transition-all duration-700",
      isMobile ? "p-8 min-h-[160px]" : "p-10 min-h-[200px]",
      isAmber ? "border-amber-500/20 bg-amber-500/[0.04]" : "border-white/5 bg-white/[0.02]",
      isWarning && "border-rose-500/30 bg-rose-500/[0.04]"
    )}>
      <div className="flex justify-between items-start">
        <p className={cn("text-[10px] font-black uppercase tracking-[0.5em] italic opacity-40", isAmber && "text-amber-500 opacity-60")}>
          {title}
        </p>
        <Icon className={cn("size-6 opacity-40", isAmber ? "text-amber-500" : "text-primary")} />
      </div>
      <div className="space-y-4">
        <h3 className={cn(
          "font-black tracking-tighter italic leading-none tabular-nums",
          isMobile ? "text-4xl" : "text-6xl",
          isWarning && "text-rose-500 animate-pulse"
        )}>
          {value}
        </h3>
        <div className="flex items-center gap-4 opacity-20 italic">
          <TrendingUp className="size-3.5" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Telemetry_Live</span>
        </div>
      </div>
      <div className="absolute -bottom-10 -right-10 size-40 bg-white/5 blur-[60px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
    </div>
  );
}