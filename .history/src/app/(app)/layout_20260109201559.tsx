import { AppClientProvider } from "@/components/app-client-provider";
import { BottomNav } from "@/components/app/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppClientProvider>
      <div className="relative min-h-screen bg-background text-foreground">
        {/* Main User Content */}
        <main className="pb-32 pt-6 px-4 max-w-md mx-auto">
          {children}
        </main>

        {/* Floating Navigation Tier */}
        <BottomNav />
      </div>
    </AppClientProvider>
  );
}