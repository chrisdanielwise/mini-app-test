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
 * 🏛️ STAFF_ROOT_LAYOUT (Institutional Apex v2026.1.20)
 * Architecture: Rigid Flexbox Chain with Height Locking.
 * Result: Viewport-locked shell that enables internal table scrolling.
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
          {/* 🌊 PRIMARY MEMBRANE: Absolute Viewport Lock (100dvh for mobile safety) */}
          <div className="flex h-[100dvh] w-full overflow-hidden bg-background selection:bg-primary/30">
            
            {/* 🛸 LEFT WING: Identity Terminal (Stationary) */}
            <div className="shrink-0 h-full hidden md:block border-r border-white/5">
              <DashboardSidebar context={dashboardContext as any} />
            </div>
            
            {/* 🛡️ THE CONTENT COLUMN: Fills space but never exceeds viewport height */}
            <div className="flex flex-col flex-1 min-w-0 h-full relative overflow-hidden">
              
              {/* 🛰️ TOP HORIZON: Stationary HUD */}
              <div className="shrink-0 w-full z-50">
                <DashboardTopNav context={dashboardContext as any} />
              </div>
              
              {/* 🚀 KINETIC VOLUME: The Scroll-Capacitor */}
              {/* min-h-0 is the "scroll unlock" that allows flex children to scroll */}
              <div className="flex-1 min-h-0 w-full relative">
                <DashboardLayoutClient userRole={userRole}>
                  {/* 🏎️ PAGE INGRESS: The fixed-box container for Tactical Slim pages */}
                  <div className="h-full w-full min-h-0 min-w-0 overflow-hidden relative flex flex-col">
                    {children}
                  </div>
                </DashboardLayoutClient>
              </div>
            </div>

            {/* 🌫️ ATMOSPHERIC DEPTH: Aesthetic Grid Overlay */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('/assets/grid.svg')] bg-[length:60px_60px]" />
          </div>
        </LayoutProvider>
      </TelegramProvider>
    </DeviceProvider>
  );
}