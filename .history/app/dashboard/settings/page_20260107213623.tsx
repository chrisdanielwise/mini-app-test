import { requireMerchantSession } from "@/lib/auth/merchant-auth"
import { MerchantService } from "@/lib/services/merchant.service"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export default async function SettingsPage() {
  const session = await requireMerchantSession()
  const merchant = await MerchantService.getById(session.merchant.id)

  if (!merchant) {
    return <div>Merchant not found</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your merchant profile and preferences</p>
      </div>

      <div className="max-w-2xl space-y-8">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Business Information</h2>
          <form className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Company Name</label>
              <input
                type="text"
                name="companyName"
                defaultValue={merchant.companyName}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Support URL</label>
              <input
                type="url"
                name="contactSupportUrl"
                defaultValue={merchant.contactSupportUrl || ""}
                placeholder="https://t.me/your_support"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="mt-1 text-sm text-muted-foreground">Link to your support channel or website</p>
            </div>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </form>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Bot Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Bot Username</label>
              <input
                type="text"
                value={merchant.botUsername || "Not configured"}
                disabled
                className="h-10 w-full rounded-md border border-border bg-muted px-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Bot Status</label>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    merchant.provisioningStatus === "READY" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
                <span className="text-sm">
                  {merchant.provisioningStatus === "READY" ? "Online" : merchant.provisioningStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-destructive/50 bg-card p-6">
          <h2 className="mb-2 text-lg font-semibold text-destructive">Danger Zone</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Permanently delete your merchant account and all associated data.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </div>
    </div>
  )
}
