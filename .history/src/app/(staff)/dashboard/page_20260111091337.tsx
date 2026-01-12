import { Suspense } from "react";
import Link from "next/link";
import {
  PlusCircle,
  TicketPercent,
  Zap,
  Activity,
  Terminal,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { redirect } from "next/navigation";

// 🔐 Staff Identity Handshake
import { getMerchantSession } from "@/lib/auth/merchant-session";

// 🏗️ Layout & Shell Nodes
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatsCardSkeleton } from "@/components/dashboard/stats-card";

// 📊 Async Data Hydration
import { AsyncRevenueCard } from "@/components/dashboard/async-revenue-card";
import AsyncSubscribersCard from "@/components/dashboard/async-subscribers-card";
import AsyncActivityFeed from "@/components/dashboard/async-activity-feed";
import { cn } from "@/lib/utils";

/**
 * 🛰️ MERCHANT COMMAND CENTER (Tactical Medium)
 * Normalized: World-standard fluid scaling for institutional oversight.
 * Optimized: High-density layout to prevent metric cropping.
 */
export default async function DashboardPage() {
  const session = await getMerchantSession();

  if (!session) redirect("/dashboard/login?reason=session_invalid");

  const { role, merchantId } = session.user;
  
  // 🛡️ ROLE LOGIC
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);
  const isMerchant = role === "merchant";

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10 px-4 md:px-8">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="border-b border-border/40 pb-6">
        <DashboardHeader
          title={isPlatformStaff ? "Platform Oversight" : "Merchant Terminal"}
          subtitle={`Session_Active: ${session.user.fullName || "Authorized Staff"}`}
        />
        <div className="flex items-center gap-2 mt-2 opacity-30">
          <Terminal className="h-3 w-3" />
          <p className="text-[8px] font-black uppercase tracking-[0.3em] italic">
            Node: {isPlatformStaff ? "GLOBAL_CORE" : (session.config.companyName || "CLUSTER_NODE")} // {role}
          </p>
        </div>
      </div>

      {/* 📊 TACTICAL STATS LEDGER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* 🚀 CRITICAL UPDATE: 
            If isPlatformStaff is true, we pass NULL to merchantId 
            to tell the component to fetch GLOBAL data instead of filtered data.
        */}
        <Suspense fallback={<StatsCardSkeleton />}>
          <AsyncRevenueCard merchantId={isPlatformStaff ? undefined : merchantId} />
        </Suspense>
        
        <Suspense fallback={<StatsCardSkeleton />}>
          <AsyncSubscribersCard merchantId={isPlatformStaff ? undefined : merchantId} />
        </Suspense>

        {/* Staff-Only Global Health Metric */}
        {isPlatformStaff && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col justify-center">
             <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-1">System Health</p>
             <p className="text-xl font-black italic uppercase">Operational</p>
          </div>
        )}
      </div>

      {/* --- OPERATIONAL FEED & RAPID COMMANDS --- */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border/10 bg-card/40 shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/10 bg-muted/10 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {isPlatformStaff ? "Global Signal Feed" : "Inbound Telemetry"}
              </h3>
              <div className={cn("h-2 w-2 rounded-full animate-pulse", isPlatformStaff ? "bg-amber-500" : "bg-emerald-500")} />
            </div>
            <Suspense fallback={<ActivityPlaceholder />}>
              <AsyncActivityFeed merchantId={isPlatformStaff ? undefined : merchantId} />
            </Suspense>
          </div>
        </div>

        {/* Rapid Protocol Sidebar */}
        <div className="space-y-6">
          {/* 🚀 ACTION GATING: Only merchants see "New Service" buttons */}
          {isMerchant && (
            <div className="rounded-2xl border border-border/10 bg-card/40 backdrop-blur-md p-5 md:p-6 shadow-lg">
              <h3 className="text-xs font-black uppercase italic tracking-widest mb-4 flex items-center gap-2 text-foreground/80">
                <Zap className="h-3.5 w-3.5 text-primary" />
                Quick Actions
              </h3>
              <div className="grid gap-2">
                <ActionBtn href="/dashboard/services/new" icon={PlusCircle} title="New Service" sub="Setup subscription" />
                <ActionBtn href="/dashboard/coupons" icon={TicketPercent} title="Create Coupon" sub="Run promotion" />
              </div>
            </div>
          )}

          {/* Staff-Only: Global Support Redirect */}
          {isPlatformStaff && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 shadow-lg">
               <h3 className="text-xs font-black uppercase italic tracking-widest mb-4 flex items-center gap-2 text-amber-500">
                <MessageSquare className="h-3.5 w-3.5" />
                Support Queue
              </h3>
              <Link href="/dashboard/support" className="block w-full py-3 px-4 bg-amber-500 text-black text-center text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform">
                Open Resolution Terminal
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** 🛠️ UI HELPERS: Tactical Fallbacks */
function ChartPlaceholder() {
  return (
    <div className="h-[250px] md:h-[300px] w-full animate-pulse rounded-xl bg-muted/5 border border-border/5" />
  );
}

function ActivityPlaceholder() {
  return (
    <div className="h-[300px] md:h-[400px] w-full animate-pulse bg-transparent" />
  );
}

function ActionBtn({ href, icon: Icon, title, sub }: any) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-border/10 p-3.5 transition-all hover:bg-primary/5 active:scale-[0.98] bg-muted/5"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-tight italic text-foreground group-hover:text-primary transition-colors">
          {title}
        </p>
        <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
          {sub}
        </p>
      </div>
    </Link>
  );
}