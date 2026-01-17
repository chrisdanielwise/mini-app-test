"use client";

import * as React from "react";
import { 
  Zap, Terminal, Copy, ShieldCheck, RefreshCcw, ExternalLink, 
  Globe, Lock, Cpu, Code2, Building2, Activity, Link2
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
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
  const { impact, selectionChange } = useHaptics();
  const { 
    isReady, 
    isMobile, 
    screenSize, 
    safeArea, 
    viewportHeight 
  } = useDeviceContext();

  // 🛡️ IDENTITY RESOLUTION: Zero-Latency Role Gating
  const isPlatformStaff = flavor === "AMBER";
  const realMerchantId = session?.merchantId;
  const activeBotNode = session?.config?.botUsername || (isPlatformStaff ? "SYSTEM_ROOT_MASTER" : "NODE_OFFLINE");

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="size-12 rounded-2xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div 
      className={cn(
        "max-w-[1500px] mx-auto space-y-10 md:space-y-16 pb-24",
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
            <span className="tracking-[0.1em]">AES-256 Protocol</span>
          </div>
        </div>

        <div className="shrink-0 relative z-20">
          <Button
            variant="outline"
            onClick={() => impact("medium")}
            className="h-14 md:h-16 px-8 rounded-2xl border-white/5 bg-white/[0.02] font-black uppercase italic text-[11px] tracking-[0.3em] text-foreground hover:bg-white/10 transition-all duration-700 active:scale-95 w-full lg:w-auto"
          >
            <RefreshCcw className="mr-3 size-4 opacity-40 group-hover:rotate-180 transition-transform duration-1000" /> 
            {isPlatformStaff ? "Platform_Sync" : "Rotate_Keys"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
        
        {/* --- LEFT: INGRESS NODES (Fluid Data Matrix) --- */}
        <div className="xl:col-span-2 space-y-8 md:space-y-12">
          {!services || services.length === 0 ? (
            <div className="rounded-[3.5rem] border border-dashed border-white/5 bg-card/10 p-24 text-center opacity-20 italic">
              <Cpu className="size-16 mx-auto mb-8 animate-pulse" />
              <p className="text-[12px] font-black uppercase tracking-[0.5em]">Zero_Active_Ingress_Points</p>
            </div>
          ) : (
            services.map((service: any, index: number) => (
              <div
                key={service.id}
                style={{ animationDelay: `${index * 80}ms` }}
                className={cn(
                  "group relative overflow-hidden rounded-[3.5rem] border border-white/5 bg-card/30 backdrop-blur-3xl shadow-apex transition-all duration-1000",
                  "animate-in fade-in slide-in-from-bottom-8",
                  isPlatformStaff ? "hover:border-amber-500/20" : "hover:border-primary/20"
                )}
              >
                <div className="p-8 md:p-14 space-y-10 md:space-y-14">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Activity className="size-4 text-emerald-500 animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 italic leading-none">
                          NODE: {service.id.slice(0, 8).toUpperCase()} // CLUSTER: {service.categoryTag || "GENERAL"}
                        </p>
                      </div>
                      <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors duration-1000">
                        {service.name}
                      </h3>
                      {isPlatformStaff && (
                        <div className="flex items-center gap-3 mt-6 opacity-30 italic">
                           <Building2 className="size-4" />
                           <span className="text-[11px] font-black uppercase tracking-[0.4em]">{service.merchant?.companyName || "ROOT"}</span>
                        </div>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-xl bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2.5 italic shadow-apex-emerald"
                    >
                      ACTIVE_READY
                    </Badge>
                  </div>

                  {/* Endpoint Protocol: Morphology Aware Padding */}
                  <div className="space-y-5">
                    <div className="flex items-center justify-between px-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
                        Production_Gateway_URL
                      </Label>
                      <span className="text-[8px] font-mono font-bold text-white/10 uppercase tracking-widest">
                        Protocol: HTTPS // Method: POST
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 bg-zinc-950/60 border border-white/5 rounded-2xl px-6 h-16 md:h-20 flex items-center font-mono text-[11px] md:text-xs tracking-tight text-emerald-500 shadow-inner truncate italic">
                        https://api.zipha.finance/v1/webhooks/signals/{service.id}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => impact("medium")}
                        className="rounded-2xl border border-white/5 bg-white/5 h-16 w-full sm:w-20 shrink-0 hover:bg-primary hover:text-white transition-all duration-700 shadow-apex active:scale-90"
                      >
                        <Copy className="size-6" />
                      </Button>
                    </div>
                  </div>

                  {/* Schema Manifest: Obsidian Syntax Depth */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 px-2">
                      <Code2 className="size-4 text-primary/40" />
                      <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic leading-none">
                        JSON_Transmission_Manifest
                      </Label>
                    </div>
                    <pre className="relative group/code bg-zinc-950/90 p-8 md:p-12 rounded-[2.5rem] border border-white/5 font-mono text-[11px] md:text-xs overflow-x-auto leading-relaxed text-zinc-400 shadow-apex transition-all duration-1000 group-hover:bg-black">
                      <div className="absolute top-5 right-8 text-[8px] font-black text-zinc-700 uppercase tracking-widest italic">
                        MIME: application/json
                      </div>
                      {`{
  "secret": "${isPlatformStaff ? "REDACTED_staff_mode" : "YOUR_NODE_TOKEN"}",
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

        {/* --- RIGHT: SECURITY HUD (Oversight Column) --- */}
        <div className="space-y-10">
          <div className={cn(
            "rounded-[3.5rem] p-10 md:p-14 shadow-apex relative overflow-hidden group transition-all duration-1000",
            isPlatformStaff ? "bg-amber-500 text-black shadow-apex-amber" : "bg-primary text-white shadow-apex-primary"
          )}>
            <Zap className="absolute -bottom-8 -right-8 size-40 opacity-10 -rotate-12 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-0" />
            <Terminal className="size-12 mb-8 opacity-60" />
            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 leading-none">
              Node <span className="opacity-40">Manual</span>
            </h3>
            <p className="text-[11px] md:text-[12px] font-bold uppercase leading-relaxed tracking-[0.2em] opacity-70 mb-12 italic">
              Integrate TradingView alerts directly with Zipha infrastructure for verified broadcast packets.
            </p>
            <Button 
              onClick={() => impact("heavy")}
              className="w-full h-18 md:h-20 rounded-[1.6rem] bg-black/90 text-white font-black uppercase italic text-[11px] md:text-xs tracking-[0.4em] shadow-2xl transition-all hover:bg-black active:scale-95"
            >
              API_DOCS <ExternalLink className="ml-3 size-4" />
            </Button>
          </div>

          {/* Network Security HUD */}
          <div className="rounded-[3.5rem] border border-white/5 bg-card/30 p-10 md:p-12 backdrop-blur-3xl shadow-apex">
            <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
              <Lock className="size-4 text-primary/40" />
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 italic">
                Network_Security
              </h4>
            </div>
            <div className="space-y-8">
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500 transition-all duration-700 group-hover:scale-110 group-hover:shadow-apex-emerald">
                  <ShieldCheck className="size-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/40 italic">TLS_Node_Verified</span>
                  <span className="text-[7px] font-mono opacity-20 uppercase tracking-widest mt-1">Status: Active</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 group cursor-pointer" onClick={() => impact("medium")}>
                <div className={cn(
                  "size-12 rounded-2xl flex items-center justify-center border transition-all duration-1000 group-hover:rotate-180 group-hover:shadow-apex",
                  isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                )}>
                  <RefreshCcw className="size-6" />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-[11px] font-black uppercase tracking-[0.3em] italic transition-colors",
                    isPlatformStaff ? "text-amber-500/40 group-hover:text-amber-500" : "text-primary/40 group-hover:text-primary"
                  )}>
                    {isPlatformStaff ? "Sync_Platform_Nodes" : "Rotate_Node_Secret"}
                  </span>
                  <span className="text-[7px] font-mono opacity-20 uppercase tracking-widest mt-1 italic">Last_Sync: 24m ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER TELEMETRY: Clamped Safe Area */}
      <div 
        className="flex flex-col md:flex-row items-center justify-center gap-8 opacity-10 py-16 border-t border-white/5"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : "4rem" }}
      >
        <div className="flex items-center gap-5">
           <Activity className="size-5 animate-pulse" />
           <p className="text-[11px] font-black uppercase tracking-[0.6em] text-foreground italic text-center leading-none">
             Laminar_Protocol_Stable // Node_ID: {realMerchantId ? realMerchantId.slice(0, 10).toUpperCase() : "ROOT_MASTER"}
           </p>
        </div>
        {!isMobile && <div className="size-1 rounded-full bg-foreground" />}
        <span className="text-[9px] font-mono tabular-nums opacity-60 tracking-widest">[v16.31_Apex_Final]</span>
      </div>
    </div>
  );
}