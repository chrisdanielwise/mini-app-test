"use client";

import * as React from "react";
import { 
  Zap, Terminal, Copy, ShieldCheck, RefreshCcw, 
  ExternalLink, Globe, Lock, Cpu, Code2, 
  Building2, Activity, ArrowUpRight
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
 * 🛰️ SIGNAL_INGRESS_TERMINAL (Institutional Apex v16.31.25)
 * Strategy: RBAC-Aware Node Ingress with Restored Chroma.
 * Fix: Global node auditing for Staff + Multi-tenant isolation for Merchants.
 */
export default function BotConfigPage({ services: initialServices = [] }: any) {
  const { flavor } = useLayout();
  const { user } = useInstitutionalAuth();
  const { impact } = useHaptics();
  const { 
    isReady, isMobile, safeArea, viewportHeight 
  } = useDeviceContext();

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
    <div 
      className={cn(
        "max-w-[1600px] mx-auto transition-all duration-1000",
        "animate-in fade-in slide-in-from-bottom-12",
        viewportHeight < 700 ? "space-y-6" : "space-y-10 md:space-y-14"
      )}
      style={{ 
        paddingTop: isMobile ? `${safeArea.top}px` : "0px",
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 7rem)` : "4rem",
        paddingLeft: isMobile ? "1.25rem" : "2rem",
        paddingRight: isMobile ? "1.25rem" : "2rem"
      }}
    >
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8 relative group">
        <div className="space-y-4">
          <div className="flex items-center gap-3 italic opacity-40">
            <Globe className={cn("size-3.5", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-primary")} />
            <div className="flex flex-col">
              <span className={cn(
                "text-[9px] font-black uppercase tracking-[0.4em] leading-none",
                isPlatformStaff ? "text-amber-500" : "text-primary"
              )}>
                {isPlatformStaff ? "Global_Signal_Protocol" : "Merchant_Ingress_Hub"}
              </span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2rem,8vw,4rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Signal <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Webhooks</span>
          </h1>
          
          <div className="flex items-center gap-2 text-[8px] font-black text-muted-foreground/30 italic uppercase tracking-[0.2em]">
            <Terminal className="size-3" />
            <span>Terminal: {activeBotNode} // AES-256 Active</span>
          </div>
        </div>

        <div className="shrink-0">
          <Button
            onClick={() => impact("medium")}
            variant="outline"
            className="h-10 px-5 border-white/10 bg-white/[0.02] text-[9px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all text-foreground italic rounded-xl"
          >
            <RefreshCcw className="mr-2 size-3.5 opacity-40" /> 
            {isPlatformStaff ? "Platform Sync" : "Rotate Keys"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
        
        {/* --- LEFT: INGRESS NODES --- */}
        <div className="xl:col-span-2 space-y-6">
          {safeServices.length === 0 ? (
            <div className="rounded-[3rem] border border-dashed border-white/5 bg-black/20 p-24 text-center opacity-20">
              <Cpu className="size-12 mx-auto mb-6" />
              <p className="text-[12px] font-black uppercase italic tracking-[0.5em]">Zero_Signal_Nodes_Detected</p>
            </div>
          ) : (
            safeServices.map((service: any) => (
              <div
                key={service.id}
                className={cn(
                  "group relative overflow-hidden rounded-[2.8rem] md:rounded-[3rem] border backdrop-blur-3xl shadow-2xl transition-all duration-700",
                  isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10 hover:border-amber-500/30" : "bg-card/30 border-white/5 hover:border-primary/30"
                )}
              >
                <div className="p-8 md:p-12 space-y-10">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary/60 italic leading-none">
                          NODE: {service.id.slice(0, 8)} // Cluster: {service.categoryTag || "GENERAL"}
                        </p>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none text-foreground group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      {isPlatformStaff && (
                        <div className="flex items-center gap-2 mt-3 opacity-30 italic">
                           <Building2 className="size-3.5" />
                           <span className="text-[10px] font-bold uppercase tracking-widest">{service.merchant?.companyName}</span>
                        </div>
                      )}
                    </div>
                    <Badge className="rounded-xl bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 shadow-sm">
                      ACTIVE_READY
                    </Badge>
                  </div>

                  {/* Production Gateway */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
                        Production Gateway
                      </Label>
                      <span className="text-[8px] font-mono font-bold text-muted-foreground/20 uppercase">Method: POST</span>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 bg-black/60 border border-white/5 rounded-2xl px-6 h-14 flex items-center font-mono text-[10px] tracking-tight text-emerald-500/80 shadow-inner truncate italic">
                        https://api.zipha.finance/v1/webhooks/signals/{service.id}
                      </div>
                      <Button
                        onClick={() => copyToClipboard(`https://api.zipha.finance/v1/webhooks/signals/${service.id}`)}
                        variant="ghost"
                        size="icon"
                        className="rounded-2xl border border-white/5 bg-white/[0.02] h-14 w-14 shrink-0 hover:bg-primary hover:text-white transition-all shadow-lg"
                      >
                        <Copy className="size-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Schema Manifest */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <Code2 className="size-4 text-primary/40" />
                      <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
                        Transmission Schema
                      </Label>
                    </div>
                    <pre className="relative group/code bg-zinc-950 p-8 rounded-[1.8rem] border border-white/5 font-mono text-[11px] overflow-x-auto leading-relaxed text-zinc-400 shadow-2xl">
                      <div className="absolute top-4 right-6 text-[8px] font-bold text-zinc-700 uppercase tracking-widest">application/json</div>
                      <code>{`{
  "secret": "${isPlatformStaff ? "REDACTED_STAFF_NODE" : "YOUR_NODE_TOKEN"}",
  "action": "SIGNAL_BROADCAST",
  "message": "🚀 BUY BTC/USD \\nEntry: 45000",
  "parse_mode": "HTML"
}`}</code>
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
            "rounded-[3rem] p-8 md:p-10 text-primary-foreground shadow-2xl relative overflow-hidden group transition-all duration-700",
            isPlatformStaff ? "bg-amber-500" : "bg-primary"
          )}>
            <Zap className="absolute -bottom-6 -right-6 size-32 opacity-10 -rotate-12 transition-transform group-hover:scale-110" />
            <Terminal className="size-8 mb-6 opacity-80" />
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-3 leading-none">
              Node <span className="text-zinc-900/40">Manual</span>
            </h3>
            <p className="text-[10px] font-bold uppercase leading-relaxed tracking-[0.1em] opacity-80 mb-10 italic">
              Integrate your TradingView alerts directly with the Zipha liquidity pool nodes for instant broadcast.
            </p>
            <Button className="w-full rounded-2xl bg-zinc-950 text-white font-black uppercase italic text-[10px] tracking-[0.3em] h-14 shadow-2xl transition-all hover:bg-zinc-900 active:scale-95">
              API_EXPLORER <ExternalLink className="ml-3 size-4" />
            </Button>
          </div>

          {/* Network Security Node */}
          <div className="rounded-[2.8rem] border border-white/5 bg-black/40 p-8 backdrop-blur-3xl shadow-xl space-y-8">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 opacity-30">
              <Lock className="size-3.5" />
              <h4 className="text-[9px] font-black uppercase tracking-[0.4em]">Network_Security</h4>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500 shadow-inner transition-transform group-hover:scale-105">
                  <ShieldCheck className="size-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 italic">TLS Node Verified</span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => impact("medium")}>
                <div className={cn(
                    "size-10 rounded-xl flex items-center justify-center border shadow-inner transition-all duration-700 group-hover:rotate-180",
                    isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                )}>
                  <RefreshCcw className="size-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 group-hover:text-foreground transition-colors italic">
                  {isPlatformStaff ? "Sync Platform Nodes" : "Rotate Node Secret"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER SIGNAL */}
      <div className="flex items-center justify-center gap-5 opacity-10 py-12 border-t border-white/5">
        <Activity className={cn("size-3.5", isPlatformStaff ? "text-amber-500" : "text-primary")} />
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-foreground italic">
          Handshake Sync: Stable // Node: {realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"}
        </p>
      </div>
    </div>
  );
}