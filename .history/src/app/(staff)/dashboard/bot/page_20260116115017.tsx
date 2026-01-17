"use client";

import * as React from "react";
import { 
  Zap, Terminal, Copy, ShieldCheck, RefreshCcw, 
  ExternalLink, Globe, Lock, Code2, 
  Building2, Activity 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

/**
 * 🛰️ SIGNAL_INGRESS_TERMINAL (Institutional Apex v2026.1.25)
 * Strategy: Stationary HUD & Independent Tactical Scroll.
 * Fix: High-density geometry prevents header cropping and blowout.
 */
export default function BotConfigPage({ services: initialServices = [] }: any) {
  const { flavor } = useLayout();
  const { user } = useInstitutionalAuth();
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  // 🛡️ IDENTITY & CHROMA RESOLUTION
  const isPlatformStaff = flavor === "AMBER";
  const realMerchantId = user?.merchantId;
  const activeBotNode = user?.config?.botUsername || (isPlatformStaff ? "SYSTEM_ROOT_MASTER" : "NODE_OFFLINE");

  // 🛡️ CRASH SHIELD: Verify data is an array before processing
  const safeServices = React.useMemo(() => 
    Array.isArray(initialServices) ? initialServices : [], 
    [initialServices]
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    impact("light");
    toast.success("TELEMETRY_COPIED", {
        description: "Node endpoint secured to clipboard."
    });
  };

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden text-foreground bg-black">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Header --- */}
      <div 
        className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2"
        style={{ paddingTop: isMobile ? `calc(${safeArea.top}px + 0.5rem)` : "0.5rem" }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-6">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2.5 italic opacity-30">
              <Globe className={cn("size-3", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-primary")} />
              <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.4em] leading-none",
                isPlatformStaff ? "text-amber-500" : "text-primary"
              )}>
                {isPlatformStaff ? "Global_Signal_Protocol" : "Merchant_Ingress_Hub"}
              </span>
            </div>
            
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none truncate">
              Signal <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Webhooks</span>
            </h1>
            
            <div className="flex items-center gap-2 text-[7px] font-black text-muted-foreground/20 italic uppercase tracking-[0.2em]">
              <Terminal className="size-2.5" />
              <span className="truncate">Terminal: {activeBotNode} // AES-256 Active</span>
            </div>
          </div>

          <div className="shrink-0 scale-90 origin-bottom-right">
            <Button
              onClick={() => impact("medium")}
              variant="outline"
              className="h-9 px-4 border-white/10 bg-white/[0.02] text-[8px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all text-foreground italic rounded-xl"
            >
              <RefreshCcw className="mr-2 size-3 opacity-40" /> 
              {isPlatformStaff ? "Platform Sync" : "Rotate Keys"}
            </Button>
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Only the nodes move --- */}
      <div className="flex-1 min-h-0 w-full relative overflow-y-auto custom-scrollbar px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* --- LEFT: INGRESS NODES --- */}
          <div className="xl:col-span-2 space-y-4">
            {safeServices.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-white/5 bg-black/20 p-16 text-center opacity-20">
                <p className="text-[10px] font-black uppercase italic tracking-[0.5em]">Zero_Signal_Nodes_Detected</p>
              </div>
            ) : (
              safeServices.map((service: any) => (
                <div
                  key={service.id}
                  className={cn(
                    "group relative overflow-hidden rounded-[1.5rem] border backdrop-blur-3xl shadow-2xl transition-all duration-700",
                    isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/30 border-white/5"
                  )}
                >
                  <div className="p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                          <p className="text-[8px] font-black uppercase tracking-widest text-primary/40 italic leading-none">
                            NODE: {service.id.slice(0, 8)} // Cluster: {service.categoryTag || "GENERAL"}
                          </p>
                        </div>
                        <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none text-foreground group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                        {isPlatformStaff && (
                          <div className="flex items-center gap-2 mt-2 opacity-20 italic">
                             <Building2 className="size-3" />
                             <span className="text-[9px] font-bold uppercase tracking-widest">{service.merchant?.companyName}</span>
                          </div>
                        )}
                      </div>
                      <Badge className="rounded-lg bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[7px] font-black uppercase px-2 py-1 shadow-sm">
                        ACTIVE
                      </Badge>
                    </div>

                    {/* Gateway Address */}
                    <div className="space-y-2">
                      <Label className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">Gateway_Endpoint</Label>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-black/60 border border-white/5 rounded-xl px-4 h-11 flex items-center font-mono text-[9px] text-emerald-500/70 truncate italic shadow-inner">
                          https://api.zipha.finance/v1/webhooks/signals/{service.id}
                        </div>
                        <Button
                          onClick={() => copyToClipboard(`https://api.zipha.finance/v1/webhooks/signals/${service.id}`)}
                          variant="ghost" size="icon" className="rounded-xl border border-white/5 bg-white/[0.02] h-11 w-11 shrink-0 hover:bg-primary"
                        >
                          <Copy className="size-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Transmission Manifest */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 opacity-30">
                        <Code2 className="size-3" />
                        <Label className="text-[7px] font-black uppercase tracking-[0.3em] italic">Manifest</Label>
                      </div>
                      <pre className="relative group/code bg-zinc-950 p-5 rounded-xl border border-white/5 font-mono text-[9px] overflow-x-auto leading-relaxed text-zinc-500 shadow-2xl">
                        <code>{`{ "secret": "${isPlatformStaff ? "REDACTED" : "YOUR_TOKEN"}", "action": "SIGNAL_BROADCAST" }`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* --- RIGHT: SECURITY HUD --- */}
          <div className="space-y-6">
            <div className={cn(
              "rounded-[2rem] p-6 text-primary-foreground shadow-2xl relative overflow-hidden group transition-all duration-700",
              isPlatformStaff ? "bg-amber-500" : "bg-primary"
            )}>
              <Zap className="absolute -bottom-4 -right-4 size-24 opacity-10 -rotate-12 transition-transform group-hover:scale-110" />
              <Terminal className="size-6 mb-4 opacity-80" />
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2 leading-none">
                Node <span className="text-zinc-900/40">Manual</span>
              </h3>
              <p className="text-[8px] font-bold uppercase leading-relaxed tracking-[0.1em] opacity-80 mb-6 italic">
                Integrate alerts directly with Zipha liquidity pool nodes.
              </p>
              <Button className="w-full rounded-xl bg-zinc-950 text-white font-black uppercase italic text-[9px] tracking-[0.2em] h-12 shadow-2xl">
                API_EXPLORER <ExternalLink className="ml-2 size-3.5" />
              </Button>
            </div>

            <div className="rounded-[1.8rem] border border-white/5 bg-black/40 p-6 backdrop-blur-3xl shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-3 opacity-20">
                <Lock className="size-3" />
                <h4 className="text-[7px] font-black uppercase tracking-[0.3em]">Network_Security</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <ShieldCheck className="size-4 text-emerald-500/60" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-foreground/30 italic">TLS Node Verified</span>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => impact("medium")}>
                  <RefreshCcw className="size-4 text-primary transition-transform duration-700 group-hover:rotate-180" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-foreground/30 group-hover:text-foreground transition-colors italic">
                    Rotate Secret
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER SIGNAL */}
        <div className="flex items-center justify-center gap-4 opacity-10 pt-8 pb-12">
          <Activity className={cn("size-3.5", isPlatformStaff ? "text-amber-500" : "text-primary")} />
          <p className="text-[7px] font-black uppercase tracking-[0.5em] text-foreground italic">
            Handshake Sync: Stable // Node: {realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"}
          </p>
        </div>
      </div>
    </div>
  );
}