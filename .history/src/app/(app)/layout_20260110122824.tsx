import { AppClientProvider } from "@/src/components/app-client-provider";
import { BottomNav } from "@/src/components/app/bottom-nav";
import { cn } from "@/src/lib/utils";

/**
 * 🛰️ MOBILE INGRESS LAYOUT (Apex Tier)
 * Hardened shell for the Zipha Subscriber ecosystem.
 * Optimized for Dynamic Viewports (dvh) and 2026 edge-to-edge hardware.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppClientProvider>
      {/* - h-[100dvh]: Absolute viewport stability across mobile browsers.
          - selection:bg-primary/20: High-fidelity branding for text selection.
      */}
      <div className="relative h-[100dvh] w-full overflow-hidden bg-background text-foreground antialiased selection:bg-primary/20">
        
        {/* --- INSTITUTIONAL AMBIENCE --- 
            Subtle top-down glow to provide depth without cluttering the UI.
        */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[35%] bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none -z-10" />

        {/* --- OPERATIONAL VIEWPORT --- 
            Isolated scroll container ensures the BottomNav never flickers or moves.
        */}
        <main className="h-full w-full overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-none pb-40 pt-2 px-6 max-w-xl mx-auto">
          
          {/* Transition Physics: Smooth vertical entrance for all sub-routes */}
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out fill-mode-forwards">
            {children}
          </div>

          {/* Bottom Branding Spacing: Ensures content isn't obscured by the Floating Nav */}
          <div className="h-24 w-full" />
        </main>

        {/* --- NAVIGATION LAYER --- 
            Fixed positioning at the absolute bottom with a pointer-events bridge.
        */}
        <div className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none">
           <div className="max-w-xl mx-auto px-6 pb-10 pointer-events-auto">
              <BottomNav />
           </div>
        </div>

        {/* Safe-Area Guard: Protects the content from the system status bar/notch */}
        <div className="fixed top-0 inset-x-0 h-8 bg-background/20 backdrop-blur-md z-[100] pointer-events-none" />
      </div>
    </AppClientProvider>
  );
}