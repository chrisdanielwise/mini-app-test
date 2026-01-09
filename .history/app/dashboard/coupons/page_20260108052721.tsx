import { requireMerchantSession } from "@/lib/auth/merchant-auth"
import { MerchantService } from "@/lib/services/merchant.service"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  Tag, 
  Ticket, 
  Calendar, 
  Users, 
  MoreHorizontal 
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default async function CouponsPage() {
  const session = await requireMerchantSession()
  const coupons = await MerchantService.getCoupons(session.merchant.id)

  return (
    <div className="space-y-6 p-6 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">Coupons</h1>
          <p className="text-sm text-muted-foreground">Manage discounts and promotional offers.</p>
        </div>
        <Button className="rounded-xl font-bold">
          <Plus className="mr-2 h-4 w-4" /> Create Coupon
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <Ticket className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">Active Coupons</p>
              <p className="text-2xl font-black">{coupons.filter(c => c.isActive).length}</p>
            </div>
          </div>
        </div>
        {/* Additional Stats cards can be added here */}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold uppercase text-[10px]">Code</TableHead>
              <TableHead className="font-bold uppercase text-[10px]">Discount</TableHead>
              <TableHead className="font-bold uppercase text-[10px]">Uses</TableHead>
              <TableHead className="font-bold uppercase text-[10px]">Expiry</TableHead>
              <TableHead className="font-bold uppercase text-[10px]">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                  No coupons created yet.
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono font-bold text-primary">
                    {coupon.code}
                  </TableCell>
                  <TableCell>
                    {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `$${coupon.value}`} OFF
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {coupon.useCount} / {coupon.maxUses || "∞"}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {coupon.expiresAt ? format(new Date(coupon.expiresAt), "MMM dd, yyyy") : "Never"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={coupon.isActive ? "default" : "secondary"}>
                      {coupon.isActive ? "ACTIVE" : "EXPIRED"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}