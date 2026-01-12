import { requireMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  Terminal, 
  User, 
  Send, 
  Bot,
  History,
  Clock,
  Globe
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * 🛰️ SUPPORT RESPONSE TERMINAL (Tactical Medium)
 * Normalized: World-standard fluid scaling for high-resiliency support nodes.
 * Optimized: Resilient grid geometry to prevent horizontal cropping.
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

  // 🏁 1. Fetch Ticket & User Context
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
            include: { service: true, serviceTier: true }
          }
        }
      }
    }
  });

  if (!ticket) return notFound();

  const activeSub = ticket.user.subscriptions[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 px-4">
      
      {/* --- COMMAND HUD HEADER: TACTICAL SYNC --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <Link
            href="/dashboard/support"
            className="group inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Support Ledger
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">
              Ticket <span className="text-primary">Resolution</span>
            </h1>
            <Badge variant="outline" className="rounded-lg text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-primary/20 bg-primary/5 text-primary">
              ID: {ticket.id.slice(0, 8)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* --- LEFT: IDENTITY MANIFEST --- */}
        <div className="space-y-6">
           <div className="rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-3xl shadow-xl space-y-6">
              <div className="flex items-center gap-2 text-muted-foreground/40">
                 <User className="h-3.5 w-3.5" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest leading-none">Identity Node</h3>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black italic border border-primary/20 shadow-inner">
                       {ticket.user.username?.[0].toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                       <p className="text-base md:text-lg font-black uppercase italic tracking-tight truncate leading-none">
                         @{ticket.user.username || "unknown"}
                       </p>
                       <p className="text-[8px] font-mono font-bold opacity-30 tracking-widest mt-1">
                         UID: {ticket.user.id.toString().slice(-12)}
                       </p>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-border/10 space-y-3">
                    <div className="flex justify-between items-center">
                       <span className="text-[8px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Status</span>
                       <Badge className="rounded-lg text-[8px] font-black uppercase px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border-none">
                          {activeSub ? "ACTIVE_NODE" : "UNBOUND"}
                       </Badge>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                       <span className="text-[8px] font-black uppercase text-muted-foreground opacity-40 tracking-widest shrink-0">Access</span>
                       <span className="text-[9px] font-black uppercase italic tracking-widest truncate text-right">{activeSub?.service.name || "N/A"}</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="rounded-2xl border border-border/10 bg-primary/5 p-6 relative overflow-hidden shadow-inner">
              <Bot className="absolute -bottom-2 -right-2 h-16 w-16 opacity-[0.05] rotate-12" />
              <div className="relative z-10 space-y-2">
                 <h4 className="text-[9px] font-black uppercase tracking-widest text-primary leading-none">Delivery Protocol</h4>
                 <p className="text-[9px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest opacity-40 italic">
                    Response delivered via <span className="text-primary">Bot Node</span>. Handshake will transition node to <span className="text-foreground">RESOLVED</span>.
                 </p>
              </div>
           </div>
        </div>

        {/* --- RIGHT: RESOLUTION CONSOLE --- */}
        <div className="lg:col-span-2 space-y-6">
           <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-xl">
              {/* Original User Message Section */}
              <div className="p-6 border-b border-border/10 bg-muted/10">
                 <div className="flex items-center gap-2 mb-3">
                    <History className="h-3.5 w-3.5 text-primary/60" />
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Original Manifest</h3>
                 </div>
                 <div className="space-y-3">
                    <p className="text-lg md:text-xl font-black uppercase italic tracking-tight leading-none text-foreground">{ticket.subject}</p>
                    <div className="p-4 rounded-xl bg-background/50 border border-border/10 italic text-[11px] md:text-xs text-foreground/70 leading-relaxed shadow-inner">
                       "{ticket.message}"
                    </div>
                 </div>
              </div>

              {/* Input Area: Tactical Sync */}
              <div className="p-6 md:p-8 space-y-6">
                 <div className="flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 text-primary/60" />
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none">Response Console</h3>
                 </div>

                 <div className="space-y-3">
                    <Textarea 
                       placeholder="EXECUTE RESPONSE COMMAND..."
                       className="min-h-[160px] md:min-h-[180px] rounded-xl border-border/40 bg-muted/10 p-5 font-bold text-[11px] md:text-xs leading-relaxed focus:ring-primary/20 transition-all resize-none shadow-inner"
                    />
                    <div className="flex items-center justify-between gap-2 px-1">
                       <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-20 italic">
                          Automated signal formatting active.
                       </p>
                       <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground opacity-20" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30">Est. Latency: 120ms</span>
                       </div>
                    </div>
                 </div>

                 <div className="pt-2">
                    <Button className="w-full h-12 md:h-14 rounded-xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[10px] md:text-[11px] shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all group">
                       <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                       Deploy Response
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* FOOTER SIGNAL */}
      <div className="flex items-center justify-center gap-3 opacity-20 py-4">
         <Globe className="h-3 w-3 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground italic text-center leading-none">
           Support Core synchronized // Node_Ref_{ticket.id.slice(0, 8)}
         </p>
      </div>
    </div>
  );
}