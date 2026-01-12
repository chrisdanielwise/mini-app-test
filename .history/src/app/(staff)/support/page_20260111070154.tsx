import { requireMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
import { 
  MessageSquare, 
  MoreHorizontal, 
  CheckCircle2, 
  User,
  ExternalLink,
  Terminal,
  Zap,
  Clock,
  Globe,
  ChevronRight
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";

/**
 * 🎧 SUPPORT DESK: Operational Node (Tactical Medium)
 * Normalized: World-standard fluid scaling for operational telemetry.
 * Optimized: Resilient grid geometry to prevent horizontal cropping.
 */
export default async function SupportPage() {
  // 🔐 1. Identity Handshake
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

  // 🏁 2. Data Fetch: Inbox Ledger
  const tickets = await prisma.supportTicket.findMany({
    where: { 
      merchantId: realMerchantId 
    },
    include: { 
      adminUser: { 
        select: {
          id: true,
          fullName: true,
          username: true
        }
      } 
    },
    orderBy: { updatedAt: 'desc' }
  });

  const openCount = tickets.filter(t => t.status === 'OPEN').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 px-4">
      
      {/* --- COMMAND HUD HEADER: TACTICAL SYNC --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2 text-primary/60">
            <MessageSquare className="h-4 w-4 shrink-0 fill-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-80 whitespace-nowrap">
              Operational Comms
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">
              Protocol <span className="text-primary">Support</span>
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 opacity-40">
              <p className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Globe className="h-3 w-3" />
                Node: <span className="text-foreground italic uppercase">{session.config.companyName}</span>
              </p>
              <p className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Terminal className="h-3 w-3" />
                Queue: <span className={cn("italic", openCount > 0 ? "text-amber-500" : "text-emerald-500")}>{openCount} OPEN</span>
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <Badge 
            variant="outline" 
            className={cn(
              "h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm",
              openCount > 0 
                ? "text-amber-500 border-amber-500/20 bg-amber-500/5" 
                : "text-muted-foreground/40 border-border/10 bg-muted/5"
            )}
          >
            {openCount} Pending Inquiries
          </Badge>
        </div>
      </div>

      {/* --- DATA NODE: THE LEDGER --- */}
      <div className="rounded-2xl border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/10">
                {[
                  "Identity Node",
                  "Inquiry Manifest",
                  "Protocol Status",
                  "",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10 text-foreground">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center opacity-20">
                    <div className="flex flex-col items-center gap-4">
                      <Zap className="h-10 w-10" />
                      <p className="text-xs font-black uppercase italic tracking-widest">
                        Support queue is currently clear.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-primary/[0.02] transition-colors group"
                  >
                    {/* Identity Node */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 md:h-11 md:w-11 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center text-primary/40 font-black border border-primary/20 shadow-inner group-hover:scale-105 transition-all">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-foreground uppercase italic tracking-tight text-sm md:text-base leading-none truncate group-hover:text-primary transition-colors">
                            {ticket.adminUser?.fullName || "Verified User"}
                          </span>
                          <span className="text-[8px] font-mono font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">
                            @{ticket.adminUser?.username || "anon"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Inquiry Manifest */}
                    <td className="px-6 py-4 max-w-sm">
                      <div className="flex flex-col gap-1">
                        <p className="text-[11px] font-black uppercase tracking-tight text-foreground/80 italic leading-snug line-clamp-1">
                          {ticket.subject}
                        </p>
                        <p className="text-[8px] text-muted-foreground/30 font-bold uppercase tracking-widest">
                          Sync: {format(new Date(ticket.updatedAt), "dd MMM yyyy")}
                        </p>
                      </div>
                    </td>

                    {/* Protocol Status */}
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center rounded-lg px-2.5 py-1 text-[8px] font-black uppercase tracking-widest border shadow-sm",
                        ticket.status === 'RESOLVED' 
                          ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' 
                          : 'bg-amber-500/5 text-amber-500 border-amber-500/20'
                      )}>
                        {ticket.status === 'RESOLVED' ? (
                          <CheckCircle2 className="h-3 w-3 mr-1.5" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1.5 animate-pulse" />
                        )}
                        {ticket.status}
                      </div>
                    </td>

                    {/* Actions Entry */}
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg bg-muted/10 border border-border/10 hover:bg-primary hover:text-white transition-all"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] rounded-xl border-border/40 bg-card/95 backdrop-blur-3xl p-1.5 shadow-2xl">
                          <div className="px-3 py-1.5 mb-1 border-b border-border/10">
                             <p className="text-[7px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Protocol Action</p>
                          </div>
                          <DropdownMenuItem className="rounded-lg py-2.5 px-3 cursor-pointer focus:bg-primary/10 group">
                            <MessageSquare className="h-3.5 w-3.5 mr-2.5 text-muted-foreground group-focus:text-primary" />
                            <span className="text-[9px] font-black uppercase tracking-widest italic">Reply via Bot</span>
                            <ChevronRight className="ml-auto h-3 w-3 opacity-20" />
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg py-2.5 px-3 cursor-pointer focus:bg-primary/10 group">
                            <ExternalLink className="h-3.5 w-3.5 mr-2.5 text-muted-foreground group-focus:text-primary" />
                            <span className="text-[9px] font-black uppercase tracking-widest italic">Audit Node</span>
                          </DropdownMenuItem>
                          <div className="h-px bg-border/10 my-1.5 mx-1" />
                          <DropdownMenuItem className="rounded-lg py-2.5 px-3 cursor-pointer text-emerald-500 focus:bg-emerald-500/10">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-2.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest italic">Close Node</span>
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
          Support queue synchronized // Sync_State: Optimal
        </p>
      </div>
    </div>
  );
}