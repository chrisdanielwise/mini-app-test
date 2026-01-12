import { getSession } from "@/lib/auth/session"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardTopNav } from "@/components/dashboard/top-nav"
import DashboardLayoutClient from "./dashboard/layout-client" 
import { redirect } from "next/navigation"

/**
 * 🛰️ STAFF ROUTE GROUP LAYOUT
 * This is a nested layout. Document tags (html/body) are inherited from the root.
 */
export default async function StaffRootLayout({ children }: { children: React.ReactNode }) {
  
  // 🛡️ 1. SERVER-SIDE IDENTITY HANDSHAKE
  let session;
  try {
    session = await getSession();
  } catch (error) {
    return redirect("/dashboard/login?reason=auth_required");
  }

  // 🛡️ 2. SECURITY PERIMETER
  if (session.user.role === "user") {
    return redirect("/unauthorized?reason=insufficient_clearance");
  }

  // 🛰️ 3. CONTEXT MAPPING: Standardizing data for Sidebar & TopNav
  const dashboardContext = { 
    merchantId: session.user.merchantId ?? null, 
    role: session.user.role, 
    user: session.user,
    config: session.config || { companyName: "Zipha Terminal", planStatus: "Starter" } 
  };

  // ✅ FIXED: Removed <html>, <head>, and <body> tags.
  // We only return the Dashboard UI structure which will be injected into the Root Body.
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      
      {/* --- LEFT: TACTICAL SIDEBAR --- */}
      <DashboardSidebar context={dashboardContext} />

      {/* --- RIGHT: OPERATIONAL VIEWPORT --- */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        
        {/* TOPNAV: Identity Node & Search */}
        <DashboardTopNav context={dashboardContext} />

        {/* MAIN CONTENT AREA: Handed over to Client Engine */}
        <DashboardLayoutClient userRole={session.user.role}>
          {children}
        </DashboardLayoutClient>
      </div>
    </div>
  );
}