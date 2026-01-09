import { requireMerchantSession } from "@/lib/auth/merchant-auth"
import { ServiceService } from "@/lib/services/service.service"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default async function ServicesPage() {
  const session = await requireMerchantSession()
  const services = await ServiceService.getByMerchant(session.merchant.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage your subscription services</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Service
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Service</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Subscribers</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Revenue</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No services yet. Create your first service to get started.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.tiers.length} tier(s)</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{service._count?.subscriptions || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>$0.00</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        service.isActive ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/services/${service.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Subscribers</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
