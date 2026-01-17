import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { redirect } from "next/navigation";
import { TelegramProvider } from "@/components/providers/telegram-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { headers } from "next/headers"; 

/**
 * 🛰️ STAFF ROOT LAYOUT (Institutional v16.16.20)
 * Fix: Uses Proxy-Hydrated Headers to bypass 3s DB latency.
 * Logic: Prevents the unauthorized loop by trusting the Middleware gate.
 */
export default async function StaffRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  
  // 1. 🛡️ EXTRACT HYDRATED IDENTITY (From Middleware)
  const userId = headerList.get("x-user-id");
  const userRole = (headerList.get("x-user-role") || "user").toLowerCase();
  const xPath = headerList.get("x-invoke-path") || "";

  // 2. 🛡️ THE LOOP BREAKER
  const isLandingPage = xPath === "/";
  if (isLandingPage) return <>{children}</>;

  // 3. 🛡️ IDENTITY HANDSHAKE (No DB Call)
  // If the Proxy didn't find a user, it would have already redirected.
  // We check here as a secondary safety measure.
  if (!userId) {
    redirect("/login?reason=auth_required");
  }

  // 4. 🛡️ ROLE AUTHORIZATION
  // Block basic 'user' roles from accessing the Staff/Merchant dashboard.
  if (userRole === "user") {
    redirect("/unauthorized");
  }

  // 🛰️ 5. CONTEXT MAPPING
  // We build the context from headers and session metadata
  const dashboardContext = {
    userId,
    role: userRole,
    // Note: If you need full user/merchant objects, use the cached service
    // merchantId: headerList.get("x-merchant-id")
  };

  return (
    <TelegramProvider>
      <LayoutProvider>
        <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
          <DashboardSidebar context={dashboardContext as any} />
          
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
            <DashboardTopNav context={dashboardContext as any} />
            
            <DashboardLayoutClient userRole={userRole}>
              <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                {children}
              </main>
            </DashboardLayoutClient>
          </div>
        </div>
      </LayoutProvider>
    </TelegramProvider>
  );
}