import { DashboardSidebar } from "@/src/components/dashboard/sidebar";
import { DashboardTopNav } from "@/src/components/dashboard/top-nav";
import { LayoutProvider } from "@/src/context/layout-provider";
import { Toaster } from "@/src/components/ui/sonner";
import { requireMerchantSession } from "@/src/lib/auth/merchant-session";
import { headers } from "next/headers";

/**
 * 🏛️ MERCHANT COMMAND SHELL (Tier 2)
 * Hardened Pathing: Uses session.merchantId and session.config
 * Fixed: Pathname Guard specifically prevents loops on /dashboard/login.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const fullPath = headerList.get("x-pathname") || ""; 
  const isLoginPage = fullPath.includes("/dashboard/login");

  // 🛡️ CONDITIONAL AUTH GUARD
  // Prevents the layout from asking for a session while on the Login route.
  if (isLoginPage) {
    return (
      <LayoutProvider>
        <div className="min-h-screen bg-background">
          {children}
          <Toaster position="top-right" richColors closeButton />
        </div>
      </LayoutProvider>
    );
  }

  // 🔐 REQUIRE SESSION (For all authenticated merchant routes)
  const session = await requireMerchantSession();

  const merchantContext = {
    id: session.merchantId,
    ...session.config
  };

  return (
    <LayoutProvider>
      {/* ✅ UNIFIED VIEWPORT: h-screen + flex-row ensures sidebar and content are side-by-side */}
      <div className="flex h-screen w-screen overflow-hidden bg-background selection:bg-primary/20">
        
        {/* --- LEFT: COMMAND COLUMN (Now mobile-responsive) --- */}
        <DashboardSidebar merchant={merchantContext} />

        {/* --- RIGHT: OPERATIONAL VIEWPORT --- */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          
          {/* Top Interface Strip with Breadcrumbs */}
          <DashboardTopNav merchant={merchantContext} />

          {/* Main Content Area: overflow-y-auto ensures independent scrolling */}
          <main className="flex-1 overflow-y-auto custom-scrollbar relative">
             {/* Background Global Aura */}
             <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
             
             {/* Responsive container for dashboard widgets */}
             <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
               {children}
             </div>
          </main>

          {/* ⚡ Dynamic Status Bar: shrink-0 ensures it stays visible at the bottom */}
          <div className="h-8 border-t border-border/10 bg-muted/5 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    System_Online // 2026.Apex
                </span>
             </div>
             <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">
               Node_ID: {session.merchantId.slice(0, 12)}
             </p>
          </div>
        </div>

        <Toaster position="top-right" expand={false} richColors closeButton />
      </div>
    </LayoutProvider>
  );
}