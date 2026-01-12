import { requireMerchantSession } from "@/src/lib/auth/merchant-auth";
import prisma from "@/src/lib/db";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  Terminal, 
  User, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  History,
  Clock,
  ExternalLink,
  Bot
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";

/**
 * 🛰️ SUPPORT RESPONSE TERMINAL (Tier 2)
 * High-resiliency direct-response interface for merchant-to-user comms.
 */
export default async function TicketResponsePage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const session = await requireMerchantSession();
  const { ticketId } = await params;

  // 🏁 1. Fetch Ticket & User Context
  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId, merchantId: session.merchant.id },
    include: {
      user: {
        include: {
          subscriptions: {
            where: { service: { merchantId: session.merchant.id } },
            include: { service: true, tier: true }
          }
        }
      }
    }
  });

  if (!ticket) return notFound();

  const activeSub = ticket.user.subscriptions[0];

  return (
    <div className="space-y-10 p-6 sm:p-10 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto">
      
      {/* --- COMMAND HEADER --- */}
      <div className="flex items-center justify-between border-b border-border/40 pb-10">
        <div className="space-y-3">
          <Link
            href="/dashboard/support"
            className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all mb-6"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Support Protocol Ledger
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
              Ticket <span className="text-primary">Resolution</span>
            </h1>
            <Badge variant="outline" className="rounded-lg text-[8px] font-black uppercase tracking-widest px-3 py-1 border-primary/20 bg-primary/5 text-primary">
              ID: {ticket.id.slice(0, 8)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* --- LEFT: INQUIRY MANIFEST --- */}
        <div className="space-y-8">
           <div className="rounded-[2.5rem] border border-border/40 bg-card/40 p-8 backdrop-blur-3xl space-y-8">
              <div className="flex items-center gap-3 text-muted-foreground/60">
                 <User className="h-4 w-4" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Identity Node</h3>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-muted/10 flex items-center justify-center text-primary font-black italic shadow-inner">
                       {ticket.user.username?.[0].toUpperCase() || "U"}
                    </div>
                    <div>
                       <p className="text-xl font-black uppercase italic tracking-tighter">@{ticket.user.username || "unknown"}</p>
                       <p className="text-[9px] font-mono font-bold opacity-30">UID: {ticket.user.id}</p>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-border/40 space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black uppercase text-muted-foreground opacity-40">Status</span>
                       <Badge className="rounded-md text-[8px] bg-emerald-500/10 text-emerald-500 border-none">
                          {activeSub ? "ACTIVE_MEMBER" : "NO_MEMBERSHIP"}
                       </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black uppercase text-muted-foreground opacity-40">Node Access</span>
                       <span className="text-[10px] font-black uppercase italic tracking-widest">{activeSub?.service.name || "N/A"}</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="rounded-[2.5rem] border border-border/40 bg-primary/5 p-8 relative overflow-hidden">
              <Bot className="absolute -bottom-4 -right-4 h-24 w-24 opacity-[0.03] rotate-12" />
              <div className="relative z-10 space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Delivery Protocol</h4>
                 <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest opacity-60">
                    Your response will be delivered instantly via the <span className="text-primary">Zipha Bot Node</span>. Once sent, the ticket status will transition to "RESOLVED".
                 </p>
              </div>
           </div>
        </div>

        {/* --- RIGHT: RESOLUTION CONSOLE --- */}
        <div className="xl:col-span-2 space-y-8">
           <div className="rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-border/40 bg-muted/20">
                 <div className="flex items-center gap-3 mb-4">
                    <History className="h-4 w-4 text-primary" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Original Manifest</h3>
                 </div>
                 <div className="space-y-4">
                    <p className="text-2xl font-black uppercase italic tracking-tighter">{ticket.subject}</p>
                    <div className="p-6 rounded-2xl bg-background/50 border border-border/40 italic text-sm text-foreground/80 leading-relaxed shadow-inner">
                       "{ticket.message}"
                    </div>
                 </div>
              </div>

              <div className="p-10 space-y-8">
                 <div className="flex items-center gap-3">
                    <Terminal className="h-4 w-4 text-primary" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">Response Console</h3>
                 </div>

                 <div className="space-y-4">
                    <Textarea 
                       placeholder="EXECUTE RESPONSE COMMAND..."
                       className="min-h-[250px] rounded-[2rem] border-border/40 bg-muted/10 p-8 font-medium text-sm leading-relaxed focus:ring-primary/20 transition-all resize-none shadow-inner"
                    />
                    <div className="flex items-center justify-between px-4">
                       <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-30">
                          Automated formatting applied via Zipha Core.
                       </p>
                       <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground opacity-30" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Est. Delivery: 120ms</span>
                       </div>
                    </div>
                 </div>

                 <div className="pt-6">
                    <Button className="w-full h-20 rounded-[2rem] bg-primary text-primary-foreground font-black uppercase italic tracking-[0.2em] text-sm shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-95 group">
                       <Send className="mr-3 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                       Deploy Response & Close Node
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}