"use client";

import * as React from "react";
import { 
  TrendingUp, Users, Activity, DollarSign, 
  ArrowUpRight, ArrowDownRight, ShieldCheck, 
  Terminal, Lock, Zap 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

const IconMap: Record<string, any> = {
  DollarSign,
  Activity,
  Users,
  TrendingUp,
  ShieldCheck
};

interface StatProps {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: string | any;
  description: string;
}

/**
 * 📊 KPI_CARD (Institutional Apex v2026.1.16)
 * Aesthetics: Chroma-Rich Minimalism | Obsidian-OLED Depth.
 * Logic: morphology-aware font clamping with Restored Color Protocol.
 */
function KpiCard({ label, value, trend, trendUp, icon: IconName, description }: StatProps) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isMobile } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";
  const Icon = typeof IconName === 'string' ? IconMap[IconName] || Activity : IconName;

  // 🧪 TACTICAL CLAMPING: Prevents text distortion while maintaining "Pro" scale
  const getValueSize = (val: string) => {
    const isSmall = val.length > 10;
    if (isMobile) return isSmall ? "text-2xl" : "text-3xl";
    return isSmall ? "text-3xl lg:text-4xl" : "text-4xl lg:text-5xl";
  };

  return (
    <div 
      onPointerEnter={() => impact("light")}
      className={cn(
        "group relative flex flex-col justify-between w-full transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "rounded-[2rem] md:rounded-[2.8rem] border p-6 md:p-8 overflow-hidden shadow-2xl",
        "min-h-[200px] md:min-h-[240px]",
        // 🎨 RESTORED CHROMA PROTOCOL
        isStaffTheme 
          ? "bg-amber-500/[0.03] border-amber-500/20 hover:border-amber-500/50 shadow-amber-500/5" 
          : "bg-primary/[0.03] border-primary/20 hover:border-primary/50 shadow-primary/5"
      )}
    >
      {/* 🌫️ KINETIC DEPTH: Subsurface Radiance Restored */}
      <div className={cn(
        "absolute -right-20 -top-20 size-64 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000",
        isStaffTheme ? "bg-amber-500" : "bg-primary"
      )} />

      <div className="flex justify-between items-start gap-4 relative z-10">
        <div className={cn(
          "size-10 md:size-12 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-700",
          isStaffTheme 
            ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
            : "bg-primary/10 border-primary/30 text-primary"
        )}>
          <Icon className="size-5 md:size-6 transition-transform group-hover:rotate-6" />
        </div>
        
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black tracking-tighter italic border transition-all duration-700",
          trendUp 
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
        )}>
          {trendUp ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {trend}
        </div>
      </div>

      <div className="space-y-1 relative z-10 flex-1 flex flex-col justify-center mt-4">
        <div className="flex items-center gap-2.5 opacity-40 italic mb-1.5">
          <Zap className={cn("size-3 animate-pulse", isStaffTheme ? "text-amber-500" : "text-primary")} />
          <p className={cn(
            "text-[9px] font-black uppercase tracking-[0.4em] truncate",
            isStaffTheme ? "text-amber-500" : "text-primary"
          )}>
            {label}
          </p>
        </div>
        
        <h3 className="text-foreground transition-all duration-700 group-hover:scale-[1.02] origin-left font-black uppercase italic tracking-tighter leading-none">
          <span className={cn(
            "transition-all duration-700",
            getValueSize(value)
          )}>
            {value}
          </span>
        </h3>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <Terminal className={cn("size-3 opacity-20", isStaffTheme ? "text-amber-500" : "text-primary")} />
          <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 leading-relaxed group-hover:text-foreground/60 transition-colors">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 🛰️ ANALYTICS_GRID (Institutional Ingress)
 * Logic: Tight-grid resolution for high-density data oversight.
 */
export function AnalyticsCards({ stats }: { stats?: StatProps[] }) {
  const { isAuthenticated, user, isLoading } = useInstitutionalAuth();
  const { isReady } = useDeviceContext();

  if (!isReady || isLoading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-[200px] md:h-[240px] rounded-[2rem] md:rounded-[2.8rem] bg-card/20 animate-pulse border border-white/5" />
      ))}
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="col-span-full rounded-[2.8rem] border border-white/5 bg-black/40 p-12 md:p-20 text-center backdrop-blur-3xl animate-in zoom-in-95 duration-1000">
        <Lock className="mx-auto size-12 text-rose-500/20 mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500/40 italic leading-loose">
          Handshake_Restricted: [Session_Identity_Null]
        </p>
      </div>
    );
  }

  const isStaff = user?.role && ["SUPER_ADMIN", "PLATFORM_MANAGER"].includes(user.role.toUpperCase());

  const defaultStats: StatProps[] = [
    { 
      label: isStaff ? "Mesh_Liquidity_Total" : "Node_Revenue", 
      value: "$12,482", 
      trend: "+14.2%", 
      trendUp: true, 
      icon: "DollarSign", 
      description: isStaff ? "Aggregate volume across node clusters." : "Verified node-ingress volume." 
    },
    { 
      label: "Signal_Load", 
      value: "1,240", 
      trend: "+5.1%", 
      trendUp: true, 
      icon: "Activity", 
      description: "Active broadcast packets in the current epoch." 
    },
    { 
      label: "Identity_Verify", 
      value: "184", 
      trend: "-2.4%", 
      trendUp: false, 
      icon: "Users", 
      description: "Validated node operators in the mesh." 
    },
    { 
      label: isStaff ? "System_Latency" : "Tier_Growth", 
      value: isStaff ? "14ms" : "22.8%", 
      trend: isStaff ? "-2ms" : "+8.3%", 
      trendUp: !isStaff, 
      icon: isStaff ? "ShieldCheck" : "TrendingUp", 
      description: isStaff ? "Verified platform handshake velocity." : "Subscription tier expansion rate." 
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {(stats || defaultStats).map((stat, i) => (
        <KpiCard key={i} {...stat} />
      ))}
    </section>
  );
}