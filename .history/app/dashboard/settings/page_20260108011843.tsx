import { requireMerchantSession } from "@/lib/auth/merchant-auth"
import { MerchantService } from "@/lib/services/merchant.service"
import { Button } from "@/components/ui/button"
import { Save, Bot, Trash2, Globe, Building2, ExternalLink } from "lucide-react"
import { revalidatePath } from "next/cache"

/**
 * Server Action to update merchant settings
 */
async function updateMerchantAction(formData: FormData, merchantId: string) {
  "use server"
  
  const companyName = formData.get("companyName") as string
  const contactSupportUrl = formData.get("contactSupportUrl") as string

  await MerchantService.update(merchantId, {
    companyName,
    contactSupportUrl,
  })

  revalidatePath("/dashboard/settings")
}

export default async function SettingsPage() {
  const session = await requireMerchantSession()
  
  // Merchant ID is already validated inside the Service layer
  const merchant = await MerchantService.getById(session.merchant.id)

  if (!merchant) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
        <Building2 className="h-10 w-10 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Account not found</h2>
        <p className="text-muted-foreground">Please contact support if this persists.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your merchant profile and technical configuration.</p>
      </div>

      <div className="grid gap-8">
        {/* Business Information Section */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Building2 className="h-5 w-5 text-primary" />
              Business Information
            </h2>
          </div>
          <div className="p-6">
            <form action={async (fd) => {
              "use server"
              await updateMerchantAction(fd, merchant.id)
            }} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    defaultValue={merchant.companyName}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Support / Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="url"
                      name="contactSupportUrl"
                      defaultValue={merchant.contactSupportUrl || ""}
                      placeholder="https://t.me/your_support"
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Business Profile
              </Button>
            </form>
          </div>
        </div>

        {/* Bot Configuration Section */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Bot className="h-5 w-5 text-primary" />
              Telegram Bot Status
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Active Bot</p>
                <p className="text-sm text-muted-foreground">
                  @{merchant.botUsername || "not_linked"}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={`https://t.me/${merchant.botUsername}`} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Bot
                </a>
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Provisioning Status</span>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    merchant.provisioningStatus === "READY" ? "bg-emerald-500 animate-pulse" : "bg-orange-500"
                  }`}
                />
                <span className="text-sm font-medium capitalize">
                  {merchant.provisioningStatus === "READY" ? "Connected" : merchant.provisioningStatus.toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
              <p className="text-sm text-muted-foreground">
                Permanently delete your merchant profile, all services, and transaction history. This action cannot be undone.
              </p>
            </div>
            <Button variant="destructive" className="shrink-0">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}