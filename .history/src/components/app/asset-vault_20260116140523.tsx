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
  Zap,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 🏛️ Institutional Contexts
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { toast } from "sonner";
import { useInstitutionalFetch } from "@/lib/hooks/use-institutional-fetch";

/**
 * 🛰️ ASSET_VAULT (Institutional Apex v2026.1.16)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density h-11 footprint and stationary HUD profile prevents blowout.
 */
export function AssetVault({ balance = 0, pending = 0 }) {
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  
  // 🛰️ DEVICE INGRESS
  const { isMobile, isTablet, isDesktop, screenSize, isPortrait, isReady } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const { execute: startWithdrawal, loading: isSyncing } = useInstitutionalFetch(
    async (payload: { address: string; amount: string }) => {
      const res = await fetch("/api/vault/withdraw", { method: "POST", body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("VAULT_SYNC_FAILED");
      return res.json();
    },
    {
      onSuccess: () => {
        notification("success");
        toast.success("SYNC_SUCCESS: Tx_Relay_Propagating");
        setAddress(""); setAmount("");
      },
      onError: (err) => {
        notification("error");
        toast.error(`VAULT_ERROR: ${err}`);
      }
    }
  );

  const handleWithdrawal = () => {
    if (!address || !amount) return toast.error("VAULT_ERROR: Incomplete_Payload");
    impact("heavy");
    startWithdrawal({ address, amount });
  };

  if (!isReady) return <div className="h-64 w-full bg-white/5 animate-pulse rounded-2xl" />;

  const telemetryGrid = (screenSize === 'xs' || (isMobile && isPortrait)) ? "grid-cols-1" : "grid-cols-2";

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      
      {/* --- 📊 TELEMETRY HORIZON: Compressed Balance Nodes --- */}
      <div className={cn("grid gap-4", telemetryGrid)}>
        <div className={cn(
          "p-5 rounded-2xl border bg-zinc-950/40 transition-all",
          isStaff ? "border-amber-500/10 shadow-sm" : "border-white/5 shadow-2xl"
        )}>
          <div className="flex items-center gap-2 mb-4 opacity-20 italic leading-none">
            <Coins className="size-3" />
            <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">Available_Liquidity</span>
          </div>
          <div className="flex items-baseline gap-2 leading-none">
            <span className="text-3xl font-black italic tracking-tighter text-foreground">${balance.toLocaleString()}</span>
            <span className="text-[7.5px] font-black uppercase tracking-widest opacity-10">USDT</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-white/5 bg-zinc-950/40 opacity-40">
          <div className="flex items-center gap-2 mb-4 italic leading-none">
            <RefreshCcw className="size-3 animate-spin-slow" />
            <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">Pending_Epoch</span>
          </div>
          <span className="text-3xl font-black italic tracking-tighter text-foreground">${pending.toLocaleString()}</span>
        </div>
      </div>

      {/* --- 🛡️ CONTROL UNIT: Tactical Slim Hub --- */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl md:rounded-3xl border p-6 md:p-8 bg-card/40 backdrop-blur-xl",
        isStaff ? "border-amber-500/10" : "border-white/5"
      )}>
        <div className="flex items-center gap-3 mb-8 leading-none relative z-10">
          <div className={cn(
            "size-9 rounded-lg border flex items-center justify-center transition-all",
            isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
          )}>
            <ArrowUpRight className="size-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-black uppercase italic tracking-tighter text-foreground">Withdraw_Asset</h3>
            <span className="text-[7.5px] font-black uppercase tracking-[0.3em] opacity-20">Protocol_Security_Active</span>
          </div>
        </div>

        <div className="grid gap-4 relative z-10">
          <div className="space-y-3">
            <label className="text-[7.5px] font-black uppercase tracking-[0.3em] opacity-20 ml-1">USDT_ADDRESS</label>
            <Input 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="T..." 
              className="h-11 rounded-xl bg-black/40 border-white/5 px-4 font-mono text-[9px] tracking-widest focus:border-primary/40 transition-all"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-[7.5px] font-black uppercase tracking-[0.3em] opacity-20 ml-1">SETTLE_AMOUNT</label>
            <div className="relative">
              <Input 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="0.00" 
                className="h-11 rounded-xl bg-black/40 border-white/5 px-4 font-black text-sm italic tracking-widest focus:border-primary/40 transition-all"
              />
              <Button 
                variant="ghost" 
                onClick={() => { setAmount(balance.toString()); impact("light"); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-3 rounded-lg text-[7px] font-black uppercase text-primary hover:bg-primary/5"
              >
                MAX
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-3">
             <div className="flex items-center justify-between opacity-20 leading-none">
                <span className="text-[6.5px] font-black uppercase tracking-widest">Network_Fee</span>
                <span className="text-[8px] font-black">$1.00 USDT</span>
             </div>
             <div className="flex items-center justify-between leading-none">
                <span className="text-[6.5px] font-black uppercase tracking-widest opacity-10">Settle_Time</span>
                <div className="flex items-center gap-1.5">
                  <Activity className="size-2.5 text-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black text-emerald-500 italic">IMMEDIATE</span>
                </div>
             </div>
          </div>

          <Button 
            disabled={isSyncing}
            onClick={handleWithdrawal}
            className={cn(
              "w-full h-11 rounded-xl font-black uppercase italic tracking-widest text-[9px] shadow-lg transition-all active:scale-95 group",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/10" : "bg-primary text-primary-foreground shadow-primary/10"
            )}
          >
            {isSyncing ? "Executing_Sync..." : "Initialize_Handshake"}
            {!isSyncing && <ArrowUpRight className="ml-2 size-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
          </Button>
        </div>
      </div>

      {/* --- 🛡️ STATIONARY FOOTER --- */}
      <div className="flex items-center justify-center gap-4 py-4 opacity-10 italic leading-none">
         <div className="flex items-center gap-1.5">
            <Lock className="size-2.5" />
            <span className="text-[6.5px] font-black uppercase tracking-widest">Z-K_Shield</span>
         </div>
         <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-2.5" />
            <span className="text-[6.5px] font-black uppercase tracking-widest">Audit_Verified</span>
         </div>
      </div>
    </div>
  );
}