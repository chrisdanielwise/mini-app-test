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
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

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
 * 📊 KPI CARD (Apex Sync Tier)
 * Logic: Character-aware fluid scaling for mobile-first dashboards.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
function KpiCard({ label, value, trend, trendUp, icon, description }: StatProps) {
  const Icon = typeof icon === 'string' ? IconMap[icon] || Activity : icon;
  const { impact } = useHaptics();

  // ELASTIC CLAMPING: Prevents container bleed on high-value metrics
  const getValueSize = (val: string) => {
    if (val.length > 12) return "text-xl sm:text-2xl md:text-3xl";
    if (val.length > 8) return "text-2xl sm:text-3xl md:text-4xl";
    return "text-4xl sm:text-5xl md:text-6xl"; // 🌊 Increased for high-contrast impact
  };

  return (
    <div 
      onPointerEnter={() => impact("light")}
      className={cn(
        "group relative flex flex-col justify-between min-h-[200px] md:min-h-[240px] w-full",
        "rounded-[2.5rem] border border-white/5 bg-card/30 p-8 md:p-10",
        "backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:border-primary/20 hover:bg-card/40 hover:scale-[1.02] shadow-2xl"
      )}
    >
      {/* 🌊 AMBIENT RADIANCE: Role-based Aura */}
      <div className="absolute -right-16 -bottom-16 h-48 w-48 bg-primary/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

      <div className="flex justify-between items-start gap-4">
        <div className="size-12 md:size-14 shrink-0 rounded-2xl md:rounded-[1.5rem] bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-inner">
          <Icon className="size-6 md:size-7 transition-transform group-hover:rotate-12 duration-500" />
        </div>
        
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-tighter italic border",
          trendUp 
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
        )}>
          {trendUp ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {trend}
        </div>
      </div>

      <div className="space-y-1 relative z-10 flex-1 flex flex-col justify-center mt-6">
        <div className="flex items-center gap-2 opacity-30 italic mb-1">
          <Terminal className="size-3 text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] truncate">
            {label}
          </p>
        </div>
        
        <h3 className={cn(
          "font-black uppercase italic tracking-[-0.07em] leading-[0.8] text-foreground transition-all duration-500",
          getValueSize(value)
        )}>
          {value}
        </h3>
      </div>

      <div className="mt-8 border-t border-white/5 pt-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 leading-relaxed group-hover:text-muted-foreground/60 transition-colors duration-700">
          {description}
        </p>
      </div>
    </div>
  );
}

export function AnalyticsCards({ stats }: { stats?: StatProps[] }) {
  const { auth, isReady } = useTelegramContext();

  if (!isReady || auth.isLoading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-[220px] rounded-[2.5rem] bg-card/20 animate-pulse border border-white/5" />
      ))}
    </div>
  );

  if (!auth.isAuthenticated) {
    return (
      <div className="col-span-full rounded-[3rem] border border-white/5 bg-rose-500/5 p-16 text-center backdrop-blur-3xl animate-in zoom-in-95 duration-1000">
        <Lock className="mx-auto size-12 text-rose-500/20 mb-6 animate-pulse" />
        <p className="text-[12px] font-black uppercase italic tracking-[0.4em] text-rose-500/60">Telemetry_Encrypted: Handshake_Required</p>
      </div>
    );
  }

  const isStaff = auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role);

  const defaultStats: StatProps[] = [
    { 
      label: isStaff ? "Global Platform GMV" : "Merchant Revenue", 
      value: "$12,482", 
      trend: "+14.2%", 
      trendUp: true, 
      icon: "DollarSign", 
      description: isStaff ? "Total platform liquidity processed." : "Liquidity processed via your node." 
    },
    { 
      label: "Active Nodes", 
      value: "1,240", 
      trend: "+5.1%", 
      trendUp: true, 
      icon: "Activity", 
      description: "Live signal instances in the cluster." 
    },
    { 
      label: "User Onboarding", 
      value: "184", 
      trend: "-2.4%", 
      trendUp: false, 
      icon: "Users", 
      description: "New identity nodes verified this epoch." 
    },
    { 
      label: isStaff ? "System Latency" : "Growth Rate", 
      value: isStaff ? "14ms" : "22.8%", 
      trend: isStaff ? "-2ms" : "+8.3%", 
      trendUp: !isStaff, 
      icon: isStaff ? "ShieldCheck" : "TrendingUp", 
      description: isStaff ? "Average global handshake velocity." : "Tier expansion vs historical metrics." 
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {(stats || defaultStats).map((stat, i) => (
        <KpiCard key={i} {...stat} />
      ))}
    </section>
  );
}