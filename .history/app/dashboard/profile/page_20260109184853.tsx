import { requireMerchantSession } from "@/src/lib/auth/merchant-auth"
import { MerchantService } from "@/src/lib/services/merchant.service"
import { Button } from "@/src/components/ui/button"
import { User, Mail, ShieldCheck, Key, LogOut } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"

export default async function MerchantProfilePage() {
  // 1. Auth Guard for Admin access
  const session = await requireMerchantSession()
  
  // 2. Fetch the Merchant's personal account data
  const merchant = await MerchantService.getById(session.merchant.id)

  if (!merchant) return <div>Account not found</div>

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Profile</h1>
        <p className="text-muted-foreground italic">Manage your administrative identity.</p>
      </div>

      <div className="grid gap-6">
        {/* Personal Details Section */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold mb-6">
            <User className="h-5 w-5 text-primary" />
            Personal Information
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={session.user?.fullName || "Merchant Admin"} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input defaultValue={session.user?.email || ""} className="h-11 rounded-xl pl-10" disabled />
              </div>
            </div>
          </div>
        </div>

        {/* Security / Role Section */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Access Level
          </h2>
          <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
            <div>
              <p className="text-sm font-bold uppercase text-muted-foreground">Current Role</p>
              <p className="font-black italic text-primary">MERCHANT_OWNER</p>
            </div>
            <Button variant="outline" className="rounded-xl gap-2">
              <Key className="h-4 w-4" />
              Change Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}