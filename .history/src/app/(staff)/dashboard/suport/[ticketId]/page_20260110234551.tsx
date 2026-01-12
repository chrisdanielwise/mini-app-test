import { requireMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
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
  Bot
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * 🛰️ SUPPORT RESPONSE TERMINAL (Apex Tier)
 * Normalized: Unified viewport padding and responsive typography.
 * Fixed: Identity handshake synchronized with hardened Merchant Session.
 */
export default async function TicketResponsePage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  // 🔐 Identity Handshake
  const session = await requireMerchantSession();
  const { ticketId } = await params;
  const realMerchantId = session.merchantId;

  // 🏁 1. Fetch Ticket & User Context with Institutional Scoping
  const ticket = await prisma.supportTicket.findUnique({
    where: { 
      id: ticketId, 
      merchantId: realMerchantId 
    },
    include: {
      user: {
        include: {
          subscriptions: {
            where: { service: { merchantId: realMerchantId } },
            include: { service: true, tier: true }
          }
        }
      }
    }
  });

  if (!ticket) return notFound();

  const activeSub = ticket.user.subscriptions[0];

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto">
      
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col gap-6 border-b border-border/40 pb-8 md:pb-10">
        <Link
          href="/dashboard/support"
          className="group inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all"
        >
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          Support Protocol Ledger
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase italic leading-none">
            Ticket <span className="text-primary">Resolution</span>
          </h1>
          <Badge variant="outline" className="w-fit rounded-lg text-[10px] font-black uppercase tracking-widest px-3 py-1 border-primary/20 bg-primary/5 text-primary">
            ID: {ticket.id.slice(0, 8)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-10">
        
        {/* --- LEFT: INQUIRY MANIFEST (Identity Node) --- */}
        <div className="space-y-6 md:space-y-8">
           <div className="rounded-3xl md:rounded-[2.5rem] border border-border/40 bg-card/40 p-6 md:p-8 backdrop-blur-3xl space-y-6 md:space-y-8 shadow-2xl">
              <div className="flex items-center gap-3 text-muted-foreground/60">
                 <User className="h-4 w-4" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Identity Node</h3>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-muted/10 flex items-center justify-center text-primary font-black italic shadow-inner border border-border/40">
                       {ticket.user.username?.[0].toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                       <p className="text-lg md:text-xl font-black uppercase italic tracking-tighter truncate leading-none">
                         @{ticket.user.username || "unknown"}
                       </p>
                       <p className="text-[9px] font-mono font-bold opacity-30 tracking-widest mt-1">
                         UID: {ticket.user.id.toString().slice(-12)}
                       </p>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-border/40 space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Status</span>
                       <Badge className="rounded-md text-[8px] font-black uppercase px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border-none tracking-widest">
                          {activeSub ? "ACTIVE_MEMBER" : "NO_MEMBERSHIP"}
                       </Badge>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                       <span className="text-[9px] font-black uppercase text-muted-foreground opacity-40 tracking-widest shrink-0">Node Access</span>
                       <span className="text-[10px] font-black uppercase italic tracking-widest truncate text-right">{activeSub?.service.name || "N/A"}</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="rounded-3xl md:rounded-[2.5rem] border border-border/40 bg-primary/5 p-6 md:p-8 relative overflow-hidden shadow-inner">
              <Bot className="absolute -bottom-4 -right-4 h-24 w-24 opacity-[0.03] rotate-12" />
              <div className="relative z-10 space-y-3">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Delivery Protocol</h4>
                 <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest opacity-60">
                    Your response will be delivered instantly via the <span className="text-primary font-black">Zipha Bot Node</span>. Once sent, the ticket status will transition to <span className="text-foreground">"RESOLVED"</span>.
                 </p>
              </div>
           </div>
        </div>

        {/* --- RIGHT: RESOLUTION CONSOLE --- */}
        <div className="xl:col-span-2 space-y-6 md:space-y-8">
           <div className="rounded-3xl md:rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
              {/* Original User Message Section */}
              <div className="p-6 md:p-8 border-b border-border/40 bg-muted/20">
                 <div className="flex items-center gap-3 mb-4">
                    <History className="h-4 w-4 text-primary" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Original Manifest</h3>
                 </div>
                 <div className="space-y-4">
                    <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-tight">{ticket.subject}</p>
                    <div className="p-5 md:p-6 rounded-2xl bg-background/50 border border-border/40 italic text-xs md:text-sm text-foreground/80 leading-relaxed shadow-inner">
                       "{ticket.message}"
                    </div>
                 </div>
              </div>

              {/* Input Area */}
              <div className="p-6 md:p-10 space-y-6 md:space-y-8">
                 <div className="flex items-center gap-3">
                    <Terminal className="h-4 w-4 text-primary" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">Response Console</h3>
                 </div>

                 <div className="space-y-4">
                    <Textarea 
                       placeholder="EXECUTE RESPONSE COMMAND..."
                       className="min-h-[200px] md:min-h-[250px] rounded-2xl md:rounded-[2rem] border-border/40 bg-muted/10 p-6 md:p-8 font-medium text-xs md:text-sm leading-relaxed focus:ring-primary/20 transition-all resize-none shadow-inner"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2">
                       <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-30">
                          Automated formatting applied via Zipha Core.
                       </p>
                       <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground opacity-30" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Est. Delivery: 120ms</span>
                       </div>
                    </div>
                 </div>

                 <div className="pt-4">
                    <Button className="w-full h-16 md:h-20 rounded-2xl md:rounded-[2rem] bg-primary text-primary-foreground font-black uppercase italic tracking-[0.15em] text-[11px] md:text-sm shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-95 group">
                       <Send className="mr-3 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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