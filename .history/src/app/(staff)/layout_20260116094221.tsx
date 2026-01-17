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
 * 🏛️ STAFF_ROOT_LAYOUT (Institutional Apex v2026.1.15)
 * Architecture: Server-Side Identity Gate with Laminar Membrane.
 * Aesthetics: Obsidian-OLED Depth | Vapour-Glass Horizon.
 */
export default async function StaffRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  
  // 🛰️ TELEMETRY INGRESS: Extracting identity from the request edge
  const userId = headerList.get("x-user-id");
  const rawRole = headerList.get("x-user-role") || "user";
  const userRole = rawRole.toLowerCase();
  const xPath = headerList.get("x-invoke-path") || "";

  // 🛡️ AUTH_GATING_PROTOCOL
  if (xPath === "/" || xPath.includes("/login")) {
    return <>{children}</>;
  }

  // 🛰️ IDENTITY HANDSHAKE: Early exit for unauthenticated vectors
  if (!userId) {
    redirect("/login?reason=auth_required");
  }

  // 🛡️ ROLE_AUTHORIZATION: Multi-tier clearance validation
  const AUTHORIZED_ROLES = ["super_admin", "merchant", "amber", "platform_manager"];
  
  if (!AUTHORIZED_ROLES.includes(userRole)) {
    redirect("/unauthorized");
  }

  const dashboardContext = { userId, role: userRole };

  return (
    <DeviceProvider>
      <TelegramProvider>
        <LayoutProvider>
          {/* 🌊 PRIMARY MEMBRANE: Absolute Viewport Isolation */}
          <div className="flex h-[100dvh] w-full overflow-hidden bg-background selection:bg-primary/30">
            
            {/* 🛸 LEFT WING: Identity Terminal */}
            <DashboardSidebar context={dashboardContext as any} />
            
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
              
              {/* 🛰️ TOP HORIZON: Identity Breadcrumbs & Global Query */}
              <DashboardTopNav context={dashboardContext as any} />
              
              {/* 🚀 KINETIC VOLUME: The Scrolling Content Shell */}
              <DashboardLayoutClient userRole={userRole}>
               
                  {/* 🏎️ PAGE INGRESS: Animated content hydration (TIGHTENED) */}
<div className={cn(
  "px-6 md:px-10 lg:px-14 pt-4 md:pt-6 pb-20", // Swapped 'p' for 'px' and reduced 'pt'
  "animate-in fade-in slide-in-from-bottom-8 duration-1000"
)}>
  {children}
</div>
                {/* </main> */}
              </DashboardLayoutClient>
            </div>

            {/* 🌫️ ATMOSPHERIC DEPTH: Fixed Backdrop Radiance */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('/assets/grid.svg')] bg-[length:60px_60px]" />
          </div>
        </LayoutProvider>
      </TelegramProvider>
    </DeviceProvider>
  );
}