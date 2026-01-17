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
 * Aesthetics: High-Density Minimalism | Obsidian-OLED Depth.
 * Logic: morphology-aware font clamping to prevent "bogus" oversized text.
 */
function KpiCard({ label, value, trend, trendUp, icon, description }: StatProps) {
  const Icon = typeof icon === 'string' ? IconMap[icon] || Activity : icon;
  const { impact } = useHaptics();
  const { isMobile } = useDeviceContext();

  // 🧪 TACTICAL CLAMPING: Prevents text distortion on large screens
  const getValueSize = (val: string) => {
    const isSmall = val.length > 10;
    if (isMobile) {
      return isSmall ? "text-2xl" : "text-3xl";
    }
    // Clamped to 4xl/5xl max to maintain professional density
    return isSmall ? "text-3xl lg:text-4xl" : "text-4xl lg:text-5xl";
  };

  return (
    <div 
      onPointerEnter={() => impact("light")}
      className={cn(
        "group relative flex flex-col justify-between w-full transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "rounded-[2rem] md:rounded-[2.8rem] border border-white/5 bg-card/40 p-6 md:p-8",
        "backdrop-blur-3xl hover:border-primary/20 hover:bg-white/[0.02] shadow-apex overflow-hidden",
        "min-h-[200px] md:min-h-[240px]"
      )}
    >
      {/* 🌫️ KINETIC DEPTH: Fixed atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.03),transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <div className="flex justify-between items-start gap-4 relative z-10">
        <div className={cn(
          "size-10 md:size-12 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-700",
          "bg-white/5 border-white/5 text-primary group-hover:border-primary/20"
        )}>
          <Icon className="size-5 md:size-6 transition-transform group-hover:rotate-6 duration-700" />
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
        <div className="flex items-center gap-2.5 opacity-30 italic mb-1.5">
          <Zap className="size-3 text-primary animate-pulse" />
          <p className="text-[9px] font-black uppercase tracking-[0.4em] truncate">
            {label}
          </p>
        </div>
        
        <h3 className={cn(
          "font-black uppercase italic tracking-tighter leading-none text-foreground transition-all duration-1000 group-hover:text-primary",
          getValueSize(value)
        )}>
          {value}
        </h3>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <Terminal className="size-3 text-primary/10" />
          <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/20 leading-relaxed group-hover:text-muted-foreground/40 transition-colors duration-700">
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