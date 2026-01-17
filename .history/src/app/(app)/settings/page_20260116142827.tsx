"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Terminal, Cpu, ChevronRight, Fingerprint, Lock, 
  Activity, FileDown, ShieldX, Globe, LogOut, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

// 🛠️ Atomic UI Components
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SessionActivityTable } from "@/components/dashboard/session-activity-table";

/**
 * 🛰️ TERMINAL_SETTINGS (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density rows (p-4) and stationary HUD profile prevents layout blowout.
 */
export default function SettingsPage() {
  const router = useRouter();
  const { impact, notification } = useHaptics();
  const { isAuthenticated, isLocked, user, isStaff } = useInstitutionalAuth();
  
  const { isMobile, screenSize, isPortrait, safeArea, isReady } = useDeviceContext();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isReady || isLocked) return <LoadingScreen message="SYNCING_COMMAND_NODES..." />;
  if (!isAuthenticated) return <IdentityNullFallback />;

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    impact("heavy");
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();
      notification("success");
      router.replace("/dashboard/login");
    } catch (err) {
      toast.error("DE-PROVISION_FAILED");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700 max-w-5xl mx-auto leading-none">
      
      {/* 🛡️ FIXED HUD: Stationary Header (h-14/16) */}
      <header 
        className="px-5 py-6 md:px-8 md:py-8 rounded-b-2xl border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all"
        style={{ paddingTop: `calc(${safeArea.top}px * 0.5 + 1rem)` }}
      >
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2 opacity-10 italic">
            <Cpu className={cn("size-3 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
            <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">
              {isStaff ? "Universal_Oversight" : "Hardware_Sync_v16"}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
            Terminal <span className="opacity-20">Settings</span>
          </h1>
        </div>
      </header>

      {/* 🚀 INDEPENDENT TACTICAL VOLUME */}
      <main className="flex-1 px-5 py-8 space-y-10 pb-32">
        
        {/* --- IDENTITY HUD: Compressed Node Plate --- */}
        <section className="relative overflow-hidden rounded-xl border border-white/5 bg-zinc-950/40 p-5 shadow-2xl group">
          <div className="flex items-center gap-4 relative z-10">
            <div className={cn(
              "size-11 rounded-lg flex items-center justify-center border shadow-inner transition-all",
              isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
            )}>
              <User className="size-5" />
            </div>
            <div className="space-y-1 min-w-0">
               <h2 className="text-base font-black uppercase italic tracking-tight text-foreground leading-none">
                 {user?.first_name || "Operator"}
               </h2>
               <p className="text-[7.5px] font-mono font-bold text-muted-foreground/20 uppercase tracking-widest mt-1">
                 NODE_ID_{user?.id?.slice(0, 8).toUpperCase()}
               </p>
            </div>
          </div>
          <ShieldCheck className="absolute -bottom-2 -right-2 size-20 opacity-[0.02] rotate-12 pointer-events-none" />
        </section>

        {/* --- TELEMETRY: High Density Table --- */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1 opacity-10 italic">
            <Activity className="size-3 text-primary" />
            <h2 className="text-[7.5px] font-black uppercase tracking-[0.3em]">Active_Telemetry</h2>
          </div>
          <div className="rounded-xl border border-white/5 bg-zinc-950/40 overflow-hidden shadow-2xl">
            <SessionActivityTable />
          </div>
        </section>

        {/* --- COMMAND MANIFEST: Tactical Grid --- */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1 opacity-10 italic">
             <Terminal className="size-3" />
             <h3 className="text-[7.5px] font-black uppercase tracking-[0.3em]">Command_Manifest</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SettingItem icon={User} label="Profile Metadata" sublabel="Identity_v16" isStaff={isStaff} />
            <SettingItem icon={FileDown} label="Audit Ledger" sublabel="Export_CSV" isStaff={isStaff} />
            <SettingItem icon={ShieldX} label="Node Revocation" sublabel="Rotate_Stamp" variant="danger" />
          </div>
        </section>

        {/* 🏁 ACTION: De-provision Node (h-11) */}
        <Button 
          disabled={isLoggingOut} 
          onClick={handleLogout}
          className="w-full h-11 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 border border-rose-500/10 font-black uppercase italic tracking-widest text-[9px] shadow-lg active:scale-95 transition-all"
        >
          <LogOut className="mr-2 size-3.5" />
          Disconnect_Identity_Node
        </Button>
      </main>

      <footer className="mt-auto flex flex-col items-center gap-2 py-8 opacity-10 italic leading-none">
         <Globe className="size-4" />
         <p className="text-[7px] font-black uppercase tracking-[0.4em] text-center">
           Audit_Core // Synchronized_Node // {screenSize.toUpperCase()}
         </p>
      </footer>

      {/* 📐 STATIONARY GRID ANCHOR */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center" />
    </div>
  );
}

function SettingItem({ icon: Icon, label, sublabel, isStaff, variant }: any) {
  return (
    <button className={cn(
      "flex items-center justify-between p-4 rounded-xl border bg-zinc-950/40 shadow-lg transition-all active:scale-95 group",
      variant === "danger" ? "border-rose-500/10" : isStaff ? "border-amber-500/10" : "border-white/5"
    )}>
      <div className="flex items-center gap-4 min-w-0">
        <div className={cn(
          "size-9 shrink-0 rounded-lg flex items-center justify-center border shadow-inner",
          variant === "danger" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
          isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-white/5 text-muted-foreground/30 border-white/5"
        )}>
          <Icon className="size-4.5" />
        </div>
        <div className="flex flex-col text-left min-w-0">
          <span className={cn(
            "text-[9px] font-black uppercase italic tracking-tight transition-colors",
            variant === "danger" ? "text-rose-500" : isStaff ? "text-amber-500" : "text-foreground/70"
          )}>{label}</span>
          <span className="text-[6.5px] font-black uppercase opacity-10 tracking-widest mt-1">{sublabel}</span>
        </div>
      </div>
      <ChevronRight className="size-3.5 opacity-10 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function IdentityNullFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background leading-none">
      <div className="rounded-2xl bg-zinc-950/60 border border-rose-500/10 p-8 shadow-2xl text-center space-y-6 max-w-sm">
        <Lock className="size-10 text-rose-500 mx-auto opacity-20" />
        <h1 className="text-xl font-black uppercase italic tracking-tighter text-foreground">Identity_Null</h1>
        <Button onClick={() => window.location.reload()} className="w-full h-11 rounded-xl bg-rose-500 text-white font-black uppercase italic tracking-widest text-[9px] shadow-lg">Initiate_Re-Sync</Button>
      </div>
    </div>
  );
}