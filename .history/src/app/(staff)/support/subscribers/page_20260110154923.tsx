import { getMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import { , MoreHorizontal, Calendar, Zap, Search } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";

/**
 * 👥 SUBSCRIBERS LEDGER
 * Administrative node for verifying and managing membership protocols.
 */
export default async function SubscribersPage() {
  // 🔐 1. Identity Handshake (Aligned with fixed session utility)
  const session = await getMerchantSession();
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect("/dashboard/login?reason=unauthorized");
  }

  // 🏁 2. Data Fetch: Live subscription nodes
  const subscriptions = await prisma.subscription.findMany({
    where: { 
      service: { 
        merchantId: session.merchantId // ✅ Alignment fix: session.merchantId
      } 
    },
    include: {
      adminUser: { // ✅ Relation fix: matching your User relation name 'adminUser'
        select: {
          id: true,
          fullName: true,
          telegramId: true,
          username: true
        }
      },
      service: true,
      tier: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 p-6 pb-32 animate-in fade-in duration-700">
      {/* --- HUD HEADER & SEARCH --- */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Subscriber Base</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
            Cluster Integrity: {subscriptions.length} Linked Nodes
          </p>
        </div>
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="IDENTITY SEARCH..." 
            className="pl-11 h-14 rounded-[1.25rem] bg-card/50 border-border/40 focus:ring-primary/10 transition-all font-black uppercase italic text-[10px] tracking-widest shadow-inner"
          />
        </div>
      </div>

      {/* --- DATABASE CONTAINER --- */}
      <div className="rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/20 border-b border-border/40">
              <tr>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Identity</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Assigned Service</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Expiration</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-muted-foreground italic uppercase text-[10px] font-black tracking-[0.2em]">
                    No active membership protocols found.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/5 transition-colors group">
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-xs text-primary italic">
                          {(sub.adminUser?.fullName || "U").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm tracking-tight">{sub.adminUser?.fullName || "Verified User"}</span>
                          <Badge variant="secondary" className="w-fit text-[8px] font-black px-1.5 py-0 mt-1 uppercase tracking-tighter bg-emerald-500/10 text-emerald-500">
                            {sub.status}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                       <div className="flex items-center gap-3">
                         <Zap className="h-3.5 w-3.5 text-primary" />
                         <div className="flex flex-col">
                           <span className="text-xs font-black uppercase italic tracking-tight">{sub.service.name}</span>
                           <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{sub.tier?.name}</span>
                         </div>
                       </div>
                    </td>
                    <td className="px-8 py-7">
                       <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 opacity-40" />
                          <span className="text-[10px] font-black uppercase tracking-widest italic">
                            {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : 'LIFETIME_NODE'}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-7 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-muted/20 hover:bg-primary/10 transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] p-2 shadow-2xl border-border/40 bg-card/95 backdrop-blur-2xl">
                          <DropdownMenuItem className="rounded-xl font-bold uppercase text-[10px] py-3 cursor-pointer">
                            View Payment Ledger
                          </DropdownMenuItem>
                          <div className="h-px bg-border/40 my-2 mx-2" />
                          <DropdownMenuItem className="rounded-xl text-destructive font-black uppercase text-[10px] py-3 cursor-pointer focus:bg-destructive/10">
                            Revoke Protocol Access
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