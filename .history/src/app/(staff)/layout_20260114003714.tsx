import { requireStaff } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { redirect } from "next/navigation";
import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { headers } from "next/headers";

/**
 * 🛰️ STAFF ROOT LAYOUT (Institutional v14.22.0)
 * Logic: Hardened Path Detection to prevent Infinite Redirect Loops.
 */
export default async function StaffRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🛡️ 1. THE LOOP BREAKER
  const headerList = await headers();
  
  // 🚀 Logic: Check multiple header sources to ensure we capture the path correctly
  const xPath = headerList.get("x-invoke-path");
  const referer = headerList.get("referer");
  const host = headerList.get("host");
  
  // Determine if we are on the login page via x-header or Referer fallback
  const isLoginPage = 
    xPath?.includes("/dashboard/login") || 
    referer?.includes("/dashboard/login");

  console.log("-------------------------------------------");
  console.log(`📡 [Layout_Ingress]: ${xPath || "HEADER_MISSING"}`);
  console.log(`🛡️ [Auth_Gate]: isLoginPage: ${isLoginPage}`);

  // 🛡️ Bypassing Auth for Login Page
  if (isLoginPage) {
    console.log("✅ [Loop_Breaker]: Login Page confirmed. Accessing Public Ingress.");
    return (
      <TelegramProvider>
        <LayoutProvider>
          <main className="min-h-screen bg-background">
            {children}
          </main>
        </LayoutProvider>
      </TelegramProvider>
    );
  }

  // 🛡️ 2. IDENTITY HANDSHAKE (Protected Routes Only)
  console.log("🛡️ [Auth_Gate]: Checking Session for protected route...");
  const session = await requireStaff().catch((err) => {
    console.error("❌ [Auth_Error]: requireStaff failed:", err.message);
    return null;
  });

  if (!session) {
    console.log("🚫 [Auth_Fail]: No Session. Redirecting to Login.");
    // 🚀 CRITICAL: We only redirect if we are NOT on the login page
    redirect("/dashboard/login?reason=auth_required");
  }

  // ... 👤 ROLE AUTHORIZATION & DASHBOARD CONTEXT ...
  const userRole = session.user.role?.toLowerCase();
  if (userRole === "user") redirect("/unauthorized");

  const dashboardContext = {
    merchantId: session.merchantId ?? null,
    role: session.user.role,
    user: session.user,
    config: session.config || { companyName: "Zipha Terminal", isGlobal: true },
  };

  return (
    <TelegramProvider>
      <LayoutProvider>
        <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
          <DashboardSidebar context={dashboardContext} />
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
            <DashboardTopNav context={dashboardContext} />
            <DashboardLayoutClient userRole={session.user.role}>
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