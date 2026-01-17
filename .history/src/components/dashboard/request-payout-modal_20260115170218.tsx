"use client";

import * as React from "react";
import { useState, useActionState, useEffect, useCallback } from "react";
import { requestPayoutAction } from "@/lib/actions/payout.actions";

// 🌊 WATER UI NODES
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
  Activity
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
 * 🌊 REQUEST_PAYOUT_MODAL (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Kinetic Ingress | Vapour-Glass depth.
 * Logic: morphology-aware safe-area clamping with high-pressure balance monitoring.
 */
export function RequestPayoutModal({
  merchantId,
  availableBalance,
}: RequestPayoutModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  
  const { impact, notification } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile, screenSize, safeArea } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";
  const [state, formAction, isPending] = useActionState(requestPayoutAction, null);
  const balanceValue = Number(availableBalance) || 0;

  // 🔄 HYDRATION SYNC: Physical Feedback Loop
  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("LIQUIDATION_COMPLETE", { description: "Broadcasted to finance mesh." });
      setOpen(false);
      setAmount("");
    }
    if (state?.error && !isPending) {
      notification("error");
    }
  }, [state, isPending, notification]);

  if (!isReady) return null;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Logic: Balancing geometry for 6-tier hardware spectrum.
   */
  const modalRadius = isMobile ? "rounded-t-[3rem] rounded-b-none" : "rounded-[3.5rem]";
  const containerPadding = screenSize === 'xs' ? "p-8" : "p-14";

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); impact("light"); }}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className={cn(
            "rounded-2xl md:rounded-3xl h-14 md:h-16 px-8 shadow-apex transition-all hover:scale-105 active:scale-95 group",
            isStaff ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-white shadow-primary/20"
          )}
        >
          <div className="size-6 rounded-lg bg-black/10 flex items-center justify-center mr-3 transition-transform group-hover:rotate-12">
            <Banknote className="size-4" />
          </div>
          <span className="font-black uppercase italic tracking-widest text-[10px]">Initialize_Liquidation</span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "max-w-2xl border-white/5 bg-background/60 backdrop-blur-3xl shadow-apex p-0 overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          modalRadius,
          isMobile ? "fixed bottom-0 translate-y-0" : ""
        )}
        style={{ 
          maxHeight: isMobile ? '94vh' : '85vh',
        }}
      >
        {/* 🌫️ VAPOUR MASK: Subsurface Kinetic Radiance */}
        <div className={cn(
          "absolute inset-0 opacity-10 blur-[100px] pointer-events-none transition-colors duration-[2000ms]",
          isStaff ? "bg-amber-500" : "bg-primary"
        )} />

        <form action={formAction} className="flex flex-col h-full relative z-10">
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className={cn("flex-1 overflow-y-auto space-y-12 custom-scrollbar", containerPadding)}>
            <DialogHeader className="space-y-6">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "size-14 md:size-16 rounded-2xl md:rounded-[1.8rem] flex items-center justify-center shadow-inner border transition-all duration-700",
                  isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                )}>
                  {isStaff ? <Globe className="size-7" /> : <Wallet className="size-7" />}
                </div>
                <div>
                  <DialogTitle className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">
                    Asset <span className={isStaff ? "text-amber-500" : "text-primary"}>Liquidation</span>
                  </DialogTitle>
                  <div className="flex items-center gap-3 mt-2 opacity-30 italic">
                    <Activity className="size-3 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Mesh_Terminal_v16.31</span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* --- 💰 HIGH-PRESSURE LIQUIDITY INPUT --- */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="flex justify-between items-end px-3">
                <Label className={cn("text-[10px] md:text-[11px] font-black uppercase italic tracking-[0.5em]", isStaff ? "text-amber-500" : "text-primary")}>
                  Liquidity_Amount
                </Label>
                <button
                  type="button"
                  onClick={() => { impact("heavy"); setAmount(balanceValue.toString()); }}
                  className={cn(
                    "text-[9px] font-black uppercase transition-all italic tracking-widest border-b-2",
                    isStaff ? "text-amber-500/60 border-amber-500/10 hover:text-amber-500" : "text-primary/60 border-primary/10 hover:text-white"
                  )}
                >
                  MAX: ${balanceValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </button>
              </div>
              
              <div className="relative group">
                <span className={cn(
                  "absolute left-8 top-1/2 -translate-y-1/2 font-black text-4xl opacity-10 group-focus-within:opacity-100 transition-opacity",
                  isStaff ? "text-amber-500" : "text-primary"
                )}>
                  $
                </span>
                <Input
                  name="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className={cn(
                    "h-24 md:h-32 pl-16 rounded-[2rem] md:rounded-[2.8rem] bg-white/[0.03] border-white/5 font-black text-4xl md:text-6xl tracking-tighter italic transition-all",
                    isStaff ? "focus:border-amber-500/40 focus:bg-amber-500/[0.05]" : "focus:border-primary/40 focus:bg-primary/[0.05]"
                  )}
                />
              </div>
            </div>

            {/* --- 📡 NETWORK PROTOCOL GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-4">
                <Label className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 ml-2">Liquidation_Protocol</Label>
                <div className="relative group">
                  <ArrowRightLeft className={cn("absolute left-6 top-1/2 -translate-y-1/2 size-4 opacity-20 pointer-events-none group-focus-within:opacity-100 transition-opacity", isStaff ? "text-amber-500" : "text-primary")} />
                  <select
                    name="method"
                    className="h-16 md:h-20 w-full rounded-2xl md:rounded-[1.8rem] border border-white/5 bg-white/[0.03] pl-16 pr-8 text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer outline-none focus:bg-white/[0.06] transition-all appearance-none"
                  >
                    <option value="USDT_TRC20">USDT_TRC20 (FAST_MESH)</option>
                    <option value="USDT_ERC20">USDT_ERC20 (STABLE_ETH)</option>
                    <option value="BANK_TRANSFER">BANK_SWIFT (INSTITUTIONAL)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 ml-2">Destination_ID</Label>
                <div className="relative group">
                  <Terminal className={cn("absolute left-6 top-1/2 -translate-y-1/2 size-4 opacity-20 group-focus-within:opacity-100 transition-opacity", isStaff ? "text-amber-500" : "text-primary")} />
                  <Input
                    name="destination"
                    placeholder="ENTER_ADDRESS_HASH"
                    required
                    className="h-16 md:h-20 pl-16 rounded-2xl md:rounded-[1.8rem] bg-white/[0.03] border-white/5 font-mono text-[11px] font-black uppercase tracking-widest focus:bg-white/[0.06]"
                  />
                </div>
              </div>
            </div>

            {/* --- OPERATIONAL NOTICE --- */}
            <div className={cn("rounded-3xl border p-6 flex items-start gap-5 transition-all", isStaff ? "bg-amber-500/5 border-amber-500/10" : "bg-primary/5 border-primary/10")}>
              <Info className={cn("size-5 shrink-0 mt-1", isStaff ? "text-amber-500" : "text-primary")} />
              <p className="text-[9px] md:text-[11px] font-black text-muted-foreground/40 uppercase leading-relaxed tracking-[0.15em] italic">
                Withdrawals audited by <span className="text-foreground not-italic">Mesh_Finance_Oversight</span>.
                Latency: ~24h Cluster Sync. Protocol verification is immutable once synchronized.
              </p>
            </div>
          </div>

          {/* --- TERMINAL FOOTER --- */}
          <div 
            className="p-8 md:p-12 border-t border-white/5 bg-white/[0.02] flex flex-col md:flex-row items-center justify-end gap-6 backdrop-blur-2xl transition-all duration-700"
            style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : '3rem' }}
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="w-full md:w-auto h-14 px-10 rounded-2xl md:rounded-3xl font-black uppercase italic tracking-widest text-[9px] opacity-30 hover:opacity-100"
            >
              Abort_Liquidation
            </Button>
            <Button
              type="submit"
              disabled={isPending || balanceValue <= 0}
              className={cn(
                "w-full md:flex-1 h-14 md:h-20 rounded-2xl md:rounded-3xl shadow-apex transition-all",
                isStaff ? "bg-amber-500 text-black shadow-amber-500/30" : "bg-primary text-white shadow-primary/30"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="size-5 animate-spin" />
                  <span className="font-black uppercase italic tracking-widest text-[10px]">Syncing_Block...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-6" />
                  <span className="font-black uppercase italic tracking-widest text-[10px]">Authorize_Liquidation</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}