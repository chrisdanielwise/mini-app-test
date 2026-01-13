"use client";

import { useState, useEffect, useMemo } from "react";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  ShieldCheck,
  Fingerprint,
  Terminal,
  Cpu,
  Info,
  Globe,
  Lock,
  UserCog
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🛰️ USER PREFERENCES TERMINAL (Institutional v12.23.0)
 * Logic: Hardened Soft-Session Ingress.
 * Feature: Bypasses SDK hangs if Identity is already verified.
 */
export default function UserPreferencesPage() {
  const { auth, user, isReady, mounted, webApp } = useTelegramContext();
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isStuck, setIsStuck] = useState(false);

  // 🛡️ HYDRATION & TIMEOUT SHIELD
  useEffect(() => {
    if (mounted) {
      const saved = localStorage.getItem("user_haptics_enabled");
      if (saved !== null) setHapticsEnabled(saved !== "false");
      setIsMounted(true);
    }

    // Safety Net: Unstick page if Telegram SDK hangs > 4s
    const timer = setTimeout(() => {
       if (!isReady) {
         console.warn("🛰️ [Settings_Node] SDK Handshake delay. Force-mounting UI.");
         setIsStuck(true);
       }
    }, 4000);

    return () => clearTimeout(timer);
  }, [mounted, isReady]);

  // 🛡️ Haptic Protocol Buffer
  const triggerHaptic = (style: "light" | "medium") => {
    if (webApp?.HapticFeedback && hapticsEnabled) {
      webApp.HapticFeedback.impactOccurred(style);
    }
  };

  const toggleHaptics = (checked: boolean) => {
    setHapticsEnabled(checked);
    localStorage.setItem("user_haptics_enabled", checked.toString());
    if (checked) triggerHaptic("medium");
  };

  const isStaff = useMemo(() => 
    auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role),
    [auth.user?.role]
  );

  // 1. INITIALIZATION: Loader only shows if we have NO auth status yet
  if (!auth.isAuthenticated && (!isReady && !isStuck || !isMounted || auth.isLoading)) {
    return <LoadingScreen message="SYNCING HARDWARE NODES..." />;
  }

  // 2. CRYPTOGRAPHIC GATE: Block unverified nodes
  if (!auth.isAuthenticated && !auth.isLoading) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background animate-in fade-in zoom-in duration-700">
        <div className="rounded-[2.5rem] bg-card border border-rose-500/10 p-10 shadow-2xl text-center space-y-6 max-w-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-rose-500/5 blur-3xl -z-10" />
          <Lock className="h-10 w-10 text-rose-500 mx-auto animate-pulse opacity-40" />
          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase italic tracking-tighter">Access Restricted</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60">
              Identity signature missing or invalid.<br />Re-launch from the bot to authenticate.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-700 max-w-3xl mx-auto text-foreground selection:bg-primary/30">
      
      <header className="px-6 py-6 md:py-8 bg-card/40 border-b border-border/10 backdrop-blur-2xl rounded-b-[2rem] shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className={cn("h-4 w-4", isStaff ? "text-amber-500" : "text-primary/60")} />
            <span className={cn("text-[9px] font-black uppercase tracking-[0.4em]", isStaff ? "text-amber-500" : "text-primary/60")}>
              {isStaff ? "Universal Oversight Link" : "Hardware Node Sync"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">
            App <span className={isStaff ? "text-amber-500/40" : "text-primary/40"}>Settings</span>
          </h1>
        </div>
      </header>

      <main className="px-5 py-8 space-y-8 pb-36">
        
        <section className="space-y-3">
          <h2 className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic ml-2">Tactile_Protocol</h2>
          <div className={cn("group rounded-2xl border bg-card/40 p-5 md:p-6 flex items-center justify-between shadow-lg backdrop-blur-3xl transition-all", isStaff ? "hover:border-amber-500/20" : "hover:border-primary/20")}>
            <div className="flex items-center gap-4">
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110", isStaff ? "bg-amber-500/5 border-amber-500/20" : "bg-primary/5 border-primary/20")}>
                <Smartphone className={cn("h-6 w-6", isStaff ? "text-amber-500" : "text-primary")} />
              </div>
              <div className="space-y-1">
                <Label className="text-base font-black uppercase italic tracking-tight leading-none">Haptic Feedback</Label>
                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Tactile interaction sync</p>
              </div>
            </div>
            <Switch checked={hapticsEnabled} onCheckedChange={toggleHaptics} className={isStaff ? "data-[state=checked]:bg-amber-500" : "data-[state=checked]:bg-primary"} />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic ml-2">Identity_Telemetry</h2>
          <div className="rounded-[2rem] border border-border/40 bg-card/40 overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="p-6 border-b border-border/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Fingerprint className="h-5 w-5 text-primary/30 shrink-0" />
                <div className="space-y-1 min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Node Identifier</p>
                  <p className="text-base font-black italic tracking-tight truncate">@{user?.username || auth.user?.username || "anonymous_node"}</p>
                </div>
              </div>
              <Badge className={cn("shrink-0 rounded-lg text-[8px] font-black tracking-[0.2em] px-2 py-0.5 border-none", isStaff ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500")}>
                {isStaff ? "MASTER_CLEARANCE" : "SYNC_OK"}
              </Badge>
            </div>
            <div className="p-6 flex items-center justify-between group hover:bg-muted/5 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <ShieldCheck className="h-5 w-5 text-primary/30 shrink-0" />
                <div className="space-y-1 min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Identity Protocol</p>
                  <p className="text-base font-black italic tracking-tight truncate">{auth.user?.role?.toUpperCase() || "STANDARD_USER"}</p>
                </div>
              </div>
              <UserCog className="h-4 w-4 opacity-20 group-hover:rotate-12 transition-all" />
            </div>
          </div>
        </section>

        <div className="pt-6 space-y-6">
          <div className="flex items-center gap-3 px-2 opacity-30 italic">
            <Terminal className="h-4 w-4 text-primary" />
            <p className="text-[8px] font-black uppercase tracking-[0.4em]">Zipha Intelligence Core // NODE_V2</p>
          </div>
          <div className="rounded-2xl bg-muted/10 border border-border/10 p-5 flex gap-4 relative overflow-hidden">
            <Info className="h-5 w-5 text-primary/40 shrink-0 mt-0.5" />
            <p className="text-[9px] font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-widest italic relative z-10">
              Hardware settings are node-specific. Global identity revocation is managed via the <span className="text-foreground font-black">Institutional Hub</span>.
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-auto flex items-center justify-center gap-3 opacity-20 py-10">
         <Globe className="h-4 w-4" />
         <p className="text-[8px] font-black uppercase tracking-[0.5em] italic text-center leading-none">Audit Handshake established // NODE_SYNC: OPTIMAL</p>
      </footer>
    </div>
  );
}