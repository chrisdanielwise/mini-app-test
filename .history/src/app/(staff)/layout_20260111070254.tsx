import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { LayoutProvider } from "@/context/layout-provider";
import { Toaster } from "@/components/ui/sonner";
import { requireMerchantSession } from "@/lib/auth/merchant-session";
import { headers } from "next/headers";

/**
 * 🏛️ DASHBOARD ARCHITECTURE (Tactical Medium)
 * Normalized: Unified viewport scaling and high-density gutters.
 * Optimized: Clean flex-row logic to prevent double-scroll and cropping.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const isLoginPage = (headerList.get("x-pathname") || "").includes("/dashboard/login");

  // Auth-less Bypass for Gateway Ingress
  if (isLoginPage) return <div className="min-h-screen bg-background">{children}</div>;

  // 🔐 Staff Identity Handshake
  const session = await requireMerchantSession();
  const merchantContext = { id: session.merchantId, ...session.config };

  return (
    <LayoutProvider>
      {/* ✅ UNIFIED CHASSIS: Fixed height to prevent double-scrollbar loops */}
      <div className="flex h-screen w-screen overflow-hidden bg-background selection:bg-primary/20">
        
        {/* --- LEFT: TACTICAL SIDEBAR --- */}
        <DashboardSidebar merchant={merchantContext} />

        {/* --- RIGHT: OPERATIONAL VIEWPORT --- */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          
          {/* TOPNAV: Operational Control Strip */}
          <DashboardTopNav merchant={merchantContext} />

          {/* ✅ MAIN HORIZON: Independent Scroll with Tactical Padding */}
          <main className="flex-1 overflow-y-auto custom-scrollbar relative px-4 md:px-6 lg:px-8 py-6">
             
             {/* Backdrop Aura: Minimal Signal */}
             <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/[0.03] blur-[100px] rounded-full -z-10 pointer-events-none" />
             
             {/* Content Clamping: World Standard 1280px */}
             <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
               {children}
             </div>
          </main>
        </div>
      </div>

      {/* Global Signal Toast */}
      <Toaster position="top-right" richColors closeButton />
    </LayoutProvider>
  );
}