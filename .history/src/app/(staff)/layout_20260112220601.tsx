import { requireStaff } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { redirect } from "next/navigation";
import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";

/**
 * 🛰️ STAFF ROOT LAYOUT (Institutional v9.3.0)
 * Architecture: Server-First Identity with Client-Side Telegram Bridge.
 * Hardened: Fixes "useTelegramContext" crash by wrapping the tree in TelegramProvider.
 */
export default async function StaffRootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has(JWT_CONFIG.cookieName);

  // If the server sees the cookie, the handshake was successful.
  console.log("🛰️ Dashboard Ingress - Session Active:", hasSession);
  // 🛡️ 1. SERVER-SIDE IDENTITY HANDSHAKE
  // This executes on the server. If it fails, it redirects before any JS hits the browser.
  const session = await requireStaff().catch(() => {
    redirect("/dashboard/login?reason=auth_required");
  });

  if (!session) {
    redirect("/dashboard/login?reason=auth_required");
  }

  // 🛡️ 2. ROLE NORMALIZATION
  // Matches Middleware RBAC hardening.
  const userRole = session.user.role?.toLowerCase();

  if (userRole === "user") {
    redirect("/dashboard/login?reason=insufficient_clearance");
  }

  // 🛰️ 3. CONTEXT MAPPING
  const dashboardContext = { 
    merchantId: session.merchantId ?? null, 
    role: userRole, 
    user: session.user,
    config: session.config || { companyName: "Zipha Terminal", isGlobal: true } 
  };

  return (
    // 🚀 STEP 1: Wrap everything in the Telegram & Layout Providers
    <TelegramProvider>
      <LayoutProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          {/* Sidebar and TopNav now have access to context via props */}
          <DashboardSidebar context={dashboardContext} />

          <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
            <DashboardTopNav context={dashboardContext} />

            {/* 🚀 CLIENT HYDRATION BRIDGE
                The children (the actual dashboard pages) are wrapped in the 
                client-side manager which handles Telegram Haptics/BackButtons. */}
            <DashboardLayoutClient userRole={userRole}>
              {children}
            </DashboardLayoutClient>
          </div>
        </div>
      </LayoutProvider>
    </TelegramProvider>
  );
}