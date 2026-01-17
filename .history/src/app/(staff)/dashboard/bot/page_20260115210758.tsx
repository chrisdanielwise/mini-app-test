"use client";

import * as React from "react";
import { 
  Zap, Terminal, Copy, ShieldCheck, RefreshCcw, ExternalLink, 
  Globe, Lock, Cpu, Code2, Building2, Activity, Link2
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

/**
 * 🌊 SIGNAL_INGRESS_CONTROL (Institutional Apex v2026.1.15)
 * Architecture: Platform-Aware Webhook Membrane.
 * Aesthetics: Obsidian Depth | Water-Ease Kinetic Ingress.
 */
export default function BotConfigPage({ session, services }: any) {
  const { flavor } = useLayout();
  const { isReady, isMobile, safeArea, screenSize } = useDeviceContext();

  // 🛡️ IDENTITY RESOLUTION: Zero-Latency Role Gating
  const isPlatformStaff = flavor === "AMBER";
  const realMerchantId = session?.merchantId;
  const activeBotNode = session?.config?.botUsername || (isPlatformStaff ? "SYSTEM_ROOT_MASTER" : "NODE_OFFLINE");

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <div className="min-h-screen bg-background animate-pulse" />;

  return (
    <div 
      className={cn(
        "max-w-[1400px] mx-auto space-y-10 md:space-y-16 pb-24",
        "animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      )}
      style={{ 
        paddingLeft: isMobile ? "1.5rem" : "0px",
        paddingRight: isMobile ? "1.5rem" : "0px"
      }}
    >
      
      {/* --- COMMAND HUD HEADER: Vapour-Glass Horizon --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6">
          <div className="flex items-center gap-4 italic opacity-40">
            <Globe className={cn("size-4", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-primary")} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] leading-none">
                {isPlatformStaff ? "Global_Signal_Core" : "Merchant_Ingress_Hub"}
              </span>
              <span className="text-[7px] font-black uppercase tracking-widest mt-1 opacity-50">v16.31_STABLE</span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Signal <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Webhooks</span>
          </h1>
          
          <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground/30 italic">
            <Terminal className="size-3.5" />
            <span className="tracking-[0.2em]">NODE: {activeBotNode}</span>
            <div className="h-px w-8 bg-white/5" />
            <span className="tracking-[0.1em]">AES-256 Enabled</span>
          </div>
        </div>

        <div className="shrink-0 flex gap-4">
          <Button
            variant="outline"
            className="h-12 md:h-14 px-8 rounded-2xl border-white/5 bg-white/[0.02] font-black uppercase italic text-[10px] tracking-[0.3em] text-foreground hover:bg-white/10"
          >
            <RefreshCcw className="mr-3 size-4 opacity-40" /> 
            {isPlatformStaff ? "Platform_Sync" : "Rotate_Keys"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
        
        {/* --- LEFT: INGRESS NODES --- */}
        <div className="xl:col-span-2 space-y-8">
          {services.length === 0 ? (
            <div className="rounded-[3rem] border border-dashed border-white/5 bg-card/10 p-24 text-center opacity-20">
              <Cpu className="size-16 mx-auto mb-8" />
              <p className="text-[12px] font-black uppercase tracking-[0.5em] italic">
                Zero_Active_Nodes_Detected
              </p>
            </div>
          ) : (
            services.map((service: any, index: number) => (
              <div
                key={service.id}
                style={{ animationDelay: `${index * 80}ms` }}
                className={cn(
                  "group relative overflow-hidden rounded-[3rem] border border-white/5 bg-card/30 backdrop-blur-3xl shadow-apex transition-all duration-1000",
                  "animate-in fade-in slide-in-from-bottom-8",
                  isPlatformStaff ? "hover:border-amber-500/20" : "hover:border-primary/20"
                )}
              >
                <div className="p-8 md:p-12 space-y-10">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Activity className="size-3.5 text-emerald-500 animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 italic leading-none">
                          NODE: {service.id.slice(0, 8)} // Cluster: {service.categoryTag || "GENERAL"}
                        </p>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors duration-700">
                        {service.name}
                      </h3>
                      {isPlatformStaff && (
                        <div className="flex items-center gap-3 mt-4 opacity-30 italic">
                           <Building2 className="size-4" />
                           <span className="text-[10px] font-black uppercase tracking-[0.4em]">{service.merchant.companyName}</span>
                        </div>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-xl bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 italic shadow-apex-emerald"
                    >
                      ACTIVE_READY
                    </Badge>
                  </div>

                  {/* Endpoint Protocol */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
                        Production_Gateway
                      </Label>
                      <span className="text-[8px] font-mono font-bold text-white/10 uppercase tracking-widest">
                        Protocol: HTTPS // POST
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-zinc-950/60 border border-white/5 rounded-2xl px-6 h-16 flex items-center font-mono text-[11px] tracking-tight text-emerald-500 shadow-inner truncate italic">
                        https://api.zipha.finance/v1/webhooks/signals/{service.id}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-2xl border border-white/5 bg-white/5 h-16 w-16 shrink-0 hover:bg-primary hover:text-white transition-all duration-700 shadow-apex active:scale-75"
                      >
                        <Copy className="size-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Schema Manifest */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 px-2">
                      <Code2 className="size-4 text-primary/40" />
                      <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic leading-none">
                        JSON_Transmission_Manifest
                      </Label>
                    </div>
                    <pre className="relative group/code bg-zinc-950/80 p-8 rounded-[2rem] border border-white/5 font-mono text-[11px] overflow-x-auto leading-relaxed text-zinc-400 shadow-apex">
                      <div className="absolute top-4 right-6 text-[8px] font-black text-zinc-700 uppercase tracking-widest italic">
                        MIME: application/json
                      </div>
                      {`{
  "secret": "${isPlatformStaff ? "REDACTED_FOR_OVERSRIGHT" : "YOUR_NODE_TOKEN"}",
  "action": "SIGNAL_BROADCAST",
  "message": "🚀 BUY BTC/USD \\nEntry: 45000",
  "parse_mode": "HTML"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- RIGHT: SECURITY HUD --- */}
        <div className="space-y-8">
          <div className={cn(
            "rounded-[3rem] p-10 shadow-apex relative overflow-hidden group transition-all duration-1000",
            isPlatformStaff ? "bg-amber-500 text-black shadow-apex-amber" : "bg-primary text-white shadow-apex-primary"
          )}>
            <Zap className="absolute -bottom-6 -right-6 size-32 opacity-10 -rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-0" />
            <Terminal className="size-10 mb-6 opacity-60" />
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 leading-none">
              Node <span className="opacity-40">Manual</span>
            </h3>
            <p className="text-[11px] font-bold uppercase leading-relaxed tracking-widest opacity-70 mb-10 italic">
              Integrate TradingView alerts directly with Zipha liquidity nodes for instant sub-second broadcast.
            </p>
            <Button className="w-full h-16 rounded-2xl bg-black/90 text-white font-black uppercase italic text-[11px] tracking-[0.3em] shadow-2xl transition-all hover:bg-black active:scale-95">
              API_DOCS <ExternalLink className="ml-3 size-4" />
            </Button>
          </div>

          <div className="rounded-[3rem] border border-white/5 bg-card/30 p-10 backdrop-blur-3xl shadow-apex">
            <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
              <Lock className="size-4 text-primary/40" />
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 italic">
                Network_Security
              </h4>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500 transition-all duration-500 group-hover:scale-110 group-hover:shadow-apex-emerald">
                  <ShieldCheck className="size-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 italic">
                  TLS_Node_Verified
                </span>
              </div>
              <div className="flex items-center gap-5 group cursor-pointer" onClick={() => impact("medium")}>
                <div className={cn(
                  "size-10 rounded-xl flex items-center justify-center border transition-all duration-700 group-hover:rotate-180 group-hover:shadow-apex",
                  isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                )}>
                  <RefreshCcw className="size-5" />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.3em] italic transition-colors",
                  isPlatformStaff ? "text-amber-500/40 group-hover:text-amber-500" : "text-primary/40 group-hover:text-primary"
                )}>
                  {isPlatformStaff ? "Sync_Platform_Nodes" : "Rotate_Node_Secret"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER TELEMETRY */}
      <div 
        className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-10 py-16 border-t border-white/5"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : "4rem" }}
      >
        <div className="flex items-center gap-4">
           <Activity className="size-4 animate-pulse" />
           <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground italic text-center leading-none">
             Handshake_Sync: Stable // Node_ID: {realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"}
           </p>
        </div>
        {!isMobile && <div className="size-1 rounded-full bg-foreground" />}
        <span className="text-[8px] font-mono tabular-nums opacity-60">[v16.31_STABLE]</span>
      </div>
    </div>
  );
}