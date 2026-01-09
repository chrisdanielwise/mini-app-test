"use client"

import { requireMerchantSession } from "@/lib/auth/merchant-auth"
import { MerchantService } from "@/lib/services/merchant.service"
import { Button } from "@/components/ui/button"
import { Save, Bot, Trash2, Globe, Building2, ExternalLink } from "lucide-react"
import { revalidatePath } from "next/cache"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/**
 * 1. Server Action to update merchant settings
 */
async function updateMerchantAction(formData: FormData, merchantId: string) {
  "use server"

  const companyName = formData.get("companyName") as string
  const contactSupportUrl = formData.get("contactSupportUrl") as string

  // Prisma 7 Stability: Updates using validated ID
  await MerchantService.update(merchantId, {
    companyName,
    contactSupportUrl,
  })

  revalidatePath("/dashboard/settings")
}

// MUST be a default export for Next.js to register the route
export default async function SettingsPage() {
  // 2. Auth Guard
  const session = await requireMerchantSession()

  // 3. Fetch Merchant Data
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
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground italic">Manage your merchant profile and bot environment.</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Merchant ID</span>
          <p className="font-mono text-xs">{merchant.id}</p>
        </div>
      </div>

      <div className="grid gap-8">
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border bg-muted/20 p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-tight">
              <Building2 className="h-5 w-5 text-primary" />
              Business Profile
            </h2>
          </div>
          <div className="p-6">
            <form action={async (fd) => {
              "use server"
              await updateMerchantAction(fd, merchant.id)
            }} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Official Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    required
                    defaultValue={merchant.companyName}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactSupportUrl">Support / Bot Link</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactSupportUrl"
                      type="url"
                      name="contactSupportUrl"
                      defaultValue={merchant.contactSupportUrl || ""}
                      placeholder="https://t.me/your_support"
                      className="h-11 rounded-xl pl-10"
                    />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full sm:w-auto rounded-xl font-bold">
                <Save className="mr-2 h-4 w-4" />
                Update Settings
              </Button>
            </form>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border bg-muted/20 p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-tight">
              <Bot className="h-5 w-5 text-primary" />
              Telegram Infrastructure
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-5">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase text-muted-foreground">Connected Bot</p>
                <p className="text-lg font-black italic text-primary">
                  @{merchant.botUsername || "not_linked"}
                </p>
              </div>
              <Button variant="outline" className="rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10" asChild>
                <a href={`https://t.me/${merchant.botUsername}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Bot
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}