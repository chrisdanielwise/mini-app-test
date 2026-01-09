import { requireMerchantSession } from "@/lib/auth/merchant-auth"
import { MerchantService } from "@/lib/services/merchant.service"
import { Button } from "@/components/ui/button"
import { Search, Filter, MoreHorizontal, UserCheck, UserMinus, Clock } from "lucide-react"
import Link from "next/link" // ✅ Added missing import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"

/**
 * Merchant Subscribers Management Page
 * Handles high-volume data with Prisma 7 optimized queries
 */
export default async function SubscribersPage() {
  const session = await requireMerchantSession()

  // 1. Fetch subscribers with initial limit
  const { subscriptions, total } = await MerchantService.getSubscribers(session.merchant.id, {
    limit: 50,
    offset: 0
  })

  return (
    <div className="space-y-6 p-6 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">Subscribers</h1>
          <p className="text-sm text-muted-foreground">
            Total Audience: <span className="font-black text-primary">{total}</span> Active Users
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, username or ID..."
            className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-11 rounded-xl px-4 font-bold border-border bg-card">
            <Filter className="mr-2 h-4 w-4" />
            Filter Status
          </Button>
        </div>
      </div>

      {/* Subscribers Table Container */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-6 py-4 font-bold uppercase text-[10px] text-muted-foreground">User Profile</th>
                <th className="px-6 py-4 font-bold uppercase text-[10px] text-muted-foreground">Service / Plan</th>
                <th className="px-6 py-4 font-bold uppercase text-[10px] text-muted-foreground">Status</th>
                <th className="px-6 py-4 font-bold uppercase text-[10px] text-muted-foreground">Subscribed Since</th>
                <th className="px-6 py-4 text-right font-bold uppercase text-[10px] text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <UserMinus className="h-10 w-10 text-muted-foreground" />
                      <p className="text-lg font-black uppercase italic">No subscribers found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shadow-inner">
                          <span className="text-xs font-black uppercase">
                            {(sub.user.fullName || sub.user.username || "U").charAt(0)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold leading-none uppercase">{sub.user.fullName || "User"}</p>
                          <p className="mt-1 text-xs text-muted-foreground font-medium">
                            {sub.user.username ? `@${sub.user.username}` : `ID: ${sub.user.telegramId}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold uppercase text-foreground">{sub.service?.name || "Global"}</span>
                        <span className="text-[10px] font-bold text-muted-foreground italic">{sub.serviceTier?.name || "Standard Tier"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase border ${
                          sub.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : sub.status === "CANCELLED"
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                              : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                        }`}
                      >
                        {sub.status === "ACTIVE" && <UserCheck className="h-3 w-3" />}
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs">{formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] rounded-xl shadow-xl border-border">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/subscribers/${sub.id}`} className="font-bold py-2.5">View Growth Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="font-bold py-2.5">Message User</DropdownMenuItem>
                          <div className="h-px bg-border my-1" />
                          <DropdownMenuItem className="text-destructive font-black py-2.5 focus:text-destructive">
                            Terminate Access
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
  )
}