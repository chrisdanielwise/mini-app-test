import { requireStaff } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { redirect } from "next/navigation";
import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { cookies, headers } from "next/headers";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🛰️ STAFF ROOT LAYOUT (Institutional v13.9.12)
 * Architecture: Server-First Identity with Client-Side Telegram Bridge.
 * Security: Hardened session gating with an explicit Loop-Breaker.
 */
export default async function StaffRootLayout({ children }: { children: React.ReactNode }) {
  // 🛡️ 1. THE LOOP BREAKER
  // We detect the current path via request headers to see if we are on the login page.
  // This prevents requireStaff from redirecting to a page that is already trying to load.
  const headerList = await headers();
  const currentPath = headerList.get("x-invoke-path") || "";
  const isLoginPage = currentPath.includes("/dashboard/login");

  if (isLoginPage) {
    return (
      <TelegramProvider>
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </TelegramProvider>
    );
  }

  // 🛡️ 2. SERVER-SIDE PRE-FLIGHT
  const cookieStore = await cookies();
  const hasSession = cookieStore.has(JWT_CONFIG.cookieName);

  // 🛡️ 3. IDENTITY HANDSHAKE
  // This executes on the server. If the HttpOnly cookie is missing,
  // the user is ejected before the page even begins to render.
  const session = await requireStaff().catch(() => {
    return null;
  });

  if (!session) {
    redirect("/dashboard/login?reason=auth_required");
  }

  // 🛡️ 4. ROLE NORMALIZATION & GATING
  const userRole = session.user.role?.toLowerCase();
  
  if (userRole === "user") {
    redirect("/dashboard/login?reason=access_denied");
  }

  // 🛰️ 5. CONTEXT MAPPING
  const dashboardContext = { 
    merchantId: session.merchantId ?? null, 
    role: userRole, 
    user: session.user,
    config: session.config || { companyName: "Zipha Terminal", isGlobal: true } 
  };

  return (
    <TelegramProvider>
      <LayoutProvider>
        <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
          
          {/* 🛡️ SIDEBAR: Hydrated with server-verified session */}
          <DashboardSidebar context={dashboardContext} />

          <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
            
            {/* 🛰️ TOP NAV: Handles node-switching and identity display */}
            <DashboardTopNav context={dashboardContext} />

            {/* 🚀 CLIENT HYDRATION BRIDGE
                Handles Telegram-specific UI logic like Haptics/MainButton */}
            <DashboardLayoutClient userRole={userRole}>
              <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                {children}
              </main>
            </DashboardLayoutClient>
          </div>
          
          {/* Subtle Grid Overlay for Institutional UI look */}
          <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
      </LayoutProvider>
    </TelegramProvider>
  );
}