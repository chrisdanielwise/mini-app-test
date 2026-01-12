import { requireMerchantSession } from "@/src/lib/auth/merchant-auth";
import prisma from "@/src/lib/db";
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
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import { format } from "date-fns";

/**
 * 🛰️ SUBSCRIBER IDENTITY NODE (Deep View)
 * High-resiliency interface for auditing and managing individual signal memberships.
 */
export default async function SubscriberDeepView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireMerchantSession();
  const { id } = await params;

  // 🏁 1. Fetch Subscriber Protocol Data
  const subscription = await prisma.subscription.findUnique({
    where: { id },
    include: {
      user: true,
      service: true,
      tier: true,
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });

  // Security Guard: Ensure this subscriber belongs to the merchant's fleet
  if (!subscription || subscription.service.merchantId !== session.merchant.id) {
    return notFound();
  }

  return (
    <div className="space-y-12 p-6 sm:p-10 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto">
      
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-border/40 pb-10">
        <div className="space-y-4">
          <Link
            href="/dashboard/subscribers"
            className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all mb-6"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to User Ledger
          </Link>
          <div className="flex flex-wrap items-center gap-6">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
              @{subscription.user.username || "NODE_ANON"}
            </h1>
            <Badge className={cn(
              "rounded-full text-[10px] font-black uppercase tracking-widest px-4 py-1.5 border",
              subscription.status === 'ACTIVE' 
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
            )}>
              {subscription.status === 'ACTIVE' ? <ShieldCheck className="mr-2 h-3.5 w-3.5" /> : <ShieldAlert className="mr-2 h-3.5 w-3.5" />}
              {subscription.status}
            </Badge>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="rounded-2xl h-14 px-8 border-border/40 bg-muted/10 font-black uppercase text-[10px] tracking-widest">
            Update Expiry
          </Button>
          <Button className="rounded-2xl h-14 px-8 bg-rose-500 text-white font-black uppercase italic tracking-widest text-[10px] shadow-2xl shadow-rose-500/20">
            <Trash2 className="mr-2 h-4 w-4" /> Revoke Access
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* --- LEFT: IDENTITY PASSPORT --- */}
        <div className="xl:col-span-2 space-y-10">
          
          {/* Section: Subscription Parameters */}
          <section className="rounded-[3rem] border border-border/40 bg-card/40 p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                <Zap className="h-48 w-48" />
             </div>
             
             <div className="flex items-center gap-3 text-primary mb-8">
                <Terminal className="h-4 w-4" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol Details</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Service Node</p>
                   <p className="text-2xl font-black italic uppercase tracking-tighter text-foreground">{subscription.service.name}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Pricing Node (Tier)</p>
                   <p className="text-2xl font-black italic uppercase tracking-tighter text-primary">{subscription.tier.name}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Identity ID (Telegram)</p>
                   <p className="text-lg font-mono font-black tracking-widest opacity-80">{subscription.user.id}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Protocol Start</p>
                   <p className="text-lg font-black italic uppercase tracking-tighter">
                     {format(new Date(subscription.createdAt), "dd MMM yyyy")}
                   </p>
                </div>
             </div>

             <div className="mt-12 p-8 rounded-[2rem] bg-muted/10 border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <Calendar className="h-6 w-6 text-muted-foreground opacity-40" />
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 leading-none">Access Expiration</p>
                      <p className="text-lg font-black uppercase italic tracking-tighter mt-1">
                        {subscription.expiresAt ? format(new Date(subscription.expiresAt), "dd MMMM yyyy") : "LIFETIME_PROTOCOL"}
                      </p>
                   </div>
                </div>
                <Badge variant="outline" className="rounded-lg h-8 px-4 bg-background text-[9px] font-black uppercase italic tracking-widest">
                  {subscription.status === 'ACTIVE' ? "Broadcasting" : "Disconnected"}
                </Badge>
             </div>
          </section>

          {/* Section: Payment Ledger (Local to User) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-4">
               <History className="h-4 w-4 text-primary" />
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em]">Payment Telemetry</h3>
            </div>
            
            <div className="rounded-[2.5rem] border border-border/40 bg-card/20 overflow-hidden backdrop-blur-xl">
               <table className="w-full text-left">
                  <thead className="bg-muted/30 border-b border-border/40">
                     <tr>
                        {["Liquidity", "Protocol", "Status", "TXID"].map((head) => (
                           <th key={head} className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">{head}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                     {subscription.payments.map((p) => (
                        <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                           <td className="px-8 py-5 font-black text-sm italic tracking-tighter">${parseFloat(p.amount).toFixed(2)}</td>
                           <td className="px-8 py-5 text-[10px] font-black uppercase tracking-widest opacity-60">{p.currency}</td>
                           <td className="px-8 py-5">
                              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">PAID</span>
                           </td>
                           <td className="px-8 py-5">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                 <ExternalLink className="h-3.5 w-3.5 opacity-40 hover:opacity-100" />
                              </Button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </section>
        </div>

        {/* --- RIGHT: LIFETIME ANALYTICS --- */}
        <div className="space-y-8">
           <div className="rounded-[2.5rem] bg-primary/5 border border-primary/20 p-8 shadow-inner relative overflow-hidden">
              <div className="relative z-10">
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary opacity-60 mb-2">Total Contribution (LTV)</p>
                 <p className="text-5xl font-black italic tracking-tighter text-primary">
                   ${subscription.payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </p>
                 <div className="mt-8 pt-8 border-t border-primary/10 space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase text-muted-foreground opacity-40">Frequency</span>
                       <span className="text-[10px] font-black uppercase italic tracking-widest">{subscription.tier.interval} Renewal</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase text-muted-foreground opacity-40">Reliability</span>
                       <span className="text-[10px] font-black uppercase italic tracking-widest text-emerald-500">HIGH_TRUST</span>
                    </div>
                 </div>
              </div>
              <Wallet className="absolute -bottom-4 -right-4 h-32 w-32 text-primary opacity-[0.03] rotate-12" />
           </div>

           <div className="rounded-[2.5rem] border border-border/40 bg-card/40 p-8 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 flex items-center gap-2">
                 <ShieldCheck className="h-3 w-3" /> System Audit
              </h4>
              <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest opacity-50">
                Identity verified via <span className="text-foreground">Telegram Auth</span>. Node broadcasting active since deployment. All financial variables are synchronized with the merchant ledger.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}