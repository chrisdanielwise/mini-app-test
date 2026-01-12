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
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ TERMINAL SETTINGS
 * Logic: Role-Aware identity audit and hardware sync.
 * Refined: Supports Universal Staff & Merchant Handshakes.
 */
export default function SettingsPage() {
  const { auth, isReady, user: tgUser } = useTelegramContext();

  // 1. SYSTEM INITIALIZATION: Wait for identity handshake
  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Syncing Identity Node..." />;
  }

  // 2. CRYPTOGRAPHIC GATE: Block unverified sessions
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background animate-in fade-in zoom-in duration-500">
        <div className="rounded-2xl bg-card border border-rose-500/10 p-8 shadow-2xl text-center space-y-4 max-w-xs relative overflow-hidden">
          <div className="absolute inset-0 bg-rose-500/5 blur-3xl -z-10" />
          <Lock className="h-10 w-10 text-rose-500 mx-auto opacity-40" />
          <div className="space-y-1">
            <h1 className="text-lg font-black uppercase italic tracking-tight">Access Locked</h1>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60">
              Identity signature missing. Re-launch the terminal to authenticate.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. ROLE ARCHITECTURE DETECTION
  const isStaff = auth.user?.role && ["super_admin", "platform_manager", "platform_support"].includes(auth.user.role);
  const userDisplay = auth.user || tgUser;

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-500 max-w-3xl mx-auto">
      
      {/* --- HUD HEADER: ROLE AWARE --- */}
      <header className="px-5 py-5 md:py-6 bg-card/40 border-b border-border/10 backdrop-blur-xl rounded-b-2xl shadow-lg relative overflow-hidden">
        <div className={cn(
          "absolute top-0 right-0 p-4 opacity-[0.02] rotate-12 pointer-events-none",
          isStaff ? "text-amber-500" : "text-primary"
        )}>
          <Terminal className="h-24 w-24 md:h-32 md:w-32" />
        </div>
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-1.5 opacity-60">
            <Cpu className={cn("h-3.5 w-3.5", isStaff ? "text-amber-500" : "text-primary")} />
            <span className={cn("text-[9px] font-black uppercase tracking-widest", isStaff ? "text-amber-500" : "text-primary")}>
              {isStaff ? "Universal Hardware Sync" : "Node Configuration"}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tight leading-none text-foreground">
            Terminal <span className={cn(isStaff ? "text-amber-500/40" : "text-primary/40")}>Settings</span>
          </h1>
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">
            {isStaff ? "Institutional Oversight Mode" : "Identity & Hardware Calibration"}
          </p>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8 pb-32">
        
        {/* 🛰️ IDENTITY PASSPORT CARD */}
        <section className="space-y-3">
          <h2 className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic ml-1">
            Active Identity Node
          </h2>
          <div className={cn(
            "rounded-xl border backdrop-blur-md p-4 md:p-5 shadow-sm relative overflow-hidden group transition-all",
            isStaff ? "border-amber-500/20 bg-amber-500/5" : "border-border/40 bg-card/40"
          )}>
            <Fingerprint className="absolute -bottom-2 -right-2 h-16 w-16 opacity-[0.03] -rotate-12 pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="relative shrink-0">
                <div className={cn("absolute inset-0 blur-xl rounded-full opacity-20", isStaff ? "bg-amber-500" : "bg-primary")} />
                <div className={cn(
                  "relative h-12 w-12 md:h-14 md:w-14 rounded-full border flex items-center justify-center text-lg md:text-xl font-black italic shadow-inner transition-colors",
                  isStaff ? "bg-amber-500 border-amber-500/20 text-black" : "bg-primary border-primary/20 text-primary-foreground"
                )}>
                  {userDisplay?.fullName?.[0] || "U"}
                </div>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-base md:text-lg font-black uppercase italic tracking-tight truncate text-foreground leading-none">
                  {userDisplay?.fullName || "Identity Unknown"}
                </span>
                <span className="text-[9px] font-mono font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">
                  @{userDisplay?.username || "anonymous_node"}
                </span>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[7px] font-black uppercase px-1.5 py-0 rounded transition-colors",
                      isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/5 text-primary border-primary/20"
                    )}
                  >
                    {auth.user?.role?.toUpperCase() || "USER"}
                  </Badge>
                  {auth.user?.merchantId && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[7px] font-black uppercase px-1.5 py-0 rounded"
                    >
                      <Zap className="h-2 w-2 mr-1 fill-current" />
                      MERCHANT
                    </Badge>
                  )}
                  {isStaff && (
                    <Badge
                      variant="outline"
                      className="bg-red-500/5 text-red-500 border-red-500/20 text-[7px] font-black uppercase px-1.5 py-0 rounded"
                    >
                      <ShieldAlert className="h-2 w-2 mr-1" />
                      ADMIN_OVERSIGHT
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ⚙️ SETTINGS CLUSTER */}
        <section className="space-y-3">
          <h2 className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic ml-1">
            Protocol Adjustment
          </h2>
          <div className="flex flex-col gap-2">
            <SettingItem
              icon={User}
              label="Profile Metadata"
              sublabel="Identity labels & bio"
              isStaff={isStaff}
            />
            <SettingItem
              icon={Shield}
              label="Security Nodes"
              sublabel="Session management"
              isStaff={isStaff}
            />
            <SettingItem
              icon={Bell}
              label="Alert Frequency"
              sublabel="Signal notification lag"
              isStaff={isStaff}
            />
            <SettingItem
              icon={Globe}
              label="Language"
              sublabel="Regional data standards"
              isStaff={isStaff}
            />
          </div>
        </section>

        {/* 🚩 DESTRUCTIVE ACTIONS */}
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
            Zipha_Build_v2.26 // Cluster_Sync: Optimal
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
  isStaff,
}: {
  icon: any;
  label: string;
  sublabel: string;
  isStaff?: boolean;
}) {
  return (
    <div
      onClick={() => hapticFeedback("light")}
      className={cn(
        "flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer group active:scale-[0.98] shadow-sm backdrop-blur-md",
        isStaff 
          ? "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30" 
          : "bg-card/40 border-border/40 hover:border-primary/20"
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={cn(
          "h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-lg flex items-center justify-center border transition-all shadow-inner",
          isStaff 
            ? "bg-amber-500/10 text-amber-500 border-amber-500/20 group-hover:scale-105" 
            : "bg-muted/10 text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 group-hover:scale-105"
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className={cn(
            "text-[11px] font-black uppercase italic tracking-tight transition-colors truncate",
            isStaff ? "text-amber-500/80 group-hover:text-amber-500" : "text-foreground/80 group-hover:text-primary"
          )}>
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