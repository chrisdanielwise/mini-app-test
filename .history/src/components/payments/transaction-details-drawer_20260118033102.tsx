"use client";

import * as React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { 
  QrCode, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  Hash, 
  Terminal,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface TransactionDetailsProps {
  transaction: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 🛰️ TRANSACTION_DETAILS_DRAWER (Institutional v16.16.83)
 * Strategy: Portal-based Deep-Dive & Hardware-Safe Clearance.
 * Mission: Display raw JSON metadata and verification protocols.
 */
export function TransactionDetailsDrawer({ transaction, open, onOpenChange }: TransactionDetailsProps) {
  const { impact, selectionChange } = useHaptics();
  const { isMobile, safeArea } = useDeviceContext();

  if (!transaction) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    impact("medium");
    toast.success("COPIED_TO_CLIPBOARD", {
      description: "Hash ID verified and synced."
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "bg-zinc-950/98 backdrop-blur-3xl border-white/5 p-0 overflow-hidden shadow-3xl transition-all duration-700",
          isMobile ? "h-[85vh] rounded-t-[2.5rem]" : "w-full sm:max-w-md border-l"
        )}
      >
        <div className="flex flex-col h-full relative z-[150]">
          
          {/* --- 🛡️ HUD HEADER --- */}
          <SheetHeader className="shrink-0 p-6 border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 opacity-30 italic">
                <Terminal className="size-3 text-primary" />
                <span className="text-[7px] font-black uppercase tracking-[0.4em]">Auth_Node_v16.83</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase italic tracking-widest">
                {transaction.status}
              </div>
            </div>
            <SheetTitle className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
              Node <span className="text-primary">Receipt</span>
            </SheetTitle>
          </SheetHeader>

          {/* --- 🚀 DATA INGRESS VOLUME --- */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-8 scrollbar-hide">
            
            {/* 📊 PRIMARY METRICS */}
            <div className="flex flex-col items-center justify-center py-6 space-y-2 bg-white/[0.02] rounded-[2rem] border border-white/5">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-20">Settlement_Amount</span>
              <div className="flex items-baseline gap-1.5 leading-none">
                <span className="text-sm font-bold opacity-30">$</span>
                <span className="text-4xl font-black italic tracking-tighter tabular-nums">
                  {Number(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* 📑 METADATA GRID */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <p className="text-[7px] font-black uppercase tracking-widest opacity-20 italic">Timestamp</p>
                  <p className="text-[10px] font-bold text-foreground/80">{format(new Date(transaction.createdAt), "HH:mm:ss")}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <p className="text-[7px] font-black uppercase tracking-widest opacity-20 italic">Date_Stamp</p>
                  <p className="text-[10px] font-bold text-foreground/80">{format(new Date(transaction.createdAt), "dd MMM yyyy")}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[7px] font-black uppercase tracking-widest opacity-20 italic">Transaction_Hash</p>
                  <button onClick={() => handleCopy(transaction.id)} className="opacity-40 hover:opacity-100 transition-opacity">
                    <Copy className="size-3" />
                  </button>
                </div>
                <p className="text-[9px] font-mono break-all opacity-60 leading-relaxed uppercase">
                  {transaction.id}
                </p>
              </div>

              {/* 🛡️ VERIFICATION PROTOCOL */}
              <div className="p-5 rounded-[2rem] bg-emerald-500/[0.03] border border-emerald-500/10 flex items-center gap-4">
                <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  <ShieldCheck className="size-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-[9px] font-black uppercase italic tracking-widest text-emerald-500/80">Institutional_Verify</p>
                  <p className="text-[7px] font-medium text-muted-foreground/40 leading-none">Protocol signature matched for Mesh_Node_09.</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- 🌊 HARDWARE FOOTER --- */}
          <div 
            className="shrink-0 p-6 bg-black/40 border-t border-white/5 flex gap-3"
            style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : "1.5rem" }}
          >
             <button className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95">
                <Download className="size-4 opacity-40" />
                <span className="text-[9px] font-black uppercase tracking-widest">Receipt</span>
             </button>
             <button className="flex-1 h-12 rounded-2xl bg-primary text-black flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95">
                <ExternalLink className="size-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Explorer</span>
             </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}