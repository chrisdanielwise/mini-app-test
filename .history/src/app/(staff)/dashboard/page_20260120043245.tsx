import { Suspense } from "react";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { DashboardClientView } from "./dashboard-client-view";

// Server Components (Lazy Data Nodes)
import { AsyncRevenueCard } from "@/components/dashboard/async-revenue-card";
import AsyncSubscribersCard from "@/components/dashboard/async-subscribers-card";
import AsyncActivityFeed from "@/components/dashboard/async-activity-feed";

/**
 * 🛰️ DASHBOARD_PAGE (Institutional Apex v2026.1.20)
 * Strategy: Stationary HUD & Independent Tactical Scroll.
 * Flow: Headers (Live Identity) -> Session (Hydrated Auth) -> Reservoir (UI).
 */
export default async function DashboardPage() {
  // 1. 🛡️ IDENTITY_EXTRACTION: Source of Truth from Middleware
  const headerList = await headers();
  const userId = headerList.get("x-user-id");
  const role = (headerList.get("x-user-role") || "user").toLowerCase();
  const fullName = headerList.get("x-user-name") || "Verified_Merchant";
  const userAgent = headerList.get("user-agent") || "";
  
  if (!userId) {
    redirect("/login?reason=session_invalid");
  }

  // 2. 🔐 AUTH_SESSION: Hydrated from the Database Cache
  const session = await getSession().catch(() => null);
  
  // 3. 🎭 ROLE_CALIBRATION
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support", "amber"].includes(role);
  
  // 🏁 THE FIX: Resolve the Merchant Identity. 
  // If Staff, we fetch global telemetry (null). If Merchant, we fetch for the node.
  const targetDataId = isPlatformStaff ? null : (session?.user?.merchantId || userId);

  return (
    /* 🏛️ PRIMARY CHASSIS: Stationary Layout Shell */
    <DashboardClientView session={session}>
      
      {/* 🚀 THE RESERVOIR: Independent Scroll Volume 
          🏁 THE FIX: overflow-y-auto + flex-1 + min-h-0. 
          This is what allows the page to scroll while the DashboardClientView's HUD stays still.
      */}
      <div className="flex-1 w-full overflow-y-auto custom-scrollbar flex flex-col min-h-0 overscroll-contain">
        
        {/* 🏎️ CONTENT_VOLUME: Padding and tactical spacing */}
        <div className="px-4 md:px-6 py-6 space-y-8 flex-1">
          
          {/* 📊 TACTICAL STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <Suspense fallback={<CardSkeleton label="Syncing_Revenue_Telemetry..." />}>
              <AsyncRevenueCard merchantId={targetDataId} />
            </Suspense>

            <Suspense fallback={<CardSkeleton label="Resolving_Growth_Node..." />}>
              <AsyncSubscribersCard merchantId={targetDataId} />
            </Suspense>
          </div>

          {/* --- OPERATIONAL FEED --- */}
          <div className="mt-8">
            <Suspense fallback={<FeedSkeleton />}>
              <AsyncActivityFeed merchantId={targetDataId} />
            </Suspense>
          </div>

          {/* 🌫️ BOTTOM CLEARANCE: Saftey zone for Mobile OS bars */}
          <div className="h-28 md:h-12 shrink-0" />
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
      <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/10 italic text-center">
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