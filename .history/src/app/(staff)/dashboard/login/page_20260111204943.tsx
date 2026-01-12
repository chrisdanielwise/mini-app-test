"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Fingerprint, 
  Terminal 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 🔐 STAFF GATEWAY TERMINAL
 * Optimized: Handles automated token consumption to prevent pre-fetch loops.
 * Feature: Unified entry for Staff (Amber) and Merchants (Emerald).
 */
function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;

useEffect(() => {
    const token = searchParams.get("token");
    const reason = searchParams.get("reason");

    // 🛡️ 1. Token Ingress (High Priority)
    if (token && !isLoading) {
      setIsLoading(true);
      router.replace(`/api/auth/callback?token=${token}`);
      return;
    }

    // 🛡️ 2. Static Error Mapping (One-Shot)
    // Only set error if it's different from current to prevent render loops
    if (reason && !error) {
      const errorMap: Record<string, string> = {
        identity_denied: "CLEARANCE_REVOKED: Role mismatch or insufficient permissions.",
        link_invalid: "HANDSHAKE_FAILED: Token expired or invalid signature.",
        auth_required: "GATE_LOCKED: Please authorize your identity to proceed.",
        session_expired: "SESSION_TERMINATED: Your security token has expired."
      };

      if (errorMap[reason]) {
        setError(errorMap[reason]);
        // 🚩 Clean the URL so the 'reason' doesn't trigger again on manual refresh
        window.history.replaceState({}, '', pathname); 
      }
    }
  }, [searchParams, error, isLoading, router]);

  const handleTelegramLogin = () => {
    if (!botUsername) {
      setError("CONFIG_ERROR: NEXT_PUBLIC_BOT_USERNAME_MISSING");
      return;
    }
    setIsLoading(true);

    // Identity Handshake Deep Link
    // Note: Matches Protocol C in your Webhook Handler
    const telegramUrl = `https://t.me/${botUsername}?start=terminal_access`;

    try {
      window.location.href = telegramUrl;
    } catch (err) {
      setIsLoading(false);
      setError("HANDSHAKE_TIMEOUT: NODE_UNREACHABLE");
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background overflow-x-hidden relative selection:bg-primary/30">
      
      {/* --- PROTOCOL BACKGROUND AURA --- */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-sm md:max-w-md rounded-2xl md:rounded-3xl border-border/40 bg-card/40 backdrop-blur-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden group border-t-primary/20">
        
        <Terminal className="absolute -top-6 -right-6 h-32 w-32 opacity-[0.03] -rotate-12 pointer-events-none" />

        <div className="flex flex-col items-center text-center space-y-6 md:space-y-8 relative z-10">
          
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full animate-pulse" />
            <div className="relative h-14 w-14 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform duration-500">
              <ShieldCheck className="h-7 w-7 md:h-8 md:w-8 text-primary-foreground" />
            </div>
          </div>

          <div className="space-y-1 md:space-y-2">
            <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tight leading-none text-foreground">
              Staff <span className="text-primary">Gateway</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center justify-center gap-2 opacity-50">
              <Fingerprint className="h-3 w-3" />
              Cryptographic Ingress
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="rounded-xl border-rose-500/20 bg-rose-500/5 text-rose-500 py-3">
              <AlertDescription className="text-[8px] font-black uppercase tracking-widest leading-tight">
                {error}
             </AlertDescription>
            </Alert>
          )}

          <div className="w-full space-y-6 pt-2">
            <Button
              onClick={handleTelegramLogin}
              disabled={isLoading}
              className="w-full h-12 md:h-14 rounded-xl bg-primary text-primary-foreground font-black uppercase italic tracking-[0.1em] text-[11px] md:text-xs shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95 group overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                   <div className="h-3 w-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                   SYNCHRONIZING...
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  Authorize Identity
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>

            <div className="space-y-4 md:space-y-6">
              <p className="px-2 md:px-6 text-center text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-40">
                Identity verified via <span className="text-foreground">Telegram Auth Node</span>. Access is monitored for cluster security.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-10 border-t border-border/10 pt-6 md:pt-8 text-center">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
            Node deployment pending?{" "}
            <Link href="/register" className="text-primary hover:text-primary/80 transition-colors italic ml-1">
              Deploy Cluster
            </Link>
          </p>
        </div>
      </Card>

      <div className="mt-10 md:mt-12 flex items-center gap-2.5 opacity-20">
        <Zap className="h-3 w-3 fill-primary text-primary" />
        <span className="text-[9px] font-black uppercase tracking-[0.4em] italic">Zipha Terminal v2.26</span>
      </div>
    </div>
  );
}

// 🛡️ WRAPPER: Required for useSearchParams() in Next.js 15+
export default function MerchantLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}