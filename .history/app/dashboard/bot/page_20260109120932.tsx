import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Terminal, 
  Copy, 
  ShieldCheck, 
  RefreshCcw,
  ExternalLink 
} from "lucide-react";

/**
 * 🛰️ BOT WEBHOOK CONFIGURATION
 * Connect external signal sources to Zipha deployment nodes.
 */
export default async function BotConfigPage() {
  const session = await requireMerchantSession();

  // Fetch services that have a VIP Channel linked
  const services = await prisma.service.findMany({
    where: { merchantId: session.merchant.id },
    select: { id: true, name: true, categoryTag: true }
  });

  return (
    <div className="space-y-8 p-6 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Signal Webhooks</h1>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Node: {session.merchant.botUsername} • Encryption Active
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: CONFIGURATION LIST --- */}
        <div className="lg:col-span-2 space-y-6">
          {services.length === 0 ? (
            <div className="rounded-[2.5rem] border border-dashed border-border p-12 text-center">
              <p className="text-xs font-black uppercase italic text-muted-foreground">
                No services found. Create a service first to enable webhooks.
              </p>
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="rounded-[2.5rem] border border-border bg-card overflow-hidden">
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                        Service Node: {service.categoryTag}
                      </p>
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">{service.name}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase border border-emerald-500/20">
                      Active Webhook
                    </span>
                  </div>

                  {/* The Dynamic URL */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase opacity-50 ml-1">Your Unique Webhook URL</p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-3 font-mono text-[10px] truncate">
                        https://api.zipha.finance/v1/webhooks/signals/{service.id}
                      </div>
                      <Button variant="outline" className="rounded-xl border-muted h-12 w-12 shrink-0">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* JSON Payload Template */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase opacity-50 ml-1">JSON Payload Template (POST)</p>
                    <pre className="bg-zinc-950 text-emerald-400 p-6 rounded-2xl font-mono text-[10px] overflow-x-auto leading-relaxed">
{`{
  "secret": "ZIPHA_SECURE_TOKEN",
  "action": "SIGNAL",
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

        {/* --- RIGHT: DOCS & SECURITY --- */}
        <div className="space-y-6">
          <div className="rounded-[2.5rem] bg-primary p-8 text-primary-foreground shadow-2xl shadow-primary/20">
            <Terminal className="h-8 w-8 mb-4" />
            <h3 className="text-lg font-black uppercase italic tracking-tighter mb-2">Developer Docs</h3>
            <p className="text-[10px] font-bold uppercase leading-relaxed opacity-80 mb-6">
              Connect TradingView alerts by pasting your webhook URL into the "Webhook URL" field in the Alert settings.
            </p>
            <Button className="w-full rounded-2xl bg-white text-primary font-black uppercase text-[10px] tracking-widest h-12">
              Read API Specs <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </div>

          <div className="rounded-[2.5rem] border border-border bg-card p-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Security Protocol</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase">IP Whitelisting Enabled</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCcw className="h-4 w-4 text-orange-500" />
                <span className="text-[10px] font-bold uppercase">Rotate Secret Token</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}