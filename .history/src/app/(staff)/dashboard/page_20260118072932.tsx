// src/app/(staff)/dashboard/page.tsx
import * as React from "react";
import { Suspense } from "react";
import { getSession } from "@/lib/auth/session"; 
import { redirect } from "next/navigation";

// 🏛️ Layout Shell
import { DashboardClientView } from "./dashboard-client-view";

// 📊 Server-Side Data Nodes (Physically isolated from Client Bundle)
import { AsyncRevenueCard } from "@/components/dashboard/async-revenue-card";
import AsyncSubscribersCard from "@/components/dashboard/async-subscribers-card";
import AsyncActivityFeed from "@/components/dashboard/async-activity-feed";

/**
 * 🛰️ DASHBOARD_PAGE (Institutional Apex v2026.1.20)
 * Strategy: Physical Boundary Enforcement via Composition.
 * Mission: Resolve 'fs/tls' leaks by keeping Prisma-dependent nodes on the server.
 */
export default async function DashboardPage() {
  // 🔐 1. IDENTITY_HANDSHAKE: Server-side session resolution
  const session = await getSession();
  
  if (!session) {
    redirect("/login?reason=session_invalid");
  }

  const { merchantId } = session;
  const isPlatformStaff = session.isStaff;

  return (
    <DashboardClientView session={session}>
      
      {/* 📊 2. TACTICAL_STATS_INGRESS: Passed as children to prevent Client Leak */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <AsyncRevenueCard merchantId={isPlatformStaff ? null : merchantId} />
        </Suspense>

        <Suspense fallback={<StatsCardSkeleton />}>
          <AsyncSubscribersCard merchantId={isPlatformStaff ? null : merchantId} />
        </Suspense>
      </div>

      {/* 🚀 3. ACTIVITY_TELEMETRY_INGRESS */}
      <div className="mt-8">
        <Suspense fallback={<ActivityPlaceholder />}>
          <AsyncActivityFeed merchantId={merchantId} />
        </Suspense>
      </div>

    </DashboardClientView>
  );
}

/** 🛠️ IN-LINE SKELETONS: Prevents layout shift during hydration */
function StatsCardSkeleton() {
  return <div className="h-[200px] rounded-[2.5rem] bg-white/[0.01] border border-white/5 animate-pulse" />;
}

function ActivityPlaceholder() {
  return (
    <div className="space-y-4 p-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 w-full bg-white/[0.01] border border-white/5 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}