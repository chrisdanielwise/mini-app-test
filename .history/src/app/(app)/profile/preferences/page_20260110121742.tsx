"use client";

import { useState, useEffect } from "react";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Smartphone, 
  ShieldCheck, 
  Fingerprint, 
  Zap, 
  BellRing, 
  Info,
  ChevronRight,
  Terminal,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/src/lib/telegram/webapp";

/**
 * 🛰️ USER PREFERENCES TERMINAL (Apex Tier)
 * Hardware calibration and session audit node for Zipha subscribers.
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
    <div className="min-h-screen space-y-12 pb-32 animate-in fade-in duration-1000">
      
      {/* --- HUD HEADER --- */}
      <header className="p-8 pt-12 bg-card/30 border-b border-border/40 backdrop-blur-xl rounded-b-[3rem] shadow-2xl">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Cpu className="h-3 w-3 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Hardware Sync
            </span>
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            App <span className="text-muted-foreground/40">Settings</span>
          </h1>
        </div>
      </header>

      <div className="px-6 space-y-10">
        
        {/* --- TACTILE FEEDBACK NODE --- */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic ml-2">
            Haptic Protocol
          </h2>
          <div className="group rounded-[2.5rem] border border-border/40 bg-card/40 p-8 flex items-center justify-between shadow-xl backdrop-blur-md transition-all hover:border-primary/20">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <Smartphone className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-black uppercase italic tracking-tight">
                  Tactile Feedback
                </Label>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                  Execute vibration on interaction
                </p>
              </div>
            </div>
            <Switch 
              checked={hapticsEnabled} 
              onCheckedChange={toggleHaptics} 
              className="scale-125 data-[state=checked]:bg-primary"
            />
          </div>
        </section>

        {/* --- IDENTITY CLUSTER AUDIT --- */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic ml-2">
            Identity Telemetry
          </h2>
          <div className="rounded-[3rem] border border-border/40 bg-card/40 overflow-hidden shadow-2xl">
            {/* User Details */}
            <div className="p-8 border-b border-border/20 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Fingerprint className="h-5 w-5 text-primary opacity-40" />
                  <div className="space-y-0.5">
                     <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">User Handle</p>
                     <p className="text-sm font-black italic tracking-tight">@{user?.username || "unlinked_node"}</p>
                  </div>
               </div>
               <Badge variant="outline" className="rounded-lg bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[8px] font-black">
                 VERIFIED
               </Badge>
            </div>

            {/* Telegram Session */}
            <div className="p-8 flex items-center justify-between group cursor-default">
               <div className="flex items-center gap-4">
                  <ShieldCheck className="h-5 w-5 text-primary opacity-40" />
                  <div className="space-y-0.5">
                     <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Session Protocol</p>
                     <p className="text-sm font-black italic tracking-tight">TELEGRAM_OAUTH_v2</p>
                  </div>
               </div>
               <ChevronRight className="h-4 w-4 opacity-10 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </section>

        {/* --- SYSTEM INFO FOOTNOTE --- */}
        <div className="pt-8 space-y-6">
           <div className="flex items-center gap-3 px-2 opacity-30 italic">
              <Terminal className="h-3 w-3" />
              <p className="text-[8px] font-black uppercase tracking-[0.4em]">
                Zipha Core Build // 2026.01.v2
              </p>
           </div>
           
           <div className="rounded-3xl bg-muted/10 border border-border/40 p-6 flex gap-4">
              <Info className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-[9px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest">
                Identity settings are synchronized across all signal broadcaters. 
                Revoking access must be performed via the <span className="text-foreground">Official Bot Node</span>.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}