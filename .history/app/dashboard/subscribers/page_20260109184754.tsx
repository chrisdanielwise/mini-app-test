import { requireMerchantSession } from "@/src/lib/auth/merchant-auth";
import prisma from "@/src/lib/db";
import { Button } from "@/components/ui/button";
import { Users, MoreHorizontal, Calendar, Zap, Search } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

/**
 * 👥 SUBSCRIBERS LEDGER
 * Unified view of all active and historical signal memberships.
 */
export default async function SubscribersPage() {
  const session = await requireMerchantSession();

  // 🏁 Fetch all subscriptions linked to this merchant's services
  const subscriptions = await prisma.subscription.findMany({
    where: {
      service: {
        merchantId: session.merchant.id
      }
    },
    include: {
      user: true,
      service: true,
      tier: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-6 p-6 pb-20 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Subscribers</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Identity Management: {subscriptions.length} Total Records
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input 
            placeholder="Search by Telegram ID..." 
            className="rounded-2xl pl-10 border-muted bg-card h-12 text-[10px] font-bold uppercase"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest">User Profile</th>
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest">Signal / Tier</th>
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest">Status</th>
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest">Expiry</th>
                <th className="px-6 py-4 text-right font-black uppercase text-[10px] text-muted-foreground tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="h-10 w-10 text-muted-foreground/20" />
                      <p className="text-xs font-black uppercase italic text-muted-foreground">The ledger is currently empty.</p>
                      <p className="text-[9px] font-bold uppercase text-muted-foreground opacity-50">Subscribers will appear here once payment links are generated.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-all duration-200">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <p className="font-black text-foreground uppercase italic tracking-tight">@{sub.user.username || 'unknown'}</p>
                        <p className="text-[9px] font-mono text-muted-foreground opacity-70">{sub.user.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <p className="text-[10px] font-black uppercase text-primary">{sub.service.name}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{sub.tier.name} Plan</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter ${
                        sub.status === 'ACTIVE' 
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                        : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 h-3 text-muted-foreground" />
                        <span className="font-black text-[10px] uppercase">
                          {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : 'LIFETIME'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl bg-muted/50">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] rounded-2xl border-border p-2">
                          <DropdownMenuItem className="rounded-xl font-bold uppercase text-[10px] py-3 cursor-pointer">
                            View Payment History
                          </DropdownMenuItem>
                          <div className="h-px bg-border my-2" />
                          <DropdownMenuItem className="rounded-xl text-destructive font-black uppercase text-[10px] py-3 cursor-pointer focus:text-destructive">
                            Revoke Access
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