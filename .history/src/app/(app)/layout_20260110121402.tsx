import { AppClientProvider } from "@/components/app-client-provider";
import { BottomNav } from "@/components/app/bottom-nav";
import { cn } from "@/lib/utils";

/**
 * 🛰️ MOBILE INGRESS LAYOUT (Tier 2)
 * High-resiliency shell for the Zipha Subscriber ecosystem.
 * Optimized for Telegram WebApp Viewports and 2026 Mobile Hardware.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppClientProvider>
      {/* 1. h-[100dvh]: Uses Dynamic Viewport Height to account for 
             Telegram's browser headers/footers shifting.
          2. overflow-hidden: Prevents the "Body Bounce" on iOS.
      */}
      <div className="relative h-[100dvh] w-full overflow-hidden bg-background text-foreground selection:bg-primary/20">
        
        {/* --- DYNAMIC BACKGROUND GLOW --- */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40%] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />

        {/* --- SCROLLABLE VIEWPORT --- */}
        <main className="h-full w-full overflow-y-auto overflow-x-hidden custom-scrollbar pb-32 pt-4 px-5 max-w-xl mx-auto">
          
          {/* Internal Content Container with Entrance Animation */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
            {children}
          </div>

          {/* Institutional Branding Spacing */}
          <div className="h-20 w-full" />
        </main>

        {/* --- NAVIGATION TIER --- 
            Placed outside the main scroll area to ensure it remains 
            persistent and physically stable.
        */}
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
           <div className="max-w-xl mx-auto px-5 pb-8 pointer-events-auto">
              <BottomNav />
           </div>
        </div>

        {/* Safe-Area Padding for modern edge-to-edge displays */}
        <div className="fixed top-0 inset-x-0 h-safe-top bg-background/50 backdrop-blur-md z-[100] pointer-events-none" />
      </div>
    </AppClientProvider>
  );
}