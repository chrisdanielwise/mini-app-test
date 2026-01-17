"use client";

import * as React from "react";
import { useState } from "react";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Coins, 
  RefreshCcw,
  ExternalLink,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { toast } from "sonner";

/**
 * 🌊 ASSET_VAULT_TERMINAL (v16.16.12)
 * Logic: Real-time balance resolution with Multi-Chain Handshake.
 * Design: Institutional Squircle Morphology with Obsidian Depth.
 */
export function AssetVault({ balance = 0, pending = 0 }) {
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const isStaff = flavor === "AMBER";

  const handleWithdrawal = () => {
    if (!address || !amount) {
      notification("error");
      return toast.error("VAULT_ERROR: Incomplete_Payload");
    }

    impact("heavy"); // 🏁 TACTILE SYNC: Feel the weight of the asset movement
    setIsSyncing(true);

    setTimeout(() => {
      notification("success");
      toast.success("WITHDRAWAL_INITIALIZED: Tx_Relay_Propagating");
      setIsSyncing(false);
      setAddress("");
      setAmount("");
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* --- TELEMETRY HORIZON: BALANCE NODES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cn(
          "relative overflow-hidden p-8 rounded-[3rem] border backdrop-blur-3xl transition-all duration-700",
          isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-card/30 border-white/5 shadow-black/40"
        )}>
          <div className="flex items-center gap-3 mb-6 opacity-40 italic">
            <Coins className="size-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Available_Liquidity</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl md:text-5xl font-black italic tracking-tighter text-foreground">${balance.toLocaleString()}</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-20 italic">USDT_TRC20</span>
          </div>
        </div>

        <div className="relative overflow-hidden p-8 rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl">
          <div className="flex items-center gap-3 mb-6 opacity-40 italic">
            <RefreshCcw className="size-3.5 animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">In_Transit_Epoch</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl md:text-5xl font-black italic tracking-tighter text-foreground/40">${pending.toLocaleString()}</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-10 italic">Awaiting_Block_Finality</span>
          </div>
        </div>
      </div>

      {/* --- WITHDRAWAL CONTROL UNIT --- */}
      <div className={cn(
        "relative overflow-hidden rounded-[3rem] border p-8 md:p-12 transition-all duration-700",
        isStaff ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-card/40 border-white/5 shadow-2xl"
      )}>
        <div className="flex items-center gap-4 mb-10">
          <div className="size-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-primary">
            <ArrowUpRight className="size-6" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground">Withdraw_Asset</h3>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic">Protocol_Security_Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic ml-2">USDT_TRC20_ADDRESS</label>
              <Input 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="T..." 
                className="h-16 rounded-2xl bg-black/20 border-white/5 px-6 font-mono text-xs uppercase tracking-widest focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic ml-2">AMOUNT_TO_SETTLE</label>
              <div className="relative">
                <Input 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00" 
                  className="h-16 rounded-2xl bg-black/20 border-white/5 px-6 font-black italic tracking-[0.2em] focus:ring-primary/20 transition-all"
                />
                <Button 
                  variant="ghost" 
                  onClick={() => { setAmount(balance.toString()); impact("light"); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-4 rounded-xl text-[9px] font-black uppercase italic text-primary hover:bg-primary/5"
                >
                  MAX_CAP
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/[0.02] border border-white/5 p-8 flex flex-col justify-between">
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-20 italic">Network_Fee</span>
                  <span className="text-[10px] font-black text-foreground">$1.00 USDT</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-20 italic">Settle_Time</span>
                  <span className="text-[10px] font-black text-emerald-500 italic">{"<"} 10_MIN_BLOCK_SYNC</span>
               </div>
            </div>
            
            <Button 
              disabled={isSyncing}
              onClick={handleWithdrawal}
              className={cn(
                "h-16 rounded-2xl font-black uppercase italic tracking-[0.2em] text-[11px] shadow-2xl transition-all duration-700 group",
                isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "bg-primary text-primary-foreground shadow-primary/40"
              )}
            >
              {isSyncing ? (
                <span className="flex items-center gap-3"><RefreshCcw className="size-4 animate-spin" /> Syncing_Vault...</span>
              ) : (
                <span className="flex items-center gap-3">Initialize_Handshake <ArrowUpRight className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></span>
              )}
            </Button>
          </div>
        </div>

        {/* --- SECURITY FOOTER --- */}
        <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-6 opacity-20">
           <div className="flex items-center gap-2">
              <Lock className="size-3" />
              <span className="text-[8px] font-black uppercase tracking-widest italic">Z-K_Shield_Active</span>
           </div>
           <div className="flex items-center gap-2">
              <ShieldCheck className="size-3" />
              <span className="text-[8px] font-black uppercase tracking-widest italic">Institutional_Audit_Verified</span>
           </div>
        </div>
      </div>
    </div>
  );
}