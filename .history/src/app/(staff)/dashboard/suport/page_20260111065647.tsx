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
  ShieldAlert,
  Globe,
  ChevronRight
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
 * 🎧 SUPPORT DESK LEDGER (Tactical Medium)
 * Normalized: World-standard fluid scaling for operational telemetry.
 * Optimized: Resilient grid geometry to prevent horizontal cropping.
 */
export default async function SupportPage() {
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

  const tickets = await prisma.supportTicket.findMany({
    where: { merchantId: realMerchantId },
    include: { user: true },
    orderBy: { updatedAt: 'desc' }
  });

  const unresolvedCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 px-4">
      
      {/* --- COMMAND HUD HEADER: TACTICAL SYNC --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1 text-left">
          <div className="flex items-center gap-2 text-primary/60">
            <MessageSquare className="h-4 w-4 shrink-0 fill-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-80 whitespace-nowrap">
              Operational Comms
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">
              Support <span className="text-primary">Desk</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">
              Node Status: <span className="text-foreground tabular-nums">{unresolvedCount}</span> Pending Intervention(s)
            </p>
          </div>
        </div>

        {/* Global Search & Filter Cluster */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full lg:w-auto shrink-0">
          <div className="relative min-w-0 sm:w-60 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-30" />
            <Input 
              placeholder="SEARCH TICKET_ID..." 
              className="h-10 md:h-11 w-full pl-10 rounded-xl border-border/40 bg-card/40 font-bold text-[9px] uppercase tracking-widest focus:ring-primary/20"
            />
          </div>
          <Button variant="outline" className="h-10 md:h-11 px-4 rounded-xl border-border/40 bg-muted/10 text-[9px] font-bold uppercase tracking-widest">
            <Filter className="mr-2 h-3.5 w-3.5 opacity-40" /> Filter
          </Button>
        </div>
      </div>

      {/* --- DATA NODE: THE RESOLUTION LEDGER --- */}
      <div className="rounded-2xl border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/10">
                {["Priority", "Identity Node", "Inquiry Manifest", "Status", ""].map((head) => (
                  <th key={head} className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10 text-foreground">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center opacity-20">
                    <div className="flex flex-col items-center gap-4">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                      <p className="text-xs font-black uppercase italic tracking-widest">
                        Protocols resolved. System clear.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-primary/[0.02] transition-colors group">
                    
                    {/* Priority Node */}
                    <td className="px-6 py-4 text-center w-20">
                      {ticket.status === 'OPEN' ? (
                        <div className="relative mx-auto h-2.5 w-2.5">
                           <div className="absolute inset-0 bg-primary/40 blur-md rounded-full animate-pulse" />
                           <div className="relative h-2 w-2 rounded-full bg-primary ring-2 ring-background shadow-lg" />
                        </div>
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-muted/30 border border-border mx-auto" />
                      )}
                    </td>

                    {/* User Identity */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary/40 shadow-inner group-hover:scale-105 transition-all">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-black text-foreground uppercase italic tracking-tight text-sm md:text-base leading-none truncate group-hover:text-primary transition-colors">
                            @{ticket.user.username || 'unknown_node'}
                          </p>
                          <p className="text-[8px] font-mono font-bold text-muted-foreground/40 uppercase tracking-tighter mt-1">
                            UID: {ticket.user.id.toString().slice(-10)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Subject & Snippet */}
                    <td className="px-6 py-4 max-w-sm">
                      <div className="flex flex-col gap-1">
                        <p className="font-bold text-xs uppercase tracking-tight text-foreground/80 leading-snug truncate">
                          {ticket.subject}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium line-clamp-1 italic opacity-40">
                          "{ticket.message}"
                        </p>
                      </div>
                    </td>

                    {/* Protocol Status */}
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center rounded-lg px-2.5 py-1 text-[8px] font-black uppercase tracking-widest border shadow-sm",
                        ticket.status === 'OPEN' 
                          ? "bg-primary/5 text-primary border-primary/20" 
                          : "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                      )}>
                        {ticket.status === 'OPEN' ? <Clock className="mr-1.5 h-3 w-3 animate-pulse" /> : <CheckCircle2 className="mr-1.5 h-3 w-3" />}
                        {ticket.status}
                      </div>
                    </td>

                    {/* Actions Entry */}
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-muted/10 border border-border/10 hover:bg-primary hover:text-white transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] rounded-xl border-border/40 bg-card/95 backdrop-blur-3xl p-1.5 shadow-2xl z-[100]">
                          <div className="px-3 py-1.5 mb-1 border-b border-border/10">
                             <p className="text-[7px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Protocol Response</p>
                          </div>
                          <DropdownMenuItem asChild className="rounded-lg py-2.5 px-3 cursor-pointer focus:bg-primary/10">
                             <Link href={`/dashboard/support/${ticket.id}`} className="flex items-center w-full">
                                <MessageSquare className="h-3.5 w-3.5 mr-2.5 text-muted-foreground" />
                                <span className="text-[9px] font-black uppercase tracking-widest italic">Direct Response</span>
                                <ChevronRight className="ml-auto h-3 w-3 opacity-20" />
                             </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg py-2.5 px-3 cursor-pointer text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-500">
                             <div className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-2.5" />
                                <span className="text-[9px] font-black uppercase tracking-widest italic">Close Node</span>
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

      {/* --- FOOTER SIGNAL --- */}
      <div className="flex items-center justify-center gap-3 opacity-20 py-4">
         <Terminal className="h-3 w-3 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
           Support Ledger synchronized // Node_ID: {realMerchantId.slice(0, 8)}
         </p>
      </div>
    </div>
  );
}