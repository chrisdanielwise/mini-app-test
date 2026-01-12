"use client";

import { useState, useEffect } from "react";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  ShieldCheck,
  Fingerprint,
  ChevronRight,
  Terminal,
  Cpu,
  Info,
  Globe,
  Lock,
  UserCog
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ USER PREFERENCES TERMINAL
 * Logic: Role-Aware identity auditing and hardware sync.
 */
export default function UserPreferencesPage() {
  const { auth, user, isReady } = useTelegramContext();
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  // 🏁 SYNCHRONIZATION: Restore hardware preferences from local node
  useEffect(() => {
    const saved = localStorage.getItem("user_haptics_enabled");
    if (saved !== null) setHapticsEnabled(saved !== "false");
  }, []);

  // 1. SYSTEM INITIALIZATION: Wait for identity handshake
  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Syncing Hardware Nodes..." />;
  }

  // 2. CRYPTOGRAPHIC GATE: Block unverified nodes
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background animate-in fade-in duration-500">
        <div className="rounded-2xl bg-card border border-rose-500/10 p-8 shadow-2xl text-center space-y-4 max-w-xs relative overflow-hidden">
          <div className="absolute inset-0 bg-rose-500/5 blur-3xl -z-10" />
          <Lock className="h-10 w-10 text-rose-500 mx-auto opacity-40" />
          <div className="space-y-1">
            <h1 className="text-lg font-black uppercase italic tracking-tight">Access Restricted</h1>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60">
              Identity signature missing. Re-launch the terminal to authenticate.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const toggleHaptics = (checked: boolean) => {
    setHapticsEnabled(checked);
    localStorage.setItem("user_haptics_enabled", checked.toString());
    if (checked) hapticFeedback("medium");
  };

  const isStaff = auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role);

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-500 max-w-3xl mx-auto">
      
      {/* --- HUD HEADER: ROLE AWARE --- */}
      <header className="px-5 py-5 md:py-6 bg-card/40 border-b border-border/10 backdrop-blur-xl rounded-b-2xl shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Cpu className={cn("h-3.5 w-3.5", isStaff ? "text-amber-500" : "text-primary/60")} />
            <span className={cn("text-[9px] font-black uppercase tracking-widest", isStaff ? "text-amber-500" : "text-primary/60")}>
              {isStaff ? "Universal Hardware Sync" : "Hardware Sync"}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tight leading-none text-foreground">
            App <span className={isStaff ? "text-amber-500/40" : "text-primary/40"}>Settings</span>
          </h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 pb-32">
        
        {/* --- HAPTIC PROTOCOL --- */}
        <section className="space-y-2.5">
          <h2 className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic ml-1">
            Haptic Protocol
          </h2>
          <div className="group rounded-xl border border-border/40 bg-card/40 p-4 md:p-5 flex items-center justify-between shadow-sm backdrop-blur-md transition-all hover:border-primary/20">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className={cn(
                "h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-lg flex items-center justify-center border shadow-inner group-hover:scale-105 transition-transform",
                isStaff ? "bg-amber-500/5 border-amber-500/20" : "bg-primary/5 border-primary/20"
              )}>
                <Smartphone className={cn("h-5 w-5", isStaff ? "text-amber-500" : "text-primary")} />
              </div>
              <div className="space-y-0.5 min-w-0">
                <Label className="text-sm font-black uppercase italic tracking-tight text-foreground">
                  Tactile Feedback
                </Label>
                <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">
                  Vibration on interaction
                </p>
              </div>
            </div>
            <Switch
              checked={hapticsEnabled}
              onCheckedChange={toggleHaptics}
              className={isStaff ? "data-[state=checked]:bg-amber-500" : "data-[state=checked]:bg-primary"}
            />
          </div>
        </section>

        {/* --- IDENTITY TELEMETRY --- */}
        <section className="space-y-2.5">
          <h2 className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic ml-1">
            Identity Telemetry
          </h2>
          <div className="rounded-xl border border-border/40 bg-card/40 overflow-hidden shadow-sm">
            {/* User Handle */}
            <div className="p-4 md:p-5 border-b border-border/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Fingerprint className="h-4 w-4 text-primary/40 shrink-0" />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/40">
                    User Handle
                  </p>
                  <p className="text-sm font-black italic tracking-tight truncate text-foreground">
                    @{user?.username || auth.user?.username || "unlinked_node"}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 rounded-md text-[7px] font-black tracking-widest px-1.5 py-0",
                  isStaff ? "bg-amber-500/5 text-amber-500 border-amber-500/20" : "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                )}
              >
                {isStaff ? "STAFF_CLEARANCE" : "VERIFIED"}
              </Badge>
            </div>

            {/* Protocol Role */}
            <div className="p-4 md:p-5 flex items-center justify-between group cursor-default hover:bg-muted/5 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <ShieldCheck className="h-4 w-4 text-primary/40 shrink-0" />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/40">
                    Identity Protocol
                  </p>
                  <p className="text-sm font-black italic tracking-tight truncate text-foreground">
                    {auth.user?.role?.toUpperCase() || "STANDARD_USER"}
                  </p>
                </div>
              </div>
              <UserCog className="h-3.5 w-3.5 opacity-20 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </section>

        {/* --- SYSTEM INFO --- */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center gap-2 px-1 opacity-20 italic">
            <Terminal className="h-3 w-3" />
            <p className="text-[7px] font-black uppercase tracking-[0.4em]">
              Zipha Build // 2026.01.v2.26
            </p>
          </div>

          <div className="rounded-xl bg-muted/10 border border-border/10 p-4 flex gap-3 shadow-inner">
            <Info className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
            <p className="text-[8px] font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-widest italic">
              Hardware settings are node-specific. Identity revocation is handled via the <span className="text-foreground font-black">Admin Terminal</span>.
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-auto flex items-center justify-center gap-3 opacity-20 py-6">
         <Globe className="h-2.5 w-2.5 text-muted-foreground" />
         <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
           Zipha Identity Core // Sync_Status: {isReady ? "READY" : "WAITING"}
         </p>
      </footer>
    </div>
  );
}