import { requireMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Users, MoreHorizontal, Calendar, Zap, Search, ShieldCheck } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/**
 * 👥 SUBSCRIBERS LEDGER
 * Administrative node for verifying and managing membership protocols.
 */
export default async function SubscribersPage() {
  const session = await requireMerchantSession();

  // 🏁 1. Fetch live subscription nodes
  const subscriptions = await prisma.subscription.findMany({
    where: { service: { merchantId: session.merchant.id } },
    include: {
      user: true,
      service: true,
      tier: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 p-6 pb-32 animate-in fade-in duration-700">
      {/* Command Header & Search Tool */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Subscriber Base</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Cluster Integrity: {subscriptions.length} Linked Nodes
          </p>
        </div>
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Identity Search (Name, ID)..." 
            className="pl-11 h-14 rounded-[1.25rem] bg-card border-border/50 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>

      {/* Database Container */}
      <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-muted/20 border-b border-border">
            <tr>
              <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Identity</th>
              <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Assigned Service</th>
              <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Expiration</th>
              <th className="px-8 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-muted/10 transition-colors group">
                <td className="px-8 py-7">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted border border-border flex items-center justify-center font-black text-xs opacity-60">
                      {(sub.user.fullName || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{sub.user.fullName || "Verified User"}</span>
                      <Badge variant="secondary" className="w-fit text-[8px] font-black px-1.5 py-0 mt-0.5">
                        {sub.status}
                      </Badge>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-7">
                   <div className="flex items-center gap-2">
                     <Zap className="h-3.5 w-3.5 text-primary" />
                     <span className="text-xs font-bold">{sub.service.name}</span>
                     <span className="text-[10px] text-muted-foreground opacity-50">• {sub.tier?.name}</span>
                   </div>
                </td>
                <td className="px-8 py-7">
                   <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : 'LIFETIME'}
                      </span>
                   </div>
                </td>
                <td className="px-8 py-7 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-muted/40 hover:bg-primary/10 transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] p-2 shadow-2xl border-border/50">
                      <DropdownMenuItem className="rounded-xl font-bold uppercase text-[10px] py-3 cursor-pointer">
                        View Payment Protocol
                      </DropdownMenuItem>
                      <div className="h-px bg-border my-2 mx-2" />
                      <DropdownMenuItem className="rounded-xl text-destructive font-black uppercase text-[10px] py-3 cursor-pointer focus:bg-destructive/10">
                        Revoke Access Node
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}