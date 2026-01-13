import { requireStaff } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { redirect } from "next/navigation";
import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { cookies } from "next/headers";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🛰️ STAFF ROOT LAYOUT (Institutional v13.8.0)
 * Architecture: Server-First Identity with Client-Side Telegram Bridge.
 * Security: Hardened session gating to eliminate 307 redirect loops.
 */
export default async function StaffRootLayout({ children }: { children: React.ReactNode }) {
  // 🛡️ 1. SERVER-SIDE PRE-FLIGHT
  const cookieStore = await cookies();
  const hasSession = cookieStore.has(JWT_CONFIG.cookieName);

  // 🛡️ 2. IDENTITY HANDSHAKE
  // This executes on the server. If the HttpOnly cookie set by /api/auth/magic 
  // is missing, the user is ejected before the page even begins to render.
  const session = await requireStaff().catch(() => {
    return null;
  });

  if (!session) {
    redirect("/dashboard/login?reason=auth_required");
  }

  // 🛡️ 3. ROLE NORMALIZATION & GATING
  const userRole = session.user.role?.toLowerCase();
  
  // Extra layer of protection: ensure 'user' roles cannot access staff dashboard
  if (userRole === "user") {
    redirect("/login?reason=access_denied");
  }

  // 🛰️ 4. CONTEXT MAPPING
  const dashboardContext = { 
    merchantId: session.merchantId ?? null, 
    role: userRole, 
    user: session.user,
    config: session.config || { companyName: "Zipha Terminal", isGlobal: true } 
  };

  return (
    /* 🚀 STEP 1: Wrap the tree in TelegramProvider to handle TMA SDK initialization.
       The provider will now detect if it's in a browser or inside Telegram. */
    <TelegramProvider>
      <LayoutProvider>
        <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
          
          {/* 🛡️ SIDEBAR: Hydrated with server-verified session */}
          <DashboardSidebar context={dashboardContext} />

          <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
            
            {/* 🛰️ TOP NAV: Handles node-switching and identity display */}
            <DashboardTopNav context={dashboardContext} />

            {/* 🚀 CLIENT HYDRATION BRIDGE
                Handles Telegram-specific UI logic like Haptics, MainButton, 
                and BackButton management for nested dashboard routes. */}
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