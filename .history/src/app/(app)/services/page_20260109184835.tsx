"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useApi } from "@/src/lib/hooks/use-api"
import { useTelegramContext } from "@/src/components/telegram/telegram-provider"
import { LoadingScreen } from "@/src/components/ui/loading-spinner"
import { ServiceCard } from "@/src/components/mini-app/service-card"
import { SkeletonList } from "@/src/components/ui/skeleton-card"
import { Input } from "@/src/components/ui/input"
import { Search, Package } from "lucide-react"

interface Service {
  id: string
  name: string
  description?: string
  currency: string
  categoryTag?: string
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
}

interface MerchantData {
  merchant: {
    id: string
    companyName?: string
    botUsername?: string
  }
  services: Service[]
}

export default function ServicesPage() {
  const { auth, isReady } = useTelegramContext()
  const searchParams = useSearchParams()
  const merchantId = searchParams.get("merchant")
  const [searchQuery, setSearchQuery] = useState("")

  // For demo purposes, use a default merchant ID if none provided
  const targetMerchantId = merchantId || "demo-merchant"

  const { data, isLoading, error } = useApi<MerchantData>(
    auth.isAuthenticated ? `/api/merchant/${targetMerchantId}/services` : null,
  )

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Loading services..." />
  }

  const filteredServices = data?.services?.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <header className="space-y-1 pt-2">
        <h1 className="text-xl font-bold text-foreground">{data?.merchant?.companyName || "Services"}</h1>
        <p className="text-sm text-muted-foreground">Choose a subscription plan</p>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Services List */}
      <section>
        {isLoading ? (
          <SkeletonList count={4} />
        ) : error ? (
          <div className="rounded-xl border border-dashed border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-sm text-destructive">Failed to load services. Please try again.</p>
          </div>
        ) : filteredServices && filteredServices.length > 0 ? (
          <div className="space-y-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                name={service.name}
                description={service.description}
                currency={service.currency}
                tiers={service.tiers}
                merchantId={targetMerchantId}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="font-medium text-foreground">No services found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term" : "No services are currently available"}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
