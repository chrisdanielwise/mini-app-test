import { requireStaff } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { redirect } from "next/navigation";
import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { headers, cookies } from "next/headers"; // 🚀 Added cookies for telemetry

/**
 * 🛰️ STAFF ROOT LAYOUT (Institutional v14.27.0)
 * Logic: Hardened with Deep Session Telemetry.
 */
export default async function StaffRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const cookieStore = await cookies();
  
  const xPath = headerList.get("x-invoke-path");
  const xUrl = headerList.get("x-url");
  const referer = headerList.get("referer");
  
  // 🛡️ 1. DEEP TELEMETRY LOGS
  console.log("-------------------------------------------");
  console.log(`📡 [Ingress]: path=${xPath || "N/A"} | url=${xUrl || "N/A"}`);
  
  // Check if the cookie actually exists at the Layout level
  const hasAuthCookie = cookieStore.has("auth_token");
  console.log(`🍪 [Cookie_Check]: auth_token present: ${hasAuthCookie}`);

  const isLoginPage = [xPath, xUrl, referer].some(val => val?.toLowerCase().includes("login"));
  console.log(`🛡️ [Loop_Breaker]: isLoginPage: ${isLoginPage}`);

  if (isLoginPage) {
    console.log("✅ [Loop_Breaker]: Bypassing Gate for Login Page.");
    return (
      <TelegramProvider>
        <LayoutProvider>
          <main className="min-h-screen bg-background">{children}</main>
        </LayoutProvider>
      </TelegramProvider>
    );
  }

  // 🛡️ 2. IDENTITY HANDSHAKE
  console.log("🛡️ [Auth_Gate]: Attempting requireStaff()...");
  const session = await requireStaff().catch((err) => {
    console.error("❌ [Auth_Error]: Handshake Fault:", err.message);
    return null;
  });

  if (!session) {
    console.log("🚫 [Auth_Fail]: Session resolution returned null.");
    // 🚀 FINAL PROTECTION: Never redirect if we are already where we need to be
    if (isLoginPage) return <>{children}</>;
    
    console.log("🚀 [Action]: Executing Redirect to Login.");
    redirect("/dashboard/login?reason=auth_required");
  }

  // 🛡️ 3. ACCESS GRANTED
  console.log(`🔓 [Access_Granted]: Node Authorized for User: ${session.user.id}`);

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
        </div>
      </LayoutProvider>
    </TelegramProvider>
  );
}