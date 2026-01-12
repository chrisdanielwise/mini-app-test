import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { LayoutProvider } from "@/context/layout-provider";
import { Toaster } from "@/components/ui/sonner";
import { requireMerchantSession } from "@/lib/auth/merchant-session";

/**
 * 🏛️ MERCHANT COMMAND SHELL (Tier 2)
 * High-resiliency wrapper for the Zipha V2 Merchant Ecosystem.
 * Manages institutional layout modes and secure session propagation.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🛡️ AUTH GUARD: Ensure only authorized merchant nodes can access the shell
  const session = await requireMerchantSession();

  return (
    <LayoutProvider>
      <div className="flex h-screen overflow-hidden bg-background selection:bg-primary/20">
        
        {/* --- LEFT: COMMAND COLUMN --- */}
        <DashboardSidebar merchant={session.merchant} />

        {/* --- RIGHT: OPERATIONAL VIEWPORT --- */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          
          {/* Top Interface Strip */}
          <DashboardTopNav merchant={session.merchant} />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto custom-scrollbar relative">
             {/* Background Global Aura: Subtly hints at the Zipha Identity */}
             <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
             
             <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
               {children}
             </div>
          </main>

          {/* ⚡ Dynamic Status Bar (Optional / Micro-feedback) */}
          <div className="h-8 border-t border-border/20 bg-muted/10 backdrop-blur-md px-6 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground">System_Online // 2026.01.v2</span>
             </div>
             <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">
               Merchant Node: {session.merchant.id.slice(0, 12)}
             </p>
          </div>
        </div>

        {/* --- GLOBAL FEEDBACK NODES --- */}
        <Toaster position="top-right" expand={false} richColors closeButton />
      </div>
    </LayoutProvider>
  );
}