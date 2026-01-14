"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTelegramContext } from "@/components/t"; // ✅ Fixed Context Import
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Fingerprint,
  Terminal,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { SessionAudit } from "@/components/auth/session-audit";
import { HandshakeSuccess } from "@/components/auth/handshake-success"; // ✅ Success UI
import { JWT_CONFIG } from "@/lib/auth/config";
import { cn } from "@/lib/utils";

/**
 * 🛰️ STAFF GATEWAY TERMINAL (Institutional v13.8.0)
 * Features: Success Overlay, Haptic Feedback, and Role-Aware Handshakes.
 */
function LoginContent() {
  const { isTelegram, hapticFeedback } = useTelegramContext(); // ✅ Resolved Name Error
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // ✅ Handshake Success State
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const exchangeStarted = useRef(false);

  const token = searchParams.get("token");
  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;

  const getErrorMessage = useCallback((reason: string) => {
    const errorMap: Record<string, string> = {
      identity_denied: "CLEARANCE_REVOKED: Identity node rejected by RBAC.",
      link_invalid: "HANDSHAKE_FAILED: Token signature mismatch or expired.",
      auth_required: "GATE_LOCKED: Node requires active session anchor.",
      session_expired: "SESSION_TERMINATED: Security epoch concluded.",
      access_denied: "INSUFFICIENT_CLEARANCE: High-level access required.",
    };
    return errorMap[reason] || "UNKNOWN_SIGNAL: Cryptographic protocol error.";
  }, []);

  useEffect(() => {
    const reason = searchParams.get("reason");

    // 🚀 AUTOMATED HANDSHAKE (Magic Link Entrance)
    if (token && !exchangeStarted.current) {
      exchangeStarted.current = true;
      setIsLoading(true);

      const performHandshake = async () => {
        const toastId = toast.loading("Verifying Identity Protocol...");

        try {
          const res = await fetch(JWT_CONFIG.endpoints.tokenExchange, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          const result = await res.json();

          if (res.ok && result.success) {
            toast.success("Identity Verified.", { id: toastId });
            setIsVerified(true); // Trigger Success Animation
            hapticFeedback?.("success");

            // Institutional delay for visual confirmation of secure anchor
            setTimeout(() => {
              router.replace("/dashboard");
              router.refresh();
            }, 1200);
          } else {
            setError(getErrorMessage(result.error || "link_invalid"));
            toast.error("Handshake Failed", { id: toastId });
            setIsLoading(false);
          }
        } catch (err) {
          setError("NETWORK_ERROR: Handshake node unreachable.");
          toast.error("Cluster Timeout", { id: toastId });
          setIsLoading(false);
        }
      };

      performHandshake();
    }

    if (reason && !error && !token) {
      setError(getErrorMessage(reason));
      window.history.replaceState({}, "", pathname);
    }
  }, [searchParams, token, error, router, pathname, getErrorMessage, hapticFeedback]);

  const handleTelegramLogin = () => {
    if (!botUsername) {
      toast.error("SYSTEM_FAILURE: BOT_IDENTITY_MISSING");
      return;
    }
    setIsLoading(true);
    hapticFeedback?.("medium");

    const telegramUrl = `https://t.me/${botUsername}?start=terminal_access`;
    
    // Tactical delay to allow haptic perception before redirect
    setTimeout(() => {
      window.location.href = telegramUrl;
    }, 150);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background relative selection:bg-amber-500/30 text-foreground overflow-hidden">
      
      {/* 🚀 IDENTITY SUCCESS OVERLAY */}
      {isVerified && <HandshakeSuccess />}

      {/* 🌌 ATMOSPHERIC AMBIENT NODES */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] bg-amber-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <Card className={cn(
        "w-full max-w-sm md:max-w-md rounded-[3rem] border-border/40 bg-card/30 backdrop-blur-3xl p-8 md:p-12 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden border-t-amber-500/20 transition-all duration-700",
        isVerified && "opacity-0 scale-95 blur-xl pointer-events-none"
      )}>
        <Terminal className="absolute -top-10 -right-10 h-40 w-40 opacity-[0.02] -rotate-12 pointer-events-none" />

        <div className="flex flex-col items-center text-center space-y-8 relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full group-hover:bg-amber-500/40 transition-colors duration-700" />
            <div className="relative h-20 w-20 rounded-[2rem] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <ShieldCheck className="h-10 w-10 text-black" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
              Terminal <span className="text-amber-500">Sync</span>
            </h1>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] flex items-center justify-center gap-2 opacity-60">
              <Fingerprint className="h-3 w-3 text-amber-500" />
              Secure Identity Handshake
            </p>
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="rounded-2xl border-rose-500/20 bg-rose-500/5 text-rose-500 py-4 animate-in fade-in zoom-in duration-300"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <AlertDescription className="text-[9px] font-black uppercase tracking-widest leading-normal text-left">
                  {error}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <div className="w-full space-y-8">
            <SessionAudit token={token} />

            <Button
              onClick={handleTelegramLogin}
              disabled={isLoading || isVerified}
              className="w-full h-16 rounded-2xl bg-amber-500 text-black font-black uppercase italic tracking-widest text-xs shadow-xl shadow-amber-500/10 transition-all hover:translate-y-[-2px] hover:shadow-amber-500/20 active:scale-95 disabled:opacity-50"
            >
              {isLoading && !isVerified ? (
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Synchronizing Node
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  Authorize Identity
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-12 border-t border-border/10 pt-8">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest leading-relaxed">
            Deployment Access via{" "}
            <span className="text-foreground/80">Zipha Bot Protocol</span>.{" "}
            <br />
            Unauthorized access is strictly monitored.
          </p>
        </div>
      </Card>

      <div className="mt-12 flex items-center gap-3 opacity-30 grayscale hover:grayscale-0 transition-all duration-700 cursor-default">
        <Zap className="h-3 w-3 fill-amber-500 text-amber-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.6em] italic">
          Institutional Access // 2026
        </span>
      </div>
    </div>
  );
}

export default function MerchantLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-20">
              Initializing Terminal...
            </span>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}