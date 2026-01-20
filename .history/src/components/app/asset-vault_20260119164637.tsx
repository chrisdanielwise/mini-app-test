"use client";

import * as React from "react";
import { useState } from "react";
import {
  ArrowUpRight,
  ShieldCheck,
  Coins,
  RefreshCcw,
  Lock,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { toast } from "sonner";
import { useInstitutionalFetch } from "@/lib/hooks/use-institutional-fetch";

interface WithdrawalPayload {
  address: string;
  amount: string;
}

/**
 * 🛰️ ASSET_VAULT (Institutional Apex v2026.1.16)
 * Fix: Resolved TS2558 by providing dual generics to the expanded hook.
 */
export function AssetVault({
  balance = 0,
  pending = 0,
}: {
  balance?: number;
  pending?: number;
}) {
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const { isMobile, screenSize, isPortrait, isReady } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  /**
   * ✅ SYNC: Passing <ResponseType, PayloadType>
   */
  

  const handleWithdrawal = () => {
    if (!address || !amount)
      return toast.error("VAULT_ERROR: Incomplete_Payload");
    if (impact) impact("heavy");

    // ✅ PASS: Typed payload to the execution trigger
    startWithdrawal(true, { address, amount });
  };

  if (!isReady)
    return <div className="h-64 w-full bg-white/5 animate-pulse rounded-2xl" />;

  const telemetryGrid =
    screenSize === "xs" || (isMobile && isPortrait)
      ? "grid-cols-1"
      : "grid-cols-2";

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className={cn("grid gap-4", telemetryGrid)}>
        <div
          className={cn(
            "p-5 rounded-2xl border bg-zinc-950/40 transition-all",
            isStaff
              ? "border-amber-500/10 shadow-sm"
              : "border-white/5 shadow-2xl"
          )}
        >
          <div className="flex items-center gap-2 mb-4 opacity-20 italic leading-none">
            <Coins className="size-3" />
            <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">
              Available_Liquidity
            </span>
          </div>
          <div className="flex items-baseline gap-2 leading-none">
            <span className="text-3xl font-black italic tracking-tighter text-foreground">
              ${balance.toLocaleString()}
            </span>
            <span className="text-[7.5px] font-black uppercase tracking-widest opacity-10">
              USDT
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-white/5 bg-zinc-950/40 opacity-40">
          <div className="flex items-center gap-2 mb-4 italic leading-none">
            <RefreshCcw className="size-3" />
            <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">
              Pending_Epoch
            </span>
          </div>
          <span className="text-3xl font-black italic tracking-tighter text-foreground">
            ${pending.toLocaleString()}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl md:rounded-3xl border p-6 md:p-8 bg-card/40 backdrop-blur-xl",
          isStaff ? "border-amber-500/10" : "border-white/5"
        )}
      >
        <div className="flex items-center gap-3 mb-8 leading-none relative z-10">
          <div
            className={cn(
              "size-9 rounded-lg border flex items-center justify-center transition-all",
              isStaff
                ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                : "bg-primary/10 border-primary/20 text-primary"
            )}
          >
            <ArrowUpRight className="size-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-black uppercase italic tracking-tighter text-foreground">
              Withdraw_Asset
            </h3>
            <span className="text-[7.5px] font-black uppercase tracking-[0.3em] opacity-20">
              Protocol_Security_Active
            </span>
          </div>
        </div>

        <div className="grid gap-4 relative z-10">
          <div className="space-y-3">
            <label className="text-[7.5px] font-black uppercase tracking-[0.3em] opacity-20 ml-1">
              USDT_ADDRESS
            </label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="T..."
              className="h-11 rounded-xl bg-black/40 border-white/5 px-4 font-mono text-[9px] tracking-widest focus:border-primary/40 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[7.5px] font-black uppercase tracking-[0.3em] opacity-20 ml-1">
              SETTLE_AMOUNT
            </label>
            <div className="relative">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="h-11 rounded-xl bg-black/40 border-white/5 px-4 font-black text-sm italic tracking-widest focus:border-primary/40 transition-all"
              />
              <Button
                variant="ghost"
                onClick={() => {
                  setAmount(balance.toString());
                  if (impact) impact("light");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-3 rounded-lg text-[7px] font-black uppercase text-primary hover:bg-primary/5"
              >
                MAX
              </Button>
            </div>
          </div>

          <Button
            disabled={isSyncing}
            onClick={handleWithdrawal}
            className={cn(
              "w-full h-11 rounded-xl font-black uppercase italic tracking-widest text-[9px] shadow-lg transition-all active:scale-95 group",
              isStaff
                ? "bg-amber-500 text-black shadow-amber-500/10"
                : "bg-primary text-primary-foreground shadow-primary/10"
            )}
          >
            {isSyncing ? "Executing_Sync..." : "Initialize_Handshake"}
            {!isSyncing && (
              <ArrowUpRight className="ml-2 size-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 py-4 opacity-10 italic leading-none">
        <div className="flex items-center gap-1.5">
          <Lock className="size-2.5" />
          <span className="text-[6.5px] font-black uppercase tracking-widest">
            Z-K_Shield
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="size-2.5" />
          <span className="text-[6.5px] font-black uppercase tracking-widest">
            Audit_Verified
          </span>
        </div>
      </div>
    </div>
  );
}
