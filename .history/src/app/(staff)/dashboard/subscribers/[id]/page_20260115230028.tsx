import { requireStaff } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert, 
  Wallet, 
  Terminal, 
  Zap, 
  Trash2,
  Calendar,
  ExternalLink,
  History,
  Globe
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

/**
 * 🛰️ SUBSCRIBER IDENTITY NODE (Tactical Medium)
 * Normalized: World-standard typography and medium-density grid.
 * Optimized: Resilient command header for administrative protocols.
 */
export default async function SubscriberDeepView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireStaff();
  const { id } = await params;
  const realMerchantId = session.merchantId;

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

  if (!subscription || subscription.service.merchantId !== realMerchantId) {
    return notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 px-4">
      
      {/* --- COMMAND HEADER: TACTICAL SCALE --- */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between border-b border-border/40 pb-6">
        <div className="space-y-2 flex-1 min-w-0">
          <Link
            href="/dashboard/subscribers"
            className="group inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Node Ledger
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase italic text-foreground truncate break-all">
              @{subscription.user.username || "NODE_ANON"}
            </h1>
            <Badge className={cn(
              "rounded-lg text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border shadow-sm",
              subscription.status === 'ACTIVE' 
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
            )}>
              {subscription.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
          <Button variant="outline" className="flex-1 lg:flex-none rounded-xl h-11 px-4 border-border/40 bg-muted/10 font-bold uppercase text-[9px] tracking-wider">
            Update Expiry
          </Button>
          <Button className="flex-1 lg:flex-none rounded-xl h-11 px-4 bg-rose-500 text-white font-bold uppercase italic tracking-wider text-[9px] shadow-lg shadow-rose-500/20">
            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Revoke
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* --- LEFT: IDENTITY PASSPORT --- */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          {/* Section: Subscription Parameters */}
          <section className="rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8 backdrop-blur-xl shadow-xl relative overflow-hidden">
             <Zap className="absolute -top-4 -right-4 h-24 w-24 opacity-[0.03] pointer-events-none -rotate-12" />
             
             <div className="flex items-center gap-2 text-primary/60 mb-6">
                <Terminal className="h-3.5 w-3.5" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Node Parameters</h3>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                <div className="space-y-0.5">
                   <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Service</p>
                   <p className="text-lg font-black italic uppercase tracking-tight text-foreground truncate">{subscription.service.name}</p>
                </div>
                <div className="space-y-0.5">
                   <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Tier</p>
                   <p className="text-lg font-black italic uppercase tracking-tight text-primary truncate">{subscription.serviceTier?.name}</p>
                </div>
                <div className="space-y-0.5">
                   <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">ID</p>
                   <p className="text-sm font-mono font-bold opacity-60 truncate">{subscription.user.id.toString()}</p>
                </div>
                <div className="space-y-0.5">
                   <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Start Date</p>
                   <p className="text-sm font-bold uppercase italic tracking-tight">
                     {format(new Date(subscription.createdAt), "dd MMM yyyy")}
                   </p>
                </div>
             </div>

             <div className="mt-8 p-4 rounded-xl bg-muted/10 border border-border/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   <Calendar className="h-4 w-4 text-muted-foreground opacity-40" />
                   <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Expiration Horizon</p>
                      <p className="text-sm font-black uppercase italic tracking-tight">
                        {subscription.expiresAt ? format(new Date(subscription.expiresAt), "dd MMMM yyyy") : "LIFETIME_PROTO"}
                      </p>
                   </div>
                </div>
                <Badge variant="outline" className="rounded-lg h-6 px-2 bg-background text-[8px] font-black uppercase italic tracking-widest">
                  {subscription.status === 'ACTIVE' ? "Broadcasting" : "Disconnected"}
                </Badge>
             </div>
          </section>

          {/* Section: Payment Ledger */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
               <History className="h-3.5 w-3.5 text-primary/60" />
               <h3 className="text-[10px] font-black uppercase tracking-widest">Payment Telemetry</h3>
            </div>
            
            <div className="rounded-2xl border border-border/40 bg-card/20 overflow-hidden backdrop-blur-xl shadow-sm">
               <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-left min-w-[450px]">
                     <thead className="bg-muted/30 border-b border-border/40">
                        <tr>
                           {["Liquidity", "Protocol", "Status", "TXID"].map((head) => (
                              <th key={head} className="px-6 py-3 text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{head}</th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/40 text-foreground">
                        {subscription.payments.map((p) => (
                           <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                              <td className="px-6 py-3.5 font-black text-xs italic tracking-tight">${parseFloat(p.amount).toFixed(2)}</td>
                              <td className="px-6 py-3.5 text-[9px] font-bold uppercase opacity-60">{p.currency}</td>
                              <td className="px-6 py-3.5">
                                 <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">PAID</span>
                              </td>
                              <td className="px-6 py-3.5">
                                 <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg border border-border/10">
                                    <ExternalLink className="h-3 w-3 opacity-30" />
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

        {/* --- RIGHT: ANALYTICS WIDGETS --- */}
        <div className="space-y-6">
           <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 shadow-lg relative overflow-hidden">
              <Wallet className="absolute -bottom-2 -right-2 h-16 w-16 text-primary opacity-[0.05] rotate-12" />
              <div className="relative z-10">
                 <p className="text-[8px] font-black uppercase tracking-widest text-primary/60 mb-1">Total Contribution</p>
                 <p className="text-3xl font-black italic tracking-tighter text-primary leading-none tabular-nums">
                   ${subscription.payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </p>
                 <div className="mt-6 pt-6 border-t border-primary/10 space-y-3">
                    <div className="flex justify-between items-center">
                       <span className="text-[8px] font-black uppercase text-muted-foreground opacity-40">Frequency</span>
                       <span className="text-[9px] font-bold uppercase italic tracking-widest">{subscription.serviceTier?.interval}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[8px] font-black uppercase text-muted-foreground opacity-40">Reliability</span>
                       <span className="text-[9px] font-black text-emerald-500">HIGH_TRUST</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="rounded-2xl border border-border/40 bg-card/40 p-6 space-y-4 shadow-md">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60 flex items-center gap-2">
                 <ShieldCheck className="h-3 w-3 text-emerald-500" /> Audit Signal
              </h4>
              <p className="text-[9px] font-bold text-muted-foreground leading-relaxed uppercase tracking-wider opacity-50 italic">
                Verified via <span className="text-foreground">Telegram Node</span>. Financial variables synchronized with active ledger for T2 compliance.
              </p>
           </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 opacity-20 py-4">
        <Globe className="h-3 w-3 text-muted-foreground" />
        <p className="text-[7px] font-black uppercase tracking-[0.3em] italic text-center">
          Identity Core synchronized // Node_Ref_{id.slice(0, 8)}
        </p>
      </div>
    </div>
  );
}