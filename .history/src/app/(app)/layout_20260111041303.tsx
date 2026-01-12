import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { BottomNav } from "@/components/app/bottom-nav";
import { cn } from "@/lib/utils";

/**
 * 🛰️ USER APP SHELL (Apex Tier)
 * Structural Anchor for all subscriber-facing nodes.
 * Normalized: Fixed 100dvh height and viewport safety gutters.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TelegramProvider>
      <div className={cn(
        "relative flex min-h-[100dvh] w-full flex-col bg-background text-foreground",
        "antialiased overflow-x-hidden selection:bg-primary/30"
      )}>
        
        {/* --- DYNAMIC BACKGROUND AURA --- */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        {/* 🚀 PRIMARY INGRESS: Content Node */}
        <main className="flex-1 pb-24 md:pb-32 transition-all duration-500">
          {children}
        </main>
        
        {/* 📱 INSTITUTIONAL BOTTOM NAV: The Control Anchor */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <BottomNav />
        </div>

      </div>
    </TelegramProvider>
  );
}