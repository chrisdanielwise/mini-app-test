"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bot, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function MerchantLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. Environmental Variable Check
  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;

  useEffect(() => {
    if (!botUsername) {
      console.error("[Login] NEXT_PUBLIC_BOT_USERNAME is not defined in .env");
      setError("System configuration error: Bot username missing.");
    }
  }, [botUsername]);

  const handleTelegramLogin = () => {
    if (!botUsername) return;

    setIsLoading(true);

    // 2. Development Mode Shortcut
    // If you're working locally without a live bot connection
    if (process.env.NODE_ENV === "development" && window.location.search.includes("mock=true")) {
      console.log("[Login] Mock login triggered for development");
      // Simulate logic or redirect to a local callback
      return;
    }

    // 3. Construct the Telegram Deep Link
    // We use 'start=merchant_login' to allow the bot to recognize the intent
    const telegramUrl = `https://t.me/${botUsername}?start=merchant_login`;

    try {
      window.location.href = telegramUrl;
    } catch (err) {
      setIsLoading(false);
      setError("Failed to redirect to Telegram. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <span className="text-2xl font-bold text-primary-foreground">Z</span>
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Merchant Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to manage your subscription business
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Button
            onClick={handleTelegramLogin}
            disabled={isLoading || !!error}
            className="w-full"
            size="lg"
          >
            <Bot className="mr-2 h-5 w-5" />
            {isLoading ? "Redirecting to Telegram..." : "Sign in with Telegram"}
          </Button>

          <p className="px-8 text-center text-xs leading-relaxed text-muted-foreground">
            By signing in, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>.
          </p>
        </div>

        <div className="border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have a merchant account?{" "}
            <a href="/register" className="font-medium text-primary hover:underline">
              Become a Merchant
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}