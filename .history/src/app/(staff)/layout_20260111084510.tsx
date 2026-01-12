import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { LayoutProvider } from "@/context/layout-provider";
import { Toaster } from "@/components/ui/sonner";
import { requireMerchantSession } from "@/lib/auth/merchant-session";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * 🏛️ STAFF GROUP ARCHITECTURE (Tactical Medium)
 * RBAC: Super Admin (100), Platform Manager (80), Platform Support (40), Merchant (10)
 * Optimized: Unified context provider for centralized support & merchant audit modes.
 */
export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";
  const isLoginPage = pathname.includes("/dashboard/login");

  // 1. Auth-less Bypass for Gateway Ingress (Login)
  if (isLoginPage) return <div className="min-h-screen bg-background">{children}</div>;

  // 2. 🔐 Staff Identity Handshake
  const session = await requireMerchantSession();
  
  // 🛡️ SECURITY PERIMETER: Hard-block standard users from accessing staff routes
  if (session.user.role === "user") {
    return redirect("/unauthorized?reason=staff_perimeter_restricted");
  }

  // 3. CENTRALIZED CONTEXT: Mapping the session to our four-tier hierarchy
  const dashboardContext = { 
    merchantId: session.merchantId, 
    role: session.user.role, 
    user: session.user,
    config: session.config 
  };

  return (
    <LayoutProvider>
      {/* ✅ UNIFIED CHASSIS: Locked height to prevent scroll-looping */}
      <div className="flex h-screen w-screen overflow-hidden bg-background selection:bg-primary/20">
        
        {/* --- LEFT: TACTICAL SIDEBAR --- */}
        {/* We pass the role so the sidebar can hide/show links via RBAC */}
        <DashboardSidebar context={dashboardContext} />

        {/* --- RIGHT: OPERATIONAL VIEWPORT --- */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          
          {/* TOPNAV: Operational Control Strip with Role Badge */}
          <DashboardTopNav context={dashboardContext} />

          {/* ✅ MAIN HORIZON: Independent Scroll with Tactical Padding */}
          <main className="flex-1 overflow-y-auto custom-scrollbar relative px-4 md:px-6 lg:px-8 py-6">
             
             {/* Backdrop Aura: High-resiliency signal glow */}
             <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/[0.04] blur-[120px] rounded-full -z-10 pointer-events-none animate-pulse" />
             
             {/* Content Clamping: World Standard 1280px Grid */}
             <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
               {children}
             </div>

             {/* Footer Telemetry */}
             <footer className="mt-20 border-t border-border/5 pt-6 pb-10 opacity-20">
               <p className="text-[8px] font-black uppercase tracking-[0.4em] text-center">
                 Zipha Unified Terminal // Mode: {session.user.role} // Protocol: v2.0.0
               </p>
             </footer>
          </main>
        </div>
      </div>

      {/* Global Signal Toast */}
      <Toaster 
        position="top-center" 
        expand={false} 
        richColors 
        theme="dark" 
        closeButton 
      />
    </LayoutProvider>
  );
}