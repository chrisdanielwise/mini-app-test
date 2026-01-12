import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  User,
  ExternalLink
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

/**
 * 🎧 SUPPORT DESK: Operational Node
 * Gated interface for resolving subscriber technical issues.
 */
export default async function SupportPage() {
  // 🔐 1. Identity Handshake
  const session = await requireMerchantSession();

  // 🏁 2. Data Fetch: Inbox Ledger
  const tickets = await prisma.supportTicket.findMany({
    where: { merchantId: session.merchant.id },
    include: { user: true },
    orderBy: { updatedAt: 'desc' }
  });

  const openCount = tickets.filter(t => t.status === 'OPEN').length;

  return (
    <div className="space-y-8 p-6 pb-20 animate-in fade-in duration-700">
      {/* Command Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Protocol Support</h1>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={`${openCount > 0 ? "text-amber-500 border-amber-500/20 bg-amber-500/5" : "text-muted-foreground opacity-50"} uppercase font-black text-[9px]`}>
            {openCount} Pending Inquiries
          </Badge>
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            Node: {session.merchant.companyName}
          </span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Identity</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Issue Description</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-20 text-center text-muted-foreground italic uppercase text-xs font-bold">
                  Support Queue Is Currently Clear.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm leading-none">{ticket.user?.fullName || "Verified User"}</span>
                        <span className="text-[10px] text-muted-foreground">ID: {ticket.user?.telegramId?.toString() || "ANON"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 max-w-md">
                    <p className="text-xs font-medium line-clamp-2 opacity-80">{ticket.subject}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-tighter ${
                        ticket.status === 'RESOLVED' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {ticket.status === 'RESOLVED' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                        {ticket.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-muted/30 group-hover:bg-primary/10 transition-all">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] border-border/50 p-2 shadow-2xl bg-card/95 backdrop-blur-xl">
                        <DropdownMenuItem className="rounded-xl font-bold uppercase text-[10px] py-3 cursor-pointer">
                          <MessageSquare className="h-3.5 w-3.5 mr-2 text-primary" /> Reply via Telegram
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl font-bold uppercase text-[10px] py-3 cursor-pointer">
                          <ExternalLink className="h-3.5 w-3.5 mr-2 text-primary" /> View Account
                        </DropdownMenuItem>
                        <div className="h-px bg-border my-2 mx-2" />
                        <DropdownMenuItem className="rounded-xl text-emerald-500 font-black uppercase text-[10px] py-3 cursor-pointer focus:bg-emerald-500/10">
                          Resolve Ticket
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
  );
}