"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useApi, apiPost } from "@/lib/hooks/use-api"
import { useTelegramContext } from "@/components/telegram/telegram-provider"
import { LoadingScreen } from "@/components/ui/loading-spinner"
import { TierSelector } from "@/components/mini-app/tier-selector"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, Clock, Users } from "lucide-react"

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
      price: string
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
  const { merchantId, serviceId } = use(params)
  const router = useRouter()
  const { auth, isReady, setBackButton, setMainButton, hapticFeedback } = useTelegramContext()

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, isLoading } = useApi<ServiceData>(auth.isAuthenticated ? `/api/merchant/${merchantId}/services` : null)

  const service = data?.services?.find((s) => s.id === serviceId)

  // Setup back button
  useEffect(() => {
    setBackButton(true, () => router.back())
    return () => setBackButton(false)
  }, [router, setBackButton])

  // Setup main button
  useEffect(() => {
    if (!service || !selectedTierId) {
      setMainButton({ text: "Select a Plan", visible: true, active: false })
      return
    }

    const tier = service.tiers.find((t) => t.id === selectedTierId)
    if (!tier) return

    setMainButton({
      text: `Subscribe - ${service.currency} ${tier.price}`,
      visible: true,
      active: !isSubmitting,
      progress: isSubmitting,
      onClick: handleSubscribe,
    })

    return () => setMainButton({ text: "", visible: false })
  }, [service, selectedTierId, isSubmitting])

  const handleSubscribe = async () => {
    if (!selectedTierId || !service || isSubmitting) return

    setIsSubmitting(true)
    hapticFeedback("medium")

    try {
      // Create payment intent
      const result = await apiPost<{ paymentUrl: string }>("/api/payments/create", {
        merchantId,
        serviceId,
        serviceTierId: selectedTierId,
      })

      hapticFeedback("success")

      // Redirect to payment or show success
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl
      } else {
        router.push("/")
      }
    } catch (error: any) {
      hapticFeedback("error")
      console.error("Subscription error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isReady || auth.isLoading || isLoading) {
    return <LoadingScreen message="Loading service..." />
  }

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-bold">Service Not Found</h1>
        <p className="text-muted-foreground">This service may no longer be available.</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 pb-24">
      {/* Header */}
      <header className="space-y-3 pt-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">{service.name}</h1>
            {data?.merchant?.companyName && (
              <p className="text-sm text-muted-foreground">by {data.merchant.companyName}</p>
            )}
          </div>
          <Badge variant="secondary" className="shrink-0">
            {service.tiers.length} plans
          </Badge>
        </div>

        {service.description && <p className="text-sm text-muted-foreground">{service.description}</p>}
      </header>

      {/* Features */}
      <section className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card p-3">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-xs text-muted-foreground">Secure Access</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card p-3">
          <Clock className="h-5 w-5 text-primary" />
          <span className="text-xs text-muted-foreground">Instant Start</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card p-3">
          <Users className="h-5 w-5 text-primary" />
          <span className="text-xs text-muted-foreground">VIP Channel</span>
        </div>
      </section>

      {/* Plan Selection */}
      <section>
        <h2 className="mb-3 font-semibold text-foreground">Select Your Plan</h2>
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

      {/* Mobile-only subscribe button (fallback for non-Telegram) */}
      <div className="fixed bottom-20 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur-lg md:hidden">
        <Button className="w-full" size="lg" disabled={!selectedTierId || isSubmitting} onClick={handleSubscribe}>
          {isSubmitting
            ? "Processing..."
            : selectedTierId
              ? `Subscribe - ${service.currency} ${service.tiers.find((t) => t.id === selectedTierId)?.price}`
              : "Select a Plan"}
        </Button>
      </div>
    </div>
  )
}
