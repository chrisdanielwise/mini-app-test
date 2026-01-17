"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTelegramContext } from "@/components/providers/telegram-provider"; 
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Fingerprint,
  Terminal,
  Loader2,
  Activity
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { SessionAudit } from "@/components/auth/session-audit";
import { HandshakeSuccess } from "@/components/auth/handshake-success"; 
import { JWT_CONFIG } from "@/lib/auth/config";
import { cn } from "@/lib/utils";
import { LoadingScreen } from "@/components/ui/loading-spinner";

/**
 * 🛰️ LOGIN_CONTENT (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Clinical Handshake Hub.
 * Fix: High-density h-11 buttons and shrunken typography prevent blowout.
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
  const redirectTo = searchParams.get("redirect") || "/home";
  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;

  const isDashboardIntent = redirectTo.startsWith("/dashboard");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const authChannel = new BroadcastChannel("zipha_auth_sync");

    authChannel.onmessage = (event) => {
      const { action, target, user } = event.data;
      if (action === "RELOAD_SESSION") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setVerifiedUser(user || { fullName: "Authorized Operator" });
        setStatus("VERIFIED");
        hapticFeedback?.("success");
        if ("vibrate" in navigator) navigator.vibrate([100, 30, 100]);
        setTimeout(() => { window.location.href = target || redirectTo; }, 1500);
      }
    };

    return () => {
      authChannel.close(); 
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [hapticFeedback, redirectTo]);

  useEffect(() => {
    if (isTelegram && status === "IDLE" && !token) handleTelegramLogin();
  }, [isTelegram]);

  useEffect(() => {
    const reason = searchParams.get("reason");
    if (token && !exchangeStarted.current) {
      exchangeStarted.current = true;
      setStatus("SYNCING");

      const performHandshake = async () => {
        try {
          const res = await fetch(`${JWT_CONFIG.endpoints.magicHandshake}?token=${token}&redirect=${redirectTo}`);
          if (res.redirected) { window.location.href = res.url; return; }
          const result = await res.json();
          if (res.ok && result.success) {
            setStatus("VERIFIED");
            setTimeout(() => { window.location.href = redirectTo; }, 1200);
          } else {
            setError(result.error || "HANDSHAKE_FAILED");
            setStatus("IDLE");
            exchangeStarted.current = false;
          }
        } catch (err) {
          setError("NETWORK_FAULT");
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

  const handleTelegramLogin = () => {
    if (!botUsername) { toast.error("BOT_ID_MISSING"); return; }
    setStatus("SYNCING");
    hapticFeedback?.("medium");
    const telegramUrl = `https://t.me/${botUsername}?start=auth_${btoa(redirectTo)}`;
    
    if (isTelegram) {
      window.location.href = telegramUrl;
    } else {
      const width = 550, height = 750;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const authWindow = window.open(telegramUrl, "Handshake", `width=${width},height=${height},top=${top},left=${left}`);
      if (!authWindow) {
        setStatus("IDLE");
        toast.error("POPUP_BLOCKED");
        return;
      }
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (status === "SYNCING") setStatus("TIMEOUT");
    }, 60000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background relative selection:bg-primary/20 text-foreground overflow-hidden">
      
      {status === "VERIFIED" && (
        <HandshakeSuccess user={verifiedUser || { fullName: "Authorized Operator" }} />
      )}

      {/* 🌫️ TACTICAL RADIANCE */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full blur-[100px] transition-all duration-1000",
          isDashboardIntent ? "bg-amber-500" : "bg-primary"
        )} />
      </div>

      <Card className={cn(
        "w-full max-w-sm rounded-2xl border-white/5 bg-zinc-950/40 backdrop-blur-xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-700 leading-none",
        isDashboardIntent ? "border-t-amber-500/20" : "border-t-primary/20",
        status === "VERIFIED" && "opacity-0 scale-95 blur-xl pointer-events-none"
      )}>
        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
          
          {/* ICON NODE: Compressed size-10 */}
          <div className="relative group">
            <div className={cn(
              "relative h-12 w-12 md:h-14 md:w-14 rounded-xl flex items-center justify-center border shadow-inner transition-transform duration-500",
              isDashboardIntent ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
            )}>
              {isDashboardIntent ? <Terminal className="size-6" /> : <ShieldCheck className="size-6" />}
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-foreground">
              {isDashboardIntent ? <>Terminal <span className="text-amber-500">Sync</span></> : <>Identity <span className="text-primary">Node</span></>}
            </h1>
            <div className="flex items-center justify-center gap-2 opacity-20 italic">
              <Fingerprint className="size-3" />
              <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">
                {status === "SYNCING" ? "Awaiting_Pulse" : "Handshake_Required"}
              </span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="rounded-xl border-rose-500/10 bg-rose-500/5 py-2">
              <AlertDescription className="text-[7.5px] font-black uppercase tracking-widest text-rose-500">{error}</AlertDescription>
            </Alert>
          )}

          {/* ACTION HUB: h-11 Standard */}
          <div className="w-full space-y-4">
            <SessionAudit token={token} />

            <Button
              onClick={handleTelegramLogin}
              disabled={status === "SYNCING" || status === "VERIFIED"}
              className={cn(
                "w-full h-11 rounded-xl font-black uppercase italic tracking-widest text-[9px] shadow-lg active:scale-95 transition-all group",
                isDashboardIntent ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
              )}
            >
              {status === "SYNCING" ? (
                <div className="flex items-center gap-2"><Loader2 className="size-3.5 animate-spin" /> Syncing_Node</div>
              ) : (
                <span className="flex items-center gap-2">Initialize_Handshake <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" /></span>
              )}
            </Button>

            {status === "SYNCING" && (
              <div className="flex items-center justify-center gap-2 opacity-10 italic">
                <Activity className="size-2.5 animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-widest">Awaiting_Bot_Confirmation</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <footer className="absolute bottom-8 flex flex-col items-center gap-2 opacity-10">
        <Zap className={cn("size-3", isDashboardIntent ? "text-amber-500" : "text-primary")} />
        <span className="text-[7px] font-black uppercase tracking-[0.4em] italic">
          v16.31_APEX // Authorized_Ingress
        </span>
      </footer>

      {/* 📐 STATIONARY GRID ANCHOR */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingScreen message="BOOTING_IDENTITY_NODE..." />}>
      <LoginContent />
    </Suspense>
  );
}