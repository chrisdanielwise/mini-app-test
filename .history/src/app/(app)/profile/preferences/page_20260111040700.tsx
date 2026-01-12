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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ USER PREFERENCES TERMINAL (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive padding and haptic-safe targets for mobile staff.
 */
export default function UserPreferencesPage() {
  const { user, isReady } = useTelegramContext();
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  // 🏁 Load settings from local cluster node
  useEffect(() => {
    const saved = localStorage.getItem("user_haptics_enabled");
    setHapticsEnabled(saved !== "false");
  }, []);

  const toggleHaptics = (checked: boolean) => {
    setHapticsEnabled(checked);
    localStorage.setItem("user_haptics_enabled", checked.toString());

    // Immediate feedback for calibration
    if (checked) hapticFeedback("medium");
  };

  return (
    <div className="flex flex-col min-h-[100dvh] space-y-8 md:space-y-12 pb-32 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      {/* --- HUD HEADER --- */}
      <header className="px-5 py-8 md:p-8 md:pt-12 bg-card/30 border-b border-border/40 backdrop-blur-xl rounded-b-[2.5rem] md:rounded-b-[3rem] shadow-xl">
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Cpu className="h-3.5 w-3.5 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Hardware Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">
            App <span className="text-muted-foreground/40">Settings</span>
          </h1>
        </div>
      </header>

      <div className="px-4 sm:px-6 space-y-8 md:space-y-10">
        {/* --- TACTILE FEEDBACK NODE --- */}
        <section className="space-y-3 md:space-y-4">
          <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic ml-2">
            Haptic Protocol
          </h2>
          <div className="group rounded-[2rem] md:rounded-[2.5rem] border border-border/40 bg-card/40 p-5 md:p-8 flex items-center justify-between shadow-lg backdrop-blur-md transition-all hover:border-primary/20">
            <div className="flex items-center gap-4 md:gap-5 min-w-0">
              <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <Smartphone className="h-6 w-6 md:h-7 md:w-7 text-primary" />
              </div>
              <div className="space-y-1 min-w-0">
                <Label className="text-xs md:text-sm font-black uppercase italic tracking-tight truncate block">
                  Tactile Feedback
                </Label>
                <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 leading-none">
                  Vibration on interaction
                </p>
              </div>
            </div>
            <Switch
              checked={hapticsEnabled}
              onCheckedChange={toggleHaptics}
              className="scale-110 md:scale-125 data-[state=checked]:bg-primary"
            />
          </div>
        </section>

        {/* --- IDENTITY CLUSTER AUDIT --- */}
        <section className="space-y-3 md:space-y-4">
          <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic ml-2">
            Identity Telemetry
          </h2>
          <div className="rounded-[2rem] md:rounded-[3rem] border border-border/40 bg-card/40 overflow-hidden shadow-xl">
            {/* User Details */}
            <div className="p-6 md:p-8 border-b border-border/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Fingerprint className="h-4 w-4 md:h-5 md:w-5 text-primary opacity-40 shrink-0" />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                    User Handle
                  </p>
                  <p className="text-xs md:text-sm font-black italic tracking-tight truncate">
                    @{user?.username || "unlinked_node"}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="shrink-0 rounded-md bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[7px] md:text-[8px] font-black tracking-widest px-2 py-0.5"
              >
                VERIFIED
              </Badge>
            </div>

            {/* Telegram Session */}
            <div className="p-6 md:p-8 flex items-center justify-between group cursor-default transition-colors hover:bg-muted/5">
              <div className="flex items-center gap-4 min-w-0">
                <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 text-primary opacity-40 shrink-0" />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                    Session Protocol
                  </p>
                  <p className="text-xs md:text-sm font-black italic tracking-tight truncate">
                    TELEGRAM_OAUTH_v2
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 opacity-20 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </section>

        {/* --- SYSTEM INFO FOOTNOTE --- */}
        <div className="pt-4 md:pt-8 space-y-6">
          <div className="flex items-center gap-3 px-2 opacity-30 italic">
            <Terminal className="h-3 w-3" />
            <p className="text-[8px] font-black uppercase tracking-[0.4em]">
              Zipha Core Build // 2026.01.v2
            </p>
          </div>

          <div className="rounded-2xl md:rounded-3xl bg-muted/10 border border-border/40 p-5 md:p-6 flex gap-4 shadow-inner">
            <Info className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest opacity-60">
              Identity settings are synchronized across all signal nodes. Full
              revocation must be performed via the{" "}
              <span className="text-foreground font-black">
                Official Bot Node
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
