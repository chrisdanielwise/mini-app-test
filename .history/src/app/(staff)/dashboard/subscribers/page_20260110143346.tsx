import { requireMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
import { 
  Users, 
  MoreHorizontal, 
  Calendar, 
  Zap, 
  Search, 
  Filter, 
  Download, 
  ChevronRight,
  Terminal,
  ShieldCheck,
  UserPlus
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 🏛️ SUBSCRIBER LEDGER CLUSTER (Tier 2)
 * High-resiliency identity management for the entire signal node fleet.
 */
export default async function SubscribersPage() {
  const session = await requireMerchantSession();

  // 🏁 1. Fetch all subscription nodes linked to the merchant's cluster
  const subscriptions = await prisma.subscription.findMany({
    where: {
      service: {
        merchantId: session.merchant.id
      }
    },
    include: {
      user: true,
      service: true,
      tier: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-12 p-6 sm:p-10 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-primary mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-4 w-4 fill-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Network Identity Hub
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
            Subscriber <span className="text-primary">Ledger</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-4 opacity-40">
            Total Validated Identities: {subscriptions.length}
          </p>
        </div>

        {/* Global Utility Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="FILTER BY TG_ID OR NAME..." 
              className="h-14 w-full sm:w-80 pl-12 rounded-2xl border-border/40 bg-card/40 font-black text-[10px] uppercase tracking-[0.2em] focus:ring-primary/20 transition-all placeholder:opacity-20"
            />
          </div>
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-border/40 bg-muted/10 text-[10px] font-black uppercase tracking-widest hover:bg-muted/20">
            <Filter className="mr-2 h-4 w-4" /> Filter Node
          </Button>
          <Button className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 bg-primary text-primary-foreground">
            <Download className="mr-2 h-4 w-4" /> Export Telemetry
          </Button>
        </div>
      </div>

      {/* --- DATA NODE: THE LEDGER --- */}
      <div className="rounded-[3.5rem] border border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border/40">
                {["Identity Node", "Service // Tier", "Protocol Status", "Expiry Horizon", ""].map((head) => (
                  <th key={head} className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-48 text-center">
                    <div className="flex flex-col items-center gap-8 opacity-20">
                      <div className="h-24 w-24 rounded-[3rem] bg-muted/50 border border-border/40 flex items-center justify-center">
                        <Terminal className="h-10 w-10" />
                      </div>
                      <p className="text-sm font-black uppercase italic tracking-tighter">
                        Identity cluster is empty. Awaiting user synchronization.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-primary/[0.02] transition-all duration-500 group cursor-default">
                    
                    {/* User Identity */}
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black italic shadow-inner group-hover:scale-105 transition-transform">
                          {(sub.user.username || "U")[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-2xl group-hover:text-primary transition-colors leading-none">
                            @{sub.user.username || 'unknown_node'}
                          </p>
                          <p className="text-[9px] font-mono font-bold text-muted-foreground uppercase opacity-30 tracking-widest">
                            ID: {sub.user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Service & Tier Mapping */}
                    <td className="px-10 py-10">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                           <Zap className="h-3 w-3 text-primary opacity-40" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-primary italic leading-none">{sub.service.name}</p>
                        </div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-5 opacity-50">
                          {sub.tier.name} ACCESS
                        </p>
                      </div>
                    </td>

                    {/* Current Lifecycle Status */}
                    <td className="px-10 py-10">
                      <div className={cn(
                        "inline-flex items-center rounded-2xl px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm",
                        sub.status === 'ACTIVE' 
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" 
                          : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                      )}>
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full mr-2.5 animate-pulse",
                          sub.status === 'ACTIVE' ? "bg-emerald-500" : "bg-amber-500"
                        )} />
                        {sub.status}
                      </div>
                    </td>

                    {/* Expiration Telemetry */}
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground opacity-30" />
                        <span className="font-black text-[11px] uppercase italic tracking-tighter text-foreground/80">
                          {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'LIFETIME_PROTO'}
                        </span>
                      </div>
                    </td>

                    {/* Operational Actions */}
                    <td className="px-10 py-10 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-muted/20 border border-border/40 hover:bg-primary hover:text-white transition-all group/btn">
                            <MoreHorizontal className="h-5 w-5 group-hover/btn:scale-110" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[260px] rounded-[2rem] border-border/40 bg-card/95 backdrop-blur-3xl p-3 shadow-2xl z-[100] animate-in zoom-in-95 duration-300">
                          <div className="px-4 py-3 mb-2 border-b border-border/20">
                             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Identity Ops</p>
                          </div>
                          <DropdownMenuItem asChild className="rounded-xl py-4 px-4 cursor-pointer focus:bg-primary/10 group">
                            <Link href={`/dashboard/subscribers/${sub.id}`} className="flex items-center justify-between w-full">
                               <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-3 text-muted-foreground group-focus:text-primary" />
                                  <span className="text-[10px] font-black uppercase tracking-widest italic">Deep Audit</span>
                               </div>
                               <ChevronRight className="h-3 w-3 opacity-20" />
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl py-4 px-4 cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-500">
                            <Trash2 className="h-4 w-4 mr-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Revoke Access</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}