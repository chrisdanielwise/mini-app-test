"use client";

import { useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { ShieldAlert, RefreshCw, Terminal, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SubscribersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("SUBSCRIBER_LEDGER_CRITICAL:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
        
        {/* --- DANGER ICON --- */}
        <div className="relative mx-auto w-24 h-24">
           <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full animate-pulse" />
           <div className="relative h-24 w-24 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-2xl">
              <ShieldAlert className="h-10 w-10" />
           </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">
            Protocol <span className="text-rose-500">Interrupted</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">
            Identity Cluster Sync Failure // Error_Code: {error.digest?.slice(0, 8) || "UNKNOWN"}
          </p>
        </div>

        <div className="p-6 rounded-[2rem] bg-muted/10 border border-border/40 flex items-center gap-4 text-left">
           <Terminal className="h-5 w-5 text-rose-500 shrink-0" />
           <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed tracking-widest">
            The system failed to synchronize the subscriber ledger. This may be due to a node timeout or encryption mismatch.
           </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            onClick={() => reset()}
            className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-[1.05] transition-transform"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Recalibrate Sync
          </Button>
          
          <Link href="/dashboard">
            <Button variant="ghost" className="h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest opacity-40 hover:opacity-100 transition-all">
               <ArrowLeft className="mr-2 h-4 w-4" /> Abort to HUD
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}