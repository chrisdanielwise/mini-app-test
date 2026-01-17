import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { redirect } from "next/navigation";
import { TelegramProvider } from "@/components/providers/telegram-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { headers } from "next/headers"; 

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

  // 🔍 DEBUG LOG 1: Layout Entry
  console.log(`🛡️ [Layout_Gate]: Entry -> Path: ${xPath} | User: ${userId} | Role: ${userRole}`);

  if (xPath === "/" || xPath.includes("/login")) {
    return <>{children}</>;
  }

  // 🛡️ IDENTITY HANDSHAKE
  if (!userId) {
    console.error("🚨 [Layout_Redirect]: No userId found in headers. Redirecting to /login");
    redirect("/login?reason=auth_required");
  }

  // 🛡️ ROLE AUTHORIZATION
  const AUTHORIZED_ROLES = ["super_admin", "merchant", "amber", "platform_manager"];
  
  if (!AUTHORIZED_ROLES.includes(userRole)) {
    console.error(`🚫 [Layout_Redirect]: Role "${userRole}" not authorized. Redirecting to /unauthorized`);
    redirect("/unauthorized");
  }

  const dashboardContext = { userId, role: userRole };

  // 🔍 DEBUG LOG 2: Successful Layout Render
  console.log(`✅ [Layout_Success]: Rendering dashboard shell for ${userId}`);

  return (
    <TelegramProvider>
      <LayoutProvider>
        <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
          <DashboardSidebar context={dashboardContext as any} />
          
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
            <DashboardTopNav context={dashboardContext as any} />
            
            <DashboardLayoutClient userRole={userRole}>
              <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                {/* 🔍 DEBUG LOG 3: This is where children (the page content) live */}
                {children}
              </main>
            </DashboardLayoutClient>
          </div>
        </div>
      </LayoutProvider>
    </TelegramProvider>
  );
}