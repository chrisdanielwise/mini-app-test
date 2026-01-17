import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { redirect } from "next/navigation";
import { TelegramProvider } from "@/components/providers/telegram-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { headers } from "next/headers"; 

/**
 * 🛰️ STAFF ROOT LAYOUT (Institutional v16.16.21)
 * Logic: Zero-DB Ingress. Trusts Proxy-Hydrated headers for sub-1ms auth.
 * Fix: Eliminates the 10s Slow Query lag and the ?error=unauthorized loop.
 */
export default async function StaffRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  
  // 1. 🛡️ EXTRACT IDENTITY FROM PROXY HEADERS
  // We trust these because the Middleware (Proxy) ensures they only exist for valid JWTs.
  const userId = headerList.get("x-user-id");
  const rawRole = headerList.get("x-user-role") || "user";
  const userRole = rawRole.toLowerCase();
  
  const xPath = headerList.get("x-invoke-path") || "";

  // 2. 🛡️ PUBLIC PATH EXEMPTION
  if (xPath === "/" || xPath.includes("/login")) {
    return <>{children}</>;
  }

  // 3. 🛡️ IDENTITY HANDSHAKE (No Database Call)
  if (!userId) {
    // If Proxy hydration failed or token is missing
    redirect("/login?reason=auth_required");
  }

  // 4. 🛡️ HARDENED ROLE AUTHORIZATION
  // Logic: Only Staff and Merchants can pass. 
  // We check the normalized lowercase role to prevent case-sensitivity loops.
  const AUTHORIZED_ROLES = ["super_admin", "merchant", "amber", "platform_manager"];
  
  if (!AUTHORIZED_ROLES.includes(userRole)) {
    console.warn(`🚫 [Access_Denied]: User ${userId} with role ${userRole} attempted dashboard ingress.`);
    redirect("/unauthorized");
  }

  // 🛰️ 5. CONTEXT MAPPING (Stateless)
  const dashboardContext = {
    userId,
    role: userRole,
    // Add other header-injected metadata here as needed
  };

  // 🛡️ 6. UI ASSEMBLY
  return (
    <TelegramProvider>
      <LayoutProvider>
        <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
          {/* Renders Sidebar using header context */}
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