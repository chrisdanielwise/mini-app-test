import { requireMerchantSession } from "@/lib/auth/merchant-auth"
import { MerchantService } from "@/lib/services/merchant.service"
import { Button } from "@/components/ui/button"
import { Search, Filter, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"

export default async function SubscribersPage() {
  const session = await requireMerchantSession()
  const { subscriptions, total } = await MerchantService.getSubscribers(session.merchant.id, { limit: 50 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subscribers</h1>
          <p className="text-muted-foreground">
            {total} total subscriber{total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search subscribers..."
            className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Service</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Tier</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Subscribed</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                        <span className="text-sm font-medium">
                          {(sub.user.fullName || sub.user.username || "U").charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{sub.user.fullName || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">
                          @{sub.user.username || sub.user.telegramId.toString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{sub.service?.name || "—"}</td>
                  <td className="px-6 py-4">{sub.serviceTier?.name || "—"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        sub.status === "ACTIVE"
                          ? "bg-green-500/10 text-green-500"
                          : sub.status === "CANCELLED"
                            ? "bg-red-500/10 text-red-500"
                            : sub.status === "PAUSED"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-gray-500/10 text-gray-500"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Extend Subscription</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Cancel Subscription</DropdownMenuItem>
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
  )
}
