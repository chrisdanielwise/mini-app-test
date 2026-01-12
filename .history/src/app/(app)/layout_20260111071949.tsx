import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { BottomNav } from "@/components/app/bottom-nav";
import { cn } from "@/lib/utils";

/**
 * 🛰️ USER APP SHELL (Tactical Medium)
 * Normalized: World-standard fluid scaling for high-resiliency mobile nodes.
 * Optimized: Adaptive viewport safety and localized background telemetry.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TelegramProvider>
      <div className={cn(
        "relative flex min-h-[100dvh] w-full flex-col bg-background text-foreground",
        "antialiased overflow-x-hidden selection:bg-primary/20"
      )}>
        
        {/* --- DYNAMIC BACKGROUND AURA: TACTICAL SYNC --- */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-[0.15]">
          <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
        </div>

        {/* 🚀 PRIMARY INGRESS: Content Node Clamped to 768px */}
        <main className="flex-1 w-full max-w-3xl mx-auto px-1 pb-28 transition-all duration-700 ease-in-out">
          <div className="relative animate-in fade-in duration-500">
            {children}
          </div>
        </main>
        
        {/* 📱 INSTITUTIONAL BOTTOM NAV: The Control Anchor */}
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <BottomNav />
          </div>
        </div>

      </div>
    </TelegramProvider>
  );
}