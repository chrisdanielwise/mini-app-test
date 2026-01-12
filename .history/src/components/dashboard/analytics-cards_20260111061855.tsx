"use client";

import { 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  icon: string | any; // Supports both string keys and Lucide components
  description: string;
}

function KpiCard({ label, value, trend, trendUp, icon, description }: StatProps) {
  const Icon = typeof icon === 'string' ? IconMap[icon] || Activity : icon;

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/40 p-8 backdrop-blur-xl transition-all hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1">
      <div className="flex justify-between items-start mb-6">
        <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shadow-inner">
          <Icon className="h-6 w-6" />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter italic",
          trendUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
        )}>
          {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">
          {label}
        </p>
        <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
          {value}
        </h3>
      </div>

      <p className="mt-6 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 leading-relaxed">
        {description}
      </p>

      <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

export function AnalyticsCards({ stats }: { stats?: StatProps[] }) {
  const defaultStats: StatProps[] = [
    { label: "Gross Revenue", value: "$12.4k", trend: "+14.2%", trendUp: true, icon: "DollarSign", description: "Net liquidity processed via Zipha Gateway." },
    { label: "Active Nodes", value: "1,240", trend: "+5.1%", trendUp: true, icon: "Activity", description: "Live user instances in current cluster." },
    { label: "New Subscribers", value: "184", trend: "-2.4%", trendUp: false, icon: "Users", description: "Identity verified in the last 24 hours." },
    { label: "Growth Rate", value: "22.8%", trend: "+8.3%", trendUp: true, icon: "TrendingUp", description: "Tier 3 expansion vs previous epoch." }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-700">
      {(stats || defaultStats).map((stat, i) => (
        <KpiCard key={i} {...stat} />
      ))}
    </section>
  );
}