import { requireMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
import { 
  MessageSquare, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  Terminal, 
  Search, 
  Filter, 
  User, 
  ShieldAlert
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * 🎧 SUPPORT DESK LEDGER (Tier 2)
 * Normalized: Fixed typography scales and responsive grid constraints.
 */
export default async function SupportPage() {
  const session = await requireMerchantSession();

  const tickets = await prisma.supportTicket.findMany({
    where: { merchantId: session.merchant.id },
    include: { user: true },
    orderBy: { updatedAt: 'desc' }
  });

  const unresolvedCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2 md:space-y-3 text-left">
          <div className="flex items-center gap-3 text-primary mb-1">
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-3.5 w-3.5 md:h-4 md:w-4 fill-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Operational Comms
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Support <span className="text-primary">Desk</span>
          </h1>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-2 opacity-40">
            Node Status: {unresolvedCount} Pending Intervention(s)
          </p>
        </div>

        {/* Global Search & Filter Strip - Optimized for Mobile Width */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary" />
            <Input 
              placeholder="SEARCH TICKET_ID..." 
              className="h-12 md:h-14 w-full pl-12 rounded-2xl border-border/40 bg-card/40 text-xs font-black uppercase tracking-widest placeholder:opacity-20"
            />
          </div>
          <Button variant="outline" className="h-12 md:h-14 px-6 rounded-2xl border-border/40 bg-muted/10 text-xs font-black uppercase tracking-widest">
            <Filter className="mr-2 h-4 w-4" /> Filter Status
          </Button>
        </div>
      </div>

      {/* --- DATA NODE: THE RESOLUTION LEDGER --- */}
      <div className="rounded-3xl md:rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/40">
                {["Priority", "Identity Node", "Inquiry Manifest", "Status", ""].map((head) => (
                  <th key={head} className="px-6 py-6 font-black uppercase text-[10px] text-muted-foreground/60 tracking-[0.2em]">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <div className="h-16 w-16 md:h-20 md:w-20 rounded-3xl bg-muted/50 border border-border/40 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                      </div>
                      <p className="text-sm font-black uppercase italic tracking-widest">
                        System Clear. Protocols resolved.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-primary/[0.02] transition-all group">
                    
                    {/* Priority Node */}
                    <td className="px-6 py-6 text-center w-24">
                      {ticket.status === 'OPEN' ? (
                        <div className="relative mx-auto h-3 w-3">
                           <div className="absolute inset-0 bg-primary/40 blur-md rounded-full animate-pulse" />
                           <div className="relative h-2 w-2 rounded-full bg-primary ring-4 ring-background shadow-2xl" />
                        </div>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-muted/30 border-2 border-border mx-auto" />
                      )}
                    </td>

                    {/* User Identity */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-muted/20 border border-border/40 flex items-center justify-center text-muted-foreground shadow-inner">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-base truncate group-hover:text-primary transition-colors">
                            @{ticket.user.username || 'unknown_node'}
                          </p>
                          <p className="text-[9px] font-mono font-bold text-muted-foreground uppercase opacity-30 tracking-widest">
                            ID: {ticket.user.id.toString().slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Subject & Snippet */}
                    <td className="px-6 py-6 max-w-md">
                      <div className="space-y-1">
                        <p className="font-black text-xs uppercase tracking-tight text-foreground/90 leading-snug">
                          {ticket.subject}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium line-clamp-1 italic opacity-60">
                          "{ticket.message}"
                        </p>
                      </div>
                    </td>

                    {/* Protocol Status */}
                    <td className="px-6 py-6">
                      <div className={cn(
                        "inline-flex items-center rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm",
                        ticket.status === 'OPEN' 
                          ? "bg-primary/5 text-primary border-primary/20" 
                          : "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                      )}>
                        {ticket.status === 'OPEN' ? <Clock className="mr-1.5 h-3 w-3 animate-pulse" /> : <CheckCircle2 className="mr-1.5 h-3 w-3" />}
                        {ticket.status}
                      </div>
                    </td>

                    {/* Actions Entry */}
                    <td className="px-6 py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-muted/20 border border-border/40 hover:bg-primary hover:text-white transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[240px] rounded-2xl border-border/40 bg-card/95 backdrop-blur-3xl p-2 shadow-2xl z-[100] animate-in zoom-in-95 duration-300">
                          <div className="px-3 py-2 mb-1 border-b border-border/20">
                             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Support Protocol</p>
                          </div>
                          <DropdownMenuItem className="rounded-lg py-3 px-3 cursor-pointer focus:bg-primary/10">
                             <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-3 text-muted-foreground group-focus:text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Direct Response</span>
                             </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg py-3 px-3 cursor-pointer text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-500">
                             <div className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Close Node</span>
                             </div>
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
           Manual intervention logged for audit compliance.
         </p>
      </div>
    </div>
  );
}