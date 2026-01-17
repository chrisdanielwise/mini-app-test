"use client";

import * as React from "react";
import { useState } from "react";
import { 
  Bot, 
  Webhook, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCcw, 
  Terminal, 
  Server,
  Activity,
  Waves,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDevice } from "@/context/device-provider";
import { useInstitutionalFetch } from "@/hooks/use-institutional-fetch";
import { toast } from "sonner";

/**
 * 🌊 SETTINGS_RELAY_PANEL (Institutional v16.16.29)
 * Logic: Hardened credential masking with useInstitutionalFetch engine.
 * Design: Kinetic Morphology with Water-Ease motion curves.
 */
export function SettingsRelay() {
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const { screenSize } = useDevice();
  const isStaff = flavor === "AMBER";

  const [showBotToken, setShowBotToken] = useState(false);
  const [config, setConfig] = useState({
    botToken: "7482910452:AAH_Node_Ex7482910452_Institutional",
    webhookUrl: "https://relay.zipha.io/v1/ingest/node_7482",
  });

  // 🛰️ TACTICAL INGRESS: Standardized Protocol Synchronization
  const { execute: saveConfig, loading: isSyncing } = useInstitutionalFetch(
    async (payload: typeof config) => {
      const res = await fetch("/api/merchant/config", {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("PROTOCOL_SYNC_FAILED");
      return res.json();
    },
    {
      onSuccess: () => {
        notification("success");
        toast.success("PROTOCOL_UPDATED: Relay_Configuration_Synchronized");
      },
      onError: (err) => {
        notification("error");
        toast.error(`RELAY_ERROR: ${err}`);
      }
    }
  );

  const handleSave = () => {
    impact("heavy");
    saveConfig(config);
  };

  const toggleMask = () => {
    impact("light");
    setShowBotToken(!showBotToken);
  };

  return (
    <div className="space-y-[var(--fluid-gap)] animate-in fade-in slide-in-from-left-8 duration-1000 ease-[var(--ease-institutional)]">
      
      {/* --- INFRASTRUCTURE HORIZON --- */}
      <div className={cn(
        "grid gap-6",
        screenSize === 'xl' ? "grid-cols-3" : "grid-cols-1"
      )}>
        <div className="lg:col-span-2 space-y-[var(--fluid-gap)]">
          
          {/* BOT IDENTITY BLOCK: KINETIC GLASS */}
          <div className={cn(
            "p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border backdrop-blur-3xl space-y-8 relative overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-card/40 border-white/5 shadow-apex"
          )}>
            <div className="flex items-center gap-4 relative z-10">
              <div className={cn(
                "size-12 rounded-2xl border flex items-center justify-center transition-all duration-1000",
                isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
              )}>
                <Bot className="size-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[var(--fluid-h2)] font-black uppercase italic tracking-tighter text-foreground leading-none">Bot_Handshake</h3>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic">Telegram_Relay_Config</span>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic ml-2">BOT_TOKEN_AUTHORIZATION</label>
                <div className="relative group/field">
                  <Input 
                    type={showBotToken ? "text" : "password"}
                    value={config.botToken}
                    readOnly
                    className="h-16 rounded-2xl bg-black/20 border-white/5 px-6 font-mono text-[11px] tracking-widest text-primary/80 transition-all duration-500 focus:border-primary/40"
                  />
                  <button 
                    onClick={toggleMask}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 rounded-xl transition-all duration-300 active:scale-90"
                  >
                    {showBotToken ? <EyeOff className="size-4 opacity-40" /> : <Eye className="size-4 opacity-40" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* WEBHOOK INGRESS BLOCK: SUBSURFACE FLOW */}
          <div className="p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 bg-card/40 backdrop-blur-3xl space-y-8 shadow-apex relative overflow-hidden transition-all duration-1000">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/[0.02] to-transparent pointer-events-none" />
             
             <div className="flex items-center gap-4 relative z-10">
              <div className="size-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Webhook className="size-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[var(--fluid-h2)] font-black uppercase italic tracking-tighter text-foreground leading-none">Webhook_Ingress</h3>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic">Real_Time_Signal_Pipe</span>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic ml-2">INGEST_URL_VECTOR</label>
              <Input 
                value={config.webhookUrl}
                onChange={(e) => setConfig({...config, webhookUrl: e.target.value})}
                className="h-16 rounded-2xl bg-black/20 border-white/5 px-6 font-mono text-[11px] tracking-widest text-foreground transition-all duration-500 focus:border-primary/40"
              />
            </div>
          </div>
        </div>

        {/* --- SECURITY STATUS PANEL: TACTICAL SIDEBAR --- */}
        <div className="space-y-[var(--fluid-gap)]">
          <div className="p-8 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl space-y-8 transition-all duration-1000 shadow-apex">
             <div className="flex items-center gap-3 italic opacity-40">
                <Server className="size-3.5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node_Security</span>
             </div>
             
             <div className="space-y-4">
                {[
                  { label: "IP_Whitelisting", status: "ACTIVE", icon: ShieldCheck, color: "text-emerald-500" },
                  { label: "SSL_Termination", status: "STABLE", icon: Activity, color: "text-emerald-500" },
                  { label: "Key_Rotation", status: "AWAITING", icon: RefreshCcw, color: "text-amber-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-5 rounded-2xl bg-black/20 border border-white/5 group hover:bg-white/5 transition-all duration-500">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{item.label}</span>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest italic leading-none", item.color)}>{item.status}</span>
                    </div>
                    <item.icon className={cn("size-4 opacity-20 group-hover:opacity-100 transition-opacity", item.color)} />
                  </div>
                ))}
             </div>

             <Button 
               disabled={isSyncing}
               onClick={handleSave}
               className={cn(
                 "w-full h-20 rounded-2xl font-black uppercase italic tracking-[0.2em] text-[11px] shadow-2xl transition-all duration-1000 group active:scale-95",
                 isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "bg-primary text-primary-foreground shadow-primary/40"
               )}
             >
               {isSyncing ? (
                 <span className="flex items-center gap-3"><Waves className="size-5 animate-bounce" /> Syncing_Relay...</span>
               ) : (
                 <span className="flex items-center gap-3">Save_Configuration <Zap className="size-4 fill-current group-hover:scale-125 transition-transform" /></span>
               )}
             </Button>
          </div>

          {/* ROTATION ANCHOR */}
          <div className="p-8 rounded-[2.5rem] md:rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000 group">
             <Terminal className="size-8 transition-transform group-hover:rotate-12" />
             <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
               Need to rotate <br /> Protocol Keys?
             </p>
             <Button variant="ghost" className="text-[10px] font-black uppercase text-primary tracking-widest hover:bg-transparent hover:scale-110 transition-all">
               Initialize_Rotation <RefreshCcw className="ml-2 size-3 animate-spin-slow" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}