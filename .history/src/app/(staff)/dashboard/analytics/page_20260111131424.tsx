import { requireStaff } from "@/lib/auth/session";
import * as MerchantService from "@/lib/services/merchant.service";
import {
  TrendingUp,
  CreditCard,
  Activity,
  Users,
  Ticket,
  Zap,
  PieChart as PieIcon,
  Globe,
  ShieldCheck,
  Terminal,
  BarChart3,
} from "lucide-react";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { cn } from "@/lib/utils";
import { RevenueChart } from "@/components/dashboard/revenue-chart";

/**
 * 🛰️ PERFORMANCE INTELLIGENCE (Tactical Apex)
 * Normalized: Unified viewport for Staff Global Oversight and Merchant Data.
 */
export default async function AnalyticsPage() {
  const session = await requireStaff();
  
  // 🛡️ ROLE PROTOCOL
  const { role, merchantId: rawMerchantId } = session.user;
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);

  // 🏁 DATA INGRESS: Fetch Global or Cluster-specific intelligence
  // We pass 'undefined' for staff to the service to trigger global aggregation
  const targetId = isPlatformStaff ? undefined : rawMerchantId;

  const [stats, categoryData] = await Promise.all([
    MerchantService.getDashboardStats(targetId),
    MerchantService.getCategoryDistribution(targetId),
  ]);

  const analytics = stats.analytics;

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 px-4">
      
      {/* --- COMMAND HUD HEADER: MODE AWARE --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe className={cn("h-3.5 w-3.5", isPlatformStaff ? "text-amber-500" : "text-primary/60")} />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-60">
              {isPlatformStaff ? "Global_Platform_Intelligence" : "Node_Intelligence_Cluster"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic text-foreground">
            {isPlatformStaff ? "System" : "Performance"} <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Intelligence</span>
          </h1>
          <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground opacity-40">
            <Terminal className="h-3 w-3" />
            <span>ID: {rawMerchantId?.slice(0, 8) || "ROOT_NODE"} // Protocol_Sync</span>
          </div>
        </div>

        <div className={cn(
          "flex items-center gap-3 border px-4 py-2 rounded-xl backdrop-blur-md",
          isPlatformStaff ? "bg-amber-500/5 border-amber-500/20" : "bg-muted/10 border-border/40"
        )}>
           <div className="text-right">
              <p className={cn("text-[10px] font-black uppercase italic", isPlatformStaff ? "text-amber-500" : "text-emerald-500")}>
                {isPlatformStaff ? "Oversight_Active" : "Node_Stable"}
              </p>
           </div>
           <ShieldCheck className={cn("h-4 w-4", isPlatformStaff ? "text-amber-500" : "text-emerald-500")} />
        </div>
      </div>

      {/* --- METRIC GRID: TACTICAL SCALING --- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {/* Metric Node: Revenue */}
        <div className={cn(
          "rounded-2xl border p-5 shadow-lg relative overflow-hidden group min-h-[140px] flex flex-col justify-between transition-all",
          isPlatformStaff ? "border-amber-500/20 bg-amber-500/[0.02]" : "border-primary/20 bg-card/40"
        )}>
          <div className="flex justify-between items-start">
            <p className={cn("text-[9px] font-black uppercase tracking-widest italic", isPlatformStaff ? "text-amber-500/60" : "text-primary/60")}>
              {isPlatformStaff ? "Global Gross" : "Revenue"}
            </p>
            <CreditCard className={cn("h-4 w-4 opacity-40", isPlatformStaff ? "text-amber-500" : "text-primary")} />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter italic leading-none tabular-nums">
              ${Number(analytics?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-1 text-emerald-500">
              <TrendingUp className="h-3 w-3" />
              <span className="text-[8px] font-bold uppercase tracking-tighter">Live Velocity</span>
            </div>
          </div>
        </div>

        {/* Metric Node: Subscribers */}
        <div className="rounded-2xl border border-border/10 bg-card/40 p-5 shadow-sm min-h-[140px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 italic">
              {isPlatformStaff ? "Total Users" : "Subscribers"}
            </p>
            <Users className="h-4 w-4 text-muted-foreground opacity-30" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter italic leading-none tabular-nums">
            {stats.activeSubscriptions.toLocaleString()}
          </h3>
          <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-40 italic">Active Ident Nodes</p>
        </div>

        {/* Metric Node: Support */}
        <div className="rounded-2xl border border-border/10 bg-card/40 p-5 shadow-sm min-h-[140px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 italic">Inquiries</p>
            <Ticket className="h-4 w-4 text-muted-foreground opacity-30" />
          </div>
          <h3 className={cn(
                "text-2xl md:text-3xl font-black tracking-tighter italic leading-none",
                stats.pendingTickets > 0 ? "text-amber-500" : "text-foreground"
              )}>
            {stats.pendingTickets}
          </h3>
          <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-40 italic">Pending Intervention</p>
        </div>

        {/* Metric Node: System Status */}
        <div className="rounded-2xl border border-border/10 bg-card/40 p-5 shadow-sm min-h-[140px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 italic">Node Status</p>
            <Zap className={cn("h-4 w-4 opacity-30", isPlatformStaff ? "text-amber-500" : "text-primary")} />
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter italic uppercase leading-none">
            {isPlatformStaff ? "SYSTEM" : "APEX"}<span className={cn("text-sm", isPlatformStaff ? "text-amber-500" : "text-primary")}>_V8</span>
          </h3>
          <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-40 italic">Protocol_Stable</p>
        </div>
      </div>

      {/* --- VISUALIZATION LAYER --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border/10 bg-card/40 p-6 shadow-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BarChart3 className={cn("h-4 w-4", isPlatformStaff ? "text-amber-500" : "text-primary")} />
              <h2 className="text-lg font-black uppercase italic tracking-tight">Revenue Scalability</h2>
            </div>
          </div>
          <div className="h-[300px] md:h-[350px] w-full bg-muted/5 rounded-xl border border-border/10 p-2">
            <RevenueChart data={analytics?.chartData || []} theme={isPlatformStaff ? "amber" : "emerald"} />
          </div>
        </div>

        <div className="rounded-2xl border border-border/10 bg-card/40 p-6 shadow-xl flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <PieIcon className="h-4 w-4 text-emerald-500" />
            <h2 className="text-lg font-black uppercase italic tracking-tight">Asset Spread</h2>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
            <CategoryChart data={categoryData} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 opacity-20 py-6">
        <Activity className={cn("h-3 w-3", isPlatformStaff ? "text-amber-500" : "text-primary")} />
        <p className="text-[8px] font-black uppercase tracking-[0.3em] italic text-center leading-none">
          Intelligence synchronized // Session: {role}
        </p>
      </div>
    </div>
  );
}