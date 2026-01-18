"use client";

import * as React from "react";
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Copy, 
  Hash, 
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { Button } from "@/components/ui/button";

/**
 * 🛰️ TRANSACTION_RECEIPT_DRAWER (Institutional v16.36.25)
 * Strategy: Forensic Data Ingress & Viewport Locking.
 * Mission: Provide an immutable visual record of a disbursement event.
 */
export function TransactionReceiptDrawer({ isOpen, onClose, transaction }: any) {
  const { impact, notification } = useHaptics();
  const { isMobile, safeArea } = useDeviceContext();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    impact("medium");
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-xl flex items-end md:items-center justify-center animate-in fade-in duration-300">
      <div 
        className={cn(
          "w-full max-w-lg bg-zinc-950 border-t md:border border-white/5 shadow-3xl flex flex-col overflow-hidden transition-all duration-500",
          isMobile ? "rounded-t-[2.5rem] h-[80vh]" : "rounded-[2.5rem] h-auto max-h-[90vh]"
        )}
        style={{ paddingBottom: isMobile ? safeArea.bottom : 0 }}
      >
        {/* --- 🛡️ FORENSIC HUD --- */}
        <div className="shrink-0 p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <ShieldCheck className="size-5" />
            </div>
            <div className="leading-none">
              <h2 className="text-lg font-black uppercase italic tracking-tighter text-foreground">Audit <span className="text-emerald-500">Receipt</span></h2>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-20">Ref_ID: {transaction.id.slice(0, 12)}</p>
            </div>
          </div>
          <button onClick={onClose} className="size-10 rounded-xl bg-white/5 flex items-center justify-center active:scale-90 transition-transform">
            <X className="size-5 opacity-40" />
          </button>
        </div>

        {/* --- 🚀 LAMINAR RECEIPT VOLUME --- */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* 💰 PRIMARY TELEMETRY */}
          <div className="text-center space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic">Disbursement_Value</p>
            <div className="flex items-center justify-center gap-2">
               <span className="text-4xl md:text-5xl font-black italic tracking-tighter tabular-nums">${parseFloat(transaction.amount).toLocaleString()}</span>
               <span className="text-xs font-black opacity-20 mt-4">{transaction.currency}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-widest italic">
               <CheckCircle2 className="size-3" />
               {transaction.status}
            </div>
          </div>

          {/* 📊 METADATA GRID */}
          <div className="grid grid-cols-1 gap-4">
             <DataNode label="Network_Protocol" value={transaction.method} icon={Globe} />
             <DataNode label="Time_Stamp" value={transaction.createdAt} icon={Clock} />
             
             <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                   <p className="text-[8px] font-black uppercase tracking-widest opacity-20 italic">Destination_Node</p>
                   <button onClick={() => handleCopy(transaction.destination)} className="text-primary opacity-40 hover:opacity-100 transition-opacity">
                      <Copy className="size-3" />
                   </button>
                </div>
                <p className="text-[11px] font-mono font-bold tracking-widest break-all leading-relaxed text-foreground/60">{transaction.destination}</p>
             </div>

             <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                   <p className="text-[8px] font-black uppercase tracking-widest opacity-20 italic">Blockchain_TX_Hash</p>
                   <button onClick={() => handleCopy(transaction.txHash)} className="text-primary opacity-40 hover:opacity-100 transition-opacity">
                      <Copy className="size-3" />
                   </button>
                </div>
                <p className="text-[10px] font-mono font-bold tracking-tighter break-all text-primary/60">{transaction.txHash || "PENDING_ON_CHAIN"}</p>
             </div>
          </div>
        </div>

        {/* --- 🕹️ TERMINAL ACTION HUB --- */}
        <div className="shrink-0 p-8 border-t border-white/5 bg-white/[0.01]">
          <Button 
            asChild
            onClick={() => impact("medium")}
            className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase italic tracking-widest text-[11px] hover:bg-white/10 transition-all"
          >
            <a href={`https://tronscan.org/#/transaction/${transaction.txHash}`} target="_blank" rel="noopener noreferrer">
              Verify on Explorer <ExternalLink className="ml-2 size-4 opacity-40" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function DataNode({ label, value, icon: Icon }: any) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
       <div className="space-y-1">
          <p className="text-[8px] font-black uppercase tracking-widest opacity-20 italic">{label}</p>
          <p className="text-xs font-black italic tracking-tight text-foreground/80">{value}</p>
       </div>
       <Icon className="size-4 opacity-20" />
    </div>
  );
}