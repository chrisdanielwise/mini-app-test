"use client";

import * as React from "react";
import { useState } from "react";
import { Bot, Webhook, Eye, EyeOff, RefreshCcw, Terminal, Server, Activity, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useInstitutionalFetch } from "@/hooks/use-institutional-fetch";
import { toast } from "sonner";

export function SettingsRelay() {
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const { screenSize, isMobile, isTablet, isPortrait, isReady } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  const [showBotToken, setShowBotToken] = useState(false);
  const [config, setConfig] = useState({
    botToken: "7482910452:AAH_Node_Ex7482910452_Institutional",
    webhookUrl: "https://relay.zipha.io/v1/ingest/node_7482",
  });

  const { execute: saveConfig, loading: isSyncing } = useInstitutionalFetch(
    async (payload: typeof config) => {
      const res = await fetch("/api/merchant/config", { method: "PATCH", body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("PROTOCOL_SYNC_FAILED");
      return res.json();
    },
    {
      onSuccess: () => {
        notification("success");
        toast.success("PROTOCOL_UPDATED: Relay_Synchronized");
      },
      onError: (err) => {
        notification("error");
        toast.error(`RELAY_ERROR: ${err}`);
      }
    }
  );

  if (!isReady) return <div className="h-64 animate-pulse bg-white/5 rounded-2xl border border-white/5" />;

  const mainGridCols = (screenSize === 'xxl' || screenSize === 'xl') ? "grid-cols-3" : 
                       (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-2" : "grid-cols-1";

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className={cn("grid gap-4", mainGridCols)}>
        <div className={cn("space-y-4", (screenSize === 'xxl' || screenSize === 'xl') ? "lg:col-span-2" : "col-span-1")}>
          
          {/* BOT IDENTITY: Slim Protocol */}
          <div className={cn(
            "relative overflow-hidden rounded-2xl border backdrop-blur-xl p-6",
            isStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/40 border-white/5 shadow-2xl"
          )}>
            <div className="flex items-center gap-3 mb-6 leading-none">
              <div className={cn(
                "size-9 rounded-lg border flex items-center justify-center transition-all",
                isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
              )}>
                <Bot className="size-5 animate-pulse" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-black uppercase italic tracking-tighter text-foreground">Bot_Handshake</h3>
                <span className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-20">Telegram_Relay_v16</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[7.5px] font-black uppercase tracking-[0.3em] opacity-20 ml-1">AUTH_TOKEN</label>
              <div className="relative group">
                <Input 
                  type={showBotToken ? "text" : "password"}
                  value={config.botToken}
                  readOnly
                  className="h-11 rounded-xl bg-black/40 border-white/5 px-4 font-mono text-[9px] tracking-widest text-primary/60"
                />
                <button 
                  onClick={() => { impact("light"); setShowBotToken(!showBotToken); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/5 rounded-lg opacity-20"
                >
                  {showBotToken ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                </button>
              </div>
            </div>
          </div>

          {/* WEBHOOK: Slim Protocol */}
          <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur-xl p-6 shadow-2xl">
             <div className="flex items-center gap-3 mb-6 leading-none">
              <div className="size-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Webhook className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-black uppercase italic tracking-tighter text-foreground">Webhook_Ingress</h3>
                <span className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-20">Signal_Pipe_Active</span>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[7.5px] font-black uppercase tracking-[0.3em] opacity-20 ml-1">INGEST_URL</label>
              <Input 
                value={config.webhookUrl}
                onChange={(e) => setConfig({...config, webhookUrl: e.target.value})}
                className="h-11 rounded-xl bg-black/40 border-white/5 px-4 font-mono text-[9px] text-foreground"
              />
            </div>
          </div>
        </div>

        {/* SECURITY PANEL: Tactical Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 space-y-6">
             <div className="flex items-center gap-2 italic opacity-20 leading-none">
                <Server className="size-3" />
                <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">Node_Security</span>
             </div>
             <div className="space-y-2">
                {[
                  { label: "IP_Whitelisting", status: "ACTIVE", icon: ShieldCheck, color: "text-emerald-500" },
                  { label: "SSL_Termination", status: "STABLE", icon: Activity, color: "text-emerald-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 group leading-none">
                    <div className="flex flex-col gap-1">
                      <span className="text-[6.5px] font-black uppercase text-muted-foreground/30">{item.label}</span>
                      <span className={cn("text-[8px] font-black italic", item.color)}>{item.status}</span>
                    </div>
                    <item.icon className={cn("size-3 opacity-20 group-hover:opacity-100", item.color)} />
                  </div>
                ))}
             </div>
             <Button 
               disabled={isSyncing}
               onClick={() => { impact("heavy"); saveConfig(config); }}
               className={cn(
                 "w-full h-11 rounded-xl font-black uppercase italic tracking-widest text-[9px] shadow-lg transition-all",
                 isStaff ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
               )}
             >
               {isSyncing ? "Syncing..." : "Save_Config"}
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}