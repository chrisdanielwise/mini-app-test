import { requireMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
import { 
  MessageSquare, 
  MoreHorizontal, 
  CheckCircle2, 
  AlertCircle,
  User,
  ExternalLink,
  Terminal,
  Zap,
  Clock
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

/**
 * 🎧 SUPPORT DESK: Operational Node (Apex Tier)
 * Normalized: World-standard typography and responsive viewport constraints.
 * Fixed: Identity handshake aligned with session.merchantId.
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
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- HUD HEADER: QUEUE TELEMETRY --- */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-border/40 pb-8 md:pb-12">
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-3 text-primary mb-1">
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <MessageSquare className="h-3.5 w-3.5 md:h-4 md:w-4 fill-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Operational Comms
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Protocol <span className="text-primary">Support</span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Badge 
              variant="outline" 
              className={cn(
                "rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                openCount > 0 
                  ? "text-amber-500 border-amber-500/20 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.1)]" 
                  : "text-muted-foreground opacity-50"
              )}
            >
              {openCount} Pending Inquiries
            </Badge>
            <div className="h-4 w-px bg-border/40 hidden sm:block" />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 flex items-center gap-2">
              <Terminal className="h-3 w-3" />
              Node: <span className="text-foreground">{session.config.companyName || "SYSTEM_ROOT"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* --- LEDGER TABLE --- */}
      <div className="rounded-3xl md:rounded-[3rem] border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-muted/30 border-b border-border/10">
              <tr>
                {["Identity Node", "Inquiry Manifest", "Protocol Status", ""].map((head) => (
                  <th key={head} className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-40 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <div className="h-16 w-16 md:h-20 md:w-20 rounded-3xl bg-muted/50 border border-border/10 flex items-center justify-center">
                        <Zap className="h-8 w-8" />
                      </div>
                      <p className="text-sm font-black uppercase italic tracking-widest">
                        Support queue is currently clear.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-primary/[0.02] transition-all group">
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl bg-muted/20 border border-border/10 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <User className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-foreground uppercase italic text-base md:text-lg tracking-tighter truncate leading-none">
                            {ticket.adminUser?.fullName || "Verified User"}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase opacity-30 mt-1.5 tracking-widest">
                            @{ticket.adminUser?.username || "anon"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="space-y-1 max-w-md">
                        <p className="text-xs font-black uppercase tracking-tight text-foreground/80 italic leading-snug line-clamp-1">
                          {ticket.subject}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase opacity-40 italic tracking-widest">
                          Last Updated: {new Date(ticket.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className={cn(
                        "inline-flex items-center rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm",
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
                    <td className="px-6 py-8 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-muted/20 border border-border/10 hover:bg-primary hover:text-white transition-all">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[240px] rounded-2xl border-border/40 bg-card/95 backdrop-blur-3xl p-2 shadow-2xl z-[100] animate-in zoom-in-95 duration-300">
                          <div className="px-3 py-2 mb-1 border-b border-border/20">
                             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Support Action</p>
                          </div>
                          <DropdownMenuItem className="rounded-lg py-3 px-3 cursor-pointer focus:bg-primary/10 group">
                            <MessageSquare className="h-4 w-4 mr-3 text-muted-foreground group-focus:text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Reply via Telegram</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg py-3 px-3 cursor-pointer focus:bg-primary/10 group">
                            <ExternalLink className="h-4 w-4 mr-3 text-muted-foreground group-focus:text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">View Account</span>
                          </DropdownMenuItem>
                          <div className="h-px bg-border/20 my-2 mx-1" />
                          <DropdownMenuItem className="rounded-lg py-3 px-3 cursor-pointer text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-500">
                            <CheckCircle2 className="h-4 w-4 mr-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Mark as Resolved</span>
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
          Operational queue monitored for service latency.
        </p>
      </div>
    </div>
  );
}