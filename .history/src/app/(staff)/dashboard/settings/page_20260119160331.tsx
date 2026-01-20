"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Bot, ShieldCheck, Maximize, Key,
  CheckCircle2, Terminal, ShieldAlert, ServerCog,
  Activity, Cpu, Fingerprint, Save, Loader2, ShieldX
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useTelegramContext } from "@/components/providers/telegram-provider"; 
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

// 🛠️ Atomic UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SessionActivityTable } from "@/components/dashboard/session-activity-table";

/**
 * 🛰️ SETTINGS_PAGE (Institutional Apex v2026.1.20)
 * Strategy: Viewport-Locked Chassis & Hardware Ingress.
 * Fix: Resolved TS2339 by synchronizing with TelegramContextValue properties.
 */
export default function SettingsPage() {
  const { isFullSize, toggleFullSize, mounted, flavor } = useLayout();
  const { user } = useInstitutionalAuth(); 
  const router = useRouter();
  
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  // ✅ FIX: Accessing hardware bridge methods from the standardized context
  const { setMainButton, hapticFeedback, isTelegram } = useTelegramContext(); 
  
  const isSuperAdmin = useMemo(() => flavor === "AMBER", [flavor]);
  const [isSaving, setIsSaving] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [settings, setSettings] = useState({
    terminalAlias: "",
  });

  // 🛠️ HARDWARE_HANDSHAKE: Syncing the Telegram Main Button
  useEffect(() => {
    if (!isTelegram || !isReady || !setMainButton) return;

    setMainButton({
      text: isSaving ? "🛰️ SYNCHRONIZING..." : "💾 COMMIT_CONFIGURATION",
      isVisible: isMobile,
      isActive: !isSaving,
      // @ts-ignore - API 8.0 support for color hex
      color: isSuperAdmin ? "#f59e0b" : "#10b981",
      onClick: () => handleSaveSequence()
    });

    return () => setMainButton({ text: "", isVisible: false });
  }, [isTelegram, isSaving, isSuperAdmin, isReady, isMobile, setMainButton]);

  const handleSaveSequence = async () => {
    if (isSaving) return;
    setIsSaving(true);
    
    // ✅ FIX: TS2339 - Using safe haptic trigger
    if (hapticFeedback) hapticFeedback("medium");

    try {
      await new Promise(r => setTimeout(r, 1500));
      toast.success("Identity Node Re-Anchored");
      if (hapticFeedback) hapticFeedback("success");
    } catch (err) {
      toast.error("Handshake Failure");
      if (hapticFeedback) hapticFeedback("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGlobalRevocation = async () => {
    if (hapticFeedback) hapticFeedback("heavy");
    const confirm = window.confirm("⚠️ WARNING: Terminal wipe will void ALL active sessions. Proceed?");
    if (!confirm) return;

    setIsRevoking(true);
    try {
      const res = await fetch("/api/auth/logout-global", { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("GLOBAL_WIPE_COMPLETE");
      if (hapticFeedback) hapticFeedback("success");
      router.replace("/dashboard/login");
    } catch (err) {
      toast.error("REVOCATION_FAILED");
      if (hapticFeedback) hapticFeedback("error");
    } finally {
      setIsRevoking(false);
    }
  };

  if (!mounted || !isReady) return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black gap-4">
      <Cpu className="size-10 text-primary/20 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Establishing_Mesh_Sync...</p>
    </div>
  );

  return (
    <div className="absolute inset-0 flex flex-col min-w-0 overflow-hidden bg-black text-foreground">
      
      {/* --- 🛡️ FIXED COMMAND HUD --- */}
      <div 
        className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2"
        style={{ paddingTop: isMobile ? `calc(${safeArea.top}px + 0.5rem)` : "0.5rem" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 px-6">
          <div className="space-y-1.5 min-w-0">
            <Link href="/dashboard" className="group inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 hover:text-primary transition-all italic leading-none mb-1">
              <ArrowLeft className="size-2.5 group-hover:-translate-x-1" /> Back_To_Root
            </Link>
            <div className="space-y-1">
              <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none truncate">
                {isSuperAdmin ? "Platform" : "Node"} <span className={isSuperAdmin ? "text-amber-500" : "text-primary"}>Config</span>
              </h1>
              <div className="flex items-center gap-2.5 opacity-20 italic leading-none">
                <Activity className="size-3 animate-pulse text-primary" />
                <p className="text-[7px] font-black uppercase tracking-[0.4em]">
                  Handshake: {user?.role || "GUEST"} // v16.31_STABLE
                </p>
              </div>
            </div>
          </div>

          {!isMobile && (
            <div className="shrink-0 scale-90 origin-bottom-right">
              <Button 
                onClick={handleSaveSequence} 
                disabled={isSaving} 
                className={cn(
                  "h-10 px-6 rounded-xl font-black uppercase italic text-[10px] tracking-[0.2em] shadow-lg transition-all",
                  isSuperAdmin ? "bg-amber-500 text-black shadow-amber-500/10" : "bg-primary text-white shadow-primary/20"
                )}
              >
                {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5 mr-2" />}
                {isSaving ? "Syncing..." : "Commit_Changes"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME --- */}
      <div className="flex-1 min-h-0 w-full relative overflow-y-auto scrollbar-hide overscroll-contain px-4 md:px-6 py-6">
        <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3")}>
          
          <div className="lg:col-span-2 space-y-6">
            <section className="space-y-4">
              <div className={cn(
                "flex items-center gap-3 border-b border-white/5 pb-3 transition-colors opacity-30",
                isSuperAdmin ? "text-amber-500" : "text-primary"
              )}>
                {isSuperAdmin ? <ServerCog className="size-3.5" /> : <Bot className="size-3.5" />}
                <h2 className="text-[8px] font-black uppercase tracking-[0.4em] italic">System_Protocols</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-white/5 overflow-hidden divide-x divide-y md:divide-y-0 divide-white/5 bg-white/[0.01]">
                <div className="space-y-2 p-6 border-r border-white/5">
                  <Label className="text-[7px] font-black uppercase tracking-[0.3em] opacity-20 italic">Terminal_Alias</Label>
                  <div className="relative group">
                    <Terminal className={cn("absolute left-4 top-1/2 -translate-y-1/2 size-3.5 transition-colors opacity-20 group-focus-within:opacity-100", isSuperAdmin ? "text-amber-500" : "text-primary")} />
                    <Input 
                      value={settings.terminalAlias}
                      onChange={(e) => setSettings({...settings, terminalAlias: e.target.value})}
                      className="h-10 rounded-lg bg-black/40 border-white/5 pl-10 font-black text-[10px] uppercase italic tracking-widest placeholder:opacity-10" 
                      placeholder="NODE_IDENTITY_ALPHA" 
                    />
                  </div>
                </div>
                <div className="space-y-2 p-6">
                  <Label className="text-[7px] font-black uppercase tracking-[0.3em] opacity-20 italic">API_Handshake</Label>
                  <div className="relative">
                    <Input type="password" defaultValue="••••••••••••••••" className="h-10 rounded-lg bg-black/40 border-white/5 pr-10 font-mono text-[9px] opacity-10 cursor-not-allowed italic" disabled />
                    <Key className="absolute right-4 top-1/2 -translate-y-1/2 size-3 text-muted-foreground/10" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <SessionActivityTable />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className={cn(
              "rounded-[2rem] border backdrop-blur-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group transition-all",
              isSuperAdmin ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-primary/[0.01] border-primary/10"
            )}>
              <ShieldCheck className="absolute -top-6 -right-6 size-32 opacity-[0.02] rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000" />
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3 opacity-20">
                  <Fingerprint className={cn("size-3.5", isSuperAdmin ? "text-amber-500" : "text-primary")} />
                  <h3 className="text-[8px] font-black uppercase tracking-[0.3em] italic">Security_Node</h3>
                </div>
                
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <Button 
                    onClick={handleGlobalRevocation}
                    disabled={isRevoking}
                    variant="outline"
                    className="w-full h-11 rounded-xl border-rose-500/20 bg-rose-500/[0.02] text-rose-500 hover:bg-rose-500/5 transition-all font-black uppercase italic text-[8px] tracking-[0.2em]"
                  >
                    <ShieldX className="mr-2 size-3.5" />
                    {isRevoking ? "REVOKING..." : "Remote_Wipe"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isMobile && <div style={{ height: `calc(${safeArea.bottom}px + 6.5rem)` }} className="shrink-0 w-full" />}
      </div>
    </div>
  );
}