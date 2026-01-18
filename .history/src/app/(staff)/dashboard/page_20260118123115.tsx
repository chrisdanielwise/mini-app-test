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
 * Strategy: Non-Blocking Ingress / Identity-First Render.
 * Mission: Eliminate 11.2s render lag to prevent safety redirects.
 */
export default async function DashboardPage() {
  // 🔐 1. IDENTITY_HANDSHAKE: Immediate Session Resolution
  // We only fetch the session here. This is fast and prevents the 30s timeout.
  const session = await getSession().catch(() => null);
  
  if (!session) {
    redirect("/login?reason=session_invalid");
  }

  const targetId = session.isStaff ? null : session.merchantId;

  // 🚀 2. IMMEDIATE RENDER: The UI Shell is sent to the browser in < 200ms.
  // Slow data-fetching is delegated to independent Suspense boundaries.
  return (
    <DashboardClientView session={session}>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* 📊 Node 1: Revenue Waveform (Independent Stream) */}
        <Suspense fallback={<CardSkeleton label="Syncing_Revenue_Telemetry..." />}>
          <AsyncRevenueCard merchantId={targetId} />
        </Suspense>

        {/* 🛰️ Node 2: Subscriber Expansion (Independent Stream) */}
        <Suspense fallback={<CardSkeleton label="Resolving_Growth_Node..." />}>
          <AsyncSubscribersCard merchantId={targetId} />
        </Suspense>
      </div>

      <div className="mt-8">
        {/* ⚡ Node 3: Activity Pulse (Independent Stream) */}
        <Suspense fallback={<FeedSkeleton />}>
          <AsyncActivityFeed merchantId={session.merchantId} />
        </Suspense>
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