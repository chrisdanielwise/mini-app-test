"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  AlertCircle, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Fingerprint, 
  Lock, 
  Terminal 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 🔐 STAFF GATEWAY TERMINAL (Apex Tier)
 * Normalized: Fixed typography scales and responsive viewport constraints.
 * Optimized: Fluid geometry for Telegram Mini App and desktop browser parity.
 */
export default function MerchantLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;

  useEffect(() => {
    if (!botUsername) {
      console.error("[Node_Error] CONFIG_MISSING: NEXT_PUBLIC_BOT_USERNAME not found.");
      setError("CONFIGURATION_ERROR: API_KEY_MISSING");
    }
  }, [botUsername]);

  const handleTelegramLogin = () => {
    if (!botUsername) return;
    setIsLoading(true);

    // Identity Handshake Deep Link
    const telegramUrl = `https://t.me/${botUsername}?start=merchant_login`;

    try {
      window.location.href = telegramUrl;
    } catch (err) {
      setIsLoading(true); // Keep loading state if redirecting
      setError("HANDSHAKE_TIMEOUT: TELEGRAM_SERVER_UNREACHABLE");
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-4 sm:p-6 bg-background overflow-x-hidden relative selection:bg-primary/30">
      
      {/* --- PROTOCOL BACKGROUND AURA --- */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md rounded-[2.5rem] sm:rounded-[4rem] border-border/40 bg-card/40 backdrop-blur-3xl p-8 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden group">
        
        {/* Background Decorative Element */}
        <Terminal className="absolute -top-10 -right-10 h-48 w-48 opacity-[0.02] -rotate-12 pointer-events-none" />

        <div className="flex flex-col items-center text-center space-y-8 md:space-y-10 relative z-10">
          
          {/* Identity Node Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl md:rounded-[2rem] bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:scale-105 transition-transform duration-500">
              <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 text-primary-foreground" />
            </div>
          </div>

          <div className="space-y-2 md:space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
              Staff <span className="text-primary">Gateway</span>
            </h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center justify-center gap-2 opacity-60">
              <Fingerprint className="h-3 w-3" />
              Cryptographic Ingress
            </p>
          </div>

          {/* Error Alert Node */}
          {error && (
            <Alert variant="destructive" className="rounded-2xl border-rose-500/20 bg-rose-500/5 text-rose-500 animate-in slide-in-from-top-2 duration-500">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-[9px] font-black uppercase tracking-widest">{error}</AlertDescription>
            </Alert>
          )}

          <div className="w-full space-y-6 md:space-y-8 pt-2">
            <Button
              onClick={handleTelegramLogin}
              disabled={isLoading || !!error}
              className="w-full h-16 md:h-20 rounded-[1.5rem] md:rounded-[2rem] bg-primary text-primary-foreground font-black uppercase italic tracking-[0.15em] text-[12px] md:text-sm shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 group overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                   <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                   SYNCHRONIZING...
                </div>
              ) : (
                <span className="flex items-center gap-3">
                  Authorize Identity
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              )}
            </Button>

            <div className="space-y-6">
              <p className="px-4 sm:px-8 text-center text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-relaxed opacity-40">
                Authorized staff only. Access is monitored and logged via the 
                <span className="text-foreground"> Zipha_Security_Cluster</span>.
              </p>
              
              <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase italic tracking-widest">
                 <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
                 <div className="h-1 w-1 rounded-full bg-border" />
                 <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-10 md:mt-12 border-t border-border/20 pt-8 md:pt-10 text-center">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
            Node deployment pending?{" "}
            <Link href="/register" className="text-primary hover:text-primary/80 transition-colors italic">
              Deploy Merchant Cluster
            </Link>
          </p>
        </div>
      </Card>

      {/* Footer Branding */}
      <div className="mt-12 md:mt-16 flex items-center gap-3 opacity-20">
        <Zap className="h-3 w-3 md:h-4 md:w-4 fill-primary text-primary" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Zipha Terminal v2.0.26</span>
      </div>
    </div>
  );
}