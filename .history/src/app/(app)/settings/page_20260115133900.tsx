"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  User, Shield, Bell, Globe, LogOut, Terminal, Cpu,
  ChevronRight, Fingerprint, Lock, ShieldAlert, Activity,
  FileDown, ShieldX, Waves, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
// import { useInstitutionalAuth } from "@lib/hooks/use-institutional-auth";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SessionActivityTable } from "@/components/dashboard/session-activity-table";

/**
 * 🛰️ USER TERMINAL SETTINGS (Institutional Apex v16.16.30)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, safeArea).
 * Logic: Atomic provision removal with Hardware-Fluid Interpolation.
 */
export default function SettingsPage() {
  const router = useRouter();
  const { impact, notification } = useHaptics();
  const { isAuthenticated, isLocked, user, isStaff } = useInstitutionalAuth();
  
  // 🛰️ DEVICE PHYSICS: Hardware Ingress
  const { 
    screenSize, isMobile, isTablet, isDesktop, 
    isPortrait, safeArea, viewportWidth, isReady 
  } = useDeviceContext();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // 🛡️ HYDRATION & AUTH GUARD
  if (!isReady || isLocked) return <LoadingScreen message="SYNCING_COMMAND_NODES..." />;
  if (!isAuthenticated) return <IdentityNullFallback />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Balancing layout gravity based on the 6-tier system.
   */
  const headerPaddingTop = `calc(${safeArea.top}px + 1.5rem)`;
  const settingsGrid = (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-2 gap-6" : "grid-cols-1 gap-4";
  const contentMaxWidth = isDesktop ? "max-w-5xl" : "max-w-3xl";

  const handleExport = async () => {
    setIsExporting(true);
    impact("medium");
    toast.loading("Compiling_Security_Ledger...");
    // Simulate compilation for fluid feedback
    setTimeout(() => {
      window.location.href = "/api/auth/audit/export";
      setIsExporting(false);
      toast.dismiss();
      notification("success");
    }, 1500);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    impact("heavy");

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();
      notification("success");
      toast.success("Identity_Node_De-provisioned");
      router.replace("/dashboard/login");
    } catch (err) {
      notification("error");
      toast.error("Failed_To_Disconnect_Node");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[var(--tg-viewport-h)] animate-in fade-in duration-1000 selection:bg-primary/30">
      
      {/* 🌊 HEADER: Fluid safeArea integration */}
      <header 
        className="px-6 pb-10 rounded-b-[3rem] md:rounded-b-[4rem] border-b border-white/5 bg-card/40 backdrop-blur-3xl shadow-apex relative overflow-hidden transition-all duration-700"
        style={{ paddingTop: headerPaddingTop }}
      >
        <div className="max-w-5xl mx-auto space-y-2 relative z-10">
          <div className="flex items-center gap-3 italic opacity-30">
            <Cpu className={cn("size-4 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">
              {isStaff ? "Universal_Oversight_Link" : "Hardware_Node_Sync"}
            </span>
          </div>
          <h1 className="text-[var(--fluid-h1)] font-black uppercase italic tracking-tighter leading-none">
            App <span className={cn("opacity-40", isStaff && "text-amber-500")}>Settings</span>
          </h1>
        </div>
        
        {/* Subsurface Radiance */}
        <Waves className="absolute -bottom-4 left-0 w-full opacity-5 text-primary pointer-events-none" 
               style={{ height: `${Math.max(40, viewportWidth * 0.1)}px` }} />
      </header>

      <main className={cn("flex-1 px-6 py-10 space-y-12 pb-48 mx-auto w-full", contentMaxWidth)}>
        
        {/* --- IDENTITY HUD --- */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-card/30 p-8 shadow-apex backdrop-blur-3xl group">
          <div className="flex items-center gap-6 relative z-10">
            <div className={cn(
              "size-16 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-all duration-1000 group-hover:rotate-6",
              isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
            )}>
              <User className="size-8" />
            </div>
            <div className="space-y-1 min-w-0">
               <h2 className="text-xl font-black uppercase italic tracking-tight truncate leading-none">
                 {user?.first_name || "Operator"}
               </h2>
               <p className="text-[9px] font-mono font-bold text-muted-foreground/30 uppercase tracking-[0.2em] leading-none">
                 NODE_ID: {user?.id?.slice(0, 12)}
               </p>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 size-32 opacity-[0.02] rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000">
            <ShieldCheck className="size-full" />
          </div>
        </section>

        {/* 📊 SESSION TELEMETRY: Morphology-Aware Padding */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-2 opacity-30 italic">
            <Activity className="size-3.5 text-primary animate-pulse" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em]">Active_Telemetry</h2>
          </div>
          <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.01] overflow-hidden shadow-inner">
            <SessionActivityTable />
          </div>
        </section>

        {/* --- SETTINGS CLUSTER: Dynamic Grid --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2 opacity-30 italic">
             <Terminal className="size-4" />
             <h3 className="text-[10px] font-black uppercase tracking-[0.5em]">Command_Manifest</h3>
          </div>
          
          <div className={cn("grid", settingsGrid)}>
            <SettingItem 
              icon={User} 
              label="Profile Metadata" 
              sublabel="Identity labels & bio" 
              isStaff={isStaff} 
              onClick={() => impact("light")}
            />
            <SettingItem 
              icon={FileDown} 
              label="Compliance Ledger" 
              sublabel="Export 30-day security CSV" 
              isStaff={isStaff}
              disabled={isExporting}
              onClick={handleExport}
            />
            <SettingItem 
              icon={ShieldX} 
              label="Node Revocation" 
              sublabel="Instantly rotate node stamp" 
              isStaff={isStaff}
              variant="danger"
              onClick={() => router.push('/settings/security')}
            />
          </div>
        </section>

        {/* ATOMIC LOGOUT: Responsive Hit-zone */}
        <div className="pt-6">
          <Button 
            disabled={isLoggingOut} 
            variant="ghost" 
            onClick={handleLogout}
            className={cn(
              "w-full h-20 rounded-[2rem] border transition-all duration-700 active:scale-95 shadow-apex",
              "bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 border-rose-500/10 hover:border-rose-500/20 font-black uppercase italic tracking-[0.2em] text-[11px]"
            )}
          >
            <div className="flex items-center gap-4">
              <LogOut className="size-5" />
              <span>Disconnect_Identity_Node</span>
            </div>
          </Button>
        </div>
      </main>

      {/* --- FOOTER: Performance telemetry --- */}
      <footer className="mt-auto flex flex-col items-center gap-4 py-12 opacity-20 italic">
         <Globe className="size-6" />
         <p className="text-[8px] font-black uppercase tracking-[0.5em] text-center leading-none">
           Institutional_Command_Sync // NODE_V16.30 // {screenSize.toUpperCase()}
         </p>
      </footer>
    </div>
  );
}

/**
 * 🛠️ HARDENED SETTING ITEM (v16.30)
 */
function SettingItem({ icon: Icon, label, sublabel, isStaff, variant, onClick, disabled }: any) {
  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-700 group active:scale-[0.98] shadow-apex backdrop-blur-3xl disabled:opacity-50",
        variant === "danger" 
          ? "bg-rose-500/5 border-rose-500/10 hover:border-rose-500/20" 
          : isStaff ? "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/20" : "bg-card/40 border-white/5 hover:border-primary/20"
      )}
    >
      <div className="flex items-center gap-5 min-w-0">
        <div className={cn(
          "size-12 shrink-0 rounded-2xl flex items-center justify-center border transition-all duration-700 shadow-inner",
          variant === "danger" ? "bg-rose-500/10 text-rose-500 border-rose-500/20 group-hover:scale-110" :
          isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20 group-hover:scale-110" : "bg-white/5 text-muted-foreground group-hover:text-primary group-hover:scale-110 border-white/5"
        )}>
          <Icon className="size-6" />
        </div>
        <div className="flex flex-col text-left min-w-0">
          <span className={cn(
            "text-[12px] font-black uppercase italic tracking-tight leading-none transition-colors",
            variant === "danger" ? "text-rose-500" : isStaff ? "text-amber-500" : "text-foreground/80 group-hover:text-foreground"
          )}>{label}</span>
          <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest mt-1.5 truncate">{sublabel}</span>
        </div>
      </div>
      <ChevronRight className="size-5 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" />
    </button>
  );
}

function IdentityNullFallback() {
  return (
    <div className="flex min-h-[var(--tg-viewport-h)] flex-col items-center justify-center p-6 bg-background">
      <div className="rounded-[3rem] bg-card border border-rose-500/10 p-12 shadow-apex text-center space-y-8 max-w-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-rose-500/5 blur-3xl -z-10" />
        <Lock className="size-14 text-rose-500 mx-auto animate-pulse opacity-40" />
        <div className="space-y-3">
          <h1 className="text-2xl font-black uppercase italic tracking-tight">Identity_Mismatch</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-relaxed opacity-40 italic">
            Handshake failure. Establish node connection via official terminal.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} className="w-full h-14 rounded-2xl bg-rose-500 text-white font-black uppercase italic tracking-widest shadow-apex">Initiate_Re-Sync</Button>
      </div>
    </div>
  );
}