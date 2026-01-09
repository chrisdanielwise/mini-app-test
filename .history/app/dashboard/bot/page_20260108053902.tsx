import { requireMerchantSession } from "@/lib/auth/merchant-auth"
import { MerchantService } from "@/lib/services/merchant.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Bot, 
  ShieldCheck, 
  RefreshCcw, 
  ExternalLink, 
  Key, 
  Globe 
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function BotConfigPage() {
  const session = await requireMerchantSession()
  const merchant = await MerchantService.getById(session.merchant.id)

  if (!merchant) return <div>Merchant not found</div>

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">Bot Config</h1>
          <p className="text-sm text-muted-foreground">Manage your Telegram API credentials and webhook status.</p>
        </div>
        <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500 px-3 py-1 font-bold">
          WEBHOOK ACTIVE
        </Badge>
      </div>

      <div className="grid gap-8">
        {/* API Credentials Card */}
        <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border bg-muted/20 p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-tight">
              <Key className="h-5 w-5 text-primary" />
              API Credentials
            </h2>
          </div>
          <div className="p-6">
            <form action={updateBotConfigAction} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="botUsername">Bot Username</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-muted-foreground font-bold">@</span>
                    <Input 
                      id="botUsername" 
                      name="botUsername" 
                      defaultValue={merchant.botUsername} 
                      placeholder="zipha_signals_bot"
                      className="h-11 rounded-xl pl-8 font-bold" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="botToken">Telegram Bot Token</Label>
                  <Input 
                    id="botToken" 
                    name="botToken" 
                    type="password"
                    defaultValue={merchant.botToken} 
                    placeholder="123456:ABC-DEF..."
                    className="h-11 rounded-xl font-mono" 
                  />
                </div>
              </div>
              <Button type="submit" className="rounded-xl font-bold px-8">
                <RefreshCcw className="mr-2 h-4 w-4" /> Update Bot Credentials
              </Button>
            </form>
          </div>
        </div>

        {/* Connection Health */}
        <div className="rounded-3xl border border-border bg-muted/30 p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-card border border-border flex items-center justify-center">
                <Bot className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Telegram Connection</p>
                <p className="text-lg font-black text-foreground">@{merchant.botUsername || "Unlinked"}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl font-bold bg-card border-border" asChild>
                <a href={`https://t.me/${merchant.botUsername}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Open Bot
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}