"use client";

import { useEffect, useState } from "react";
import { useLayout } from "@/context/layout-provider";
import { useAuth } from "@/lib/hooks/use-auth";
import { useTelegramContext } from "@/components/providers/telegram-provider"; 
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Bot, ShieldCheck, Maximize, Key, Settings2,
  CheckCircle2, X, Layout, Terminal, ShieldAlert, ServerCog,
  Globe, Zap, ShieldX
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SessionActivityTable } from "@/components/dashboard/session-activity-table";

export default function SettingsPage() {
  const { isFullSize, toggleFullSize, navMode, setNavMode, mounted } = useLayout();
  const { user } = useAuth();
  const router = useRouter();
  const { setMainButton, hapticFeedback, isTelegram } = useTelegramContext(); 
  
  const isSuperAdmin = user?.role?.toUpperCase() === "SUPER_ADMIN";

  const [isSaving, setIsSaving] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [settings, setSettings] = useState({
    botUsername: "@ZiphaSignals_Bot",
    webhookEnabled: true,
    terminalAlias: "",
  });

  /**
   * 🔘 NATIVE MAIN BUTTON SYNC
   * Strategy: Primary Commit Action on mobile footer.
   */
  useEffect(() => {
    if (!isTelegram) return;

    setMainButton({
      text: isSaving ? "🛰️ SYNCHRONIZING..." : "💾 COMMIT CONFIGURATION",
      isVisible: true,
      isLoader: isSaving,
      color: isSuperAdmin ? "#f59e0b" : "#0088cc",
      onClick: async () => {
        if (isSaving) return;
        handleSaveSequence();
      }
    });

    return () => setMainButton({ text: "", onClick: () => {}, isVisible: false });
  }, [isTelegram, isSaving, settings, isSuperAdmin]);

  const handleSaveSequence = async () => {
    setIsSaving(true);
    hapticFeedback("medium");
    try {
      await new Promise(r => setTimeout(r, 1500));
      toast.success("Identity Node Re-Anchored");
      hapticFeedback("success");
    } catch (err) {
      toast.error("Handshake Failure");
      hapticFeedback("error");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * 🧹 GLOBAL REVOCATION LOGIC
   * Logic: Rotates the Security Stamp via /api/auth/logout-global.
   */
  const handleGlobalRevocation = async () => {
    const confirm = window.confirm("⚠️ WARNING: This will terminate EVERY active session across all devices. Proceed?");
    if (!confirm) return;

    setIsRevoking(true);
    hapticFeedback("heavy");

    try {
      const res = await fetch("/api/auth/logout-global", { method: "POST" });
      if (!res.ok) throw new Error();

      toast.success("GLOBAL_WIPE_COMPLETE: All sessions voided.");
      hapticFeedback("success");
      
      // Force exit to login gate
      router.replace("/dashboard/login");
    } catch (err) {
      toast.error("REVOCATION_FAILED: Critical system error.");
      hapticFeedback("error");
    } finally {
      setIsRevoking(false);
    }
  };

  if (!mounted) return <div className="p-8 animate-pulse text-[9px] font-black uppercase tracking-[0.4em] opacity-20">Initializing_Node...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 px-4 text-foreground">
      
      {/* --- HUD HEADER --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <Link href="/dashboard" className="group inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> 
            Back to Command
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase italic leading-none">
              {isSuperAdmin ? "Platform" : "Node"} <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Config</span>
            </h1>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-40 italic">
              Active Session: {user?.role} // Stamp: Verified
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* --- LEFT: CONFIGURATION --- */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-6">
            <div className={cn("flex items-center gap-2 border-b border-border/10 pb-3", isSuperAdmin ? "text-amber-500/60" : "text-primary/60")}>
              {isSuperAdmin ? <ServerCog className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              <h2 className="text-[10px] font-black uppercase tracking-widest">System Protocols</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest opacity-40">Terminal Alias</Label>
                <div className="relative">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-20" />
                  <Input 
                    value={settings.terminalAlias}
                    onChange={(e) => setSettings({...settings, terminalAlias: e.target.value})}
                    className="h-11 rounded-xl bg-muted/10 pl-11 font-black text-[10px] uppercase tracking-widest" 
                    placeholder="NODE_IDENTITY_ALPHA" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest opacity-40">API Handshake</Label>
                <div className="relative">
                  <Input type="password" defaultValue="••••••••••••••••" className="h-11 rounded-xl bg-muted/10 pr-11 font-mono text-xs shadow-inner" />
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-20" />
                </div>
              </div>
            </div>
            <SessionActivityTable />
          </section>

          {/* Architecture Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-emerald-500/60 border-b border-border/10 pb-3">
              <Maximize className="h-4 w-4" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">Interface Architecture</h2>
            </div>
            <div className="flex items-center justify-between p-6 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-2xl transition-colors">
                <div className="space-y-0.5">
                  <p className="text-xs font-black uppercase italic tracking-tight">Ultra-Wide Flow</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-30">1920PX CANVAS SYNC</p>
                </div>
                <Switch checked={isFullSize} onCheckedChange={toggleFullSize} />
            </div>
          </section>
        </div>

        {/* --- RIGHT: SECURITY HUB --- */}
        <div className="space-y-6">
          <div className="rounded-[2.5rem] bg-card/40 border border-border/40 p-8 backdrop-blur-3xl shadow-xl relative overflow-hidden group">
            <ShieldCheck className="absolute -top-4 -right-4 h-24 w-24 opacity-[0.02] rotate-12" />
            
            <div className="space-y-6 relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60">Security Node</h3>
              
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-inner">
                     <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-foreground/60">Node Sync: Live</span>
                </li>
              </ul>

              {/* 🚨 EMERGENCY REVOCATION TERMINAL */}
              <div className="pt-6 border-t border-border/10 space-y-4">
                <div className="flex items-center gap-2 text-rose-500/60">
                   <ShieldAlert className="h-3.5 w-3.5" />
                   <span className="text-[8px] font-black uppercase tracking-widest">Danger Zone</span>
                </div>
                <Button 
                  onClick={handleGlobalRevocation}
                  disabled={isRevoking}
                  variant="outline"
                  className="w-full h-14 rounded-2xl border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-black uppercase italic text-[9px] tracking-widest"
                >
                  <ShieldX className="mr-2 h-4 w-4" />
                  {isRevoking ? "REVOKING ALL NODES..." : "Global Remote Wipe"}
                </Button>
                <p className="text-[7px] text-muted-foreground/40 uppercase font-bold text-center leading-relaxed">
                  Rotating security stamp will invalidate every active JWT session.
                </p>
              </div>

              <div className="pt-4">
                 <Button onClick={handleSaveSequence} disabled={isSaving} className="w-full h-12 rounded-xl uppercase font-black italic text-[10px] tracking-[0.2em]">
                   {isSaving ? "Syncing..." : "Commit Changes"}
                 </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 py-4 opacity-20">
             <Zap className="h-3 w-3 text-amber-500" />
             <p className="text-[7px] font-black uppercase tracking-[0.4em]">Handshake: Sliding v14.1</p>
          </div>
        </div>
      </div>
    </div>
  );
}