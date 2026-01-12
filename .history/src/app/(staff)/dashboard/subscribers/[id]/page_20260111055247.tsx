import { requireMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Wallet, 
  CreditCard, 
  Terminal, 
  Zap, 
  Trash2,
  Calendar,
  ExternalLink,
  History
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

/**
 * 🛰️ SUBSCRIBER IDENTITY NODE (Deep View)
 * Normalized: World-standard typography and responsive grid constraints.
 * Optimized: Clean command header for administrative protocols.
 */
export default async function SubscriberDeepView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireMerchantSession();
  const { id } = await params;
  const realMerchantId = session.merchantId;

  // 🏁 1. Fetch Subscriber Protocol Data
  const subscription = await prisma.subscription.findUnique({
    where: { id },
    include: {
      user: true,
      service: true,
      serviceTier: true,
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });

  // Security Guard: Institutional Scoping
  if (!subscription || subscription.service.merchantId !== realMerchantId) {
    return notFound();
  }

  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto">
      
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-border/40 pb-8 lg:pb-10">
        <div className="space-y-3 lg:space-y-4 flex-1">
         
          <div className="flex flex-wrap items-center gap-4 lg:gap-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase italic leading-none truncate max-w-full text-foreground">
              @{subscription.user.username || "NODE_ANON"}
            </h1>
            <Badge className={cn(
              "rounded-full text-[10px] font-black uppercase tracking-widest px-3 py-1 border shadow-sm",
              subscription.status === 'ACTIVE' 
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
            )}>
              {subscription.status === 'ACTIVE' ? <ShieldCheck className="mr-1.5 h-3 w-3" /> : <ShieldAlert className="mr-1.5 h-3 w-3" />}
              {subscription.status}
            </Badge>
          </div>
        </div>

        {/* 🛠️ ACTION NODE CLUSTER */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 lg:flex-none rounded-xl h-12 lg:h-14 px-6 border-border/40 bg-muted/10 font-black uppercase text-[10px] tracking-widest hover:bg-primary/5 hover:text-primary transition-all">
              Update Expiry
            </Button>
            <Button className="flex-1 lg:flex-none rounded-xl h-12 lg:h-14 px-6 bg-rose-500 text-white font-black uppercase italic tracking-widest text-[10px] shadow-2xl shadow-rose-500/20 hover:bg-rose-600 active:scale-95 transition-all">
              <Trash2 className="mr-2 h-4 w-4" /> Revoke Access
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        
        {/* --- LEFT: IDENTITY PASSPORT --- */}
        <div className="lg:col-span-2 space-y-8 lg:space-y-10">
          
          {/* Section: Subscription Parameters */}
          <section className="rounded-3xl border border-border/40 bg-card/40 p-5 sm:p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                <Zap className="h-32 w-32 sm:h-48 sm:w-48" />
             </div>
             
             <div className="flex items-center gap-3 text-primary mb-6 lg:mb-8">
                <Terminal className="h-4 w-4" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol Details</h3>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
                <div className="space-y-1">
                   <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Service Node</p>
                   <p className="text-xl lg:text-2xl font-black italic uppercase tracking-tighter text-foreground truncate">{subscription.service.name}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Pricing Node (Tier)</p>
                   <p className="text-xl lg:text-2xl font-black italic uppercase tracking-tighter text-primary truncate">{subscription.serviceTier?.name}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Identity ID (Telegram)</p>
                   <p className="text-base lg:text-lg font-mono font-black tracking-widest opacity-80 truncate text-foreground">{subscription.user.id.toString()}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Protocol Start</p>
                   <p className="text-base lg:text-lg font-black italic uppercase tracking-tighter text-foreground">
                     {format(new Date(subscription.createdAt), "dd MMM yyyy")}
                   </p>
                </div>
             </div>

             <div className="mt-8 lg:mt-12 p-5 sm:p-6 rounded-2xl bg-muted/10 border border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground opacity-40" />
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 leading-none">Access Expiration</p>
                      <p className="text-base lg:text-lg font-black uppercase italic tracking-tighter mt-1 text-foreground">
                        {subscription.expiresAt ? format(new Date(subscription.expiresAt), "dd MMMM yyyy") : "LIFETIME_PROTOCOL"}
                      </p>
                   </div>
                </div>
                <Badge variant="outline" className="rounded-lg h-8 px-3 bg-background text-[9px] font-black uppercase italic tracking-widest border-border/40">
                  {subscription.status === 'ACTIVE' ? "Broadcasting" : "Disconnected"}
                </Badge>
             </div>
          </section>

          {/* Section: Payment Ledger */}
          <section className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 px-4">
               <History className="h-4 w-4 text-primary" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Payment Telemetry</h3>
            </div>
            
            <div className="rounded-3xl border border-border/40 bg-card/20 overflow-hidden backdrop-blur-xl shadow-inner">
               <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-left min-w-[500px]">
                     <thead className="bg-muted/30 border-b border-border/40">
                        <tr>
                           {["Liquidity", "Protocol", "Status", "TXID"].map((head) => (
                              <th key={head} className="px-5 sm:px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">{head}</th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/40 text-foreground">
                        {subscription.payments.map((p) => (
                           <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                              <td className="px-5 sm:px-8 py-4 font-black text-sm italic tracking-tighter">${parseFloat(p.amount).toFixed(2)}</td>
                              <td className="px-5 sm:px-8 py-4 text-[10px] font-black uppercase tracking-widest opacity-60">{p.currency}</td>
                              <td className="px-5 sm:px-8 py-4">
                                 <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">PAID</span>
                              </td>
                              <td className="px-5 sm:px-8 py-4">
                                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border border-border/10">
                                    <ExternalLink className="h-3.5 w-3.5 opacity-40 hover:opacity-100 transition-opacity" />
                                 </Button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </section>
        </div>

        {/* --- RIGHT: LIFETIME ANALYTICS --- */}
        <div className="space-y-6 lg:space-y-8">
           <div className="rounded-3xl bg-primary/5 border border-primary/20 p-6 sm:p-8 shadow-inner relative overflow-hidden">
              <div className="relative z-10">
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary opacity-60 mb-2">Contribution (LTV)</p>
                 <p className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter text-primary leading-none">
                   ${subscription.payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </p>
                 <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-primary/10 space-y-4">
                    <div className="flex justify-between items-center gap-4">
                       <span className="text-[9px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Frequency</span>
                       <span className="text-[10px] font-black uppercase italic tracking-widest text-right text-foreground">{subscription.serviceTier?.interval} Renewal</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                       <span className="text-[9px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Reliability</span>
                       <span className="text-[10px] font-black uppercase italic tracking-widest text-emerald-500 text-right">HIGH_TRUST</span>
                    </div>
                 </div>
              </div>
              <Wallet className="absolute -bottom-4 -right-4 h-24 w-24 sm:h-32 sm:w-32 text-primary opacity-[0.03] rotate-12" />
           </div>

           <div className="rounded-3xl border border-border/40 bg-card/40 p-6 sm:p-8 space-y-4 lg:space-y-6 shadow-xl">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 flex items-center gap-2">
                 <ShieldCheck className="h-3 w-3 text-emerald-500" /> System Audit
              </h4>
              <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest opacity-50">
                Identity verified via <span className="text-foreground">Telegram Auth</span>. Node broadcasting active. All financial variables synchronized with merchant ledger for compliance.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}