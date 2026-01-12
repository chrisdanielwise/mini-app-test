import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { LayoutProvider } from "@/context/layout-provider";
import { Toaster } from "@/components/ui/sonner";
import { requireMerchantSession } from "@/lib/auth/merchant-session";
import { headers } from "next/headers";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const isLoginPage = (headerList.get("x-pathname") || "").includes("/dashboard/login");

  if (isLoginPage) return <div className="min-h-screen bg-background">{children}</div>;

  const session = await requireMerchantSession();
  const merchantContext = { id: session.merchantId, ...session.config };

  return (
    <LayoutProvider>
      {/* ✅ FLEX-ROW: Sidebar and content side-by-side */}
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        
        {/* --- LEFT: The ONLY Sidebar Node --- */}
        <DashboardSidebar merchant={merchantContext} />

        {/* --- RIGHT: Operational Viewport --- */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          <DashboardTopNav merchant={merchantContext} />

          {/* ✅ FIXED: overflow-y-auto handles scrolling independently */}
          <main className="flex-1 overflow-y-auto custom-scrollbar relative px-4 sm:px-10 py-8">
             <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
             <div className="max-w-7xl mx-auto">
               {children}
             </div>
          </main>
        </div>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </LayoutProvider>
  );
}