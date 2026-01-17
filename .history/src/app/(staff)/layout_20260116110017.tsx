import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { redirect } from "next/navigation";
import { TelegramProvider } from "@/components/providers/telegram-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { DeviceProvider } from "@/components/providers/device-provider";
import { headers } from "next/headers"; 
import { cn } from "@/lib/utils";

/**
 * 🏛️ STAFF_ROOT_LAYOUT (Institutional Apex v2026.1.18)
 * Architecture: Rigid Flexbox Chain with Height Locking.
 * Fix: Forced 'h-screen' and 'overflow-hidden' on every major container.
 * Fix: Added 'min-h-0' to 'flex-1' containers to "unlock" internal table scrolling.
 */
export default async function StaffRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  
  const userId = headerList.get("x-user-id");
  const rawRole = headerList.get("x-user-role") || "user";
  const userRole = rawRole.toLowerCase();
  const xPath = headerList.get("x-invoke-path") || "";

  if (xPath === "/" || xPath.includes("/login")) {
    return <>{children}</>;
  }

  if (!userId) {
    redirect("/login?reason=auth_required");
  }

  const AUTHORIZED_ROLES = ["super_admin", "merchant", "amber", "platform_manager"];
  
  if (!AUTHORIZED_ROLES.includes(userRole)) {
    redirect("/unauthorized");
  }

  const dashboardContext = { userId, role: userRole };

  return (
    <DeviceProvider>
      <TelegramProvider>
        <LayoutProvider>
          {/* 🌊 PRIMARY MEMBRANE: Absolute Viewport Lock */}
          <div className="flex h-screen w-full overflow-hidden bg-background selection:bg-primary/30">
            
            {/* 🛸 LEFT WING: Identity Terminal (Fixed Width) */}
            <div className="shrink-0 h-full hidden md:block border-r border-white/5">
              <DashboardSidebar context={dashboardContext as any} />
            </div>
            
            {/* 🛡️ THE CONTENT COLUMN: This must fill remaining space and NEVER expand */}
            <div className="flex flex-col flex-1 min-w-0 h-full relative overflow-hidden">
              
              {/* 🛰️ TOP HORIZON: Stationary Identity HUD */}
              <div className="shrink-0 w-full z-50">
                <DashboardTopNav context={dashboardContext as any} />
              </div>
              
              {/* 🚀 KINETIC VOLUME: The Scrolling Content Shell */}
              {/* 🛡️ FIX: Removed padding from here; child components handle their own margins */}
              <div className="flex-1 min-h-0 w-full relative">
                <DashboardLayoutClient userRole={userRole}>
                  {/* 🏎️ PAGE INGRESS: The Stationary container for the Fixed Header page */}
                  <div className="h-full w-full min-h-0 min-w-0 overflow-hidden relative flex flex-col">
                    {children}
                  </div>
                </DashboardLayoutClient>
              </div>
            </div>

            {/* 🌫️ ATMOSPHERIC DEPTH */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('/assets/grid.svg')] bg-[length:60px_60px]" />
          </div>
        </LayoutProvider>
      </TelegramProvider>
    </DeviceProvider>
  );
}