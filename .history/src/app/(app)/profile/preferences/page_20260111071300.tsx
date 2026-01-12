"use client";

import { useState, useEffect } from "react";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
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
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ USER PREFERENCES TERMINAL (Tactical Medium)
 * Normalized: High-density scannable scale for mobile mini-apps.
 * Optimized: Resilient grid geometry to prevent horizontal cropping.
 */
export default function UserPreferencesPage() {
  const { user, isReady } = useTelegramContext();
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user_haptics_enabled");
    setSettings(saved !== "false");
  }, []);

  const toggleHaptics = (checked: boolean) => {
    setHapticsEnabled(checked);
    localStorage.setItem("user_haptics_enabled", checked.toString());
    if (checked) hapticFeedback("medium");
  };

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-500 max-w-3xl mx-auto">
      
      {/* --- HUD HEADER: TACTICAL SYNC --- */}
      <header className="px-5 py-5 md:py-6 bg-card/40 border-b border-border/10 backdrop-blur-xl rounded-b-2xl shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-primary/60">
            <Cpu className="h-3.5 w-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Hardware Sync
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tight leading-none text-foreground">
            App <span className="text-primary/40">Settings</span>
          </h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 pb-32">
        
        {/* --- TACTILE FEEDBACK NODE: COMPACT --- */}
        <section className="space-y-2.5">
          <h2 className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic ml-1">
            Haptic Protocol
          </h2>
          <div className="group rounded-xl border border-border/40 bg-card/40 p-4 md:p-5 flex items-center justify-between shadow-sm backdrop-blur-md transition-all hover:border-primary/20">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-105 transition-transform">
                <Smartphone className="h-5 w-5 text-primary" />
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
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </section>

        {/* --- IDENTITY CLUSTER AUDIT: NORMALIZED --- */}
        <section className="space-y-2.5">
          <h2 className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic ml-1">
            Identity Telemetry
          </h2>
          <div className="rounded-xl border border-border/40 bg-card/40 overflow-hidden shadow-sm">
            {/* User Details */}
            <div className="p-4 md:p-5 border-b border-border/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Fingerprint className="h-4 w-4 text-primary/40 shrink-0" />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/40">
                    User Handle
                  </p>
                  <p className="text-sm font-black italic tracking-tight truncate text-foreground">
                    @{user?.username || "unlinked_node"}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="shrink-0 rounded-md bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[7px] font-black tracking-widest px-1.5 py-0"
              >
                VERIFIED
              </Badge>
            </div>

            {/* Telegram Session */}
            <div className="p-4 md:p-5 flex items-center justify-between group cursor-default hover:bg-muted/5 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <ShieldCheck className="h-4 w-4 text-primary/40 shrink-0" />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/40">
                    Session Protocol
                  </p>
                  <p className="text-sm font-black italic tracking-tight truncate text-foreground">
                    TELEGRAM_OAUTH_v2
                  </p>
                </div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 opacity-20 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </section>

        {/* --- SYSTEM INFO FOOTNOTE --- */}
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
              Identity settings synced across nodes. Revocation performed via the <span className="text-foreground font-black">Official Bot</span>.
            </p>
          </div>
        </div>
      </main>

      {/* --- FOOTER SIGNAL --- */}
      <footer className="mt-auto flex items-center justify-center gap-3 opacity-20 py-6">
         <Globe className="h-2.5 w-2.5 text-muted-foreground" />
         <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
           Zipha Identity Core // State: Stable
         </p>
      </footer>
    </div>
  );
}