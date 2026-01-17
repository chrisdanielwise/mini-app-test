"use client";

import * as React from "react";
import { 
  TrendingUp, CreditCard, Activity, Users, 
  Ticket, Zap, PieChart as PieIcon, Globe, 
  ShieldCheck, Terminal, BarChart3 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

// 📊 Intelligence Components
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";

/**
 * 🛰️ ANALYTICS_PAGE (Institutional Apex v16.31.20)
 * Strategy: De-stacked Independent Scroll Volume & High-Density Metrics.
 * Fix: Isolated scroll to prevent Command HUD blowout.
 */
export default function AnalyticsPage({ stats, categoryData }: any) {
  const { flavor } = useLayout();
  const { user } = useInstitutionalAuth();
  const { isReady, isMobile, screenSize, safeArea } = useDeviceContext();

  const isPlatformStaff = flavor === "AMBER";
  const realMerchantId = user?.merchantId;
  const role = user?.role || "NODE_GUEST";

  const analytics = stats?.analytics || { totalRevenue: 0, chartData: [] };
  const safeStats = {
    activeSubscriptions: stats?.activeSubscriptions ?? 0,
    pendingTickets: stats?.pendingTickets ?? 0
  };

  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden text-foreground">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Header --- */}
      <div 
        className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2"
        style={{ paddingTop: isMobile ? `calc(${safeArea.top}px + 0.5rem)` : "0.5rem" }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-6">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2.5 italic opacity-30">
              <Globe className={cn("size-3", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-primary")} />
              <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.4em] leading-none",
                isPlatformStaff ? "text-amber-500" : "text-primary"
              )}>
                {isPlatformStaff ? "Global_Platform_Intelligence" : "Node_Intelligence_Cluster"}
              </span>
            </div>
            
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none truncate">
              {isPlatformStaff ? "System" : "Performance"} <span className={isPlatformStaff ? "text-amber-500" : "text-primary"}>Intelligence</span>
            </h1>
            
            <div className="flex items-center gap-2 text-[7px] font-black text-muted-foreground/20 italic uppercase tracking-[0.2em]">
              <Terminal className="size-2.5" />
              <span className="truncate">NODE: {realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"} // Protocol_Sync</span>
            </div>
          </div>

          <div className={cn(
            "flex items-center gap-3 border px-4 py-2 rounded-xl backdrop-blur-3xl transition-all scale-90 origin-bottom-right",
            isPlatformStaff ? "bg-amber-500/[0.04] border-amber-500/20 shadow-amber-500/5" : "bg-primary/[0.02] border-primary/10 shadow-primary/5"
          )}>
             <p className={cn("text-[7px] font-black uppercase tracking-[0.3em] italic leading-none", isPlatformStaff ? "text-amber-500" : "text-emerald-500")}>
               {isPlatformStaff ? "Oversight_Active" : "Node_Stable"}
             </p>
             <ShieldCheck className={cn("size-4", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-emerald-500")} />
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Only metrics and charts move --- */}
      <div className="flex-1 min-h-0 w-full relative overflow-y-auto custom-scrollbar px-6 py-6 space-y-8">
        
        {/* --- METRIC GRID --- */}
        <div className={cn("grid gap-4 w-full", {
          "grid-cols-1": screenSize === 'xs',
          "grid-cols-2": screenSize === 'sm' || screenSize === 'md',
          "grid-cols-4": screenSize === 'lg' || screenSize === 'xl' || screenSize === 'xxl'
        })}>
          <MetricNode 
            title={isPlatformStaff ? "Global Gross" : "Revenue"} 
            value={`$${Number(analytics.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
            icon={CreditCard} 
            isAmber={isPlatformStaff} 
            hasTrend 
          />
          <MetricNode 
            title={isPlatformStaff ? "Total Users" : "Subscribers"} 
            value={safeStats.activeSubscriptions.toLocaleString()} 
            icon={Users} 
          />
          <MetricNode 
            title="Inquiries" 
            value={safeStats.pendingTickets} 
            icon={Ticket} 
            isWarning={safeStats.pendingTickets > 0} 
          />
          <MetricNode 
            title="Node Status" 
            value={isPlatformStaff ? "SYSTEM_V2" : "APEX_V2"} 
            icon={Zap} 
            isAmber={isPlatformStaff} 
          />
        </div>

        {/* --- VISUALIZATION LAYER --- */}
        <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-3")}>
          <div className={cn(
            "xl:col-span-2 rounded-[2rem] border backdrop-blur-3xl p-6 md:p-8 shadow-2xl flex flex-col",
            isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/30 border-white/5"
          )}>
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className={cn("size-4", isPlatformStaff ? "text-amber-500" : "text-primary")} />
              <h2 className="text-sm md:text-md font-black uppercase italic tracking-tighter opacity-60">Revenue Scalability</h2>
            </div>
            <div className="w-full rounded-2xl border border-white/5 bg-white/[0.01] p-2" style={{ height: isMobile ? "240px" : "320px" }}>
              <RevenueChart data={analytics.chartData} theme={isPlatformStaff ? "amber" : "emerald"} />
            </div>
          </div>

          <div className={cn(
            "rounded-[2rem] border backdrop-blur-3xl p-6 md:p-8 shadow-2xl flex flex-col",
            isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/30 border-white/5"
          )}>
            <div className="flex items-center gap-3 mb-6">
              <PieIcon className="size-4 text-emerald-500" />
              <h2 className="text-sm md:text-md font-black uppercase italic tracking-tighter opacity-60">Asset Spread</h2>
            </div>
            <div className="flex-1 min-h-[200px] flex items-center justify-center relative">
              <CategoryChart data={categoryData} />
            </div>
          </div>
        </div>

        {/* FOOTER SIGNAL */}
        <div className="flex items-center justify-center gap-4 opacity-10 pt-8 pb-12">
          <Activity className={cn("size-3", isPlatformStaff ? "text-amber-500" : "text-primary")} />
          <p className="text-[7px] font-black uppercase tracking-[0.5em] italic">
            Intelligence synchronized // Session: {role}
          </p>
        </div>
      </div>
    </div>
  );
}

/** 🧪 ATOMIC COMPONENT: COMPRESSED METRIC NODE */
function MetricNode({ title, value, icon: Icon, isAmber, isWarning, hasTrend }: any) {
  return (
    <div className={cn(
      "rounded-2xl border shadow-lg relative overflow-hidden group flex flex-col justify-between transition-all duration-700 p-5 min-h-[120px]",
      isAmber ? "border-amber-500/20 bg-amber-500/[0.02]" : "border-white/5 bg-white/[0.01]",
      isWarning && "border-rose-500/20 bg-rose-500/[0.04]"
    )}>
      <div className="flex justify-between items-start">
        <p className={cn("text-[7px] font-black uppercase tracking-[0.2em] italic opacity-20", isAmber && "text-amber-500 opacity-40")}>
          {title}
        </p>
        <Icon className={cn("size-3.5 opacity-20", isAmber ? "text-amber-500" : "text-primary")} />
      </div>
      <div className="space-y-0.5">
        <h3 className={cn(
          "font-black tracking-tighter italic leading-none tabular-nums text-2xl md:text-3xl",
          isWarning && "text-rose-500"
        )}>
          {value}
        </h3>
        {hasTrend && (
          <div className="flex items-center gap-1.5 text-emerald-500/60 italic">
            <TrendingUp className="size-2" />
            <span className="text-[6px] font-black uppercase tracking-[0.1em]">Velocity_Ok</span>
          </div>
        )}
      </div>
      <div className="absolute -bottom-6 -right-6 size-24 bg-white/[0.02] blur-[30px] rounded-full pointer-events-none group-hover:scale-125 transition-all duration-1000" />
    </div>
  );
}