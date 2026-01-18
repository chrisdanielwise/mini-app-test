import { Suspense } from "react";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { DashboardClientView } from "./dashboard-client-view";

// Server Components (Data Nodes)
import { AsyncRevenueCard } from "@/components/dashboard/async-revenue-card";
import AsyncSubscribersCard from "@/components/dashboard/async-subscribers-card";
import AsyncActivityFeed from "@/components/dashboard/async-activity-feed";

/**
 * 🛰️ DASHBOARD_PAGE (Resilient v2026.1.18)
 * Strategy: Immediate Entry / Lazy Data.
 * Mission: Fix the /unauthorized loop by not waiting for slow DB queries.
 */
export default async function DashboardPage() {
  // 🔐 1. IDENTITY_HANDSHAKE: This is fast (~100ms)
  // We only check if you are logged in. We DO NOT fetch stats here.
  const session = await getSession().catch(() => null);
  
  if (!session) {
    redirect("/login?reason=session_invalid");
  }

  const targetId = session.isStaff ? null : session.merchantId;

  // 🚀 2. IMMEDIATE RENDER: Returns the UI shell immediately.
  // The user sees the sidebar and layout instantly.
  return (
    <DashboardClientView session={session}>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* 📊 Node 1: Revenue Waveform */}
        <Suspense fallback={<CardSkeleton label="Syncing_Revenue_Telemetry..." />}>
          <AsyncRevenueCard merchantId={targetId} />
        </Suspense>

        {/* 🛰️ Node 2: Subscriber Expansion */}
        <Suspense fallback={<CardSkeleton label="Resolving_Growth_Node..." />}>
          <AsyncSubscribersCard merchantId={targetId} />
        </Suspense>
      </div>

      <div className="mt-8">
        {/* ⚡ Node 3: Activity Pulse */}
        <Suspense fallback={<FeedSkeleton />}>
          <AsyncActivityFeed merchantId={session.merchantId} />
        </Suspense>
      </div>

    </DashboardClientView>
  );
}

/** 🛠️ RESILIENCE COMPONENTS */

function CardSkeleton({ label }: { label: string }) {
  return (
    <div className="h-[320px] rounded-[2.5rem] border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center animate-pulse p-8">
      <div className="size-10 rounded-2xl bg-white/5 mb-4" />
      <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/10 italic">{label}</p>
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