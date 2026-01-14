import { requireStaff } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { redirect } from "next/navigation";
import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { headers } from "next/headers";

/**
 * 🛰️ STAFF ROOT LAYOUT (Institutional v14.24.0)
 * Logic: Triple-Redundancy Path Detection (x-path, x-url, referer).
 * Fix: Prevents 307 loops by shielding the Login Node from the Auth Gate.
 */
export default async function StaffRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🛡️ 1. THE LOOP BREAKER
  const headerList = await headers();
  
  // 🚀 TRIPLE-REDUNDANCY: Capture path from every possible ingress header
  const xPath = headerList.get("x-invoke-path");
  const xUrl = headerList.get("x-url"); // Fallback URL header
  const referer = headerList.get("referer");
  
  // Logic: Is the user currently trying to view the login node?
  const isLoginPage = 
    xPath?.includes("/dashboard/login") || 
    xUrl?.includes("/dashboard/login") ||
    referer?.includes("/dashboard/login");

  // --- 🛰️ DEBUG CONSOLE ---
  console.log("-------------------------------------------");
  console.log(`📡 [Inbound]: path=${xPath || "N/A"} | url=${xUrl || "N/A"}`);
  console.log(`🛡️ [Auth_Gate]: isLoginPage recognized: ${isLoginPage}`);

  // 🛡️ CIRCUIT BREAKER: Bypassing Auth Gate for Login Page
  if (isLoginPage) {
    console.log("✅ [Loop_Breaker]: Login Page confirmed. Accessing Public Ingress.");
    return (
      <TelegramProvider>
        <LayoutProvider>
          <main className="min-h-screen bg-background flex flex-col">
            {children}
          </main>
        </LayoutProvider>
      </TelegramProvider>
    );
  }

  // 🛡️ 2. IDENTITY HANDSHAKE (Protected Routes Only)
  console.log("🛡️ [Auth_Gate]: Checking Session for protected route...");
  
  // We use requireStaff() but handle the null state to prevent unhandled crashes
  const session = await requireStaff().catch((err) => {
    console.error("❌ [Auth_Error]: requireStaff failed:", err.message);
    return null;
  });

  // If no session exists AND we aren't on the login page, we must redirect.
  if (!session) {
    console.log("🚫 [Auth_Fail]: No valid session detected. Expelling to Login.");
    redirect("/dashboard/login?reason=auth_required");
  }

  // 🛡️ 3. ROLE AUTHORIZATION
  const userRole = session.user.role?.toLowerCase() || "user";
  console.log(`👤 [Identity]: User=${session.user.id} | Role=${userRole}`);

  if (userRole === "user") {
    console.log("⛔ [Access_Denied]: Insufficient clearance. Redirecting to Unauthorized.");
    redirect("/unauthorized");
  }

  console.log("🔓 [Access_Granted]: Identity Node Authorized.");

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

          {/* 🌌 Background Protocol Mesh */}
          <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
      </LayoutProvider>
    </TelegramProvider>
  );
}