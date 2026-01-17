"use client";

import * as React from "react";
import { 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Terminal,
  Lock,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
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
 * 📊 KPI_CARD (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease scaling | Vapour-Glass depth.
 * Logic: Morphology-aware elasticity for financial metrics.
 */
function KpiCard({ label, value, trend, trendUp, icon, description }: StatProps) {
  const Icon = typeof icon === 'string' ? IconMap[icon] || Activity : icon;
  const { impact } = useHaptics();
  const { screenSize, isMobile } = useDeviceContext();

  // 🧪 ELASTIC CLAMPING: Morphology-aware font scaling
  const getValueSize = (val: string) => {
    const isSmall = val.length > 10;
    if (isMobile) {
      return isSmall ? "text-3xl" : "text-4xl";
    }
    return isSmall ? "text-4xl lg:text-5xl" : "text-6xl lg:text-7xl";
  };

  return (
    <div 
      onPointerEnter={() => impact("light")}
      className={cn(
        "group relative flex flex-col justify-between w-full transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 bg-card/30 p-8 md:p-10",
        "backdrop-blur-3xl hover:border-primary/20 hover:bg-card/40 hover:scale-[1.02] shadow-apex",
        screenSize === 'xs' ? "min-h-[220px]" : "min-h-[260px] md:min-h-[300px]"
      )}
    >
      {/* 🌫️ VAPOUR OVERLAY: Kinetic radiance */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.05),transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <div className="flex justify-between items-start gap-4 relative z-10">
        <div className="size-12 md:size-16 shrink-0 rounded-2xl md:rounded-[1.8rem] bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-inner group-hover:bg-primary/10 transition-colors duration-700">
          <Icon className="size-6 md:size-8 transition-transform group-hover:rotate-12 group-hover:scale-110 duration-700" />
        </div>
        
        <div className={cn(
          "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black tracking-tighter italic border transition-all duration-700",
          trendUp 
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 group-hover:bg-emerald-500/20" 
            : "bg-rose-500/10 text-rose-500 border-rose-500/20 group-hover:bg-rose-500/20"
        )}>
          {trendUp ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
          {trend}
        </div>
      </div>

      <div className="space-y-2 relative z-10 flex-1 flex flex-col justify-center mt-6">
        <div className="flex items-center gap-3 opacity-30 italic mb-2">
          <Zap className="size-3 text-primary animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] truncate">
            {label}
          </p>
        </div>
        
        <h3 className={cn(
          "font-black uppercase italic tracking-[-0.08em] leading-[0.75] text-foreground transition-all duration-1000",
          getValueSize(value)
        )}>
          {value}
        </h3>
      </div>

      <div className="mt-8 border-t border-white/5 pt-6 relative z-10">
        <div className="flex items-center gap-2">
          <Terminal className="size-3 text-primary/20" />
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 leading-relaxed group-hover:text-muted-foreground/60 transition-colors duration-700">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 🛰️ ANALYTICS_LIST (Institutional Ingress)
 * Logic: morphology-aware grid resolution.
 */
export function AnalyticsCards({ stats }: { stats?: StatProps[] }) {
  const { isAuthenticated, user, isLoading } = useInstitutionalAuth();
  const { isReady, screenSize } = useDeviceContext();

  if (!isReady || isLoading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-[260px] md:h-[300px] rounded-[2.5rem] md:rounded-[3.5rem] bg-card/20 animate-pulse border border-white/5" />
      ))}
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="col-span-full rounded-[3.5rem] border border-white/5 bg-rose-500/5 p-16 md:p-24 text-center backdrop-blur-3xl animate-in zoom-in-95 duration-1000">
        <Lock className="mx-auto size-16 text-rose-500/10 mb-8 animate-pulse" />
        <p className="text-[11px] md:text-[13px] font-black uppercase italic tracking-[0.5em] text-rose-500/40">
          Telemetry_Encrypted: Session_Anchor_Missing
        </p>
      </div>
    );
  }

  const isStaff = user?.role && ["SUPER_ADMIN", "PLATFORM_MANAGER"].includes(user.role.toUpperCase());

  const defaultStats: StatProps[] = [
    { 
      label: isStaff ? "Global Platform GMV" : "Node Revenue", 
      value: "$12,482", 
      trend: "+14.2%", 
      trendUp: true, 
      icon: "DollarSign", 
      description: isStaff ? "Total liquidity processed across all nodes." : "Verified liquidity processed via this node." 
    },
    { 
      label: "Live Clusters", 
      value: "1,240", 
      trend: "+5.1%", 
      trendUp: true, 
      icon: "Activity", 
      description: "Active signal instances currently in the mesh." 
    },
    { 
      label: "Identity Verification", 
      value: "184", 
      trend: "-2.4%", 
      trendUp: false, 
      icon: "Users", 
      description: "New identity nodes verified in this epoch." 
    },
    { 
      label: isStaff ? "Mesh Latency" : "Tier Expansion", 
      value: isStaff ? "14ms" : "22.8%", 
      trend: isStaff ? "-2ms" : "+8.3%", 
      trendUp: !isStaff, 
      icon: isStaff ? "ShieldCheck" : "TrendingUp", 
      description: isStaff ? "Average global handshake velocity." : "Tier adoption rate vs historical average." 
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
      {(stats || defaultStats).map((stat, i) => (
        <KpiCard key={i} {...stat} />
      ))}
    </section>
  );
}