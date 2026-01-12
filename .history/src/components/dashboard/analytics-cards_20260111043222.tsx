"use client";

import { 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";

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
 * 📊 KPI CARD (Apex Tier)
 * Normalized: Fluid typography scales and adaptive horizontal safe-zones.
 * Optimized: Resilient metrics that prevent clipping on high-density displays.
 */
function KpiCard({ label, value, trend, trendUp, icon, description }: StatProps) {
  const Icon = typeof icon === 'string' ? IconMap[icon] || Activity : icon;

  return (
    <div 
      onClick={() => hapticFeedback("light")}
      className={cn(
        "group relative overflow-hidden flex flex-col justify-between min-h-[160px] md:min-h-[200px]",
        "rounded-[2rem] md:rounded-[2.5rem] border border-border/40 bg-card/40",
        "p-5 md:p-8 backdrop-blur-xl transition-all duration-500",
        "hover:border-primary/30 hover:shadow-2xl active:scale-[0.98] cursor-default shadow-lg"
      )}
    >
      {/* Visual Telemetry: Background Aura */}
      <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="flex justify-between items-start mb-6">
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-muted/50 flex items-center justify-center text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-inner">
          <Icon className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110" />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black tracking-tighter italic border",
          trendUp 
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
        )}>
          {trendUp ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
          {trend}
        </div>
      </div>

      <div className="space-y-1.5 md:space-y-2 relative z-10 min-w-0">
        <div className="flex items-center gap-2 opacity-40 italic">
          <Zap className="h-2.5 w-2.5 text-primary" />
          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] truncate">
            {label}
          </p>
        </div>
        <h3 className={cn(
          "font-black uppercase italic tracking-tighter leading-none truncate w-full",
          // FLUID METRIC LOGIC: Shrinks text size for long digits
          value.length > 8 ? "text-xl sm:text-2xl md:text-3xl" : "text-2xl sm:text-3xl md:text-4xl"
        )}>
          {value}
        </h3>
      </div>

      <p className="mt-4 md:mt-6 text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 leading-relaxed truncate group-hover:opacity-100 transition-opacity">
        {description}
      </p>
    </div>
  );
}

export function AnalyticsCards({ stats }: { stats?: StatProps[] }) {
  const defaultStats: StatProps[] = [
    { label: "Gross Revenue", value: "$12,400.00", trend: "+14.2%", trendUp: true, icon: "DollarSign", description: "Liquidity processed via Zipha Gateway." },
    { label: "Active Nodes", value: "1,240", trend: "+5.1%", trendUp: true, icon: "Activity", description: "Live user instances in cluster." },
    { label: "New Subscribers", value: "184", trend: "-2.4%", trendUp: false, icon: "Users", description: "Identity verified in last epoch." },
    { label: "Growth Rate", value: "22.8%", trend: "+8.3%", trendUp: true, icon: "TrendingUp", description: "Tier 3 expansion vs previous." }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-in slide-in-from-bottom-4 duration-1000">
      {(stats || defaultStats).map((stat, i) => (
        <KpiCard key={i} {...stat} />
      ))}
    </section>
  );
}