"use client";

import { useState, useActionState, useEffect } from "react";
// import { createServiceAction } from "@/lib/actions/service-actions";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Loader2,
  Zap,
  Layers,
  ShieldCheck,
  Trash2,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { createServiceAction } from "@/lib/actions/service.actions";

interface CreateServiceModalProps {
  merchantId: string;
}

/**
 * 🚀 MULTI-TIER DEPLOYMENT ENGINE
 * Allows merchants to register a digital asset and define a complete
 * pricing architecture in a single atomic operation.
 */
export function CreateServiceModal({ merchantId }: CreateServiceModalProps) {
  const [open, setOpen] = useState(false);

  // 💎 Dynamic Tier State management for multi-plan deployment
  const [tiers, setTiers] = useState([
    {
      id: Date.now(),
      name: "",
      price: "",
      interval: "MONTHLY",
      type: "STANDARD",
    },
  ]);

  const [state, formAction, isPending] = useActionState(
    createServiceAction,
    null
  );

  useEffect(() => {
    if (state?.success && !isPending) {
      toast.success("Service nodes deployed successfully.");
      setOpen(false);
      // Reset tiers for next use
      setTiers([
        {
          id: Date.now(),
          name: "",
          price: "",
          interval: "MONTHLY",
          type: "STANDARD",
        },
      ]);
    }
  }, [state, isPending]);

  const addTierRow = () => {
    setTiers([
      ...tiers,
      {
        id: Date.now(),
        name: "",
        price: "",
        interval: "MONTHLY",
        type: "STANDARD",
      },
    ]);
  };

  const removeTierRow = (id: number) => {
    if (tiers.length > 1) {
      setTiers(tiers.filter((t) => t.id !== id));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl h-14 px-8 font-black uppercase italic tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all bg-primary text-primary-foreground">
          <Plus className="mr-2 h-5 w-5" /> New Signal Deployment
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl rounded-[3rem] border-border bg-card p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <form action={formAction} className="flex flex-col max-h-[90vh]">
          {/* 🔑 Identity Handshake */}
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="p-10 space-y-10 overflow-y-auto scrollbar-hide">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">
                Deployment Protocol
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-70">
                Establish a new digital asset node and its initial pricing
                tiers.
              </DialogDescription>
            </DialogHeader>

            {/* --- SECTION 1: SERVICE IDENTITY --- */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Zap className="h-4 w-4 fill-primary" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">
                  Asset Identity
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase ml-1">
                    Service Label
                  </Label>
                  <Input
                    name="name"
                    placeholder="VIP GOLD SIGNALS"
                    required
                    className="h-14 rounded-2xl border-muted bg-muted/10 font-black uppercase italic text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase ml-1">
                    Category Node
                  </Label>
                  <Input
                    name="categoryTag"
                    placeholder="FOREX"
                    className="h-14 rounded-2xl border-muted bg-muted/10 font-black uppercase text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase ml-1">
                  Asset Description
                </Label>
                <Textarea
                  name="description"
                  placeholder="Summarize signal frequency and reliability protocols..."
                  className="rounded-2xl min-h-[100px] bg-muted/10 border-muted font-bold text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase ml-1 text-primary">
                  Target Telegram Channel ID
                </Label>
                <Input
                  name="vipChannelId"
                  placeholder="-100123456789"
                  required
                  className="h-14 rounded-2xl border-primary/20 bg-primary/5 font-mono text-xs text-primary"
                />
                <div className="flex items-center gap-1.5 px-1 opacity-50">
                  <Info className="h-3 w-3" />
                  <p className="text-[8px] font-bold uppercase">
                    Include -100 prefix for secure private nodes.
                  </p>
                </div>
              </div>
            </div>

            {/* --- SECTION 2: DYNAMIC PRICING ARCHITECTURE --- */}
            <div className="space-y-6 pt-10 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-500">
                  <Layers className="h-4 w-4" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">
                    Pricing Architecture
                  </h3>
                </div>
                <Button
                  type="button"
                  onClick={addTierRow}
                  variant="outline"
                  className="h-9 rounded-xl text-[9px] font-black uppercase border-primary/20 text-primary hover:bg-primary/5 transition-all"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Tier Node
                </Button>
              </div>

              <div className="space-y-4">
                {tiers.map((tier, index) => (
                  <div
                    key={tier.id}
                    className="grid grid-cols-12 gap-4 p-6 rounded-[2rem] bg-muted/20 border border-border/50 items-end animate-in slide-in-from-right-4 duration-300 group"
                  >
                    <div className="col-span-12 sm:col-span-5 space-y-2">
                      <Label className="text-[8px] font-black uppercase opacity-50">
                        Tier Name
                      </Label>
                      <Input
                        name="tierNames[]"
                        placeholder="e.g. Monthly VIP"
                        required
                        className="h-12 rounded-xl bg-card border-muted font-bold text-xs"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3 space-y-2">
                      <Label className="text-[8px] font-black uppercase opacity-50">
                        Price (USD)
                      </Label>
                      <Input
                        name="tierPrices[]"
                        type="number"
                        step="0.01"
                        placeholder="49.99"
                        required
                        className="h-12 rounded-xl bg-card border-muted font-bold text-xs"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-3 space-y-2">
                      <Label className="text-[8px] font-black uppercase opacity-50">
                        Cycle
                      </Label>
                      <select
                        name="tierIntervals[]"
                        className="w-full h-12 rounded-xl border border-muted bg-card px-2 text-[10px] font-black uppercase outline-none focus:ring-1 focus:ring-primary/20"
                      >
                        <option value="MONTH">Monthly</option>
                        <option value="WEEK">Weekly</option>
                        <option value="YEAR">Annual</option>
                        <option value="DAY">Daily</option>
                      </select>
                      <input
                        type="hidden"
                        name="tierTypes[]"
                        value="STANDARD"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-end pb-1 justify-center">
                      {tiers.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeTierRow(tier.id)}
                          variant="ghost"
                          className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- ERROR FEEDBACK --- */}
            {state?.error && (
              <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-5">
                <p className="text-[10px] font-black uppercase text-destructive text-center tracking-widest">
                  Deployment Failure: {state.error}
                </p>
              </div>
            )}
          </div>

          <div className="bg-muted/30 p-8 flex items-center justify-end gap-4 border-t border-border/50 backdrop-blur-xl">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-xl h-14 px-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Abord
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 max-w-[280px] rounded-[1.5rem] bg-primary h-14 text-[12px] font-black uppercase italic tracking-[0.1em] shadow-2xl shadow-primary/20 transition-all active:scale-95"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deploying
                  Node...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" /> Confirm & Deploy
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
