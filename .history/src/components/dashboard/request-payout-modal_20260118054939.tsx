"use client";

import * as React from "react";
import { useState, useActionState, useEffect } from "react";
import { requestPayoutAction } from "@/lib/actions/payout.actions";

// 🏛️ INSTITUTIONAL UI NODES
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 🛠️ UTILS & TELEMETRY
import {
  Banknote,
  Loader2,
  ShieldCheck,
  Wallet,
  Info,
  Terminal,
  ArrowRightLeft,
  Globe,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useLayout } from "@/context/layout-provider";
import { useDeviceContext } from "@/components/providers/device-provider";

interface RequestPayoutModalProps {
  merchantId: string;
  availableBalance: number | string;
}

/**
 * 🛰️ REQUEST_PAYOUT_MODAL (Institutional Apex v2026.1.20)
 * Logic: Merged Legacy Server Action with Hardened 2026 Chassis.
 * Strategy: Bottom-Sheet Ingress (Mobile) / Tactical Dialog (Desktop).
 */
export function RequestPayoutModal({
  merchantId,
  availableBalance,
}: RequestPayoutModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  
  const { impact, notification } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";
  const balanceValue = Number(availableBalance) || 0;

  // 🛡️ LEGACY LOGIC INTEGRATION: Action State Management
  const [state, formAction, isPending] = useActionState(requestPayoutAction, null);

  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("LIQUIDATION_INITIALIZED", {
        description: "Request dispatched to finance node."
      });
      setOpen(false);
      setAmount("");
    }
    if (state?.error && !isPending) {
      notification("error");
    }
  }, [state, isPending, notification]);

  if (!isReady) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); impact("light"); }}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className={cn(
            "rounded-xl h-12 md:h-14 px-6 md:px-8 shadow-apex transition-all active:scale-95 group",
            isStaff ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-primary-foreground shadow-primary/20"
          )}
        >
          <Banknote className="size-4 md:size-5 mr-2 transition-transform group-hover:rotate-12" />
          <span className="font-black uppercase italic tracking-widest text-[10px] md:text-xs">
            Request Liquidation
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "max-w-xl border-white/5 bg-zinc-950/90 backdrop-blur-3xl p-0 overflow-hidden shadow-2xl transition-all duration-500",
          isMobile 
            ? "fixed bottom-0 rounded-t-[2.5rem] w-full translate-y-0 translate-x-0 left-0 right-0 border-t" 
            : "rounded-[2.5rem]"
        )}
      >
        <form action={formAction} className="flex flex-col h-full relative z-10">
          <input type="hidden" name="merchantId" value={merchantId} />

          {/* --- 🛡️ FIXED HUD: Compressed Strategic Header --- */}
          <div className="shrink-0 p-6 md:p-8 border-b border-white/5 bg-white/[0.02]">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "size-10 md:size-12 rounded-xl flex items-center justify-center border shadow-inner",
                  isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                )}>
                  {isStaff ? <Globe className="size-6" /> : <Wallet className="size-6" />}
                </div>
                <div className="leading-none">
                  <DialogTitle className="text-xl md:text-3xl font-black italic uppercase tracking-tighter text-foreground">
                    Asset <span className={isStaff ? "text-amber-500" : "text-primary"}>Liquidation</span>
                  </DialogTitle>
                  <p className="text-[7.5px] md:text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] mt-2 italic">
                    Institutional Protocol // Ref: {merchantId.slice(0, 8)}
                  </p>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* --- 🚀 TACTICAL CONTENT RESERVOIR --- */}
          <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-h-[70vh] scrollbar-hide">
            
            {/* Amount Configuration */}
            <div className="space-y-3">
              <div className="flex justify-between items-end px-1">
                <Label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
                  Liquidity_Amount
                </Label>
                <button
                  type="button"
                  onClick={() => { impact("heavy"); setAmount(balanceValue.toString()); }}
                  className={cn(
                    "text-[8px] md:text-[10px] font-black uppercase border-b transition-all italic",
                    isStaff ? "text-amber-500/60 border-amber-500/20" : "text-primary border-primary/20"
                  )}
                >
                  MAX: ${balanceValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </button>
              </div>
              
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-3xl opacity-10 text-foreground">$</span>
                <Input
                  name="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="h-16 md:h-20 pl-14 rounded-2xl bg-white/[0.02] border-white/5 font-black text-3xl tracking-tighter italic text-foreground focus:ring-0"
                />
              </div>
            </div>

            {/* Protocol Multi-Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] opacity-30 ml-1 italic">Protocol</Label>
                <div className="relative">
                   <ArrowRightLeft className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 opacity-20 pointer-events-none" />
                   <select
                    name="method"
                    className="h-12 w-full rounded-xl border border-white/5 bg-white/[0.02] pl-11 pr-4 text-[9px] font-black uppercase outline-none appearance-none italic text-foreground"
                   >
                    <option value="USDT_TRC20">USDT_TRC20 (Fast)</option>
                    <option value="USDT_ERC20">USDT_ERC20 (Stable)</option>
                    <option value="BANK_TRANSFER">BANK_SWIFT</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] opacity-30 ml-1 italic">Destination</Label>
                <div className="relative">
                   <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 opacity-20 pointer-events-none" />
                   <Input
                    name="destination"
                    placeholder="ENTER_ADDRESS..."
                    required
                    className="h-12 rounded-xl bg-white/[0.02] border-white/5 pl-11 font-mono text-[10px] tracking-widest text-foreground"
                   />
                </div>
              </div>
            </div>

            {/* ERROR FEEDBACK NODE */}
            {state?.error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 flex items-center gap-3 animate-in shake-1">
                <AlertCircle className="size-4 text-rose-500" />
                <p className="text-[9px] font-black uppercase text-rose-500 tracking-widest">{state.error}</p>
              </div>
            )}

            <div className={cn("rounded-2xl border p-5 flex items-start gap-4 shadow-sm", isStaff ? "bg-amber-500/5 border-amber-500/10" : "bg-primary/5 border-primary/10")}>
              <Info className={cn("size-4 shrink-0 mt-0.5", isStaff ? "text-amber-500" : "text-primary")} />
              <p className="text-[8px] md:text-[9px] font-black text-muted-foreground/40 uppercase leading-relaxed tracking-wider italic">
                Withdrawals audited by <span className="text-foreground">Zipha_Finance</span>. 
                Protocol verification is immutable once synchronized on-chain.
              </p>
            </div>
          </div>

          {/* --- 🌊 HARDENED FOOTER: Safe Area Sync --- */}
          <div 
            className="shrink-0 p-6 md:p-8 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-end gap-4"
            style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1.5rem)` : "2rem" }}
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => { impact("light"); setOpen(false); }}
              className="w-full sm:w-auto h-12 px-8 rounded-xl font-black uppercase italic tracking-widest text-[9px] opacity-20 hover:opacity-100 transition-all"
            >
              Abort_Sync
            </Button>
            <Button
              type="submit"
              disabled={isPending || balanceValue <= 0}
              onClick={() => impact("medium")}
              className={cn(
                "w-full sm:min-w-[220px] h-14 md:h-16 rounded-2xl shadow-xl transition-all active:scale-95",
                isStaff ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Provisioning...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Authorize Liquidation</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}