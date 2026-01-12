import { requireMerchantSession } from "@/lib/auth/merchant-auth";
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
  Code2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * 🛰️ SIGNAL INGRESS CONTROL (Tier 2)
 * High-resiliency webhook configuration for external signal synchronization.
 */
export default async function BotConfigPage() {
  const session = await requireMerchantSession();

  // Fetch services cluster that have a valid identity link
  const services = await prisma.service.findMany({
    where: { merchantId: session.merchant.id },
    select: { id: true, name: true, categoryTag: true }
  });

  return (
    <div className="space-y-12 p-8 sm:p-12 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000 max-w-7xl mx-auto">
      
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 border-b border-border/40 pb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-primary mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="h-4 w-4 fill-primary animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Ingress Protocol Hub
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Signal <span className="text-primary">Webhooks</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40">
            Active Node: {session.merchant.botUsername || "SYSTEM_DEFAULT"} // Encryption Level: AES-256
          </p>
        </div>

        <div className="flex gap-4">
           <Button variant="outline" className="h-14 px-8 rounded-2xl border-border/40 bg-muted/10 font-black uppercase text-[10px] tracking-widest">
             <RefreshCcw className="mr-2 h-4 w-4" /> Global Rotation
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        
        {/* --- LEFT: INGRESS NODES --- */}
        <div className="xl:col-span-2 space-y-10">
          {services.length === 0 ? (
            <div className="rounded-[3rem] border border-dashed border-border/40 bg-card/20 p-24 text-center">
              <Cpu className="h-12 w-12 text-muted-foreground/20 mx-auto mb-6" />
              <p className="text-sm font-black uppercase italic text-muted-foreground tracking-tighter">
                No active signal nodes detected. 
              </p>
              <p className="text-[10px] font-black uppercase text-muted-foreground/40 mt-3 tracking-widest">
                Deploy a service identity to initialize webhook ingress.
              </p>
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="group relative overflow-hidden rounded-[3.5rem] border border-border/40 bg-card/40 backdrop-blur-3xl shadow-2xl transition-all hover:border-primary/20">
                <div className="p-10 md:p-14 space-y-10">
                  
                  {/* Node Identity */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
                            Cluster: {service.categoryTag || "GENERAL_SIGNAL"}
                         </p>
                      </div>
                      <h3 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">{service.name}</h3>
                    </div>
                    <Badge variant="outline" className="rounded-lg bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest px-4 py-2">
                      INGRESS_ENABLED
                    </Badge>
                  </div>

                  {/* Endpoint Protocol */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Production Webhook Target</Label>
                       <span className="text-[8px] font-mono text-muted-foreground/30">POST_METHOD_ONLY</span>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 bg-zinc-950/50 border border-border/40 rounded-2xl px-6 py-5 font-mono text-xs tracking-tighter text-emerald-500 shadow-inner truncate">
                        https://api.zipha.finance/v1/webhooks/signals/{service.id}
                      </div>
                      <Button variant="ghost" className="rounded-2xl border border-border/40 bg-card h-16 w-16 shrink-0 hover:bg-primary hover:text-white transition-all">
                        <Copy className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Schema Manifest */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-2 px-1">
                       <Code2 className="h-3 w-3 text-primary" />
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">JSON Schema Manifest (POST)</Label>
                    </div>
                    <pre className="relative group/code bg-zinc-950 p-8 rounded-[2rem] border border-border/40 font-mono text-[11px] overflow-x-auto leading-relaxed text-zinc-400 shadow-2xl">
                       <div className="absolute top-4 right-4 text-[8px] font-black text-zinc-700 tracking-widest">application/json</div>
{`{
  "secret": "YOUR_SECURE_NODE_TOKEN",
  "action": "SIGNAL_BROADCAST",
  "message": "🚀 BUY BTC/USD \\nEntry: 45000 \\nTP: 48000 \\nSL: 44000",
  "parse_mode": "HTML"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- RIGHT: DOCS & SECURITY CLUSTER --- */}
        <div className="space-y-10">
          {/* Documentation Node */}
          <div className="rounded-[3rem] bg-primary p-10 text-primary-foreground shadow-2xl shadow-primary/30 relative overflow-hidden group">
            <Zap className="absolute -bottom-6 -right-6 h-32 w-32 opacity-10 -rotate-12 transition-transform group-hover:scale-110" />
            <Terminal className="h-10 w-10 mb-6 opacity-80" />
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Tactical <span className="text-zinc-900/50">Docs</span></h3>
            <p className="text-[11px] font-black uppercase leading-relaxed tracking-widest opacity-80 mb-10">
              Integrate TradingView alerts instantly by mapping your strategy to the JSON Manifest above. Paste the endpoint into the "Webhook URL" field.
            </p>
            <Button className="w-full rounded-2xl bg-zinc-950 text-white font-black uppercase italic text-[11px] tracking-[0.2em] h-16 shadow-2xl transition-all hover:bg-zinc-900">
              Open API Specs <ExternalLink className="ml-3 h-4 w-4" />
            </Button>
          </div>

          {/* Security Node */}
          <div className="rounded-[3rem] border border-border/40 bg-card/40 p-10 backdrop-blur-2xl shadow-xl">
            <div className="flex items-center gap-3 mb-8 border-b border-border/20 pb-4">
               <Lock className="h-4 w-4 text-primary" />
               <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">Security HUD</h4>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500 shadow-inner">
                   <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">WAF Whitelisting Active</span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500 shadow-inner group-hover:rotate-180 transition-transform duration-700">
                   <RefreshCcw className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70 group-hover:text-amber-500 transition-colors">Rotate Node Secrets</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}