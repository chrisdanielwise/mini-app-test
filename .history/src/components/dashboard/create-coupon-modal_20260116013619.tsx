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
  Terminal, Globe, Activity, Cpu, Fingerprint, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useLayout } from "@/context/layout-provider";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 CREATE_CAMPAIGN_MODAL (Institutional Apex v2026.1.16)
 * Strategy: v2.0.0 Schema Alignment + Geometry Clamping.
 * Fix: Standardized 'amount' and 'discountType' field names for Prisma handshake.
 */
export function CreateCouponModal({ merchantId }: { merchantId: string }) {
  const [open, setOpen] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  
  const { impact, notification, selectionChange } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const [state, formAction, isPending] = useActionState(createCouponAction, null);
  const isStaffTheme = flavor === "AMBER";

  // 📡 SERVICE DISCOVERY
  useEffect(() => {
    if (open && merchantId && isReady) {
      // Staff use PLATFORM_ROOT bypass, Merchants use their UUID
      const targetId = merchantId === "PLATFORM_ROOT" ? "global" : merchantId;
      fetch(`/api/merchant/${targetId}/services`)
        .then((res) => res.json())
        .then((data) => setServices(Array.isArray(data) ? data : []))
        .catch((err) => console.error("SIGNAL_FETCH_FAILURE", err));
    }
  }, [open, merchantId, isReady]);

  // 🔄 HYDRATION SYNC
  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("CAMPAIGN_LIVE", { description: "Discount node broadcasted." });
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
            "rounded-2xl h-12 md:h-14 px-6 md:px-8 shadow-lg transition-all hover:scale-[1.02] active:scale-95 group border-none italic",
            isStaffTheme ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-white shadow-primary/20"
          )}
        >
          <Ticket className="size-4 mr-3 transition-transform group-hover:rotate-12" />
          <span className="font-black uppercase tracking-[0.2em] text-[10px]">Initialize_Campaign</span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "max-w-2xl border-white/5 bg-black/80 backdrop-blur-3xl shadow-2xl p-0 overflow-hidden",
          isMobile ? "fixed bottom-0 translate-y-0 rounded-t-[2.5rem] rounded-b-none w-full" : "rounded-[3rem]"
        )}
        style={{ 
          maxHeight: isMobile ? '92vh' : '85vh',
          paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : '0px'
        }}
      >
        <form action={formAction} className="flex flex-col h-full relative z-10">
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-5">
                <div className={cn(
                  "size-12 rounded-2xl flex items-center justify-center border shadow-inner",
                  isStaffTheme ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                )}>
                  {isStaffTheme ? <Globe className="size-6" /> : <Zap className="size-6" />}
                </div>
                <div>
                  <DialogTitle className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-foreground">
                    Campaign <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Deploy</span>
                  </DialogTitle>
                  <p className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] mt-1">Audit_v16.31_Stable</p>
                </div>
              </div>
            </DialogHeader>

            <div className="grid gap-8">
              {/* --- Code Identity Node --- */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">Protocol_Code</Label>
                  <button type="button" onClick={generateCode} className="text-[8px] font-black uppercase tracking-widest text-primary hover:opacity-100 opacity-40 transition-opacity italic">Auto_Generate</button>
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1 group">
                    <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/10 group-focus-within:text-primary transition-colors" />
                    <Input
                      name="code"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                      placeholder="EX: ALPHA_NODE_2026"
                      required
                      className="h-14 pl-14 rounded-xl font-mono font-black text-sm tracking-[0.2em] bg-white/[0.02] border-white/5 focus:bg-white/[0.04] transition-all text-foreground"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateCode}
                    className="size-14 rounded-xl border-white/5 bg-white/[0.02] hover:bg-white/5 active:scale-90 transition-all"
                  >
                    <RefreshCw className={cn("size-5", isStaffTheme ? "text-amber-500" : "text-primary")} />
                  </Button>
                </div>
              </div>

              {/* --- Variable Calibration --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-muted-foreground/40 italic">Type</Label>
                  <select
                    name="discountType"
                    className="w-full h-14 rounded-xl border border-white/5 bg-white/[0.02] px-6 text-[10px] font-black uppercase tracking-[0.2em] outline-none text-foreground italic focus:bg-white/[0.04]"
                  >
                    <option value="PERCENTAGE" className="bg-zinc-900 text-foreground">Percentage (%)</option>
                    <option value="FIXED" className="bg-zinc-900 text-foreground">Fixed Value ($)</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-muted-foreground/40 italic">Amount</Label>
                  <Input
                    name="amount"
                    type="number"
                    min="1"
                    placeholder="10"
                    required
                    className="h-14 px-6 rounded-xl border-white/5 bg-white/[0.02] font-black text-lg italic text-foreground"
                  />
                </div>
              </div>

              {/* --- Usage Bounds --- */}
              <div className="space-y-3">
                <Label className="text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-muted-foreground/40 italic">Usage_Cap</Label>
                <Input
                  name="maxUses"
                  type="number"
                  placeholder="INF_LIMIT"
                  className="h-14 px-6 rounded-xl border-white/5 bg-white/[0.02] font-black text-sm italic text-foreground"
                />
              </div>

              {/* --- Targeting Node --- */}
              <div className="space-y-3">
                <Label className="text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-muted-foreground/40 italic">Target_Node</Label>
                <div className="relative">
                  <select
                    name="serviceId"
                    className="w-full h-14 rounded-xl border border-white/5 bg-white/[0.02] px-6 text-[10px] font-black uppercase tracking-[0.2em] appearance-none outline-none text-foreground italic focus:bg-white/[0.04]"
                  >
                    <option value="global" className="bg-zinc-900">GLOBAL_CLUSTER (ALL_SERVICES)</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id} className="bg-zinc-900">{s.name.toUpperCase()}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 size-3 opacity-20 pointer-events-none" />
                </div>
              </div>
            </div>

            {state?.error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-5 animate-in shake-200">
                <p className="text-[9px] font-black uppercase text-rose-500 text-center tracking-widest italic">
                  FAULT_DETECTED: {state.error}
                </p>
              </div>
            )}
          </div>

          {/* --- Footer Assembly --- */}
          <div className="p-8 md:p-10 flex items-center justify-end gap-5 border-t border-white/5 bg-white/[0.01]">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { impact("light"); setOpen(false); }}
              className="h-12 px-6 font-black uppercase italic tracking-widest text-[9px] opacity-30 hover:opacity-100 transition-all text-foreground"
            >
              Abort_Provision
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "min-w-[200px] h-14 rounded-xl shadow-xl transition-all border-none italic font-black uppercase tracking-[0.2em] text-[10px]",
                isStaffTheme ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-white shadow-primary/20"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Syncing_Block...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Cpu className="size-4" />
                  <span>Initialize_Campaign</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}