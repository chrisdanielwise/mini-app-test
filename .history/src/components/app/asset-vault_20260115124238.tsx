"use client";

import * as React from "react";
import { useState } from "react";
import { 
  Wallet, 
  ArrowUpRight, 
  ShieldCheck, 
  Coins, 
  RefreshCcw,
  Lock,
  Waves,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDevice } from "@/context/device-provider";
import { useInstitutionalFetch } from "@/hooks/use-institutional-fetch";
import { toast } from "sonner";

/**
 * 🌊 ASSET_VAULT_TERMINAL (Institutional v16.16.29)
 * Logic: Real-time balance resolution with useInstitutionalFetch engine.
 * Design: Kinetic Squircle Morphology with Water-Ease motion curves.
 */
export function AssetVault({ balance = 0, pending = 0 }) {
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const { isMobile, screenSize } = useDevice();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const isStaff = flavor === "AMBER";

  // 🛰️ TACTICAL INGRESS: Standardized Vault Handshake
  const { execute: startWithdrawal, loading: isSyncing } = useInstitutionalFetch(
    async (payload: { address: string; amount: string }) => {
      // Logic would interface with src/app/(app)/vault/actions.ts
      const res = await fetch("/api/vault/withdraw", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("VAULT_SYNC_FAILED");
      return res.json();
    },
    {
      onSuccess: () => {
        notification("success");
        toast.success("WITHDRAWAL_INITIALIZED: Tx_Relay_Propagating");
        setAddress("");
        setAmount("");
      },
      onError: (err) => {
        notification("error");
        toast.error(`VAULT_ERROR: ${err}`);
      }
    }
  );

  const handleWithdrawal = () => {
    if (!address || !amount) {
      notification("error");
      return toast.error("VAULT_ERROR: Incomplete_Payload");
    }
    impact("heavy");
    startWithdrawal({ address, amount });
  };

  return (
    <div className="space-y-[var(--fluid-gap)] animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* --- TELEMETRY HORIZON: FLUID BALANCE NODES --- */}
      <div className={cn("grid gap-6", screenSize === 'xs' ? "grid-cols-1" : "grid-cols-2")}>
        <div className={cn(
          "relative overflow-hidden p-8 rounded-[2.5rem] md:rounded-[3rem] border backdrop-blur-3xl transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-card/30 border-white/5 shadow-apex"
        )}>
          {/* Subsurface Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-[2000ms] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-6 opacity-40 italic">
            <Coins className={cn("size-3.5", isStaff ? "text-amber-500" : "text-primary")} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Available_Liquidity</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-[var(--fluid-h1)] font-black italic tracking-tighter text-foreground">${balance.toLocaleString()}</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-20 italic">USDT_TRC20</span>
          </div>
        </div>

        <div className="relative overflow-hidden p-8 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl transition-all duration-1000">
          <div className="flex items-center gap-3 mb-6 opacity-40 italic">
            <RefreshCcw className="size-3.5 animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">In_Transit_Epoch</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-[var(--fluid-h1)] font-black italic tracking-tighter text-foreground/40">${pending.toLocaleString()}</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-10 italic">Awaiting_Finality</span>
          </div>
        </div>
      </div>

      {/* --- WITHDRAWAL CONTROL UNIT: KINETIC GLASS --- */}
      <div className={cn(
        "relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border p-8 md:p-12 transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        isStaff ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-card/40 border-white/5 shadow-apex"
      )}>
        <div className="flex items-center gap-4 mb-10">
          <div className={cn(
            "size-12 rounded-2xl border flex items-center justify-center transition-all duration-1000",
            isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
          )}>
            <ArrowUpRight className="size-6 group-hover:rotate-45" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[var(--fluid-h2)] font-black uppercase italic tracking-tighter text-foreground leading-none">Withdraw_Asset</h3>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic">Protocol_Security_Active</span>
          </div>
        </div>

        <div className={cn("grid gap-8", screenSize === 'xl' ? "grid-cols-2" : "grid-cols-1")}>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic ml-2">USDT_TRC20_ADDRESS</label>
              <Input 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="T..." 
                className="h-16 rounded-2xl bg-black/20 border-white/5 px-6 font-mono text-xs uppercase tracking-widest focus:ring-primary/20 transition-all duration-500"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic ml-2">AMOUNT_TO_SETTLE</label>
              <div className="relative">
                <Input 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00" 
                  className="h-16 rounded-2xl bg-black/20 border-white/5 px-6 font-black italic tracking-[0.2em] focus:ring-primary/20 transition-all duration-500"
                />
                <Button 
                  variant="ghost" 
                  onClick={() => { setAmount(balance.toString()); impact("light"); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-4 rounded-xl text-[9px] font-black uppercase italic text-primary hover:bg-primary/5 active:scale-90"
                >
                  MAX_CAP
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-[2.2rem] bg-white/[0.02] border border-white/5 p-8 flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
            <div className="space-y-4 relative z-10">
               <div className="flex items-center justify-between opacity-40">
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Network_Fee</span>
                  <span className="text-[10px] font-black text-foreground">$1.00 USDT</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-20 italic">Settle_Time</span>
                  <div className="flex items-center gap-2">
                    <Activity className="size-3 text-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 italic">{"<"} 10_MIN_BLOCK_SYNC</span>
                  </div>
               </div>
            </div>
            
            <Button 
              disabled={isSyncing}
              onClick={handleWithdrawal}
              className={cn(
                "mt-8 h-20 rounded-[1.8rem] font-black uppercase italic tracking-[0.2em] text-[11px] shadow-2xl transition-all duration-1000 group active:scale-95",
                isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "bg-primary text-primary-foreground shadow-primary/40"
              )}
            >
              {isSyncing ? (
                <span className="flex items-center gap-3"><Waves className="size-5 animate-bounce" /> Executing_Provision...</span>
              ) : (
                <span className="flex items-center gap-3">Initialize_Handshake <ArrowUpRight className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-700" /></span>
              )}
            </Button>
          </div>
        </div>

        {/* --- SECURITY FOOTER: ATOMIC GAUNTLET --- */}
        <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-8 opacity-20">
           <div className="flex items-center gap-2 group cursor-help">
              <Lock className="size-3 transition-transform group-hover:scale-125" />
              <span className="text-[8px] font-black uppercase tracking-widest italic">Z-K_Shield_Active</span>
           </div>
           <div className="flex items-center gap-2 group cursor-help">
              <ShieldCheck className="size-3 transition-transform group-hover:scale-125" />
              <span className="text-[8px] font-black uppercase tracking-widest italic">Institutional_Audit_Verified</span>
           </div>
        </div>
      </div>
    </div>
  );
}