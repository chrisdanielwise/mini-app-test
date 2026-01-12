import { AppClientProvider } from "@/components/app-client-provider";
import { BottomNav } from "@/components/app/bottom-nav"; // Your mobile nav

/**
 * 📱 USER APP LAYOUT (Tier 3)
 * Optimized for Telegram Mini App immersion.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppClientProvider>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Main Content Area */}
        <main className="flex-1 pb-24 px-4 pt-6">
          {children}
        </main>

        {/* 📱 Mobile-First Navigation (Tier 3 exclusive) */}
        <BottomNav />
      </div>
    </AppClientProvider>
  );
}