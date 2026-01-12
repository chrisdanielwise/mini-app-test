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
  UserPlus,
  Trash2
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
 * Normalized: Fixed typography scales and responsive grid constraints.
 */
export default async function SubscribersPage() {
  // 🔐 Identity Handshake
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

  // 🏁 1. Fetch all subscription nodes linked to the merchant's cluster
  const subscriptions = await prisma.subscription.findMany({
    where: {
      service: { merchantId: realMerchantId }
    },
    include: {
      user: true,
      service: true,
      tier: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-3 text-primary mb-1">
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-3.5 w-3.5 md:h-4 md:w-4 fill-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Network Identity Hub
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Subscriber <span className="text-primary">Ledger</span>
          </h1>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-2 opacity-40">
            Validated Identities: <span className="text-foreground">{subscriptions.length}</span>
          </p>
        </div>

        {/* Global Utility Actions - Responsive Width */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <div className="relative flex-1 xl:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="FILTER IDENTITY..." 
              className="h-12 md:h-14 w-full pl-12 rounded-2xl border-border/40 bg-card/40 text-xs font-black uppercase tracking-widest placeholder:opacity-20"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none h-12 md:h-14 px-6 rounded-2xl border-border/40 bg-muted/10 text-xs font-black uppercase tracking-widest">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button className="flex-1 sm:flex-none h-12 md:h-14 px-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 bg-primary text-primary-foreground">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
      </div>

      {/* --- DATA NODE: THE LEDGER --- */}
      <div className="rounded-3xl md:rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/40">
                {["Identity Node", "Service // Tier", "Protocol Status", "Expiry Horizon", ""].map((head) => (
                  <th key={head} className="px-6 py-6 font-black uppercase text-[10px] text-muted-foreground/60 tracking-[0.2em]">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-40 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <div className="h-16 w-16 md:h-20 md:w-20 rounded-3xl bg-muted/50 border border-border/40 flex items-center justify-center\">
                        <Terminal className="h-8 w-8" />
                      </div>
                      <p className="text-sm font-black uppercase italic tracking-widest">
                        Identity cluster empty. Awaiting synchronization.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-primary/[0.02] transition-all group">
                    
                    {/* User Identity Cell */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black italic shadow-inner border border-primary/20">
                          {(sub.user.username || "U")[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-base md:text-lg group-hover:text-primary transition-colors leading-none truncate">
                            @{sub.user.username || 'unknown_node'}
                          </p>
                          <p className="text-[9px] font-mono font-bold text-muted-foreground uppercase opacity-30 tracking-widest mt-1.5">
                            UID: {sub.user.id.toString().slice(-12)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Service & Tier Cell */}
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                           <Zap className="h-3 w-3 text-primary opacity-40" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-primary italic leading-none truncate max-w-[150px]">
                             {sub.service.name}
                           </p>
                        </div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-5 opacity-50">
                          {sub.tier.name} ACCESS
                        </p>
                      </div>
                    </td>

                    {/* Protocol Status Cell */}
                    <td className="px-6 py-6">
                      <div className={cn(
                        "inline-flex items-center rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm",
                        sub.status === 'ACTIVE' 
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" 
                          : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                      )}>
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full mr-2 animate-pulse",
                          sub.status === 'ACTIVE' ? "bg-emerald-500" : "bg-amber-500"
                        )} />
                        {sub.status}
                      </div>
                    </td>

                    {/* Expiry Horizon Cell */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground opacity-30" />
                        <span className="font-black text-xs uppercase italic tracking-tighter text-foreground/80">
                          {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'LIFETIME_PROTO'}
                        </span>
                      </div>
                    </td>

                    {/* Operational Actions Entry */}
                    <td className="px-6 py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-muted/20 border border-border/40 hover:bg-primary hover:text-white transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[240px] rounded-2xl border-border/40 bg-card/95 backdrop-blur-3xl p-2 shadow-2xl z-[100] animate-in zoom-in-95 duration-300">
                          <div className="px-3 py-2 mb-1 border-b border-border/20">
                             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Identity Ops</p>
                          </div>
                          <DropdownMenuItem asChild className="rounded-lg py-3 px-3 cursor-pointer focus:bg-primary/10 group">
                            <Link href={`/dashboard/subscribers/${sub.id}`} className="flex items-center justify-between w-full">
                               <div className=\"flex items-center\">
                                  <Users className=\"h-4 w-4 mr-3 text-muted-foreground group-focus:text-primary\" />
                                  <span className=\"text-[10px] font-black uppercase tracking-widest italic\">Deep Audit</span>
                               </div>
                               <ChevronRight className="h-3 w-3 opacity-20" />
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg py-3 px-3 cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-500">
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
      
      {/* --- FOOTER OVERRIDE --- */}
      <div className="flex items-center gap-3 px-6 opacity-20">
         <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">
           Network identity nodes are monitored for protocol compliance.
         </p>
      </div>
    </div>
  );
}