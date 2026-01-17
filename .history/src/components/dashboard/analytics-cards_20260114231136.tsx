"use client";

import { 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Terminal,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTelegramContext } from "@/components/providers/telegram-provider";

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
 */
function KpiCard({ label, value, trend, trendUp, icon, description }: StatProps) {
  const Icon = typeof icon === 'string' ? IconMap[icon] || Activity : icon;

  // ELASTIC CLAMPING: Prevents container bleed on high-value metrics
  const getValueSize = (val: string) => {
    if (val.length > 12) return "text-xl sm:text-2xl md:text-3xl";
    if (val.length > 8) return "text-2xl sm:text-3xl md:text-4xl";
    return "text-3xl sm:text-4xl md:text-5xl";
  };

  return (
    <div className={cn(
        "group relative overflow-hidden flex flex-col justify-between min-h-[180px] md:min-h-[220px] w-full",
        "rounded-3xl md:rounded-[2.5rem] border border-border/40 bg-card/40",
        "p-6 md:p-9 backdrop-blur-3xl transition-all duration-500",
        "hover:border-primary/40 hover:shadow-2xl active:scale-[0.98] cursor-default shadow-xl"
      )}
    >
      {/* Visual Telemetry: Role-based Aura */}
      <div className="absolute -right-10 -bottom-10 h-32 w-32 bg-primary/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl md:rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-inner">
          <Icon className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110 duration-500" />
        </div>
        
        <div className={cn(
          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] md:text-[9px] font-black tracking-tighter italic border whitespace-nowrap",
          trendUp 
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
        )}>
          {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend}
        </div>
      </div>

      <div className="space-y-1 md:space-y-2 relative z-10 min-w-0 flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-2 opacity-30 italic mb-1">
          <Terminal className="h-2.5 w-2.5 text-primary" />
          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] truncate">
            {label}
          </p>
        </div>
        
        <h3 className={cn(
          "font-black uppercase italic tracking-[-0.05em] leading-[0.85] text-foreground w-full break-words",
          getValueSize(value)
        )}>
          {value}
        </h3>
      </div>

      <div className="mt-4 md:mt-6 border-t border-border/10 pt-4 overflow-hidden">
        <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 leading-relaxed whitespace-normal group-hover:text-muted-foreground/60 transition-colors duration-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/**
 * 📊 ANALYTICS CARDS (Apex Tier Container)
 * Optimized: Hydrates with role-aware fallback data for Staff and Merchants.
 */
export function AnalyticsCards({ stats }: { stats?: StatProps[] }) {
  const { auth, isReady } = useTelegramContext();

  // SYSTEM HYDRATION: Show empty state if not authenticated
  if (!isReady || auth.isLoading) return null;

  if (!auth.isAuthenticated) {
    return (
      <div className="col-span-full rounded-[2.5rem] border border-dashed border-rose-500/20 bg-rose-500/5 p-12 text-center">
        <Lock className="mx-auto h-8 w-8 text-rose-500/40 mb-3" />
        <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Telemetry Encrypted: Handshake Required</p>
      </div>
    );
  }

  const isStaff = auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role);

  // Default Stats adapted based on Role Clearance
  const defaultStats: StatProps[] = [
    { 
      label: isStaff ? "Global Platform GMV" : "Merchant Revenue", 
      value: "$12.4k", 
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
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 w-full max-w-full overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {(stats || defaultStats).map((stat, i) => (
        <KpiCard key={i} {...stat} />
      ))}
    </section>
  );
}