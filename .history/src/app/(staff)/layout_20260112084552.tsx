import { requireStaff } from "@/lib/auth/session"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardTopNav } from "@/components/dashboard/top-nav"
import DashboardLayoutClient from "./dashboard/layout-client" 
import { redirect } from "next/navigation"

export default async function StaffRootLayout({ children }: { children: React.ReactNode }) {
  
  // 🛡️ 1. SERVER-SIDE IDENTITY HANDSHAKE
  let session;
  try {
    session = await requireStaff();
  } catch (error) {
    // 🚀 CRITICAL FIX: Ensure the redirect path matches your Middleware absolute path exactly.
    // Also, ensure this route actually exists in src/app/dashboard/login/page.tsx
    redirect("/dashboard/login?reason=auth_required");
  }

  // 🛡️ 2. ROLE NORMALIZATION
  // We force lowercase comparison to match the middleware RBAC hardening.
  const userRole = session.user.role?.toLowerCase();

  if (userRole === "user") {
    redirect("/dashboard/login?reason=insufficient_clearance");
  }

  // 🛰️ 3. CONTEXT MAPPING
  const dashboardContext = { 
    merchantId: session.user.merchantId ?? null, 
    role: userRole, 
    user: session.user,
    config: session.config || { companyName: "Zipha Terminal", planStatus: "Starter" } 
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <DashboardSidebar context={dashboardContext} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        <DashboardTopNav context={dashboardContext} />

        {/* 🚀 CLIENT HYDRATION BRIDGE */}
        {/* We pass the normalized userRole here to ensure the client-side 
            components (like charts) don't flicker. */}
        <DashboardLayoutClient userRole={userRole}>
          {children}
        </DashboardLayoutClient>
      </div>
    </div>
  );
}