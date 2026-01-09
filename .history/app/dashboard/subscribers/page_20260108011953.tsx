import { requireMerchantSession } from "@/lib/auth/merchant-auth"
import { MerchantService } from "@/lib/services/merchant.service"
import { Button } from "@/components/ui/button"
import { Search, Filter, MoreHorizontal, UserCheck, UserMinus, Clock } from "lucide-react"
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
  // MerchantService already handles BigInt to String conversion for user.telegramId
  const { subscriptions, total } = await MerchantService.getSubscribers(session.merchant.id, {
    limit: 50,
    offset: 0
  })

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscribers</h1>
          <p className="text-sm text-muted-foreground">
            You have <span className="font-medium text-foreground">{total}</span> total subscriber{total !== 1 ? "s" : ""}
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
            className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter Status
          </Button>
        </div>
      </div>

      {/* Subscribers Table Container */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-6 py-4 font-medium text-muted-foreground">User Profile</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Service / Plan</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Subscribed Since</th>
                <th className="px-6 py-4 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <UserMinus className="h-10 w-10" />
                      <p className="text-lg font-medium">No subscribers found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                          <span className="text-xs font-bold uppercase">
                            {(sub.user.fullName || sub.user.username || "U").charAt(0)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-semibold leading-none">{sub.user.fullName || "User"}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {sub.user.username ? `@${sub.user.username}` : `ID: ${sub.user.telegramId}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{sub.service?.name || "Global"}</span>
                        <span className="text-xs text-muted-foreground">{sub.serviceTier?.name || "Standard Tier"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${sub.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : sub.status === "CANCELLED"
                              ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                              : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                          }`}
                      >
                        {sub.status === "ACTIVE" && <UserCheck className="h-3 w-3" />}
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/subscribers/${sub.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Message User</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
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