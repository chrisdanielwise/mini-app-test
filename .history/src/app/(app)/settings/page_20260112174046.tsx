"use client";

import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
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
  Lock,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";

/**
 * 🛰️ TERMINAL SETTINGS (Institutional v9.5.8)
 * Architecture: Role-Aware identity audit and hardware sync.
 * Hardened: Next.js 16 Hydration Shield & Telegram Haptic Safety.
 */
export default function SettingsPage() {
  const { auth, isReady, user: tgUser, mounted, webApp } = useTelegramContext();
  const [tunnelReady, setTunnelReady] = useState(false);

  // 🛡️ HYDRATION SHIELD: Prevents SSR/CSR desync in Turbopack
  useEffect(() => {
    if (mounted) setTunnelReady(true);
  }, [mounted]);

  // 🛡️ Haptic Protocol Buffer: Verifies bridge availability
  const triggerHaptic = (style: "light" | "medium" | "warning") => {
    if (webApp?.HapticFeedback) {
      if (style === "warning") {
        webApp.HapticFeedback.notificationOccurred("warning");
      } else {
        webApp.HapticFeedback.impactOccurred(style);
      }
    }
  };

  // 🛡️ ROLE ARCHITECTURE DETECTION
  const isStaff = useMemo(() => 
    auth.user?.role && ["super_admin", "platform_manager", "platform_support"].includes(auth.user.role),
    [auth.user?.role]
  );

  const userDisplay = auth.user || tgUser;

  // 1. SYSTEM INITIALIZATION: Wait for identity handshake and client mount
  if (!isReady || !tunnelReady || auth.isLoading) {
    return <LoadingScreen message="Syncing Identity Node..." />;
  }

  // 2. CRYPTOGRAPHIC GATE: Block unverified sessions
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background animate-in fade-in zoom-in duration-700">
        <div className="rounded-[2.5rem] bg-card border border-rose-500/10 p-10 shadow-2xl text-center space-y-6 max-w-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-rose-500/5 blur-3xl -z-10" />
          <Lock className="h-12 w-12 text-rose-500 mx-auto animate-pulse opacity-40 shadow-inner" />
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Access Locked</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60">
              Identity signature missing or invalid.<br />Re-launch the terminal to authenticate.
            </p>
          </div>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline" 
            className="w-full h-12 rounded-xl border-rose-500/20 text-rose-500 font-black uppercase text-[10px] tracking-widest italic hover:bg-rose-500/5"
          >
            Reconnect Node
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-700 max-w-3xl mx-auto text-foreground selection:bg-primary/30">
      
      {/* --- HUD HEADER --- */}
      <header className="px-6 py-6 md:py-8 bg-card/40 border-b border-border/10 backdrop-blur-2xl rounded-b-[2rem] shadow-xl relative overflow-hidden">
        <div className={cn(
          "absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 pointer-events-none transition-colors duration-1000",
          isStaff ? "text-amber-500" : "text-primary"
        )}>
          <Terminal className="h-32 w-32 md:h-40 md:w-40" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 opacity-50">
            <Cpu className={cn("h-4 w-4", isStaff ? "text-amber-500" : "text-primary")} />
            <span className={cn("text-[9px] font-black uppercase tracking-[0.4em]", isStaff ? "text-amber-500" : "text-primary")}>
              {isStaff ? "Universal Hardware Sync" : "Node Configuration"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">
            Terminal <span className={cn(isStaff ? "text-amber-500/40" : "text-primary/40")}>Settings</span>
          </h1>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">
            {isStaff ? "Institutional Oversight Active" : "Identity & Hardware Calibration"}
          </p>
        </div>
      </header>

      <main className="px-5 py-8 space-y-10 pb-36">
        
        {/* 🛰️ IDENTITY PASSPORT CARD */}
        <section className="space-y-4">
          <h2 className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic ml-2">
            Active_Identity_Node
          </h2>
          <div className={cn(
            "rounded-[2rem] border backdrop-blur-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group transition-all duration-500",
            isStaff ? "border-amber-500/20 bg-amber-500/5" : "border-border/40 bg-card/40"
          )}>
            <Fingerprint className="absolute -bottom-4 -right-4 h-24 w-24 opacity-[0.03] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform" />

            <div className="flex items-center gap-5 relative z-10">
              <div className="relative shrink-0">
                <div className={cn("absolute inset-0 blur-2xl rounded-full opacity-25", isStaff ? "bg-amber-500" : "bg-primary")} />
                <div className={cn(
                  "relative h-16 w-16 md:h-20 md:w-20 rounded-[1.25rem] border-2 flex items-center justify-center text-xl md:text-2xl font-black italic shadow-2xl transition-all duration-700",
                  isStaff ? "bg-amber-500 border-amber-400/20 text-black" : "bg-primary border-primary-foreground/20 text-primary-foreground"
                )}>
                  {(userDisplay?.fullName || "U")[0].toUpperCase()}
                </div>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-xl md:text-2xl font-black uppercase italic tracking-tight truncate leading-none">
                  {userDisplay?.fullName || "Identity Unknown"}
                </span>
                <span className="text-[10px] font-mono font-bold text-muted-foreground/40 uppercase tracking-widest mt-2">
                  @{userDisplay?.username || "anonymous_node"}
                </span>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge
                    className={cn(
                      "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-lg border-none transition-colors shadow-sm",
                      isStaff ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
                    )}
                  >
                    {auth.user?.role?.toUpperCase() || "STANDARD_USER"}
                  </Badge>
                  {auth.user?.merchantId && (
                    <Badge
                      className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-lg shadow-sm"
                    >
                      <Zap className="h-2.5 w-2.5 mr-1.5 fill-current" />
                      MERCHANT_NODE
                    </Badge>
                  )}
                  {isStaff && (
                    <Badge
                      className="bg-rose-500/10 text-rose-500 border-none text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-lg shadow-sm animate-pulse"
                    >
                      <ShieldAlert className="h-2.5 w-2.5 mr-1.5" />
                      ADMIN_OVERSIGHT
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ⚙️ SETTINGS CLUSTER */}
        <section className="space-y-4">
          <h2 className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic ml-2">
            Protocol_Adjustment
          </h2>
          <div className="flex flex-col gap-3">
            <SettingItem
              icon={User}
              label="Profile Metadata"
              sublabel="Identity labels & cluster bio"
              isStaff={isStaff}
              onTrigger={() => triggerHaptic("light")}
            />
            <SettingItem
              icon={Shield}
              label="Security Nodes"
              sublabel="Cryptographic session management"
              isStaff={isStaff}
              onTrigger={() => triggerHaptic("light")}
            />
            <SettingItem
              icon={Bell}
              label="Alert Frequency"
              sublabel="Signal notification latency"
              isStaff={isStaff}
              onTrigger={() => triggerHaptic("light")}
            />
            <SettingItem
              icon={Globe}
              label="Data Language"
              sublabel="Regional localized standards"
              isStaff={isStaff}
              onTrigger={() => triggerHaptic("light")}
            />
          </div>
        </section>

        {/* 🚩 DESTRUCTIVE ACTIONS */}
        <div className="pt-4 space-y-8">
          <Button
            variant="ghost"
            className="w-full h-14 rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 font-black uppercase italic tracking-widest text-[10px] transition-all active:scale-[0.98] border border-rose-500/10 shadow-lg"
            onClick={() => {
              triggerHaptic("warning");
              window.location.reload();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect Identity Node
          </Button>
          <div className="flex flex-col items-center gap-2 opacity-20 italic">
            <Terminal className="h-4 w-4" />
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-center">
              Zipha_Build_v2.26 // Handshake: Optimal
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function SettingItem({
  icon: Icon,
  label,
  sublabel,
  isStaff,
  onTrigger
}: {
  icon: any;
  label: string;
  sublabel: string;
  isStaff?: boolean;
  onTrigger: () => void;
}) {
  return (
    <div
      onClick={onTrigger}
      className={cn(
        "flex items-center justify-between p-5 md:p-6 rounded-2xl border transition-all cursor-pointer group active:scale-[0.98] shadow-xl backdrop-blur-3xl",
        isStaff 
          ? "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30" 
          : "bg-card/40 border-border/40 hover:border-primary/20"
      )}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={cn(
          "h-11 w-11 md:h-12 md:w-12 shrink-0 rounded-xl flex items-center justify-center border transition-all shadow-inner",
          isStaff 
            ? "bg-amber-500/10 text-amber-500 border-amber-500/20 group-hover:scale-110" 
            : "bg-muted/10 text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 group-hover:scale-110"
        )}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className={cn(
            "text-[13px] font-black uppercase italic tracking-tight transition-colors truncate",
            isStaff ? "text-amber-500/80 group-hover:text-amber-500" : "text-foreground group-hover:text-primary"
          )}>
            {label}
          </span>
          <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest truncate leading-none mt-0.5">
            {sublabel}
          </span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </div>
  );
}