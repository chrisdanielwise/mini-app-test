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
 * 🛰️ STAFF_ROOT_LAYOUT (Institutional v16.16.98)
 * Strategy: Viewport-Locked Shell & Role-Gated Tunneling.
 * Fix: Restored 'merchant' to authorized roles to prevent loop.
 * Fix: Optimized z-indexing for HUD stability.
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

  // 🛡️ IDENTITY_VALIDATION: Core session check from Proxy Handshake
  if (!userId) {
    redirect("/login?reason=auth_required");
  }

  /**
   * 🕵️ ROLE_TOPOLOGY_CHECK
   * Hardened: Permits merchants and all staff levels.
   */
  const AUTHORIZED_ROLES = [
    "super_admin", 
    "platform_manager", 
    "platform_support", 
    "amber", 
    "merchant", // ✅ RESTORED: Critical for Merchant Terminal access
  ];
  cons
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
            <div className="shrink-0 h-full hidden lg:block border-r border-white/5 bg-zinc-950/50 backdrop-blur-3xl relative z-50">
              <DashboardSidebar context={dashboardContext as any} />
            </div>
            
            {/* 🛡️ THE CONTENT COLUMN: Tactical Compression Node */}
            <div className="flex flex-col flex-1 min-w-0 h-full relative overflow-hidden">
              
              {/* 🛰️ TOP HORIZON: Stationary HUD */}
              <div className="shrink-0 w-full z-[60] bg-black">
                <DashboardTopNav context={dashboardContext as any} />
              </div>
              
              {/* 🚀 KINETIC VOLUME: The Scroll-Capacitor Handshake */}
              {/* min-h-0 is mandatory to unlock flex-scrolling in the reservoir */}
              <div className="flex-1 min-h-0 w-full relative z-10 bg-black">
                <DashboardLayoutClient userRole={userRole}>
                  {/* 🏎️ PAGE INGRESS: The fixed-box container for high-density pages */}
                  <div className="h-full w-full min-h-0 min-w-0 overflow-hidden relative flex flex-col">
                    {children}
                  </div>
                </DashboardLayoutClient>
              </div>
            </div>

            {/* 🌫️ ATMOSPHERIC RADIANCE: Dynamic Identity Bleed */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
               <div className={cn(
                 "absolute top-0 right-0 size-[500px] rounded-full blur-[140px] transition-colors duration-1000",
                 userRole === "merchant" ? "bg-primary/10" : "bg-amber-500/10"
               )} />
               <div className="absolute bottom-0 left-0 size-[300px] bg-zinc-500/5 rounded-full blur-[120px]" />
            </div>

            {/* 📉 GRID_TOPOLOGY: Institutional Texture */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('/assets/grid.svg')] bg-[length:32px_32px]" />
          </div>
        </LayoutProvider>
      </TelegramProvider>
    </DeviceProvider>
  );
}