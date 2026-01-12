import { TelegramProvider } from "@/src/components/telegram/telegram-provider";
import { BottomNav } from "@/src/components/app/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    // 🛰️ The Provider Node must wrap the entire tree
    <TelegramProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <main className="flex-1 pb-24"> {/* Space for BottomNav */}
          {children}
        </main>
        
        {/* 📱 Institutional Navigation */}
        <BottomNav />
      </div>
    </TelegramProvider>
  );
}