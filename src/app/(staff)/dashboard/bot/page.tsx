import { requireStaff } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Terminal,
  Copy,
  ShieldCheck,
  RefreshCcw,
  ExternalLink,
  Globe,
  Lock,
  Cpu,
  Code2,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

/**
 * 🛰️ SIGNAL INGRESS CONTROL (Institutional v9.3.9)
 * Fix: Dynamic Protocol Filter prevents UUID validation errors for platform staff.
 * Fix: Multi-tenant Endpoint Visibility allows Super Admins to audit global nodes.
 */
export default async function BotConfigPage() {
  const session = await requireStaff();

  // 🛡️ IDENTITY PROTOCOLS
  const { role } = session.user;
  const realMerchantId = session.merchantId;
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);
  
  // ✅ SAFE DATA NORMALIZATION
  // Merchant config comes from the session config object for UI consistency
  const activeBotNode = session.config?.botUsername || (isPlatformStaff ? "SYSTEM_ROOT_MASTER" : "NODE_OFFLINE");

  // 🏁 DATA INGRESS: Dynamic RBAC Filtering
  // If Super Admin, realMerchantId is null -> whereClause becomes {} (fetch all)
  const whereClause = realMerchantId ? { merchantId: realMerchantId } : {};

  const services = await prisma.service.findMany({
    where: whereClause,
    select: { 
      id: true, 
      name: true, 
      categoryTag: true,
      merchant: { select: { companyName: true } } // Audit visibility for staff
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 px-4 md:px-8 text-foreground">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2">
            <Globe className={cn(
              "h-4 w-4 shrink-0 animate-pulse", 
              isPlatformStaff ? "text-amber-500" : "text-primary"
            )} />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-80">
              {isPlatformStaff ? "Global_Signal_Core" : "Merchant_Ingress_Hub"}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none">
              Signal <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Webhooks</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-40 italic">
              Terminal: {activeBotNode} // AES-256 Enabled
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <Button
            variant="outline"
            className="h-10 md:h-11 px-6 rounded-xl border-border/40 bg-muted/10 font-bold uppercase text-[9px] tracking-widest hover:bg-primary/5 transition-all text-foreground"
          >
            <RefreshCcw className="mr-2 h-3.5 w-3.5 opacity-40" /> {isPlatformStaff ? "Platform Sync" : "Rotate Keys"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
        
        {/* --- LEFT: INGRESS NODES --- */}
        <div className="xl:col-span-2 space-y-6">
          {services.length === 0 ? (
            <div className="rounded-[2.5rem] border border-dashed border-border/10 bg-card/20 p-20 text-center opacity-40">
              <Cpu className="h-10 w-10 mx-auto mb-4" />
              <p className="text-sm font-black uppercase italic tracking-tight leading-none">
                No active signal nodes detected.
              </p>
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className={cn(
                  "group relative overflow-hidden rounded-[2.5rem] border border-border/10 bg-card/40 backdrop-blur-3xl shadow-xl transition-all",
                  isPlatformStaff ? "hover:border-amber-500/20" : "hover:border-primary/20"
                )}
              >
                <div className="p-6 md:p-10 space-y-8">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary/60 italic leading-none">
                          NODE: {service.id.slice(0, 8)} // Cluster: {service.categoryTag || "GENERAL"}
                        </p>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      {isPlatformStaff && (
                        <div className="flex items-center gap-1.5 mt-2 opacity-40">
                           <Building2 className="h-3 w-3" />
                           <span className="text-[9px] font-bold uppercase tracking-widest italic">{service.merchant.companyName}</span>
                        </div>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-lg bg-emerald-500/5 text-emerald-500 border-emerald-500/10 text-[8px] font-black uppercase tracking-widest px-2.5 py-1"
                    >
                      ACTIVE_READY
                    </Badge>
                  </div>

                  {/* Endpoint Protocol */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                        Production Gateway
                      </Label>
                      <span className="text-[8px] font-mono font-bold text-muted-foreground/30 uppercase">
                        Method: POST
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-zinc-950/40 border border-border/40 rounded-xl px-5 h-11 flex items-center font-mono text-[10px] tracking-tight text-emerald-500 shadow-inner truncate italic">
                        https://api.zipha.finance/v1/webhooks/signals/{service.id}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl border border-border/40 bg-card h-11 w-11 shrink-0 hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Schema Manifest */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                      <Code2 className="h-3.5 w-3.5 text-primary/60" />
                      <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 leading-none">
                        JSON Transmission Schema
                      </Label>
                    </div>
                    <pre className="relative group/code bg-zinc-950/90 p-6 rounded-xl border border-border/10 font-mono text-[10px] overflow-x-auto leading-relaxed text-zinc-400 shadow-2xl">
                      <div className="absolute top-3 right-4 text-[8px] font-bold text-zinc-700 uppercase">
                        application/json
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

        {/* --- RIGHT: SECURITY HUD --- */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-primary p-6 md:p-8 text-primary-foreground shadow-xl relative overflow-hidden group">
            <Zap className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10 -rotate-12 transition-transform group-hover:scale-110" />
            <Terminal className="h-8 w-8 mb-4 opacity-80" />
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2 leading-none">
              Node <span className="text-zinc-900/40">Manual</span>
            </h3>
            <p className="text-[10px] font-bold uppercase leading-relaxed tracking-widest opacity-80 mb-8 italic">
              Integrate your TradingView alerts directly with the Zipha liquidity pool nodes for instant broadcast.
            </p>
            <Button className="w-full rounded-xl bg-zinc-950 text-white font-black uppercase italic text-[10px] tracking-widest h-12 shadow-lg transition-all hover:bg-zinc-900">
              API Docs <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="rounded-3xl border border-border/10 bg-card/40 p-6 backdrop-blur-3xl shadow-md">
            <div className="flex items-center gap-2 mb-6 border-b border-border/10 pb-3">
              <Lock className="h-3.5 w-3.5 text-primary/60" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
                Network Security
              </h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/60">
                  TLS Node Verified
                </span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500 group-hover:rotate-180 transition-transform duration-700">
                  <RefreshCcw className="h-3.5 w-3.5" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/60 group-hover:text-amber-500 transition-colors">
                  {isPlatformStaff ? "Sync Platform Nodes" : "Rotate Node Secret"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 opacity-20 py-6">
        <Terminal className="h-3 w-3" />
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
          Handshake Sync: Stable // Node_ID: {realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "PLATFORM_ROOT"}
        </p>
      </div>
    </div>
  );
}