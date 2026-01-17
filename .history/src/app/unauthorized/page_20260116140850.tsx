"use client";

import { useState } from "react";
import { ShieldAlert, ArrowLeft, Lock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { cn } from "@/lib/utils";

/**
 * 🛰️ UNAUTHORIZED_GATE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density h-11 buttons and shrunken typography prevent layout blowout.
 */
export default function UnauthorizedPage() {
  const { webApp } = useTelegramContext();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestAccess = async () => {
    setIsRequesting(true);
    webApp?.HapticFeedback?.impactOccurred("medium");
    
    try {
      const res = await fetch("/api/auth/request-access", { method: "POST" });
      
      if (res.ok) {
        toast.success("SIGNAL_DISPATCHED: Awaiting Handshake");
        webApp?.HapticFeedback?.notificationOccurred("success");
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("PROTOCOL_ERROR: Node unreachable");
      webApp?.HapticFeedback?.notificationOccurred("error");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background relative selection:bg-rose-500/20 text-foreground overflow-hidden leading-none">
      
      <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700 relative z-10">
        
        {/* --- 🛡️ FIXED HUD: Shield Node --- */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative size-14 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-2xl">
            <ShieldAlert className="size-7 text-rose-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-rose-500">
            Clearance <span className="text-foreground/80">Denied</span>
          </h1>
        </div>

        {/* --- INTERCEPT BLOCK: Tactical Slim --- */}
        <div className="bg-zinc-950/40 border border-rose-500/10 rounded-2xl backdrop-blur-xl p-5 md:p-6 space-y-5 shadow-2xl">
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-rose-500/40 italic">
                <Lock className="size-2.5" />
                <span className="text-[7.5px] font-black uppercase tracking-widest">RBAC_INTERCEPT_v16</span>
             </div>
             <p className="text-[9px] font-black text-muted-foreground/40 uppercase italic leading-tight">
               Identity signature lacks requisite clearance for target node egress.
             </p>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handleRequestAccess}
              disabled={isRequesting}
              className={cn(
                "w-full h-11 rounded-xl bg-rose-500 text-white hover:bg-rose-600 active:scale-95",
                "font-black uppercase italic tracking-widest text-[9px] transition-all shadow-lg"
              )}
            >
              <Send className="mr-2 size-3.5" />
              {isRequesting ? "Dispatching..." : "Request Clearance"}
            </Button>

            <Link href="/home" className="block">
              <Button variant="ghost" className="w-full h-11 rounded-xl border border-white/5 font-black uppercase italic tracking-widest text-[9px] opacity-20 hover:opacity-100">
                <ArrowLeft className="mr-2 size-3.5" />
                Return to Core
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 🏛️ STATIONARY GRID ANCHOR */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center" />
    </div>
  );
}