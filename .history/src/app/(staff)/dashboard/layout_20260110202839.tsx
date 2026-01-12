import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { LayoutProvider } from "@/context/layout-provider";
import { Toaster } from "@/components/ui/sonner";
import { requireMerchantSession } from "@/lib/auth/merchant-session";
import { headers } from "next/headers";

/**
 * 🏛️ MERCHANT COMMAND SHELL (Tier 2)
 * Fixed: Added a Pathname Guard to prevent infinite redirect loops on the login page.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🛰️ DETECT CURRENT ROUTE
  // We use headers to check the URL because this is a Server Component.
  const headerList = await headers();
  const fullPath = headerList.get("x-pathname") || ""; 
  const isLoginPage = fullPath.includes("/dashboard/login");

  // 🛡️ CONDITIONAL AUTH GUARD
  // If we are on the login page, we SKIP the session requirement.
  if (isLoginPage) {
    return (
      <LayoutProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </LayoutProvider>
    );
  }

  // 🔐 REQUIRE SESSION (For all other dashboard routes)
  const session = await requireMerchantSession();

  const merchantContext = {
    id: session.merchantId,
    ...session.config
  };

  return (
    <LayoutProvider>
      <div className="flex h-screen overflow-hidden bg-background selection:bg-primary/20">
        
        {/* --- LEFT: COMMAND COLUMN --- */}
        <DashboardSidebar merchant={merchantContext} />

        {/* --- RIGHT: OPERATIONAL VIEWPORT --- */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          
          <DashboardTopNav merchant={merchantContext} />

          <main className="flex-1 overflow-y-auto custom-scrollbar relative">
             <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
             
             <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
               {children}
             </div>
          </main>

          {/* ⚡ Dynamic Status Bar */}
          <div className="h-8 border-t border-border/20 bg-muted/10 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
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