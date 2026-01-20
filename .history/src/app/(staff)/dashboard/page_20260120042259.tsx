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
 * 🛰️ DASHBOARD_PAGE 
 * Strategy: Viewport-Locked Reservoir with Hybrid Identity Extraction.
 * Standard: Next.js 15+ Async Header Protocol + Hybrid Auth Handshake.
 */
export default async function DashboardPage() {
  // 1. 🛡️ IDENTITY_EXTRACTION (Proxy Headers)
  const headerList = await headers();
  const userId = headerList.get("x-user-id");
  const role = (headerList.get("x-user-role") || "user").toLowerCase();
  const fullName = headerList.get("x-user-name") || "Verified_Merchant";
  const userAgent = headerList.get("user-agent") || "";
  
  // 📱 Device & Protocol Logic
  const isMobile = /Mobile|Android|iPhone|Telegram/i.test(userAgent);
  const realMerchantId = userId; 

  // 🔐 2. AUTH_HANDSHAKE
  const session = await getSession().catch(() => null);
  
  if (!userId || !session) {
    redirect("/login?reason=session_invalid");
  }

  // 🎭 3. ROLE_CALIBRATION
  const isSuperAdmin = role === "super_admin";
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support", "amber"].includes(role);
  const isMerchant = role === "merchant" || role === "owner";

  // Target ID for data nodes (Null for staff to see global telemetry)
  const targetDataId = isPlatformStaff ? null : (session.user.merchantId || realMerchantId);

  return (
    /* 🏛️ PRIMARY CHASSIS: Stationary HUD container */
    <DashboardClientView session={session}>
      
      {/* 🚀 THE RESERVOIR: Independent Scroll Volume 
          🏁 THE FIX: 'overflow-y-auto' + 'flex-1' + 'min-h-0' ensures the internal 
          volume scrolls while keeping the dashboard sidebar/header locked.
      */}
      
      <div className="flex-1 w-full overflow-y-auto custom-scrollbar flex flex-col min-h-0 overscroll-contain">
        
        {/* 🏎️ CONTENT_VOLUME: Padding and tactical spacing */}
        <div className="px-4 md:px-6 py-6 space-y-8 flex-1">
          
          {/* 📊 TACTICAL STATS LEDGER */}
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

          {/* 🌫️ BOTTOM CLEARANCE: Standardized for Mobile BottomNav / Safe Areas */}
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