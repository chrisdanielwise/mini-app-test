import { requireMerchantSession } from "@/lib/auth/merchant-auth"
import { ServiceService } from "@/lib/services/service.service"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal, Users, DollarSign, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

/**
 * Merchant Services Dashboard Page
 * Updated for Prisma 7 and Next.js 15+ Async Params
 */
export default async function ServicesPage() {
  // 1. Ensure the merchant is authenticated
  const session = await requireMerchantSession()
  
  // 2. Fetch services using the secure UUID-validated service
  const services = await ServiceService.getByMerchant(session.merchant.id)

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage your subscription services and tiers</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Service
          </Link>
        </Button>
      </div>

      {/* Services Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-6 py-4 font-medium text-muted-foreground">Service Name</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Active Subscribers</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Pricing Tiers</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ShieldAlert className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No services found. Start by creating one.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-foreground">{service.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {service.shortDescription || "No description"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {service._count?.subscriptions || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium">
                          {/* Logic: Display price range of the tiers.
                            Service tiers price is already converted to string by the service.
                          */}
                          {service.tiers.length > 0 
                            ? `${service.tiers.length} Tiers` 
                            : "No Tiers Set"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          service.isActive 
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                            : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                        }`}
                      >
                        {service.isActive ? "Live" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/services/${service.id}`}>
                              Edit Service
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/subscribers?serviceId=${service.id}`}>
                              View Subscribers
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Archive Service
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