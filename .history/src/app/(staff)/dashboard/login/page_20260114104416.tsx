"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Fingerprint,
  Terminal,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { SessionAudit } from "@/components/auth/session-audit";
import { HandshakeSuccess } from "@/components/auth/handshake-success";
import { JWT_CONFIG } from "@/lib/auth/config";
import { cn } from "@/lib/utils";

/**
 * 🛰️ STAFF GATEWAY TERMINAL (Institutional v15.0.3)
 * Optimized for Cross-Tab Identity Synchronization and Watchdog Protection.
 */
function LoginContent() {
  const { isTelegram, hapticFeedback } = useTelegramContext();
  const [status, setStatus] = useState<
    "IDLE" | "SYNCING" | "VERIFIED" | "TIMEOUT"
  >("IDLE");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // 🛡️ SYNC-LOCKS: Prevents duplicate handshake executions
  const exchangeStarted = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const token = searchParams.get("token");
  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;

  // 🛰️ 1. BROADCAST CHANNEL LISTENER
  useEffect(() => {
    // Guard: Ensure browser environment
    if (typeof window === "undefined") return;

    const authChannel = new BroadcastChannel("zipha_auth_sync");

    /**
     * 🛰️ IDENTITY PULSE LISTENER (v15.0.4)
     * Architecture: Anchors the session on the primary terminal via cross-tab broadcast.
     */
    authChannel.onmessage = (event) => {
      const { action, target, timestamp } = event.data;

      // 🛡️ SECURITY GUARD: Only respond to the reload signal
      if (action === "RELOAD_SESSION") {
        // 1. 🧹 CLEAR WATCHDOG: Stop the timeout timer
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        console.log(
          `✅ [Sync_Handshake]: Identity pulse received at ${timestamp}.`
        );

        // 2. ⚡ VISUAL CONFIRMATION
        setStatus("VERIFIED");
        hapticFeedback?.("success");
        toast.success("Identity Anchored via Remote Node", {
          description:
            "Synchronizing session nodes... Redirecting to dashboard.",
        });

        /**
         * 🚀 THE PATH TRANSITION (Fix)
         * We use window.location.href to force a hard reload.
         * This ensures the browser sends the new auth cookies to the server,
         * allowing Next.js Middleware to grant access to protected routes.
         */
        setTimeout(() => {
          // Logic: Prioritize the target from the pulse, fallback to /dashboard
          window.location.href = target || "/dashboard";
        }, 1000);
      }
    };
    return () => {
      authChannel.close(); // Prevent memory leaks
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [hapticFeedback]);

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

  // 🚀 AUTOMATED HANDSHAKE (When landing directly from a Magic Link)
  useEffect(() => {
    const reason = searchParams.get("reason");

    if (token && !exchangeStarted.current) {
      exchangeStarted.current = true;
      setStatus("SYNCING");

      const performHandshake = async () => {
        const toastId = toast.loading("Verifying Identity Protocol...");

        try {
          // ✅ FIX: Changed 'tokenExchange' to 'magicHandshake' per your TS error
          const res = await fetch(JWT_CONFIG.endpoints.magicHandshake, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          const result = await res.json();

          if (res.ok && result.success) {
            toast.success("Identity Verified.", { id: toastId });
            setStatus("VERIFIED");
            hapticFeedback?.("success");

            setTimeout(() => {
              router.replace("/dashboard");
              router.refresh();
            }, 1200);
          } else {
            setError(getErrorMessage(result.error || "link_invalid"));
            toast.error("Handshake Failed", { id: toastId });
            setStatus("IDLE");
            exchangeStarted.current = false; // Allow retry on failure
          }
        } catch (err) {
          setError("NETWORK_ERROR: Handshake node unreachable.");
          toast.error("Cluster Timeout", { id: toastId });
          setStatus("IDLE");
          exchangeStarted.current = false;
        }
      };

      performHandshake();
    }

    if (reason && !error && !token) {
      setError(getErrorMessage(reason));
      window.history.replaceState({}, "", pathname);
    }
  }, [
    searchParams,
    token,
    error,
    router,
    pathname,
    getErrorMessage,
    hapticFeedback,
  ]);

  const handleTelegramLogin = () => {
    if (!botUsername) {
      toast.error("SYSTEM_FAILURE: BOT_IDENTITY_MISSING");
      return;
    }

    setStatus("SYNCING");
    hapticFeedback?.("medium");

    // 🛰️ START WATCHDOG: Reset state if Telegram doesn't signal back in 60s
    timeoutRef.current = setTimeout(() => {
      setStatus("TIMEOUT");
    }, 60000);

    const telegramUrl = `https://t.me/${botUsername}?start=terminal_access`;

    setTimeout(() => {
      window.location.href = telegramUrl;
    }, 150);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background relative selection:bg-amber-500/30 text-foreground overflow-hidden">
      {status === "VERIFIED" && <HandshakeSuccess user={verifiedUser || { fullName: "Verified" }} />}

      {/* Ambiance */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] bg-amber-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <Card
        className={cn(
          "w-full max-w-sm md:max-w-md rounded-[3rem] border-border/40 bg-card/30 backdrop-blur-3xl p-8 md:p-12 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden border-t-amber-500/20 transition-all duration-700",
          status === "VERIFIED" &&
            "opacity-0 scale-95 blur-xl pointer-events-none"
        )}
      >
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
              {status === "SYNCING"
                ? "Awaiting Remote Pulse"
                : "Secure Identity Handshake"}
            </p>
          </div>

          {status === "TIMEOUT" && (
            <Alert
              variant="destructive"
              className="rounded-2xl border-rose-500/20 bg-rose-500/5 text-rose-500 py-4"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <AlertDescription className="text-[9px] font-black uppercase tracking-widest">
                  HANDSHAKE_TIMEOUT: Check Telegram App.
                </AlertDescription>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleTelegramLogin}
                  className="h-6 text-[8px] font-black uppercase tracking-widest bg-rose-500/10 hover:bg-rose-500/20"
                >
                  Retry
                </Button>
              </div>
            </Alert>
          )}

          {error && status !== "TIMEOUT" && (
            <Alert
              variant="destructive"
              className="rounded-2xl border-rose-500/20 bg-rose-500/5 text-rose-500 py-4"
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
              disabled={status === "SYNCING" || status === "VERIFIED"}
              className="w-full h-16 rounded-2xl bg-amber-500 text-black font-black uppercase italic tracking-widest text-xs shadow-xl shadow-amber-500/10 transition-all hover:translate-y-[-2px] hover:shadow-amber-500/20 active:scale-95 disabled:opacity-50"
            >
              {status === "SYNCING" ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Synchronizing Node
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  {status === "TIMEOUT"
                    ? "Re-Initialize Handshake"
                    : "Authorize Identity"}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            {status === "SYNCING" && (
              <button
                onClick={() => setStatus("IDLE")}
                className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                [ CANCEL_AUTH ]
              </button>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-border/10 pt-8 text-center">
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500/20" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
