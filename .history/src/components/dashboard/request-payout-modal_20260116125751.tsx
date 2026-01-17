"use client";

import * as React from "react";
import { useState, useActionState, useEffect, useCallback } from "react";
import { requestPayoutAction } from "@/lib/actions/payout.actions";

// 🌊 INSTITUTIONAL UI NODES
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
 * 🛰️ REQUEST_PAYOUT_MODAL (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density inputs (h-16) and shrunken header volume prevents blowout.
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
  const [state, formAction, isPending] = useActionState(requestPayoutAction, null);
  const balanceValue = Number(availableBalance) || 0;

  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("LIQUIDATION_COMPLETE");
      setOpen(false);
      setAmount("");
    }
    if (state?.error && !isPending) notification("error");
  }, [state, isPending, notification]);

  if (!isReady) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); impact("light"); }}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className={cn(
            "rounded-xl h-11 px-5 shadow-apex transition-all active:scale-95 group",
            isStaff ? "bg-amber-500 text-black" : "bg-primary text-white"
          )}
        >
          <Banknote className="size-3.5 mr-2 transition-transform group-hover:rotate-12" />
          <span className="font-black uppercase italic tracking-widest text-[9px]">Initialize_Liquidation</span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "max-w-lg border-white/5 bg-background/80 backdrop-blur-xl p-0 overflow-hidden shadow-2xl",
          isMobile ? "fixed bottom-0 rounded-t-3xl w-full" : "rounded-2xl"
        )}
      >
        <form action={formAction} className="flex flex-col h-full relative z-10">
          <input type="hidden" name="merchantId" value={merchantId} />

          {/* --- 🛡️ FIXED HUD: Compressed Header --- */}
          <div className="shrink-0 p-6 border-b border-white/5 bg-white/[0.02]">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "size-10 rounded-xl flex items-center justify-center border shadow-inner",
                  isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                )}>
                  {isStaff ? <Globe className="size-5" /> : <Wallet className="size-5" />}
                </div>
                <div className="leading-none">
                  <DialogTitle className="text-xl font-black italic uppercase tracking-tighter text-foreground">
                    Asset <span className={isStaff ? "text-amber-500" : "text-primary"}>Liquidation</span>
                  </DialogTitle>
                  <p className="text-[7.5px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] mt-1.5 italic">Mesh_Terminal_v16.31</p>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* --- 🚀 TACTICAL SLIM CONTENT --- */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
            
            {/* Liquidity Input: Compressed h-16 */}
            <div className="space-y-2">
              <div className="flex justify-between items-end px-1">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">Liquidity_Amount</Label>
                <button
                  type="button"
                  onClick={() => { impact("heavy"); setAmount(balanceValue.toString()); }}
                  className="text-[8px] font-black uppercase text-primary border-b border-primary/20 hover:border-primary transition-all"
                >
                  MAX: ${balanceValue.toLocaleString()}
                </button>
              </div>
              
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-2xl opacity-10 text-foreground">$</span>
                <Input
                  name="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="h-16 pl-10 rounded-xl bg-white/[0.02] border-white/5 font-black text-3xl tracking-tighter italic"
                />
              </div>
            </div>

            {/* Protocol Grid: Slim h-11 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.4em] opacity-30 ml-1 italic">Protocol</Label>
                <select
                  name="method"
                  className="h-11 w-full rounded-xl border border-white/5 bg-white/[0.02] px-4 text-[9px] font-black uppercase outline-none appearance-none italic"
                >
                  <option value="USDT_TRC20">USDT_TRC20</option>
                  <option value="USDT_ERC20">USDT_ERC20</option>
                  <option value="BANK_TRANSFER">BANK_SWIFT</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.4em] opacity-30 ml-1 italic">Destination</Label>
                <Input
                  name="destination"
                  placeholder="ADDRESS_HASH..."
                  required
                  className="h-11 rounded-xl bg-white/[0.02] border-white/5 font-mono text-[10px] tracking-widest"
                />
              </div>
            </div>

            {/* Operational Notice */}
            <div className={cn("rounded-xl border p-4 flex items-start gap-3", isStaff ? "bg-amber-500/5 border-amber-500/10" : "bg-primary/5 border-primary/10")}>
              <Info className="size-3.5 shrink-0 mt-0.5 opacity-40" />
              <p className="text-[7.5px] font-black text-muted-foreground/40 uppercase leading-relaxed tracking-[0.1em] italic">
                Withdrawals audited by <span className="text-foreground">Mesh_Finance</span>. 
                Latency: ~24h Cluster Sync.
              </p>
            </div>
          </div>

          {/* --- 🌊 SLIM FOOTER --- */}
          <div 
            className="shrink-0 p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-end gap-3"
            style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : "1.25rem" }}
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="h-9 px-5 rounded-lg font-black uppercase italic tracking-widest text-[8px] opacity-20 hover:opacity-100"
            >
              Abort
            </Button>
            <Button
              type="submit"
              disabled={isPending || balanceValue <= 0}
              className={cn(
                "min-w-[180px] h-11 rounded-xl shadow-lg transition-all active:scale-95",
                isStaff ? "bg-amber-500 text-black" : "bg-primary text-white"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-3 animate-spin" />
                  <span className="text-[9px]">Syncing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Authorize_Liquidation</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}