import { requireMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
import { 
  MoreHorizontal, 
  Calendar, 
  Zap, 
  Search, 
  UserPlus, 
  Terminal,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 👥 SUBSCRIBERS LEDGER (Apex Tier)
 * Normalized: World-standard typography and responsive grid constraints.
 * Fixed: Identity handshake aligned with session.merchantId.
 */
export default async function SubscribersPage() {
  // 🔐 1. Identity Handshake
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

  // 🏁 2. Data Fetch: Live subscription nodes
  const subscriptions = await prisma.subscription.findMany({
    where: {
      service: {
        merchantId: realMerchantId,
      },
    },
    include: {
      adminUser: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
      service: true,
      tier: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- HUD HEADER & SEARCH --- */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-border/40 pb-8 md:pb-12">
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-3 text-primary mb-1">
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <UserPlus className="h-3.5 w-3.5 md:h-4 md:w-4 fill-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Network Identity Hub
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Subscriber <span className="text-primary">Base</span>
          </h1>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-2 opacity-40">
            Cluster Integrity: <span className="text-foreground">{subscriptions.length} Linked Nodes</span>
          </p>
        </div>

        <div className="relative w-full lg:w-80 group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="IDENTITY SEARCH..."
            className="pl-12 h-12 md:h-14 rounded-xl md:rounded-2xl bg-card/40 border-border/40 text-xs font-black uppercase tracking-widest placeholder:opacity-20 shadow-inner"
          />
        </div>
      </div>

      {/* --- DATABASE CONTAINER --- */}
      <div className="rounded-3xl md:rounded-[3rem] border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-muted/30 border-b border-border/10">
              <tr>
                {["Identity Node", "Assigned Service", "Expiration Horizon", ""].map((head) => (
                  <th key={head} className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-40 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <div className="h-16 w-16 md:h-20 md:w-20 rounded-3xl bg-muted/50 border border-border/10 flex items-center justify-center">
                        <ShieldAlert className="h-8 w-8" />
                      </div>
                      <p className="text-sm font-black uppercase italic tracking-widest">
                        No active membership protocols detected.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-primary/[0.02] transition-all group">
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-sm text-primary italic shadow-inner">
                          {(sub.adminUser?.fullName || "U").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-foreground uppercase italic text-base md:text-lg tracking-tighter leading-none truncate">
                            {sub.adminUser?.fullName || "Verified User"}
                          </span>
                          <Badge
                            variant="secondary"
                            className="w-fit text-[8px] font-black px-1.5 py-0.5 mt-1.5 uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border-none"
                          >
                            {sub.status}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                           <Zap className="h-3 w-3 text-primary opacity-40" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-primary italic leading-none truncate max-w-[150px]">
                             {sub.service.name}
                           </p>
                        </div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-5 opacity-50">
                          {sub.tier?.name} ACCESS
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground opacity-30" />
                        <span className="font-black text-xs uppercase italic tracking-tighter text-foreground/80">
                          {sub.expiresAt
                            ? new Date(sub.expiresAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                            : "LIFETIME_NODE"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-8 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-muted/20 border border-border/10 hover:bg-primary hover:text-white transition-all"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[240px] rounded-2xl border-border/40 bg-card/95 backdrop-blur-3xl p-2 shadow-2xl z-[100] animate-in zoom-in-95 duration-300"
                        >
                          <div className="px-3 py-2 mb-1 border-b border-border/20">
                             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Node Operations</p>
                          </div>
                          <DropdownMenuItem className="rounded-lg py-3 px-3 cursor-pointer focus:bg-primary/10 group">
                            <span className="text-[10px] font-black uppercase tracking-widest italic flex items-center justify-between w-full">
                              View Payment Ledger
                              <ChevronRight className="h-3 w-3 opacity-20" />
                            </span>
                          </DropdownMenuItem>
                          <div className="h-px bg-border/20 my-2 mx-1" />
                          <DropdownMenuItem className="rounded-lg py-3 px-3 cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-500">
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Revoke Protocol Access</span>
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