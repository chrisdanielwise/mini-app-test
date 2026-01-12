import { requireMerchantSession } from "@/src/lib/auth/merchant-auth"
import { MerchantService } from "@/src/lib/services/merchant.service"
import { Button } from "@/src/components/ui/button"
import { 
  CreditCard, 
  CheckCircle2, 
  Zap, 
  Clock, 
  ArrowUpRight 
} from "lucide-react"
import { Badge } from "@/src/components/ui/badge"

export default async function BillingPage() {
  const session = await requireMerchantSession()
  const merchant = await MerchantService.getById(session.merchant.id)

  const currentPlan = merchant?.planStatus || "Starter"

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 pb-20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">Billing & Plan</h1>
          <p className="text-muted-foreground">Manage your Zipha platform subscription.</p>
        </div>
        <Badge variant="outline" className="w-fit border-primary/30 bg-primary/5 px-4 py-1 text-primary">
          <Clock className="mr-2 h-3 w-3" />
          Next billing: Feb 08, 2026
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Current Plan Card */}
        <div className="md:col-span-2 rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-start justify-between mb-8">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Plan</p>
              <h2 className="text-4xl font-black text-primary italic uppercase">{currentPlan}</h2>
            </div>
            <div className="rounded-2xl bg-primary/10 p-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mb-8">
            {[
              "Up to 500 Subscribers",
              "Unlimited Signal Services",
              "Custom Bot Branding",
              "Priority Merchant Support"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-6 border-t border-border">
            <Button className="rounded-xl font-bold px-6">Change Plan</Button>
            <Button variant="outline" className="rounded-xl font-bold px-6">View Invoices</Button>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="rounded-3xl border border-border bg-muted/30 p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Payment Method
            </h3>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Visa ending in</p>
              <p className="font-mono font-bold tracking-tighter">•••• 4242</p>
            </div>
          </div>
          <Button variant="link" className="text-primary font-bold p-0 h-auto justify-start">
            Update Card <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}