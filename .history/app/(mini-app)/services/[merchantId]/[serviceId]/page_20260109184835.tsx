"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useApi, apiPost } from "@/src/lib/hooks/use-api"
import { useTelegramContext } from "@/src/components/telegram/telegram-provider"
import { LoadingScreen } from "@/src/components/ui/loading-spinner"
import { TierSelector } from "@/src/components/mini-app/tier-selector"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { ArrowLeft, Shield, Clock, Users, Zap } from "lucide-react"

// Updated Interface: Prisma 7 Decimal returns as string for precision safety
interface ServiceData {
  merchant: {
    id: string
    companyName?: string
    botUsername?: string
  }
  services: Array<{
    id: string
    name: string
    description?: string
    currency: string
    tiers: Array<{
      id: string
      name: string
      price: string // Stringified Decimal
      compareAtPrice?: string
      discountPercentage: number
      interval: string
      intervalCount: number
      type: string
    }>
  }>
}

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ merchantId: string; serviceId: string }>
}) {
  // 1. Unwrap Async Params (Next.js 15 Pattern)
  const { merchantId, serviceId } = use(params)
  const router = useRouter()

  const {
    auth,
    isReady,
    isTelegram,
    setBackButton,
    setMainButton,
    hapticFeedback
  } = useTelegramContext()

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 2. Data Fetching via secure useApi (Handles JWT Authorization headers internally)
  const { data, isLoading } = useApi<ServiceData>(
    auth.isAuthenticated ? `/api/merchant/${merchantId}/services` : null
  )

  const service = data?.services?.find((s) => s.id === serviceId)

  /**
   * Telegram Navigation: Setup Back Button
   */
  useEffect(() => {
    // Only show Telegram BackButton if we are in the Telegram environment
    if (isTelegram) {
      setBackButton(true, () => router.back())
      return () => setBackButton(false)
    }
  }, [router, setBackButton, isTelegram])

  /**
   * Telegram Main Button Lifecycle
   * Syncs the "Subscribe" action with the native Telegram footer button
   */
  useEffect(() => {
    if (!isTelegram) return;

    if (!service || !selectedTierId) {
      setMainButton({
        text: "Select a Plan",
        visible: true,
        active: false,
        color: "#242424" // Muted gray
      })
      return
    }

    const tier = service.tiers.find((t) => t.id === selectedTierId)
    if (!tier) return

    setMainButton({
      text: `SUBSCRIBE - ${service.currency} ${tier.price}`,
      visible: true,
      active: !isSubmitting,
      progress: isSubmitting,
      onClick: handleSubscribe,
    })

    // Cleanup: Hide button when navigating away to prevent overlap on next page
    return () => setMainButton({ text: "", visible: false })
  }, [service, selectedTierId, isSubmitting, isTelegram])

  const handleSubscribe = async () => {
    if (!selectedTierId || !service || isSubmitting) return

    setIsSubmitting(true)
    hapticFeedback("medium")

    try {
      // 3. API Call: Create Subscription/Payment Record
      const result = await apiPost<{ paymentUrl: string }>("/api/payments/create", {
        merchantId,
        serviceId,
        serviceTierId: selectedTierId,
      })

      hapticFeedback("success")

      if (result.paymentUrl) {
        // Redirect to external payment gateway or internal Telegram Invoice
        window.location.href = result.paymentUrl
      } else {
        router.push("/profile")
      }
    } catch (error: any) {
      hapticFeedback("error")
      console.error("Subscription flow error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isReady || auth.isLoading || isLoading) {
    return <LoadingScreen message="Unlocking plans..." />
  }

  if (!service) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-bold">Service Expired</h1>
        <p className="text-muted-foreground text-sm">This merchant is currently not accepting new subscribers for this service.</p>
        <Button onClick={() => router.push("/")} variant="secondary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Browse Others
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen space-y-6 bg-background pb-32">
      {/* Visual Header */}

      <header className="space-y-4 px-4 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase italic">{service.name}</h1>
            {data?.merchant?.companyName && (
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                PROVISIONED BY {data.merchant.companyName}
              </p>
            )}
          </div>
          <Badge variant="outline" className="border-primary/50 bg-primary/10 px-3 py-1 text-primary">
            {service.tiers.length} Tiers
          </Badge>
        </div>

        {service.description && (
          <div className="rounded-2xl bg-muted/30 p-4 border border-border/50">
            <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
          </div>
        )}
      </header>

      {/* Feature Icons Grid */}

      <section className="grid grid-cols-3 gap-3 px-4">
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30">
          <div className="rounded-full bg-primary/10 p-2"><Shield className="h-5 w-5 text-primary" /></div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground">Encrypted</span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4">
          <div className="rounded-full bg-amber-500/10 p-2"><Zap className="h-5 w-5 text-amber-500" /></div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground">Auto-Join</span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4">
          <div className="rounded-full bg-blue-500/10 p-2"><Users className="h-5 w-5 text-blue-500" /></div>
          <span className="text-[10px] font-bold uppercase text-muted-foreground">Support</span>
        </div>
      </section>

      {/* Tier/Plan Selection */}
      <section className="px-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Select Subscription Tier</h2>
        </div>
        <TierSelector
          tiers={service.tiers}
          selectedTierId={selectedTierId}
          onSelect={(id) => {
            setSelectedTierId(id)
            hapticFeedback("light")
          }}
          currency={service.currency}
        />
      </section>

      {/* Web-Fallback Subscription Button (Hidden in Telegram) */}
      {!isTelegram && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 p-6 backdrop-blur-xl">
          <Button
            className="h-14 w-full rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
            disabled={!selectedTierId || isSubmitting}
            onClick={handleSubscribe}
          >
            {isSubmitting
              ? "Securing Connection..."
              : selectedTierId
                ? `SUBSCRIBE - ${service.currency} ${service.tiers.find((t) => t.id === selectedTierId)?.price}`
                : "Select a Plan"}
          </Button>
        </div>
      )}
    </div>
  )
}