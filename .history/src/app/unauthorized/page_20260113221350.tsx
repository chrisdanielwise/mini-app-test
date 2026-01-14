"use client";

import { useState } from "react";
import { ShieldAlert, Terminal, ArrowLeft, Lock, Info, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useTelegramContext } from "@/components/telegram/te";

export default function UnauthorizedPage() {
  const { hapticFeedback } = useTelegramContext();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestAccess = async () => {
    setIsRequesting(true);
    hapticFeedback?.("medium");
    
    try {
      // Logic: Pings the bot to notify Super Admins
      const res = await fetch("/api/auth/request-access", { method: "POST" });
      
      if (res.ok) {
        toast.success("ACCESS_REQUEST_DISPATCHED: Awaiting Admin Handshake");
        hapticFeedback?.("success");
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("PROTOCOL_ERROR: Request node unreachable");
      hapticFeedback?.("error");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background relative selection:bg-rose-500/30 text-foreground overflow-hidden">
      {/* ... Ambient Glow Code ... */}

      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-20 w-20 rounded-[2rem] bg-rose-500/10 border-2 border-rose-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="h-10 w-10 text-rose-500" />
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-rose-500">
            Clearance <span className="text-foreground">Denied</span>
          </h1>
        </div>

        <div className="bg-card/40 border border-rose-500/10 rounded-[2.5rem] backdrop-blur-3xl p-8 space-y-6">
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-rose-500/60">
                <Lock className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase tracking-widest italic">RBAC_INTERCEPT_V4</span>
             </div>
             <p className="text-xs font-bold text-muted-foreground uppercase italic leading-relaxed">
               Target node requires high-clearance identity anchors.
             </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleRequestAccess}
              disabled={isRequesting}
              className="w-full h-14 rounded-2xl bg-rose-500 text-white hover:bg-rose-600 font-black uppercase italic tracking-widest text-[11px] transition-all"
            >
              <Send className="mr-2 h-4 w-4" />
              {isRequesting ? "Dispatching Signal..." : "Request Admin Clearance"}
            </Button>

            <Link href="/home" className="block">
              <Button variant="ghost" className="w-full h-14 rounded-2xl border border-border/10 font-black uppercase italic tracking-widest text-[11px] opacity-60">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}