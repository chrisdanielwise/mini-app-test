import { requireMerchantSession } from "@/src/lib/auth/merchant-auth";
import prisma from "@/src/lib/db";
import { Button } from "@/src/components/ui/button";
import { MessageSquare, MoreHorizontal, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/src/components/ui/dropdown-menu";

/**
 * 🎧 SUPPORT DESK LEDGER
 * Manage subscriber inquiries and technical issues.
 */
export default async function SupportPage() {
  const session = await requireMerchantSession();

  // 🏁 Fetch tickets for this merchant's services
  const tickets = await prisma.supportTicket.findMany({
    where: { merchantId: session.merchant.id },
    include: {
      user: true,
    },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="space-y-6 p-6 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">Support Desk</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Inbox: {tickets.filter(t => t.status === 'OPEN').length} Unresolved Issues
          </p>
        </div>
      </div>

      {/* Tickets Ledger */}
      <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest text-center w-16">Priority</th>
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest">User Profile</th>
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest">Inquiry Subject</th>
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest">Status</th>
                <th className="px-6 py-4 text-right font-black uppercase text-[10px] text-muted-foreground tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500/20" />
                      <p className="text-xs font-black uppercase italic text-muted-foreground">Inbox Clear.</p>
                      <p className="text-[9px] font-bold uppercase text-muted-foreground opacity-50">No subscribers currently need assistance.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-muted/30 transition-all duration-200">
                    <td className="px-6 py-5 text-center">
                      {ticket.status === 'OPEN' ? (
                        <div className="h-2 w-2 rounded-full bg-primary mx-auto animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-muted mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <p className="font-black text-foreground uppercase italic tracking-tight">@{ticket.user.username || 'unknown'}</p>
                        <p className="text-[9px] font-mono text-muted-foreground opacity-70">UID: {ticket.user.id.toString().slice(-8)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-xs">
                      <div className="flex flex-col">
                        <p className="font-bold text-xs line-clamp-1 uppercase">{ticket.subject}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 italic">{ticket.message}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter ${
                        ticket.status === 'OPEN' 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      }`}>
                        {ticket.status === 'OPEN' ? <Clock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl bg-muted/50">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] rounded-2xl border-border p-2 shadow-xl">
                          <DropdownMenuItem className="rounded-xl font-bold uppercase text-[10px] py-3 cursor-pointer">
                            <MessageSquare className="h-3 w-3 mr-2" /> Reply via Bot
                          </DropdownMenuItem>
                          <div className="h-px bg-border my-2" />
                          <DropdownMenuItem className="rounded-xl text-emerald-500 font-black uppercase text-[10px] py-3 cursor-pointer focus:text-emerald-600 focus:bg-emerald-50">
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
    </div>
  );
}