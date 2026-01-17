"use client";

import * as React from "react";
import { useState, useActionState, useEffect, useCallback } from "react";
import { createCouponAction } from "@/lib/actions/coupon.actions";

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
  Ticket,
  Loader2,
  Zap,
  ShieldCheck,
  RefreshCw,
  Terminal,
  Globe,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useLayout } from "@/context/layout-provider";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 CREATE_CAMPAIGN_MODAL (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Transition | Vapour-Glass depth.
 * Logic: morphology-aware viewport clamping with role-flavored haptics.
 */
export function CreateCouponModal({ merchantId }: { merchantId: string }) {
  const [open, setOpen] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  
  const { impact, notification } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile, screenSize, safeArea } = useDeviceContext();
  
  const [state, formAction, isPending] = useActionState(createCouponAction, null);
  const isStaff = flavor === "AMBER";

  // 📡 SERVICE DISCOVERY: Hardware-aware fetch
  useEffect(() => {
    if (open && merchantId && isReady) {
      fetch(`/api/merchant/${merchantId}/services`)
        .then((res) => res.json())
        .then((data) => setServices(data))
        .catch((err) => console.error("SIGNAL_FETCH_FAILURE", err));
    }
  }, [open, merchantId, isReady]);

  // 🔄 HYDRATION SYNC
  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("CAMPAIGN_LIVE", { description: "Discount node successfully broadcasted." });
      setOpen(false);
      setCustomCode("");
    }
    if (state?.error && !isPending) {
      notification("error");
    }
  }, [state, isPending, notification]);

  const generateCode = useCallback(() => {
    impact("medium");
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomCode(result);
  }, [impact]);

  if (!isReady) return null;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Balancing visual density based on hardware tier.
   */
  const modalRadius = isMobile ? "rounded-t-[3rem] rounded-b-none" : "rounded-[3.5rem]";
  const modalPosition = isMobile ? "fixed bottom-0 translate-y-0" : "";

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
            <Ticket className="size-4" />
          </div>
          <span className="font-black uppercase italic tracking-widest text-[10px]">Initialize_Campaign</span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "max-w-2xl border-white/5 bg-background/60 backdrop-blur-3xl shadow-apex p-0 overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          modalRadius,
          modalPosition
        )}
        style={{ 
          maxHeight: isMobile ? '92vh' : '85vh',
          paddingBottom: isMobile ? `${safeArea.bottom}px` : '0px'
        }}
      >
        {/* 🧪 THE VAPOUR MASK: Kinetic Glass Ingress */}
        <div className={cn(
          "absolute inset-0 opacity-10 blur-[100px] pointer-events-none transition-colors duration-[2000ms]",
          isStaff ? "bg-amber-500" : "bg-primary"
        )} />

        <form action={formAction} className="flex flex-col h-full relative z-10">
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="flex-1 overflow-y-auto p-8 md:p-14 space-y-12 custom-scrollbar">
            <DialogHeader className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "size-14 md:size-16 rounded-2xl md:rounded-[1.8rem] flex items-center justify-center shadow-inner border transition-colors",
                    isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                  )}>
                    {isStaff ? <Globe className="size-7" /> : <Zap className="size-7 fill-current" />}
                  </div>
                  <div>
                    <DialogTitle className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">
                      Campaign <span className={isStaff ? "text-amber-500" : "text-primary"}>Deploy</span>
                    </DialogTitle>
                    <div className="flex items-center gap-3 mt-2 opacity-30 italic">
                      <Activity className="size-3 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em]">Protocol_Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-10 md:space-y-14">
              {/* --- Code Identity Protocol --- */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <Label className={cn("text-[10px] md:text-[11px] uppercase font-black italic tracking-[0.4em]", isStaff ? "text-amber-500" : "text-primary")}>
                    Protocol_Identity_Code
                  </Label>
                  <button type="button" onClick={generateCode} className="text-[8px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">Auto_Generate</button>
                </div>
                <div className="flex gap-4">
                  <div className="relative flex-1 group">
                    <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                    <Input
                      name="code"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                      placeholder="EX: ALPHA_NODE_2026"
                      required
                      className={cn(
                        "h-16 md:h-20 pl-16 rounded-2xl md:rounded-[2rem] font-mono font-black text-lg tracking-widest bg-white/[0.03] border-white/5 transition-all focus:bg-white/[0.06]",
                        isStaff ? "text-amber-500 focus:border-amber-500/40" : "text-primary focus:border-primary/40"
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateCode}
                    className="size-16 md:size-20 rounded-2xl md:rounded-[2rem] border-white/5 bg-white/[0.03] group transition-all active:scale-90"
                  >
                    <RefreshCw className={cn("size-6 group-active:rotate-180 transition-transform duration-1000", isStaff && "text-amber-500")} />
                  </Button>
                </div>
              </div>

              {/* --- Financial Variables --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <div className="space-y-4">
                  <Label className={cn("text-[10px] uppercase font-black italic tracking-[0.4em] ml-2", isStaff ? "text-amber-500" : "text-primary")}>Reduction (%)</Label>
                  <Input
                    name="discountPercent"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="10"
                    required
                    className="h-16 md:h-20 px-8 rounded-2xl md:rounded-[2rem] border-white/5 bg-white/[0.03] font-black text-lg italic"
                  />
                </div>
                <div className="space-y-4">
                  <Label className={cn("text-[10px] uppercase font-black italic tracking-[0.4em] ml-2", isStaff ? "text-amber-500" : "text-primary")}>Usage_Cap</Label>
                  <Input
                    name="maxUses"
                    type="number"
                    placeholder="INF_LIMIT"
                    className="h-16 md:h-20 px-8 rounded-2xl md:rounded-[2rem] border-white/5 bg-white/[0.03] font-black text-lg italic"
                  />
                </div>
              </div>

              {/* --- Targeting Matrix --- */}
              <div className="space-y-4">
                <Label className={cn("text-[10px] uppercase font-black italic tracking-[0.4em] ml-2", isStaff ? "text-amber-500" : "text-primary")}>Target_Service_Node</Label>
                <div className="relative">
                  <select
                    name="serviceId"
                    className="w-full h-16 md:h-20 rounded-2xl md:rounded-[2rem] border border-white/5 bg-white/[0.03] px-8 text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 appearance-none focus:bg-white/[0.06] transition-all"
                  >
                    <option value="global">GLOBAL_CLUSTER (ALL_SERVICES)</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className={cn("flex items-center gap-5 p-6 rounded-3xl border transition-all", isStaff ? "bg-amber-500/5 border-amber-500/10" : "bg-primary/5 border-primary/10")}>
                  <ShieldCheck className={cn("size-5 shrink-0 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
                  <p className="text-[9px] md:text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.15em] leading-relaxed italic">
                    Vouchers (100% OFF) grant instant VIP access bypassing gateway protocols.
                  </p>
                </div>
              </div>
            </div>

            {state?.error && (
              <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-6 animate-in shake-200">
                <p className="text-[10px] font-black uppercase text-destructive text-center tracking-widest italic leading-none">
                  {state.error}
                </p>
              </div>
            )}
          </div>

          {/* --- Footer Assembly --- */}
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-end gap-6 border-t border-white/5 bg-white/[0.02] backdrop-blur-2xl">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="w-full md:w-auto h-14 px-10 rounded-2xl md:rounded-3xl font-black uppercase italic tracking-widest text-[9px] opacity-30 hover:opacity-100"
            >
              Abort_Provision
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "w-full md:w-auto min-w-[240px] h-14 md:h-20 rounded-2xl md:rounded-3xl shadow-apex transition-all",
                isStaff ? "bg-amber-500 text-black" : "bg-primary text-white"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="font-black uppercase italic tracking-widest text-[10px]">Syncing_Block...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-5" />
                  <span className="font-black uppercase italic tracking-widest text-[10px]">Initialize_Campaign</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}