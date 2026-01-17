"use client";

import * as React from "react";
import { useState } from "react";
import { 
  Bot, 
  Webhook, 
  Key, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCcw, 
  ShieldCheck,
  Terminal,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { toast } from "sonner";

/**
 * 🌊 SETTINGS_RELAY_PANEL (v16.16.12)
 * Logic: Hardened input masking for sensitive Bot/API credentials.
 * Design: Institutional Squircle Morphology with Security Interlocks.
 */
export function SettingsRelay() {
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const isStaff = flavor === "AMBER";

  const [showBotToken, setShowBotToken] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);
  
  const [config, setConfig] = useState({
    botToken: "7482910452:AAH_Node_Ex7482910452_Institutional",
    webhookUrl: "https://relay.zipha.io/v1/ingest/node_7482",
    apiSecret: "sk_live_v16_hardened_relay_key"
  });

  const handleSave = () => {
    impact("heavy");
    notification("success");
    toast.success("PROTOCOL_UPDATED: Relay_Configuration_Synchronized");
  };

  const toggleMask = (type: 'bot' | 'webhook') => {
    impact("light");
    if (type === 'bot') setShowBotToken(!showBotToken);
    if (type === 'webhook') setShowWebhook(!showWebhook);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
      
      {/* --- INFRASTRUCTURE OVERVIEW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          
          {/* BOT IDENTITY BLOCK */}
          <div className={cn(
            "p-8 md:p-10 rounded-[3rem] border backdrop-blur-3xl space-y-8",
            isStaff ? "bg-amber-500/[0.03] border-amber-500/20" : "bg-card/40 border-white/5 shadow-2xl"
          )}>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Bot className="size-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground">Bot_Handshake</h3>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic">Telegram_Relay_Config</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic ml-2">BOT_TOKEN_AUTHORIZATION</label>
                <div className="relative group/field">
                  <Input 
                    type={showBotToken ? "text" : "password"}
                    value={config.botToken}
                    readOnly
                    className="h-16 rounded-2xl bg-black/20 border-white/5 px-6 font-mono text-[11px] tracking-widest text-primary/80 transition-all"
                  />
                  <button 
                    onClick={() => toggleMask('bot')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 rounded-xl transition-all"
                  >
                    {showBotToken ? <EyeOff className="size-4 opacity-40" /> : <Eye className="size-4 opacity-40" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* WEBHOOK RELAY BLOCK */}
          <div className="p-8 md:p-10 rounded-[3rem] border border-white/5 bg-card/40 backdrop-blur-3xl space-y-8 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Webhook className="size-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground">Webhook_Ingress</h3>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic">Real_Time_Signal_Pipe</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic ml-2">INGEST_URL_VECTOR</label>
              <Input 
                value={config.webhookUrl}
                onChange={(e) => setConfig({...config, webhookUrl: e.target.value})}
                className="h-16 rounded-2xl bg-black/20 border-white/5 px-6 font-mono text-[11px] tracking-widest text-foreground transition-all"
              />
            </div>
          </div>
        </div>

        {/* --- SECURITY STATUS PANEL (SIDE) --- */}
        <div className="space-y-6">
          <div className="p-8 rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl space-y-6">
             <div className="flex items-center gap-3 italic opacity-40">
                <Server className="size-3.5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node_Security</span>
             </div>
             
             <div className="space-y-4">
                {[
                  { label: "IP_Whitelisting", status: "ACTIVE", color: "text-emerald-500" },
                  { label: "SSL_Termination", status: "STABLE", color: "text-emerald-500" },
                  { label: "Key_Rotation", status: "AWAITING", color: "text-amber-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{item.label}</span>
                    <span className={cn("text-[9px] font-black uppercase tracking-widest italic", item.color)}>{item.status}</span>
                  </div>
                ))}
             </div>

             <Button 
               onClick={handleSave}
               className={cn(
                 "w-full h-16 rounded-2xl font-black uppercase italic tracking-[0.2em] text-[11px] shadow-2xl transition-all",
                 isStaff ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
               )}
             >
               Save_Configuration <Save className="ml-3 size-4" />
             </Button>
          </div>

          <div className="p-8 rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
             <Terminal className="size-8" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">
               Need to rotate <br /> Protocol Keys?
             </p>
             <Button variant="ghost" className="text-[9px] font-black uppercase text-primary tracking-widest">
               Initialize_Rotation <RefreshCcw className="ml-2 size-3" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}