import { Suspense } from "react";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { DashboardClientView } from "./dashboard-client-view";

// Server Components (Lazy Data Nodes)
import { AsyncRevenueCard } from "@/components/dashboard/async-revenue-card";
import AsyncSubscribersCard from "@/components/dashboard/async-subscribers-card";
import AsyncActivityFeed from "@/components/dashboard/async-activity-feed";


/**
 * 🛰️ DASHBOARD_PAGE (Institutional Apex v2026.1.18)
 * Strategy: Internal Scroll Reservoir.
 * Fix: Wrapped children in a scrollable div to prevent collision with the Fixed HUD.
 */
export default async function DashboardPage() {
  const session = await getSession().catch(() => null);
  
  if (!session) {
    redirect("/login?reason=session_invalid");
  }

  const targetId = session.isStaff ? null : session.merchantId;

  return (
    <DashboardClientView session={session}>
      {/* 🏁 THE FIX: This container captures the scroll volume locally */}
      <div className="h-full w-full overflow-y-auto custom-scrollbar px-6 py-6 space-y-8 overscroll-contain">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <Suspense fallback={<CardSkeleton label="Syncing_Revenue_Telemetry..." />}>
            <AsyncRevenueCard merchantId={targetId} />
          </Suspense>

          <Suspense fallback={<CardSkeleton label="Resolving_Growth_Node..." />}>
            <AsyncSubscribersCard merchantId={targetId} />
          </Suspense>
        </div>

        <div className="mt-8">
          <Suspense fallback={<FeedSkeleton />}>
            <AsyncActivityFeed merchantId={session.merchantId} />
          </Suspense>
        </div>

        {/* 🌫️ BOTTOM CLEARANCE: Ensures content clears the BottomNav */}
        <div className="h-24 md:hidden" />
      </div>
    </DashboardClientView>
  );
}

/** 🛠️ RESILIENCE COMPONENTS (UI Skeletons) */

function CardSkeleton({ label }: { label: string }) {
  return (
    <div className="h-[320px] rounded-[2.5rem] border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center animate-pulse p-8">
      <div className="size-10 rounded-2xl bg-white/5 mb-4" />
      <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/10 italic">
        {label}
      </p>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="h-[400px] rounded-[2.5rem] border border-white/5 bg-white/[0.01] animate-pulse p-8">
      <div className="h-4 w-24 bg-white/5 rounded mb-8" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 w-full bg-white/5 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}