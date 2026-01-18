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
 * 🛰️ STAFF_ROOT_LAYOUT (Institutional v16.16.95)
 * Path: @/app/(staff)/dashboard/layout.tsx
 * Strategy: Viewport-Locked Shell & Role-Gated Tunneling.
 * Mission: Orchestrate L80+ personnel oversight within the /(staff)/ route group.
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

  // 🛡️ AUTH_BYPASS: Horizon check for login nodes
  if (xPath === "/" || xPath.includes("/login")) {
    return <>{children}</>;
  }

  // 🛡️ IDENTITY_VALIDATION: Core session check
  if (!userId) {
    redirect("/login?reason=auth_required");
  }

  /**
   * 🕵️ ROLE_TOPOLOGY_CHECK
   * Only allows high-clearance roles to enter the (staff) route group.
   * Amber/Merchant roles are permitted for identity-swap testing.
   */
  const AUTHORIZED_ROLES = ["super_admin", "platform_manager", "amber", "merchant"];
  
  if (!AUTHORIZED_ROLES.includes(userRole)) {
    redirect("/unauthorized");
  }

  const dashboardContext = { userId, role: userRole };

  return (
    <DeviceProvider>
      <TelegramProvider>
        <LayoutProvider>
          {/* 🏛️ PRIMARY MEMBRANE: Absolute Viewport Lock (100dvh for Telegram Safety) */}
          <div className="flex h-[100dvh] w-full overflow-hidden bg-black selection:bg-amber-500/30">
            
            {/* 🛸 LEFT WING: Identity Terminal (Stationary Horizon) */}
            <div className="shrink-0 h-full hidden md:block border-r border-white/5 bg-zinc-950/50 backdrop-blur-3xl">
              <DashboardSidebar context={dashboardContext as any} />
            </div>
            
            {/* 🛡️ THE CONTENT COLUMN: Tactical Compression Node */}
            <div className="flex flex-col flex-1 min-w-0 h-full relative overflow-hidden">
              
              {/* 🛰️ TOP HORIZON: Stationary Staff HUD */}
              <div className="shrink-0 w-full z-50">
                <DashboardTopNav context={dashboardContext as any} />
              </div>
              
              {/* 🚀 KINETIC VOLUME: The Scroll-Capacitor Handshake */}
              {/* min-h-0 is mandatory to unlock flex-scrolling in the reservoir */}
              <div className="flex-1 min-h-0 w-full relative">
                <DashboardLayoutClient userRole={userRole}>
                  {/* 🏎️ PAGE INGRESS: The fixed-box container for high-density pages */}
                  <div className="h-full w-full min-h-0 min-w-0 overflow-hidden relative flex flex-col">
                    {children}
                  </div>
                </DashboardLayoutClient>
              </div>
            </div>

            {/* 🌫️ ATMOSPHERIC RADIANCE: Staff-Specific Identity Bleed */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
               <div className="absolute top-0 right-0 size-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
               <div className="absolute bottom-0 left-0 size-[300px] bg-amber-600/5 rounded-full blur-[100px]" />
            </div>

            {/* 📉 GRID_TOPOLOGY: Institutional Texture */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02] bg-[url('/assets/grid.svg')] bg-[length:40px_40px]" />
          </div>
        </LayoutProvider>
      </TelegramProvider>
    </DeviceProvider>
  );
}