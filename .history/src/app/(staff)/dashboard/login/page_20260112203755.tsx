"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Fingerprint, 
  Terminal,
  AlertTriangle 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * 🔐 STAFF GATEWAY TERMINAL (Institutional v9.7.2)
 * Hardened: Silent Token Exchange Protocol with Hydration Shield.
 * Optimized: Cross-browser cookie injection for Safari & Telegram.
 */
function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const exchangeStarted = useRef(false); // 🛡️ Prevents token-burn in Strict Mode

  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;

  const getErrorMessage = useCallback((reason: string) => {
    const errorMap: Record<string, string> = {
      identity_denied: "CLEARANCE_REVOKED: Identity node rejected by RBAC protocol.",
      link_invalid: "HANDSHAKE_FAILED: Token signature mismatch or expiration.",
      auth_required: "GATE_LOCKED: Authentication required for this node.",
      session_expired: "SESSION_TERMINATED: Security epoch has concluded.",
      access_denied: "INSUFFICIENT_CLEARANCE: Node requires higher level access."
    };
    return errorMap[reason] || "UNKNOWN_SIGNAL: Cryptographic failure.";
  }, []);

  useEffect(() => {
    const token = searchParams.get("token");
    const reason = searchParams.get("reason");

    // 🚀 INGRESS A: Automated Token Exchange (The Silent Handshake)
    if (token && !exchangeStarted.current) {
      exchangeStarted.current = true;
      setIsLoading(true);
      
      const performHandshake = async () => {
        const toastId = toast.loading("Verifying Identity Protocol...");
        
        try {
          const res = await fetch("/api/auth/token-exchange", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (res.ok) {
            toast.success("Identity Verified. Synchronizing...", { id: toastId });
            // Remove token from URL and move to dashboard
            router.replace("/dashboard");
            router.refresh();
          } else {
            const data = await res.json();
            setError(getErrorMessage(data.error || "link_invalid"));
            toast.error("Handshake Failed", { id: toastId });
            setIsLoading(false);
          }
        } catch (err) {
          setError("NETWORK_ERROR: Handshake node unreachable.");
          toast.error("Network Failure", { id: toastId });
          setIsLoading(false);
        }
      };

      performHandshake();
    }

    // 🚀 INGRESS B: Passive Error Logging
    if (reason && !error && !token) {
      setError(getErrorMessage(reason));
      window.history.replaceState({}, '', pathname); 
    }
  }, [searchParams, error, router, pathname, getErrorMessage]);

  const handleTelegramLogin = () => {
    if (!botUsername) {
      setError("CONFIG_ERROR: NEXT_PUBLIC_BOT_USERNAME_MISSING");
      return;
    }
    setIsLoading(true);
    const telegramUrl = `https://t.me/${botUsername}?start=terminal_access`;
    window.location.href = telegramUrl;
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background overflow-x-hidden relative selection:bg-primary/30 text-foreground">
      
      {/* --- PROTOCOL BACKGROUND AURA --- */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-sm md:max-w-md rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden group border-t-amber-500/20">
        
        <Terminal className="absolute -top-6 -right-6 h-32 w-32 opacity-[0.03] -rotate-12 pointer-events-none" />

        <div className="flex flex-col items-center text-center space-y-8 md:space-y-10 relative z-10">
          
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/20">
              <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 text-white" />
            </div>
          </div>

          <div className="space-y-2 md:space-y-3">
            <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
              Gateway <span className="text-amber-500">Node</span>
            </h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] flex items-center justify-center gap-2 opacity-50">
              <Fingerprint className="h-3 w-3 text-amber-500" />
              Cryptographic Ingress
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="rounded-xl border-rose-500/20 bg-rose-500/5 text-rose-500 py-3 text-left">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 shrink-0" />
                <AlertDescription className="text-[8px] font-black uppercase tracking-widest leading-tight">
                  {error}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <div className="w-full space-y-6">
            <Button
              onClick={handleTelegramLogin}
              disabled={isLoading}
              className="w-full h-14 md:h-16 rounded-xl bg-amber-500 text-black font-black uppercase italic tracking-[0.1em] text-xs shadow-xl shadow-amber-500/10 transition-all hover:scale-[1.02] active:scale-95 group overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                   <div className="h-3 w-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                   SYNCHRONIZING...
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  Authorize Identity
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-10 md:mt-12 border-t border-border/10 pt-8 text-center">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 leading-relaxed">
            Identity synchronized via <span className="text-foreground">Telegram Hub</span>. <br/>
            Node deployment pending?{" "}
            <Link href="/register" className="text-amber-500 hover:text-amber-400 transition-colors italic ml-1">
              Onboard Cluster
            </Link>
          </p>
        </div>
      </Card>

      <div className="mt-10 md:mt-12 flex items-center gap-2.5 opacity-20">
        <Zap className="h-3 w-3 fill-amber-500 text-amber-500" />
        <span className="text-[9px] font-black uppercase tracking-[0.5em] italic">Zipha Platform Root // 2026</span>
      </div>
    </div>
  );
}

export default function MerchantLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}