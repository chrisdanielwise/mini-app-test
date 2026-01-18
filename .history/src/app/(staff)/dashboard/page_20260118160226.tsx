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
 * Strategy: Viewport-Locked Reservoir.
 * Fix: Forced h-full and min-h-0 to ensure HUD remains stationary on mobile.
 */
export default async function DashboardPage() {
  const session = await getSession().catch(() => null);
  
  if (!session) {
    redirect("/login?reason=session_invalid");
  }

  const targetId = session.isStaff ? null : session.merchantId;

  return (
    /* 🏛️ PRIMARY CHASSIS: Locked at 100% height of the DashboardClientView slot */
    <DashboardClientView session={session}>
      
      {/* 🚀 THE RESERVOIR: Independent Scroll Volume 
          🏁 THE FIX: overflow-y-auto + h-full + min-h-0 locks the parent headers.
      */}
      <div className="h-full w-full overflow-y-auto custom-scrollbar flex flex-col min-h-0 overscroll-contain">
        
        {/* 🏎️ CONTENT_VOLUME: Padding and spacing for the cards */}
        <div className="px-4 md:px-6 py-6 space-y-8 flex-1">
          
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

          {/* 🌫️ BOTTOM CLEARANCE: Standardized for Mobile BottomNav */}
          <div className="h-28 md:h-12" />
        </div>
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