"use client";

import { useTelegramContext } from "@/components/providers/TelegramProvider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User, Shield, Bell, Globe, LogOut, Terminal, Cpu,
  ChevronRight, Fingerprint, Lock, ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SettingsPage() {
  const { auth, isReady, user: tgUser, mounted, setMainButton, hapticFeedback, isTelegram } = useTelegramContext();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 🛡️ ROLE DETECTION (Institutional Alignment)
  const isStaff = useMemo(() => 
    auth.user?.role && ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT"].includes(auth.user.role.toUpperCase()),
    [auth.user?.role]
  );

  /**
   * 🧹 ATOMIC LOGOUT SEQUENCE
   * Logic: Server-side cookie purge + audit log + local state reset.
   */
  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    hapticFeedback("warning");

    try {
      console.log("🔐 [Settings_Logout] Terminating Server Session...");
      
      const res = await fetch("/api/auth/logout", { method: "POST" });
      
      if (!res.ok) throw new Error("LOGOUT_FAILED");

      hapticFeedback("success");
      toast.success("Identity Node De-provisioned");
      
      // 🚀 Redirect to the bot entrance for re-authentication
      router.replace("/dashboard/login");
    } catch (err) {
      console.error("🔥 [Logout_Error]:", err);
      toast.error("Failed to disconnect node cleanly");
    } finally {
      setIsLoggingOut(false);
    }
  };

  /**
   * 🔘 NATIVE MAIN BUTTON: LOGOUT TRIGGER
   */
  useEffect(() => {
    if (!isTelegram || !auth.isAuthenticated) return;

    setMainButton({
      text: isLoggingOut ? "🛰️ PURGING SESSION..." : "🔐 DISCONNECT IDENTITY NODE",
      color: "#ef4444", 
      isVisible: true,
      isLoader: isLoggingOut,
      onClick: handleLogout
    });

    return () => setMainButton({ text: "", onClick: () => {}, isVisible: false });
  }, [isTelegram, auth.isAuthenticated, isLoggingOut, setMainButton]);

  const userDisplay = auth.user || tgUser;

  // ... (Keep existing loading and lock barriers)

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-700 max-w-3xl mx-auto text-foreground">
      
      {/* HUD HEADER */}
      <header className="px-6 py-6 bg-card/40 border-b border-border/10 backdrop-blur-2xl rounded-b-[2rem] shadow-xl relative overflow-hidden">
        <div className={cn("absolute top-0 right-0 p-6 opacity-[0.03]", isStaff ? "text-amber-500" : "text-primary")}>
          <Terminal className="h-32 w-32" />
        </div>
        <div className="relative z-10 space-y-2">
          <Cpu className={cn("h-4 w-4", isStaff ? "text-amber-500" : "text-primary")} />
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">
            Terminal <span className={cn(isStaff ? "text-amber-500/40" : "text-primary/40")}>Settings</span>
          </h1>
        </div>
      </header>

      <main className="px-5 py-8 space-y-10 pb-36">
        {/* IDENTITY CARD */}
        <section className="space-y-4">
          <div className={cn("rounded-[2rem] border backdrop-blur-3xl p-6 group", isStaff ? "border-amber-500/20 bg-amber-500/5" : "border-border/40 bg-card/40")}>
            <div className="flex items-center gap-5">
              <div className={cn("h-16 w-16 rounded-[1.25rem] border-2 flex items-center justify-center font-black italic", isStaff ? "bg-amber-500 border-amber-400/20" : "bg-primary border-primary-foreground/20 text-white")}>
                {(userDisplay?.fullName || userDisplay?.firstName || "U")[0].toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black uppercase italic truncate">{userDisplay?.fullName || userDisplay?.firstName}</span>
                <Badge className={cn("mt-2 text-[8px] font-black uppercase", isStaff ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary")}>
                  {auth.user?.role?.toUpperCase() || "STANDARD_USER"}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* WEB FALLBACK LOGOUT */}
        <div className="pt-4 md:block hidden">
          <Button 
            disabled={isLoggingOut} 
            variant="ghost" 
            className="w-full h-14 rounded-2xl bg-rose-500/5 text-rose-500 font-black uppercase"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Disconnect Identity
          </Button>
        </div>
      </main>
    </div>
  );
}