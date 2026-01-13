import { requireStaff } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { redirect } from "next/navigation";
import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { headers } from "next/headers";

/**
 * 🛰️ STAFF ROOT LAYOUT (Institutional v13.9.18)
 * Architecture: Server-First Identity with Debug Verbosity.
 */
export default async function StaffRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🛡️ 1. THE LOOP BREAKER & DEBUG CONSOLE
  const headerList = await headers();
  const currentPath = headerList.get("x-invoke-path") || "";
  
  // --- 🛰️ DEBUG LOG START ---
  console.log("-------------------------------------------");
  console.log(`📡 [Layout_Ingress]: ${currentPath || "EMPTY_PATH"}`);
  // --- 🛰️ DEBUG LOG END ---

  // Check if we are in the "Safe Zone"
  const isLoginPage = currentPath.includes("/dashboard/login");

  if (isLoginPage) {
    console.log("✅ [Loop_Breaker]: Login Page detected. Bypassing Auth.");
    return (
      <TelegramProvider>
        <LayoutProvider>{children}</LayoutProvider>
      </TelegramProvider>
    );
  }

  // 🛡️ 2. IDENTITY HANDSHAKE
  console.log("🛡️ [Auth_Gate]: Checking Session for protected route...");
  const session = await requireStaff().catch((err) => {
    console.error("❌ [Auth_Error]: requireStaff failed:", err.message);
    return null;
  });

  if (!session) {
    console.log("🚫 [Auth_Fail]: No Session. Redirecting to Login.");
    redirect("/dashboard/login?reason=auth_required");
  }

  // 🛡️ 3. ROLE AUTHORIZATION
  const userRole = session.user.role?.toLowerCase();
  console.log(`👤 [Identity]: User=${session.user.id} | Role=${userRole}`);

  if (userRole === "user") {
    console.log("⛔ [Access_Denied]: Redirecting to Unauthorized.");
    redirect("/unauthorized");
  }

  console.log("🔓 [Access_Granted]: Rendering Dashboard Layout.");

  // 🛰️ 4. CONTEXT MAPPING
  const dashboardContext = {
    merchantId: session.merchantId ?? null,
    role: session.user.role,
    user: session.user,
    config: session.config || { companyName: "Zipha Terminal", isGlobal: true },
  };

  return (
    <TelegramProvider>
      <LayoutProvider>
        <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
          <DashboardSidebar context={dashboardContext} />
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
            <DashboardTopNav context={dashboardContext} />
            <DashboardLayoutClient userRole={session.user.role}>
              <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                {children}
              </main>
            </DashboardLayoutClient>
          </div>
          <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
      </LayoutProvider>
    </TelegramProvider>
  );
}