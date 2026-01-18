"use client";

import * as React from "react";
import { 
  X, 
  ArrowUpRight, 
  Wallet, 
  ShieldCheck, 
  Zap, 
  AlertCircle,
  ArrowRight,
  Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { Button } from "@/components/ui/button";

/**
 * 🛰️ SETTLEMENT_REQUEST_DRAWER (Institutional v16.36.10)
 * Strategy: Multi-Stage Kinetic Handshake.
 * Mission: Secure fund disbursement with dynamic hardware clearance.
 */
export function SettlementRequestDrawer({ isOpen, onClose, balance = 4250.75 }: any) {
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const [amount, setAmount] = React.useState("");
  const [stage, setStage] = React.useState<"INPUT" | "CONFIRM" | "SUCCESS">("INPUT");

  const fee = parseFloat(amount || "0") * 0.01; // 1% Protocol Fee
  const netAmount = parseFloat(amount || "0") - fee;

  const handleNext = () => {
    impact("medium");
    setStage("CONFIRM");
  };

  const handleFinalize = async () => {
    impact("heavy");
    notification("warning");
    setStage("SUCCESS");
    
    // 🚀 ATOMIC_SETTLEMENT: Handshake with Mesh Node
    await new Promise(r => setTimeout(r, 2000));
    notification("success");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-xl flex items-end md:items-center justify-center animate-in fade-in duration-300">
      <div 
        className={cn(
          "w-full max-w-lg bg-zinc-950 border-t md:border border-white/5 shadow-3xl flex flex-col overflow-hidden transition-all duration-500",
          isMobile ? "rounded-t-[2.5rem] h-[85vh]" : "rounded-[2.5rem] h-auto"
        )}
        style={{ paddingBottom: isMobile ? safeArea.bottom : 0 }}
      >
        {/* --- 🛡️ DRAWER HUD --- */}
        <div className="shrink-0 p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Wallet className="size-5" />
            </div>
            <div className="leading-none">
              <h2 className="text-lg font-black uppercase italic tracking-tighter">New <span className="text-primary">Settlement</span></h2>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-20">Protocol_v16.36</p>
            </div>
          </div>
          <button onClick={onClose} className="size-10 rounded-xl bg-white/5 flex items-center justify-center active:scale-90 transition-transform">
            <X className="size-5 opacity-40" />
          </button>
        </div>

        {/* --- 🚀 KINETIC STAGE CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {stage === "INPUT" && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30 italic">Available_Liquidity</p>
                <p className="text-3xl font-black italic tracking-tighter tabular-nums">${balance.toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-2 italic">Disbursement_Amount</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black opacity-20">$</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-20 bg-white/[0.03] border border-white/10 rounded-2xl px-12 text-3xl font-black italic tracking-tighter tabular-nums focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 leading-none">
                    <p className="text-[7px] font-black uppercase opacity-20 mb-2">Network_Fee</p>
                    <p className="text-sm font-bold tabular-nums opacity-60">${fee.toFixed(2)}</p>
                 </div>
                 <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 leading-none">
                    <p className="text-[7px] font-black uppercase opacity-20 mb-2">Net_Received</p>
                    <p className="text-sm font-black text-primary tabular-nums">${netAmount > 0 ? netAmount.toFixed(2) : "0.00"}</p>
                 </div>
              </div>
            </div>
          )}

          {stage === "CONFIRM" && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500 text-center py-10">
               <div className="size-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Fingerprint className="size-10 text-primary animate-pulse" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Verify <span className="text-primary">Disbursement</span></h3>
                  <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Target: USDT_TRC20 // 0x...8E4F</p>
               </div>
               <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-2">Total_To_Send</p>
                  <p className="text-4xl font-black italic tracking-tighter text-primary tabular-nums">${parseFloat(amount).toLocaleString()}</p>
               </div>
            </div>
          )}
        </div>

        {/* --- 🕹️ TACTICAL ACTION HUB --- */}
        <div className="shrink-0 p-8 border-t border-white/5 bg-white/[0.01]">
          {stage === "INPUT" && (
            <Button 
              disabled={!amount || parseFloat(amount) <= 0}
              onClick={handleNext}
              className="w-full h-16 rounded-2xl bg-primary text-black font-black uppercase italic tracking-widest text-[11px] group"
            >
              Verify Liquidity <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}

          {stage === "CONFIRM" && (
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setStage("INPUT")}
                className="h-16 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest"
              >
                Abort
              </Button>
              <Button 
                onClick={handleFinalize}
                className="h-16 rounded-2xl bg-primary text-black font-black uppercase italic tracking-widest text-[11px] shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              >
                Confirm Sync
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}