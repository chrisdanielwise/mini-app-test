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