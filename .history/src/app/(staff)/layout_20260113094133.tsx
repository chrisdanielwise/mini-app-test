import { requireStaff } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { redirect } from "next/navigation";
import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { headers } from "next/headers";

/**
 * 🛰️ STAFF ROOT LAYOUT (Institutional v13.9.15)
 * * Architecture Strategy: Lean Authorization.
 * 1. The Middleware (proxy.ts) handles the "Is Logged In?" check (Identity).
 * 2. This Layout handles the "Is Staff?" check (Permissions).
 * 3. The Loop Breaker prevents the layout from gating its own login page.
 */
export default async function StaffRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🛡️ 1. THE LOOP BREAKER
  // We extract the current path from the custom header set in middleware.
  // This is essential because the Login page is nested inside this protected folder.
  const headerList = await headers();
  const currentPath = headerList.get("x-invoke-path") || "";

  // If the user is currently on the login route, we skip all security checks.
  // This prevents requireStaff() from triggering a redirect loop.
  if (currentPath.includes("/dashboard/login")) {
    return (
      <TelegramProvider>
        <LayoutProvider>{children}</LayoutProvider>
      </TelegramProvider>
    );
  }

  // 🛡️ 2. ROLE AUTHORIZATION (The "Clearance" Layer)
  // At this point, Middleware has already verified that a valid JWT exists.
  // We now fetch the session to verify the user has 'staff' or 'admin' roles.
  const session = await requireStaff().catch(() => null);

  if (!session) {
    redirect("/dashboard/login?reason=auth_required");
  }

  // 🛡️ ROLE GATING
  const userRole = session.user.role?.toLowerCase();

  if (userRole === "user") {
    // 🚀 REDIRECT TO THE NEW PAGE (Not the login page!)
    redirect("/unauthorized");
  }

  // 🛰️ 3. CONTEXT MAPPING
  // Prepare the data needed for the Sidebar, TopNav, and Client Hydration.
  const dashboardContext = {
    merchantId: session.merchantId ?? null,
    role: session.user.role,
    user: session.user,
    config: session.config || { companyName: "Zipha Terminal", isGlobal: true },
  };

  return (
    <TelegramProvider>
      <LayoutProvider>
        {/* Main Dashboard Container: Locked to viewport height */}
        <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
          {/* 🛡️ SIDEBAR: Renders navigation based on staff permissions */}
          <DashboardSidebar context={dashboardContext} />

          {/* 🛰️ CONTENT AREA: Handles TopNav and Page rendering */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
            <DashboardTopNav context={dashboardContext} />

            {/* 🚀 CLIENT HYDRATION BRIDGE
                Wraps children in a client-side manager for Telegram Haptics/UI logic. */}
            <DashboardLayoutClient userRole={session.user.role}>
              <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                {children}
              </main>
            </DashboardLayoutClient>
          </div>

          {/* Subtle Grid Overlay: Provides the "Institutional" UI depth */}
          <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
      </LayoutProvider>
    </TelegramProvider>
  );
}
