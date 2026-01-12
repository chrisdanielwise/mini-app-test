"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, AlertCircle, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import Link from "next/link";

/**
 * 🔐 STAFF GATEWAY LOGIN
 * Tier 2: Secure entry point for Merchants and Support Staff.
 * Uses Telegram's cryptographic session for passwordless authentication.
 */
export default function MerchantLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Environmental Variable Sync
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

    // 2. Development Mode Shortcut (Ngrok/Local testing)
    if (process.env.NODE_ENV === "development" && typeof window !== 'undefined' && window.location.search.includes("mock=true")) {
      console.log("[Login] Mock login triggered for local development");
      // Simulate redirection to your local auth callback if needed
      return;
    }

    // 3. Construct the Identity Handshake Deep Link
    // Payload 'merchant_login' tells the bot to generate a one-time login token.
    const telegramUrl = `https://t.me/${botUsername}?start=merchant_login`;

    try {
      window.location.href = telegramUrl;
    } catch (err) {
      setIsLoading(false);
      setError("Handshake failed: Unable to reach Telegram servers.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background overflow-hidden relative">
      
      {/* --- DECORATIVE BACKGROUND --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <Card className="w-full max-w-md rounded-[3rem] border-border/40 bg-card/50 backdrop-blur-xl p-10 shadow-2xl animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center text-center space-y-6">
          
          {/* Logo / Icon Node */}
          <div className="h-16 w-16 rounded-[1.5rem] bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
            <ShieldCheck className="h-8 w-8 text-primary-foreground" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Staff Gateway</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Identity Handshake Required
            </p>
          </div>

          {/* Error Alert Node */}
          {error && (
            <Alert variant="destructive" className="rounded-2xl border-destructive/20 bg-destructive/5 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-[10px] font-bold uppercase tracking-tight">{error}</AlertDescription>
            </Alert>
          )}

          <div className="w-full space-y-6 pt-4">
            <Button
              onClick={handleTelegramLogin}
              disabled={isLoading || !!error}
              className="w-full h-16 rounded-2xl bg-primary font-black uppercase italic tracking-widest text-sm shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95 group"
            >
              {isLoading ? (
                "Syncing Node..."
              ) : (
                <>
                  Verify via Telegram 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <div className="space-y-4">
              <p className="px-6 text-center text-[9px] font-medium text-muted-foreground uppercase tracking-tight leading-relaxed">
                By verifying your identity, you agree to the Zipha Protocol{" "}
                <Link href="/terms" className="text-primary hover:underline underline-offset-4 font-bold">Terms</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-primary hover:underline underline-offset-4 font-bold">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-10 border-t border-border/40 pt-8 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Don't have a cluster yet?{" "}
            <Link href="/register" className="text-primary hover:underline font-black italic">
              Deploy Merchant Node
            </Link>
          </p>
        </div>
      </Card>

      {/* Footer Branding */}
      <div className="mt-12 flex items-center gap-2 opacity-30">
        <Zap className="h-3 w-3 fill-current" />
        <span className="text-[8px] font-black uppercase tracking-[0.4em]">Zipha Protocol v2.0.0</span>
      </div>
    </div>
  );
}