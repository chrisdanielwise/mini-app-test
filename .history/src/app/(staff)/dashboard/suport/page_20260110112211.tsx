import { requireMerchantSession } from "@/src/lib/auth/merchant-auth";
import prisma from "@/src/lib/db";
import { 
  MessageSquare, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  Terminal, 
  Search, 
  Filter, 
  User, 
  ChevronRight,
  ShieldAlert,
  ArrowUpRight
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";
import Link from "next/link";

/**
 * 🎧 SUPPORT DESK LEDGER (Tier 2)
 * High-resiliency resolution hub for auditing and managing user inquiries.
 */
export default async function SupportPage() {
  const session = await requireMerchantSession();

  // 🏁 1. Fetch tickets with institutional context
  const tickets = await prisma.supportTicket.findMany({
    where: { merchantId: session.merchant.id },
    include: {
      user: true,
    },
    orderBy: { updatedAt: 'desc' }
  });

  const unresolvedCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;

  return (
    <div className="space-y-12 p-6 sm:p-10 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-primary mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 fill-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Operational Comms
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
            Support <span className="text-primary">Desk</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-4 opacity-40">
            Node Status: {unresolvedCount} Pending Intervention(s)
          </p>
        </div>

        {/* Global Search & Filter Strip */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="SEARCH TICKET_ID OR USER..." 
              className="h-14 w-full sm:w-80 pl-12 rounded-2xl border-border/40 bg-card/40 font-black text-[10px] uppercase tracking-[0.2em] focus:ring-primary/20 transition-all placeholder:opacity-20"
            />
          </div>
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-border/40 bg-muted/10 text-[10px] font-black uppercase tracking-widest">
            <Filter className="mr-2 h-4 w-4" /> Filter Status
          </Button>
        </div>
      </div>

      {/* --- DATA NODE: THE RESOLUTION LEDGER --- */}
      <div className="rounded-[3.5rem] border border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border/40">
                {["Priority", "Identity Node", "Inquiry Manifest", "Status", ""].map((head) => (
                  <th key={head} className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-48 text-center">
                    <div className="flex flex-col items-center gap-8 opacity-20">
                      <div className="h-24 w-24 rounded-[3rem] bg-muted/50 border border-border/40 flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                      </div>
                      <p className="text-sm font-black uppercase italic tracking-tighter">
                        System Clear. All protocols resolved.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-primary/[0.02] transition-all duration-500 group">
                    
                    {/* Priority Node */}
                    <td className="px-10 py-10 text-center w-32">
                      {ticket.status === 'OPEN' ? (
                        <div className="relative mx-auto">
                           <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
                           <div className="relative h-3 w-3 rounded-full bg-primary border-4 border-background shadow-2xl" />
                        </div>
                      ) : (
                        <div className="h-3 w-3 rounded-full bg-muted/30 border-2 border-border mx-auto" />
                      )}
                    </td>

                    {/* User Identity */}
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-center text-muted-foreground shadow-inner">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-xl group-hover:text-primary transition-colors leading-none">
                            @{ticket.user.username || 'unknown_node'}
                          </p>
                          <p className="text-[9px] font-mono font-bold text-muted-foreground uppercase opacity-30 tracking-widest">
                            UID: {ticket.user.id.toString().slice(-12)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Subject & Snippet */}
                    <td className="px-10 py-10 max-w-sm">
                      <div className="space-y-2">
                        <p className="font-black text-xs uppercase tracking-tight text-foreground/90 leading-tight">
                          {ticket.subject}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium line-clamp-1 italic opacity-60">
                          "{ticket.message}"
                        </p>
                      </div>
                    </td>

                    {/* Protocol Status */}
                    <td className="px-10 py-10">
                      <div className={cn(
                        "inline-flex items-center rounded-2xl px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm",
                        ticket.status === 'OPEN' 
                          ? "bg-primary/5 text-primary border-primary/20" 
                          : "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                      )}>
                        {ticket.status === 'OPEN' ? <Clock className="mr-2 h-3.5 w-3.5 animate-pulse" /> : <CheckCircle2 className="mr-2 h-3.5 w-3.5" />}
                        {ticket.status}
                      </div>
                    </td>

                    {/* Actions Entry */}
                    <td className="px-10 py-10 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-muted/20 border border-border/40 hover:bg-primary hover:text-white transition-all group/btn">
                            <MoreHorizontal className="h-5 w-5 group-hover/btn:scale-110" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[260px] rounded-[2rem] border-border/40 bg-card/95 backdrop-blur-3xl p-3 shadow-2xl z-[100] animate-in zoom-in-95 duration-300">
                          <div className="px-4 py-3 mb-2 border-b border-border/20">
                             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Support Protocol</p>
                          </div>
                          <DropdownMenuItem className="rounded-xl py-4 px-4 cursor-pointer focus:bg-primary/10 group">
                             <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-3 text-muted-foreground group-focus:text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Direct Response</span>
                             </div>
                          </DropdownMenuItem>
                          <div className="h-px bg-border/20 my-2 mx-2" />
                          <DropdownMenuItem className="rounded-xl py-4 px-4 cursor-pointer text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-500">
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
      <div className="flex items-center gap-3 px-8 opacity-20">
         <Terminal className="h-3.5 w-3.5" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] italic">
           Manual intervention logged for audit compliance.
         </p>
      </div>
    </div>
  );
}