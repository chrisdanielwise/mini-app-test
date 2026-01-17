import { requireStaff } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { redirect } from "next/navigation";
import { TelegramProvider } from "@/components/providers/telegram-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { headers, cookies } from "next/headers"; // 🚀 Added cookies for telemetry

/**
 * 🛰️ STAFF ROOT LAYOUT (Institutional v14.41.0)
 * Fix: Removed .catch() to allow Next.js redirects to propagate naturally.
 * Logic: Grants dashboard access to both Staff and Merchants.
 */
export default async function StaffRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const cookieStore = await cookies();
  
  const xPath = headerList.get("x-invoke-path") || "";
  const xUrl = headerList.get("x-url") || "";
  const referer = headerList.get("referer") || "";

  // Inside StaffRootLayout
const isLandingPage = xPath === "/";

if (isLandingPage) {
  // Allow rendering the children (Landing Page) without pushing to /dashboard
  return <>{children}</>;
}
  
  // 🛡️ 1. THE LOOP BREAKER
  const isLoginPage = [xPath, xUrl, referer].some(val => val.toLowerCase().includes("login"));

  if (isLoginPage) {
    return (
      <TelegramProvider>
        <LayoutProvider>
          <main className="min-h-screen bg-background">{children}</main>
        </LayoutProvider>
      </TelegramProvider>
    );
  }

  // 🛡️ 2. IDENTITY HANDSHAKE
  // 🚀 CRITICAL: Remove .catch() so redirect() can function correctly
  const session = await requireStaff();

  if (!session) {
    redirect("/login?reason=auth_required");
  }


  // 🛡️ 3. ROLE AUTHORIZATION
  const userRole = session.user.role?.toLowerCase() as string;
  
  // Allow Merchants and Staff. Kick out basic 'user' roles.
  if (userRole === "user") {
    redirect("/unauthorized");
  }

  // 🛰️ 4. CONTEXT MAPPING
  const dashboardContext = {
    merchantId: session.merchantId ?? null,
    role: session.user.role,
    user: session.user,
    config: session.config,
  };

  // 🛡️ 5. UI RENDERING
  // If the code reaches here, you WILL see the sidebar.
  return (
    <TelegramProvider>
      <LayoutProvider>
        <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
          {/* These only render if the auth gate above passes */}
          <DashboardSidebar context={dashboardContext} />
          
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
            <DashboardTopNav context={dashboardContext} />
            
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