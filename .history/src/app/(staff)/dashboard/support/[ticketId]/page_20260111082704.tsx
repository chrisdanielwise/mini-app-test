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
  Globe,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * 🛰️ TICKET RESOLUTION TERMINAL (Tactical Medium)
 * Path: /dashboard/support/[ticketId]
 * Logic: Role-Based Response Console for Centralized Platform Support.
 */
export default async function TicketResponsePage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  // 🔐 Identity Handshake
  const session = await requireMerchantSession();
  const { ticketId } = await params;
  const { role, merchantId: sessionMerchantId } = session.user;

  // 🛡️ ROLE DETERMINATION
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);

  // 🏁 1. Fetch Ticket & Context
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      user: true,
      merchant: { select: { companyName: true, id: true } }
    }
  });

  if (!ticket) return notFound();

  // 🛡️ SECURITY AUDIT: Ensure merchants can't peek at other merchants' tickets
  if (!isPlatformStaff && ticket.merchantId !== sessionMerchantId) {
    return notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 px-4">
      
      {/* --- COMMAND HUD HEADER --- */}
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
                       <p className="text-[8px] font-mono font-bold opacity-30 tracking-widest mt-1 uppercase">
                         Origin: {ticket.merchant?.companyName || "ROOT"}
                       </p>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-border/10 space-y-3">
                    <div className="flex justify-between items-center">
                       <span className="text-[8px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">Protocol Status</span>
                       <Badge className={cn(
                          "rounded-lg text-[8px] font-black uppercase px-2 py-0.5 border-none",
                          ticket.status === 'OPEN' ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                       )}>
                          {ticket.status}
                       </Badge>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                       <span className="text-[8px] font-black uppercase text-muted-foreground opacity-40 tracking-widest shrink-0">Priority</span>
                       <span className="text-[9px] font-black uppercase italic tracking-widest truncate text-right text-foreground">{ticket.priority}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Role Context Notification */}
           {!isPlatformStaff && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-2">
                <div className="flex items-center gap-2 text-amber-500">
                   <AlertCircle className="h-3.5 w-3.5" />
                   <h4 className="text-[9px] font-black uppercase tracking-widest leading-none">Audit Notification</h4>
                </div>
                <p className="text-[9px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest opacity-60 italic">
                  Merchant access is restricted to <span className="text-amber-500">Read-Only</span>. Platform staff are managing this intervention.
                </p>
              </div>
           )}
        </div>

        {/* --- RIGHT: RESOLUTION CONSOLE --- */}
        <div className="lg:col-span-2 space-y-6">
           <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-xl">
              {/* Original User Message Section */}
              <div className="p-6 border-b border-border/10 bg-muted/10">
                 <div className="flex items-center gap-2 mb-3">
                    <History className="h-3.5 w-3.5 text-primary/60" />
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Inquiry Manifest</h3>
                 </div>
                 <div className="space-y-3">
                    <p className="text-lg md:text-xl font-black uppercase italic tracking-tight leading-none text-foreground">{ticket.subject}</p>
                    {/* Placeholder for ticket message content from your schema */}
                    <div className="p-4 rounded-xl bg-background/50 border border-border/10 italic text-[11px] md:text-xs text-foreground/70 leading-relaxed shadow-inner">
                       "Node reports access failure on VIP cluster after payment validation. Manual handshake requested."
                    </div>
                 </div>
              </div>

              {/* Input Area: Gated by isPlatformStaff */}
              <div className="p-6 md:p-8 space-y-6">
                 {isPlatformStaff ? (
                   <>
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
                              Telegram Signal formatting active.
                           </p>
                           <div className="flex items-center gap-2">
                              <ShieldCheck className="h-3 w-3 text-primary opacity-40" />
                              <span className="text-[8px] font-black uppercase tracking-widest text-primary/40 italic">Staff ID: {session.user.role}</span>
                           </div>
                        </div>
                     </div>

                     <div className="pt-2">
                        <Button className="w-full h-12 md:h-14 rounded-xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[10px] md:text-[11px] shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all group">
                           <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                           Deploy Response
                        </Button>
                     </div>
                   </>
                 ) : (
                   <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                      <Bot className="h-12 w-12" />
                      <p className="text-xs font-black uppercase tracking-[0.2em] italic max-w-xs leading-relaxed">
                         The response terminal is locked for Merchant nodes. Platform intervention in progress.
                      </p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* FOOTER SIGNAL */}
      <div className="flex items-center justify-center gap-3 opacity-20 py-4">
         <Globe className="h-3 w-3 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground italic text-center leading-none">
           Centralized Resolution Core synchronized // Node_ID: {ticket.id.slice(0, 8)}
         </p>
      </div>
    </div>
  );
}