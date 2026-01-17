"use client";

import * as React from "react";
import { 
  TrendingUp, CreditCard, Activity, Users, 
  Ticket, Zap, PieChart as PieIcon, Globe, 
  ShieldCheck, Terminal, BarChart3, Cpu, DollarSign 
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
 * 🌊 ANALYTICS_PAGE (Institutional Apex v16.31.18)
 * Strategy: Re-integration of Legacy Color Functionality with v16 Ingress.
 * Fix: Restored Amber/Emerald conditional radiance protocols.
 */
export default function AnalyticsPage({ stats, categoryData }: any) {
  const { flavor } = useLayout();
  const { user } = useInstitutionalAuth();
  const { 
    isReady, isMobile, screenSize, safeArea, viewportHeight 
  } = useDeviceContext();

  // 🛡️ IDENTITY & COLOR RESOLUTION (Restored from Legacy)
  const isPlatformStaff = flavor === "AMBER";
  const realMerchantId = user?.merchantId;
  const role = user?.role || "NODE_GUEST";

  // 🛡️ DATA INGRESS FALLBACKS (Restored from Legacy)
  const analytics = stats?.analytics || { totalRevenue: 0, chartData: [] };
  const safeStats = {
    activeSubscriptions: stats?.activeSubscriptions ?? 0,
    pendingTickets: stats?.pendingTickets ?? 0
  };

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div 
      className={cn(
        "max-w-[1600px] mx-auto transition-all duration-1000",
        "animate-in fade-in slide-in-from-bottom-12",
        viewportHeight < 700 ? "space-y-6" : "space-y-10 md:space-y-14"
      )}
      style={{ 
        paddingTop: isMobile ? `${safeArea.top}px` : "0px",
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 7rem)` : "4rem",
        paddingLeft: isMobile ? "1.25rem" : "2rem",
        paddingRight: isMobile ? "1.25rem" : "2rem"
      }}
    >
      {/* --- COMMAND HUD HEADER: Responsive Matrix --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8 relative group">
        <div className="space-y-4">
          <div className="flex items-center gap-3 italic opacity-40">
            {/* 🎨 Legacy Color Logic: Globe Signal */}
            <Globe className={cn("size-3.5", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-primary")} />
            <div className="flex flex-col">
              <span className={cn(
                "text-[9px] font-black uppercase tracking-[0.4em] leading-none",
                isPlatformStaff ? "text-amber-500" : "text-primary"
              )}>
                {isPlatformStaff ? "Global_Platform_Intelligence" : "Node_Intelligence_Cluster"}
              </span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2rem,8vw,4rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            {/* 🎨 Legacy Color Logic: Title Ingress */}
            {isPlatformStaff ? "System" : "Performance"} <span className={isPlatformStaff ? "text-amber-500" : "text-primary"}>Intelligence</span>
          </h1>
          
          <div className="flex items-center gap-2 text-[8px] font-black text-muted-foreground/30 italic uppercase tracking-[0.2em]">
            <Terminal className="size-3" />
            <span>NODE: {realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "PLATFORM_ROOT"} // Protocol_Sync</span>
          </div>
        </div>

        {/* --- DYNAMIC STATUS NODE --- */}
        <div className={cn(
          "flex items-center gap-4 border px-5 py-3 rounded-2xl backdrop-blur-3xl transition-all",
          isPlatformStaff ? "bg-amber-500/[0.04] border-amber-500/20 shadow-amber-500/5" : "bg-primary/[0.02] border-primary/10 shadow-primary/5",
          isMobile && "w-full justify-between"
        )}>
           <div className="text-right">
              {/* 🎨 Legacy Color Logic: Status Ingress */}
              <p className={cn("text-[8px] font-black uppercase tracking-[0.3em] italic leading-none", isPlatformStaff ? "text-amber-500" : "text-emerald-500")}>
                {isPlatformStaff ? "Oversight_Active" : "Node_Stable"}
              </p>
           </div>
           <ShieldCheck className={cn("size-5", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-emerald-500")} />
        </div>
      </div>

      {/* --- METRIC GRID --- */}
      <div className={cn("grid gap-4 md:gap-6 w-full", {
        "grid-cols-1": screenSize === 'xs',
        "grid-cols-2": screenSize === 'sm' || screenSize === 'md',
        "grid-cols-4": screenSize === 'lg' || screenSize === 'xl' || screenSize === 'xxl'
      })}>
        {/* 🎨 Legacy Revenue Node Styling */}
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
          isAmber={false} 
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
      <div className={cn("grid gap-6 md:gap-8", isMobile ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-3")}>
        {/* Revenue Velocity Chart */}
        <div className={cn(
          "xl:col-span-2 rounded-[2.5rem] md:rounded-[3rem] border backdrop-blur-3xl p-8 md:p-10 shadow-2xl flex flex-col",
          isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/30 border-white/5"
        )}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <BarChart3 className={cn("size-4 md:size-5", isPlatformStaff ? "text-amber-500" : "text-primary")} />
              <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tighter">Revenue Scalability</h2>
            </div>
          </div>
          <div className="w-full rounded-2xl border border-white/5 bg-white/[0.01] p-2 md:p-4" style={{ height: isMobile ? "260px" : "400px" }}>
            <RevenueChart data={analytics.chartData} theme={isPlatformStaff ? "amber" : "emerald"} />
          </div>
        </div>

        {/* Asset Spread Matrix */}
        <div className={cn(
          "rounded-[2.5rem] md:rounded-[3rem] border backdrop-blur-3xl p-8 md:p-10 shadow-2xl flex flex-col",
          isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/30 border-white/5"
        )}>
          <div className="flex items-center gap-4 mb-8">
            <PieIcon className="size-4 md:size-5 text-emerald-500" />
            <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tighter">Asset Spread</h2>
          </div>
          <div className="flex-1 flex items-center justify-center relative z-10" style={{ minHeight: isMobile ? "240px" : "300px" }}>
            <CategoryChart data={categoryData} />
          </div>
        </div>
      </div>

      {/* FOOTER SIGNAL */}
      <div className="flex items-center justify-center gap-5 opacity-10 py-12 border-t border-white/5">
        <Activity className={cn("size-3", isPlatformStaff ? "text-amber-500" : "text-primary")} />
        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-foreground italic">
          Intelligence synchronized // Session: {role}
        </p>
      </div>
    </div>
  );
}

/** 🧪 ATOMIC COMPONENT: METRIC NODE */
function MetricNode({ title, value, icon: Icon, isAmber, isWarning, hasTrend }: any) {
  return (
    <div className={cn(
      "rounded-[1.8rem] md:rounded-[2.2rem] border shadow-lg relative overflow-hidden group flex flex-col justify-between transition-all duration-700 p-8 min-h-[160px]",
      isAmber ? "border-amber-500/20 bg-amber-500/[0.02]" : "border-white/5 bg-white/[0.01]",
      isWarning && "border-rose-500/20 bg-rose-500/[0.04]"
    )}>
      <div className="flex justify-between items-start">
        <p className={cn("text-[8px] font-black uppercase tracking-[0.3em] italic opacity-30", isAmber && "text-amber-500 opacity-60")}>
          {title}
        </p>
        <Icon className={cn("size-4 md:size-5 opacity-20", isAmber ? "text-amber-500" : "text-primary")} />
      </div>
      <div className="space-y-1">
        <h3 className={cn(
          "font-black tracking-tighter italic leading-none tabular-nums transition-all text-3xl md:text-4xl",
          isWarning && "text-rose-500"
        )}>
          {value}
        </h3>
        {hasTrend && (
          <div className="flex items-center gap-2 text-emerald-500 italic">
            <TrendingUp className="size-2.5" />
            <span className="text-[7px] font-black uppercase tracking-[0.1em]">Live Velocity</span>
          </div>
        )}
      </div>
      <div className="absolute -bottom-8 -right-8 size-32 bg-white/[0.03] blur-[40px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
    </div>
  );
}