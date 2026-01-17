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
 * 📊 KPI_CARD (Institutional Tactical Slim)
 * Strategy: Vertical Compression & Geometry Lock.
 * Fix: Reduced padding (p-5) and min-height (140px) for high-density oversight.
 */
function KpiCard({ label, value, trend, trendUp, icon: IconName, description }: StatProps) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isMobile } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";
  const Icon = typeof IconName === 'string' ? IconMap[IconName] || Activity : IconName;

  return (
    <div 
      onPointerEnter={() => impact("light")}
      className={cn(
        "group relative flex flex-col justify-between w-full transition-all duration-500",
        "rounded-2xl border p-5 overflow-hidden shadow-xl", // Reduced p-8 -> p-5
        "min-h-[140px] md:min-h-[160px]", // Reduced min-h-240 -> 160
        isStaffTheme 
          ? "bg-amber-500/[0.02] border-amber-500/10 hover:border-amber-500/30" 
          : "bg-primary/[0.02] border-primary/10 hover:border-primary/30"
      )}
    >
      {/* 🌫️ KINETIC DEPTH: Compressed Radiance */}
      <div className={cn(
        "absolute -right-12 -top-12 size-48 blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000",
        isStaffTheme ? "bg-amber-500" : "bg-primary"
      )} />

      <div className="flex justify-between items-start gap-4 relative z-10">
        <div className={cn(
          "size-8 shrink-0 rounded-lg flex items-center justify-center border shadow-inner transition-all",
          isStaffTheme 
            ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
            : "bg-primary/10 border-primary/20 text-primary"
        )}>
          <Icon className="size-4 transition-transform group-hover:rotate-6" />
        </div>
        
        <div className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[7px] font-black tracking-tighter italic border transition-all",
          trendUp 
            ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" 
            : "bg-rose-500/5 text-rose-500 border-rose-500/10"
        )}>
          {trendUp ? <ArrowUpRight className="size-2.5" /> : <ArrowDownRight className="size-2.5" />}
          {trend}
        </div>
      </div>

      <div className="space-y-0.5 relative z-10 flex-1 flex flex-col justify-end mb-2">
        <div className="flex items-center gap-2 opacity-20 italic mb-1">
          <Zap className={cn("size-2.5 animate-pulse", isStaffTheme ? "text-amber-500" : "text-primary")} />
          <p className={cn(
            "text-[7px] font-black uppercase tracking-[0.3em] truncate",
            isStaffTheme ? "text-amber-500" : "text-primary"
          )}>
            {label}
          </p>
        </div>
        
        <h3 className="text-foreground font-black uppercase italic tracking-tighter leading-none">
          <span className="text-2xl md:text-3xl tabular-nums">
            {value}
          </span>
        </h3>
      </div>

      <div className="pt-3 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <Terminal className={cn("size-2.5 opacity-10", isStaffTheme ? "text-amber-500" : "text-primary")} />
          <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-muted-foreground/30 truncate leading-none">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 🛰️ ANALYTICS_GRID (Institutional Ingress)
 */
export function AnalyticsCards({ stats }: { stats?: StatProps[] }) {
  const { isAuthenticated, user, isLoading } = useInstitutionalAuth();
  const { isReady } = useDeviceContext();

  if (!isReady || isLoading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-[140px] md:h-[160px] rounded-2xl bg-card/20 animate-pulse border border-white/5" />
      ))}
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="col-span-full rounded-2xl border border-white/5 bg-black/40 p-12 text-center backdrop-blur-3xl">
        <Lock className="mx-auto size-10 text-rose-500/20 mb-4" />
        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-rose-500/30 italic">
          Handshake_Restricted: Identity_Null
        </p>
      </div>
    );
  }

  const isStaff = user?.role && ["SUPER_ADMIN", "PLATFORM_MANAGER"].includes(user.role.toUpperCase());

  const defaultStats: StatProps[] = [
    { label: isStaff ? "Mesh_Liquidity" : "Revenue", value: "$12,482", trend: "+14.2%", trendUp: true, icon: "DollarSign", description: "Aggregated node volume." },
    { label: "Signal_Load", value: "1,240", trend: "+5.1%", trendUp: true, icon: "Activity", description: "Active broadcast packets." },
    { label: "Identity_Verify", value: "184", trend: "-2.4%", trendUp: false, icon: "Users", description: "Validated node operators." },
    { label: isStaff ? "Latency" : "Tier_Growth", value: isStaff ? "14ms" : "22.8%", trend: isStaff ? "-2ms" : "+8.3%", trendUp: !isStaff, icon: isStaff ? "ShieldCheck" : "TrendingUp", description: "System velocity sync." }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      {(stats || defaultStats).map((stat, i) => (
        <KpiCard key={i} {...stat} />
      ))}
    </section>
  );
}