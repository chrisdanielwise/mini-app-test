"use client";

import * as React from "react";
import { useState, useActionState, useEffect, useCallback } from "react";
import { createCouponAction } from "@/lib/actions/coupon.actions";

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
  Ticket, Loader2, Zap, ShieldCheck, RefreshCw,
  Terminal, Globe, Cpu, Fingerprint, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useLayout } from "@/context/layout-provider";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ CREATE_COUPON_MODAL (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: Standardized h-11 height and high-density typography prevents blowout.
 */
export function CreateCouponModal({ merchantId }: { merchantId: string }) {
  const [open, setOpen] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  
  const { impact, notification, selectionChange } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile } = useDeviceContext();
  
  const [state, formAction, isPending] = useActionState(createCouponAction, null);
  const isStaffTheme = flavor === "AMBER";

  useEffect(() => {
    if (open && merchantId && isReady) {
      const targetId = merchantId === "PLATFORM_ROOT" ? "global" : merchantId;
      fetch(`/api/merchant/${targetId}/services`)
        .then((res) => res.json())
        .then((data) => setServices(Array.isArray(data) ? data : []))
        .catch((err) => console.error("SIGNAL_FETCH_FAILURE", err));
    }
  }, [open, merchantId, isReady]);

  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("CAMPAIGN_LIVE");
      setOpen(false);
      setCustomCode("");
    }
    if (state?.error && !isPending) notification("error");
  }, [state, isPending, notification]);

  const generateCode = useCallback(() => {
    impact("medium");
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setCustomCode(result);
  }, [impact]);

  if (!isReady) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); impact("light"); }}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          onClick={() => selectionChange()}
          className={cn(
            "rounded-xl h-11 px-5 shadow-apex transition-all active:scale-95 group",
            isStaffTheme ? "bg-amber-500 text-black" : "bg-primary text-white"
          )}
        >
          <Ticket className="size-3.5 mr-2 transition-transform group-hover:rotate-12" />
          <span className="font-black uppercase tracking-widest text-[9px]">Deploy_Campaign</span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "max-w-lg border-white/5 bg-background/80 backdrop-blur-xl p-0 overflow-hidden",
          isMobile ? "fixed bottom-0 rounded-t-3xl w-full" : "rounded-2xl"
        )}
      >
        <form action={formAction} className="flex flex-col h-full relative z-10">
          <input type="hidden" name="merchantId" value={merchantId} />

          {/* --- 🛡️ COMPRESSED COMMAND HUD --- */}
          <div className="shrink-0 p-6 border-b border-white/5 bg-white/[0.02]">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "size-10 rounded-xl flex items-center justify-center border shadow-inner",
                  isStaffTheme ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                )}>
                  {isStaffTheme ? <Globe className="size-5" /> : <Zap className="size-5" />}
                </div>
                <div className="leading-none">
                  <DialogTitle className="text-xl font-black italic uppercase tracking-tighter text-foreground">
                    Campaign <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Deploy</span>
                  </DialogTitle>
                  <p className="text-[7.5px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] mt-1.5 italic">Audit_v16.31_Stable</p>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* --- 🚀 TACTICAL SLIM CONTENT --- */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
            {/* Identity Node */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">Protocol_Code</Label>
                <button type="button" onClick={generateCode} className="text-[7px] font-black uppercase tracking-widest text-primary hover:opacity-100 opacity-30 transition-opacity italic">Auto_Generate</button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/10 group-focus-within:text-primary transition-colors" />
                  <Input
                    name="code"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                    placeholder="EX: ALPHA_NODE"
                    required
                    className="h-11 pl-10 rounded-xl font-mono font-black text-xs tracking-widest bg-white/[0.02] border-white/5 placeholder:opacity-10"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateCode}
                  className="size-11 rounded-xl border-white/5 bg-white/[0.02] active:scale-90 transition-all"
                >
                  <RefreshCw className={cn("size-4", isStaffTheme ? "text-amber-500" : "text-primary")} />
                </Button>
              </div>
            </div>

            {/* Variable Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic ml-1">Type</Label>
                <div className="relative">
                  <select
                    name="discountType"
                    className="w-full h-11 rounded-xl border border-white/5 bg-white/[0.02] px-4 text-[9px] font-black uppercase tracking-widest outline-none text-foreground appearance-none italic focus:bg-white/[0.04]"
                  >
                    <option value="PERCENTAGE" className="bg-zinc-900">Percentage (%)</option>
                    <option value="FIXED" className="bg-zinc-900">Fixed ($)</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-2.5 opacity-20 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic ml-1">Amount</Label>
                <Input
                  name="amount"
                  type="number"
                  placeholder="10"
                  required
                  className="h-11 px-4 rounded-xl border-white/5 bg-white/[0.02] font-black text-sm italic"
                />
              </div>
            </div>

            {/* Targeting & Usage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic ml-1">Usage_Cap</Label>
                <Input
                  name="maxUses"
                  type="number"
                  placeholder="INF_LIMIT"
                  className="h-11 px-4 rounded-xl border-white/5 bg-white/[0.02] font-black text-xs italic"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic ml-1">Target_Node</Label>
                <div className="relative">
                  <select
                    name="serviceId"
                    className="w-full h-11 rounded-xl border border-white/5 bg-white/[0.02] px-4 text-[9px] font-black uppercase tracking-widest outline-none appearance-none italic"
                  >
                    <option value="global" className="bg-zinc-900">GLOBAL_CLUSTER</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id} className="bg-zinc-900">{s.name.toUpperCase()}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-2.5 opacity-20 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* --- 🌊 SLIM FOOTER --- */}
          <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { impact("light"); setOpen(false); }}
              className="h-9 px-5 rounded-lg font-black uppercase italic tracking-widest text-[8px] opacity-30 hover:opacity-100 transition-all"
            >
              Abort
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "min-w-[160px] h-10 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg transition-all active:scale-95",
                isStaffTheme ? "bg-amber-500 text-black" : "bg-primary text-white"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-3 animate-spin" />
                  <span>Syncing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Cpu className="size-3.5" />
                  <span>Deploy_Node</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}