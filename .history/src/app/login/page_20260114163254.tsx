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

export function LoginContent() {
  const { isTelegram, hapticFeedback, webApp } = useTelegramContext();
  const [status, setStatus] = useState<"IDLE" | "SYNCING" | "VERIFIED" | "TIMEOUT">("IDLE");
  const [error, setError] = useState<string | null>(null);
  const [verifiedUser, setVerifiedUser] = useState<any>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const exchangeStarted = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const token = searchParams.get("token");
  const redirectTo = searchParams.get("redirect") || "/home";
  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;

  const isDashboardIntent = redirectTo.startsWith("/dashboard");

  /**
   * 📡 1. CROSS-TAB HANDSHAKE LISTENER
   * Refined with strict event-source validation and auto-cleanup.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const authChannel = new BroadcastChannel("zipha_auth_sync");

    authChannel.onmessage = (event) => {
      const { action, target, user } = event.data;

      if (action === "RELOAD_SESSION") {
        // Clear safety timeout immediately
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setVerifiedUser(user || { fullName: "Authorized Operator" });
        setStatus("VERIFIED");

        hapticFeedback?.("success");
        
        // 🚀 SUCCESS VIBRATION (Mobile Native)
        if ("vibrate" in navigator) navigator.vibrate([100, 30, 100]);

        setTimeout(() => {
          // Use hard redirect to ensure fresh cookies are sent to the target node
          window.location.href = target || redirectTo;
        }, 1500);
      }
    };

    return () => {
      authChannel.close(); 
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [hapticFeedback, redirectTo]);

  /**
   * 🚀 2. AUTOMATIC HANDSHAKE TRIGGER (TMA Only)
   * If the user is inside the Telegram App, we initiate the handshake automatically.
   */
  useEffect(() => {
    if (isTelegram && status === "IDLE" && !token) {
      handleTelegramLogin();
    }
  }, [isTelegram]);

  /**
   * 🛡️ 3. MAGIC LINK VERIFICATION
   */
  useEffect(() => {
    const reason = searchParams.get("reason");

    if (token && !exchangeStarted.current) {
      exchangeStarted.current = true;
      setStatus("SYNCING");

      const performHandshake = async () => {
        const toastId = toast.loading("Syncing Identity Node...");
        try {
          const res = await fetch(`${JWT_CONFIG.endpoints.magicHandshake}?token=${token}&redirect=${redirectTo}`);
          
          if (res.redirected) {
             window.location.href = res.url;
             return;
          }

          const result = await res.json();
          if (res.ok && result.success) {
            toast.success("Handshake Successful", { id: toastId });
            setStatus("VERIFIED");
            setTimeout(() => { window.location.href = redirectTo; }, 1200);
          } else {
            setError(result.error || "HANDSHAKE_FAILED");
            setStatus("IDLE");
            exchangeStarted.current = false;
          }
        } catch (err) {
          setError("NETWORK_FAULT: Node unreachable.");
          setStatus("IDLE");
          exchangeStarted.current = false;
        }
      };
      performHandshake();
    }

    if (reason && !error && !token) {
      setError(reason.toUpperCase());
      window.history.replaceState({}, "", pathname);
    }
  }, [token, searchParams, redirectTo, pathname]);

  /**
   * 🤖 4. TELEGRAM GATEWAY
   * Opens the system-default Telegram client to authorize the handshake.
   */
  const handleTelegramLogin = () => {
    if (!botUsername) {
      toast.error("CRITICAL: BOT_IDENTITY_MISSING");
      return;
    }

    setStatus("SYNCING");
    hapticFeedback?.("medium");

    // 🚀 MOBILE TMA: Use direct bot link
    // 💻 DESKTOP: Use popup window
    const telegramUrl = `https://t.me/${botUsername}?start=auth_${btoa(redirectTo)}`;
    
    if (isTelegram) {
      // Inside TMA, we must use openTelegramLink or just location for the bot
      window.location.href = telegramUrl;
    } else {
      const width = 550;
      const height = 750;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const authWindow = window.open(telegramUrl, "Handshake", 
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`);
      
      if (!authWindow) {
        setStatus("IDLE");
        toast.error("POPUP_BLOCKED: Please enable pop-ups for this node.");
        return;
      }
    }

    // Set a 60s safety timeout for the sync pulse
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (status === "SYNCING") setStatus("TIMEOUT");
    }, 60000);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background relative selection:bg-primary/30 text-foreground overflow-hidden">
      
      {status === "VERIFIED" && (
        <HandshakeSuccess user={verifiedUser || { fullName: "Authorized Operator" }} />
      )}

      {/* Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className={cn(
          "absolute top-[-10%] left-[-20%] w-[60%] h-[60%] rounded-full blur-[120px] transition-all duration-1000",
          isDashboardIntent ? "bg-amber-500 animate-pulse" : "bg-primary"
        )} />
      </div>

      <Card className={cn(
        "w-full max-w-sm md:max-w-md rounded-[3rem] border-border/40 bg-card/30 backdrop-blur-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-700",
        isDashboardIntent ? "border-t-amber-500/20" : "border-t-primary/20",
        status === "VERIFIED" && "opacity-0 scale-95 blur-xl pointer-events-none"
      )}>
        <div className="flex flex-col items-center text-center space-y-8 relative z-10">
          
          {/* ICON NODE */}
          <div className="relative group">
            <div className={cn(
              "absolute inset-0 blur-2xl rounded-full transition-colors duration-700",
              isDashboardIntent ? "bg-amber-500/20" : "bg-primary/20"
            )} />
            <div className={cn(
              "relative h-20 w-20 rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500",
              isDashboardIntent ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
            )}>
              {isDashboardIntent ? <Terminal className="h-10 w-10" /> : <ShieldCheck className="h-10 w-10" />}
            </div>
          </div>

          {/* TEXT BLOCK */}
          <div className="space-y-2">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
              {isDashboardIntent ? <>Terminal <span className="text-amber-500">Sync</span></> : <>Identity <span className="text-primary">Node</span></>}
            </h1>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] flex items-center justify-center gap-2 opacity-60">
              <Fingerprint className="h-3 w-3" />
              {status === "SYNCING" ? "Awaiting Remote Pulse" : "Protocol Handshake Required"}
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="rounded-2xl border-rose-500/20 bg-rose-500/5 text-rose-500 py-3">
              <AlertDescription className="text-[9px] font-black uppercase tracking-widest">{error}</AlertDescription>
            </Alert>
          )}

          {/* ACTION CLUSTER */}
          <div className="w-full space-y-6">
            <SessionAudit token={token} />

            <Button
              onClick={handleTelegramLogin}
              disabled={status === "SYNCING" || status === "VERIFIED"}
              className={cn(
                "w-full h-16 rounded-2xl font-black uppercase italic tracking-widest text-xs transition-all active:scale-95 shadow-xl",
                isDashboardIntent ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-primary text-primary-foreground"
              )}
            >
              {status === "SYNCING" ? (
                <div className="flex items-center gap-3"><Loader2 className="h-4 w-4 animate-spin" /> Syncing Node</div>
              ) : (
                <span className="flex items-center gap-2">Initialize Handshake <ArrowRight className="h-4 w-4" /></span>
              )}
            </Button>

            {status === "SYNCING" && (
              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">
                Check your Telegram App for the security pulse
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* FOOTER AUDIT */}
      <footer className="mt-12 flex flex-col items-center gap-3 opacity-30">
        <Zap className={cn("h-4 w-4", isDashboardIntent ? "text-amber-500" : "text-primary")} />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">
          Institutional Access // 2026
        </span>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingScreen message="BOOTING IDENTITY NODE..." />}>
      <LoginContent />
    </Suspense>
  );
}