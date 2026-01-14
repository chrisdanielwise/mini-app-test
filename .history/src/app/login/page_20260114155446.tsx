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
  Lock,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { SessionAudit } from "@/components/auth/session-audit";
import { HandshakeSuccess } from "@/components/auth/handshake-success"; 
import { JWT_CONFIG } from "@/lib/auth/config";
import { cn } from "@/lib/utils";

/**
 * 🛰️ UNIVERSAL LOGIN CONTENT
 * Logic: Handles both TMA (Mobile) and Desktop handshakes with dynamic redirection.
 */
export function LoginContent() {
  const { isTelegram, hapticFeedback } = useTelegramContext();
  const [status, setStatus] = useState<"IDLE" | "SYNCING" | "VERIFIED" | "TIMEOUT">("IDLE");
  const [error, setError] = useState<string | null>(null);
  const [verifiedUser, setVerifiedUser] = useState<any>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const exchangeStarted = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const token = searchParams.get("token");
  // 🚀 REDIRECT CAPTURE: Ensures user returns to /home or /dashboard post-auth
  const redirectTo = searchParams.get("redirect") || "/home";
  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;

  const isDashboardIntent = redirectTo.startsWith("/dashboard");

  /**
   * 📡 1. CROSS-TAB HANDSHAKE LISTENER
   * Architecture: Listens for the "RELOAD_SESSION" pulse from the Magic Handshake bridge.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const authChannel = new BroadcastChannel("zipha_auth_sync");

    authChannel.onmessage = (event) => {
      const { action, target, timestamp, user } = event.data;

      if (action === "RELOAD_SESSION") {
        authChannel.postMessage({ action: "HANDSHAKE_ACKNOWLEDGED" });
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setVerifiedUser(user || { fullName: "Authorized Operator" });
        setStatus("VERIFIED");

        hapticFeedback?.("success");
        router.refresh();
        
        toast.success("Identity Anchored via Remote Node");

        setTimeout(() => {
          // 🚀 PRECISION RETURN: Uses the target provided by the handshake or the local param
          window.location.href = target || redirectTo;
        }, 1200);
      }
    };

    return () => {
      authChannel.close(); 
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [hapticFeedback, redirectTo, router]);

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

  /**
   * 🚀 2. MAGIC HANDSHAKE LOGIC
   * Used for direct link entries (Magic Links).
   */
  useEffect(() => {
    const reason = searchParams.get("reason");

    if (token && !exchangeStarted.current) {
      exchangeStarted.current = true;
      setStatus("SYNCING");

      const performHandshake = async () => {
        const toastId = toast.loading("Verifying Identity Protocol...");

        try {
          // 📡 Calls the API we updated earlier with tiered expiry
          const res = await fetch(`${JWT_CONFIG.endpoints.magicHandshake}?token=${token}&redirect=${redirectTo}`);
          
          if (res.redirected) {
             window.location.href = res.url;
             return;
          }

          const result = await res.json();

          if (res.ok && result.success) {
            toast.success("Identity Verified.", { id: toastId });
            setVerifiedUser(result.user);
            setStatus("VERIFIED");
            hapticFeedback?.("success");

            setTimeout(() => {
              window.location.href = redirectTo;
            }, 1200);
          } else {
            setError(getErrorMessage(result.error || "link_invalid"));
            setStatus("IDLE");
            exchangeStarted.current = false;
          }
        } catch (err) {
          setError("NETWORK_ERROR: Handshake node unreachable.");
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
  }, [searchParams, token, error, router, pathname, getErrorMessage, hapticFeedback, redirectTo]);

  /**
   * 🤖 3. TELEGRAM INITIALIZATION
   * Synchronous window opening to bypass mobile browser blockers.
   */
  const handleTelegramLogin = () => {
    if (!botUsername) {
      toast.error("SYSTEM_FAILURE: BOT_IDENTITY_MISSING");
      return;
    }

    const width = 550;
    const height = 750;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // 🚀 Pass the redirect parameter to the bot so it carries through the link
    const telegramUrl = `https://t.me/${botUsername}?start=auth_${btoa(redirectTo)}`;
    
    const authWindow = window.open(
      telegramUrl,
      "IdentityHandshake",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=1,resizable=yes`
    );

    if (!authWindow) {
      toast.error("POPUP_BLOCKED: Please allow pop-ups for this site.");
      return;
    }

    setStatus("SYNCING");
    hapticFeedback?.("medium");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setStatus("TIMEOUT");
    }, 60000);

    const checkClosed = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(checkClosed);
        setStatus((prev) => (prev === "SYNCING" ? "IDLE" : prev));
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background relative selection:bg-amber-500/30 text-foreground overflow-hidden">
      
      {status === "VERIFIED" && (
        <HandshakeSuccess user={verifiedUser || { fullName: "Authorized Operator" }} />
      )}

      {/* Atmospheric Underlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className={cn(
          "absolute top-[-10%] left-[-20%] w-[60%] h-[60%] rounded-full blur-[120px] transition-colors duration-1000",
          isDashboardIntent ? "bg-amber-500/10 animate-pulse" : "bg-primary/5"
        )} />
      </div>

      <Card className={cn(
        "w-full max-w-sm md:max-w-md rounded-[3rem] border-border/40 bg-card/30 backdrop-blur-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-700",
        isDashboardIntent ? "border-t-amber-500/20" : "border-t-primary/20",
        status === "VERIFIED" && "opacity-0 scale-95 blur-xl pointer-events-none"
      )}>
        <div className="flex flex-col items-center text-center space-y-8 relative z-10">
          <div className="relative group">
            <div className={cn(
              "absolute inset-0 blur-2xl rounded-full transition-colors duration-700",
              isDashboardIntent ? "bg-amber-500/20 group-hover:bg-amber-500/40" : "bg-primary/20 group-hover:bg-primary/40"
            )} />
            <div className={cn(
              "relative h-20 w-20 rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500",
              isDashboardIntent ? "bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-500/20" : "bg-gradient-to-br from-primary to-primary/60 shadow-primary/20"
            )}>
              {isDashboardIntent ? <Terminal className="h-10 w-10 text-black" /> : <ShieldCheck className="h-10 w-10 text-primary-foreground" />}
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-foreground">
              {isDashboardIntent ? <>Terminal <span className="text-amber-500">Sync</span></> : <>Identity <span className="text-primary">Node</span></>}
            </h1>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] flex items-center justify-center gap-2 opacity-60">
              <Fingerprint className={cn("h-3 w-3", isDashboardIntent ? "text-amber-500" : "text-primary")} />
              {status === "SYNCING" ? "Awaiting Remote Pulse" : isDashboardIntent ? "Secure Staff Handshake" : "Synchronize Mobile Link"}
            </p>
          </div>

          {error && (
             <Alert variant="destructive" className="rounded-2xl border-rose-500/20 bg-rose-500/5 text-rose-500">
               <AlertDescription className="text-[9px] font-black uppercase tracking-widest">{error}</AlertDescription>
             </Alert>
          )}

          <div className="w-full space-y-8">
            <SessionAudit token={token} />

            <Button
              onClick={handleTelegramLogin}
              disabled={status === "SYNCING" || status === "VERIFIED"}
              className={cn(
                "w-full h-16 rounded-2xl font-black uppercase italic tracking-widest text-xs shadow-xl transition-all active:scale-95",
                isDashboardIntent ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-primary text-primary-foreground"
              )}
            >
              {status === "SYNCING" ? (
                <div className="flex items-center gap-3"><Loader2 className="h-4 w-4 animate-spin" /> Handshake In Progress</div>
              ) : (
                <span className="flex items-center gap-2">Authorize Protocol <ArrowRight className="h-4 w-4" /></span>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-12 border-t border-border/10 pt-8 text-center">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest leading-relaxed">
            Institutional Access // Protocol: Zipha_V16
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[100dvh] items-center justify-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-primary/20" /></div>}>
      <LoginContent />
    </Suspense>
  );
}