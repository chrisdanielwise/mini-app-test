"use client";

import { useLayout } from "@/context/layout-provider";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Bot, 
  ShieldCheck, 
  Maximize, 
  Key, 
  Settings2,
  CheckCircle2,
  X,
  Layout,
  Zap,
  Globe,
  Terminal,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { SettingsDeployButton } from "@/components/dashboard/settings-deploy-button";
import { useState } from "react";

/**
 * 🛰️ SYSTEM CONFIGURATION NODE (Tier 2)
 * High-resiliency environment for merchant engine parameters.
 */
export default function SettingsPage() {
  const { isFullSize, toggleFullSize, navMode, setNavMode } = useLayout();
  
  // 🏁 State for live-deployment logic
  const [settings, setSettings] = useState({
    botUsername: "@ZiphaSignals_Bot",
    webhookEnabled: true,
  });

  return (
    <div className="min-h-screen bg-background space-y-12 p-8 sm:p-12 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* --- COMMAND HEADER --- */}
      <div className="flex items-center justify-between border-b border-border/40 pb-12">
        <div className="space-y-3">
          <Link 
            href="/dashboard" 
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" /> 
            Command Center
          </Link>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none flex items-center gap-6">
            System <span className="text-primary">Config</span> 
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40">
            Node Protocol v2.0.26 // Edge Sync Stable
          </p>
        </div>

        <div className="hidden lg:block">
           <div className="flex h-20 w-20 items-center justify-center rounded-[2.5rem] border border-primary/20 bg-primary/5 text-primary shadow-inner">
              <Settings2 className="h-10 w-10 animate-[spin_8s_linear_infinite]" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        
        {/* --- LEFT: NODE PARAMETERS --- */}
        <div className="xl:col-span-2 space-y-16">
          
          {/* Signal Automation Node */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-primary border-b border-border/40 pb-4">
              <Bot className="h-4 w-4" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">Signal Automation Protocol</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-primary/70">Bot Identity (@Handle)</Label>
                <div className="relative">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30" />
                  <Input 
                    className="rounded-2xl border-border/40 bg-muted/10 h-14 pl-12 font-black text-xs uppercase tracking-widest text-primary focus:ring-primary/20" 
                    placeholder="@ALPHASIGNAL_BOT" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-primary/70">Secure API Handshake</Label>
                <div className="relative">
                  <Input type="password" defaultValue="••••••••••••••••" className="rounded-2xl border-border/40 bg-muted/10 h-14 font-mono pr-12 text-sm shadow-inner" />
                  <Key className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30" />
                </div>
              </div>
            </div>

            {/* Webhook Logic Block */}
            <div className="group flex items-center justify-between p-8 rounded-[3rem] bg-card/40 border border-border/40 backdrop-blur-3xl transition-all hover:border-primary/20">
              <div className="max-w-[70%] space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-sm font-black uppercase italic tracking-tighter">
                    External Signal Ingress
                  </p>
                </div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed tracking-widest opacity-60">
                  Allow protocol injection from TradingView, PineScript, or MT5/MT4 Cloud Nodes.
                </p>
              </div>
              <Switch defaultChecked className="scale-125 data-[state=checked]:bg-primary" />
            </div>
          </section>

          {/* Interface Architecture Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-emerald-500 border-b border-border/40 pb-4">
              <Maximize className="h-4 w-4" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">Interface Architecture</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-8 rounded-[3rem] bg-card/40 border border-border/40 backdrop-blur-2xl hover:bg-muted/10 transition-colors">
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase italic tracking-tighter">Ultra-Wide Flow</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">1920PX CANVAS SYNC</p>
                </div>
                <Switch checked={isFullSize} onCheckedChange={toggleFullSize} className="scale-110" />
              </div>

              <div className="flex items-center justify-between p-8 rounded-[3rem] bg-card/40 border border-border/40 backdrop-blur-2xl hover:bg-muted/10 transition-colors">
                <div className="space-y-2">
                  <p className="text-sm font-black uppercase italic tracking-tighter leading-none">Command Mode</p>
                  <select 
                    value={navMode}
                    onChange={(e) => setNavMode(e.target.value as any)}
                    className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-primary outline-none cursor-pointer"
                  >
                    <option value="SIDEBAR">Protocol: Sidebar</option>
                    <option value="TOPBAR">Protocol: Command Strip</option>
                    <option value="BOTTOM">Protocol: Float Nav</option>
                  </select>
                </div>
                <Layout className="h-6 w-6 text-muted-foreground opacity-20" />
              </div>
            </div>
          </section>
        </div>

        {/* --- RIGHT: SECURITY HUD --- */}
        <div className="space-y-10">
          <div className="rounded-[3.5rem] bg-card/40 border border-border/40 p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
               <ShieldCheck className="h-32 w-32" />
            </div>
            
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-8">Node Security Hub</h3>
            <ul className="space-y-6 relative z-10">
              <li className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-inner">
                   <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Database Sync: Live</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-inner">
                   <Globe className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Zone: Global_Edge_01</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-inner">
                   <ShieldAlert className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Wallet Lock: Enabled</span>
              </li>
            </ul>

            <div className="mt-12">
               <SettingsDeployButton formData={settings} />
            </div>
          </div>

          {/* EXIT TERMINAL */}
          <div className="pt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-3 opacity-20 group">
               <Terminal className="h-3 w-3" />
               <p className="text-[8px] font-black uppercase tracking-[0.4em] italic group-hover:opacity-100 transition-opacity">Close System Node</p>
            </div>
            <Link href="/dashboard">
              <Button 
                variant="outline" 
                className="h-24 w-24 rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-xl hover:bg-rose-500 hover:text-white hover:border-rose-500 shadow-2xl transition-all duration-700 group active:scale-95"
              >
                <X className="h-10 w-10 group-hover:rotate-90 transition-transform duration-700" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}