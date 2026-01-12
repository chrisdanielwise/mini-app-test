"use client";

import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  Bell,
  Globe,
  LogOut,
  Terminal,
  Cpu,
  ChevronRight,
  Fingerprint,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ TERMINAL SETTINGS (Tactical Medium)
 * Normalized: High-density scannable scale for mobile mini-apps.
 * Optimized: Resilient grid geometry to prevent horizontal cropping.
 */
export default function SettingsPage() {
  const { user } = useTelegramContext();

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-500 max-w-3xl mx-auto">
      
      {/* --- HUD HEADER: TACTICAL SYNC --- */}
      <header className="px-5 py-5 md:py-6 bg-card/40 border-b border-border/10 backdrop-blur-xl rounded-b-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-[0.02] rotate-12 pointer-events-none">
          <Terminal className="h-24 w-24 md:h-32 md:w-32" />
        </div>
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-1.5 text-primary/60">
            <Cpu className="h-3.5 w-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Node Configuration
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tight leading-none text-foreground">
            Terminal <span className="text-primary/40">Settings</span>
          </h1>
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">
            Identity & Hardware Calibration
          </p>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8 pb-32">
        
        {/* 🛰️ IDENTITY PASSPORT CARD: COMPACT */}
        <section className="space-y-3">
          <h2 className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic ml-1">
            Active Identity Node
          </h2>
          <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-md p-4 md:p-5 shadow-sm relative overflow-hidden group">
            <Fingerprint className="absolute -bottom-2 -right-2 h-16 w-16 opacity-[0.03] -rotate-12 pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
                <div className="relative h-12 w-12 md:h-14 md:w-14 rounded-full bg-primary border border-primary/20 flex items-center justify-center text-lg md:text-xl font-black text-primary-foreground italic shadow-inner">
                  {user?.fullName?.[0] || "U"}
                </div>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-base md:text-lg font-black uppercase italic tracking-tight truncate text-foreground leading-none">
                  {user?.fullName || "Identity Unknown"}
                </span>
                <span className="text-[9px] font-mono font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">
                  @{user?.username || "anonymous_node"}
                </span>

                <div className="mt-2 flex gap-1.5">
                  <Badge
                    variant="outline"
                    className="bg-primary/5 text-primary border-primary/20 text-[7px] font-black uppercase px-1.5 py-0 rounded"
                  >
                    {user?.role || "USER"}
                  </Badge>
                  {user?.merchantId && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[7px] font-black uppercase px-1.5 py-0 rounded"
                    >
                      <Zap className="h-2 w-2 mr-1 fill-current" />
                      MERCHANT
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ⚙️ SETTINGS CLUSTER: NORMALIZED */}
        <section className="space-y-3">
          <h2 className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic ml-1">
            Protocol Adjustment
          </h2>
          <div className="flex flex-col gap-2">
            <SettingItem
              icon={User}
              label="Profile Metadata"
              sublabel="Identity labels & bio"
            />
            <SettingItem
              icon={Shield}
              label="Security Nodes"
              sublabel="Session management"
            />
            <SettingItem
              icon={Bell}
              label="Alert Frequency"
              sublabel="Signal notification lag"
            />
            <SettingItem
              icon={Globe}
              label="Language"
              sublabel="Regional data standards"
            />
          </div>
        </section>

        {/* 🚩 DESTRUCTIVE ACTIONS: TACTICAL SCALE */}
        <div className="pt-2">
          <Button
            variant="ghost"
            className="w-full h-11 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 font-bold uppercase italic tracking-widest text-[9px] transition-all active:scale-[0.98] border border-rose-500/10"
            onClick={() => {
              hapticFeedback("warning");
              window.location.reload();
            }}
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Disconnect Identity Node
          </Button>
          <p className="mt-6 text-center text-[7px] font-bold text-muted-foreground/20 uppercase tracking-[0.4em] italic">
            Zipha_Build_v2.26 // Node_Ref: {user?.id?.toString().slice(0, 8)}
          </p>
        </div>
      </main>
    </div>
  );
}

function SettingItem({
  icon: Icon,
  label,
  sublabel,
}: {
  icon: any;
  label: string;
  sublabel: string;
}) {
  return (
    <div
      onClick={() => hapticFeedback("light")}
      className="flex items-center justify-between p-3.5 rounded-xl bg-card/40 border border-border/40 hover:border-primary/20 transition-all cursor-pointer group active:scale-[0.98] shadow-sm backdrop-blur-md"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-lg bg-muted/10 flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary border border-transparent group-hover:border-primary/20 transition-all shadow-inner">
          <Icon className="h-4 w-4 transition-transform group-hover:scale-105" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-black uppercase italic tracking-tight text-foreground/80 group-hover:text-primary transition-colors truncate">
            {label}
          </span>
          <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest truncate leading-none">
            {sublabel}
          </span>
        </div>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
    </div>
  );
}