"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"

export default function MerchantLoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleTelegramLogin = () => {
    setIsLoading(true)
    // Redirect to Telegram bot for authentication
    window.location.href = `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}?start=merchant_login`
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <span className="text-2xl font-bold text-primary-foreground">Z</span>
          </div>
          <h1 className="mt-6 text-2xl font-bold">Merchant Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Sign in to manage your subscription business</p>
        </div>

        <Button onClick={handleTelegramLogin} disabled={isLoading} className="w-full" size="lg">
          <Bot className="mr-2 h-5 w-5" />
          {isLoading ? "Connecting..." : "Sign in with Telegram"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don't have a merchant account?{" "}
          <a href="#" className="text-primary hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  )
}
