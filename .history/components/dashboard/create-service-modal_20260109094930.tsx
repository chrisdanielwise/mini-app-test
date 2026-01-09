"use client";

import { useState, useActionState, useEffect } from "react";
import { createServiceAction } from "@/lib/actions/service.actions";
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
import { Plus, Loader2, Zap, Layers, ShieldCheck } from "lucide-react";

interface CreateServiceModalProps {
  merchantId: string;
}

/**
 * 🚀 CREATE SERVICE MODAL
 * Handles atomic deployment of Service + ServiceTier.
 * Optimized for Zipha V2 Schema & Next.js 16.
 */
export function CreateServiceModal({ merchantId }: CreateServiceModalProps) {
  const [open, setOpen] = useState(false);
  
  // 🛡️ useActionState handles the Server Action response and loading state
  const [state, formAction, isPending] = useActionState(createServiceAction, null);

  // Auto-close modal when creation is successful (when state changes and no error)
  useEffect(() => {
    if (state && !state.error && !isPending) {
      setOpen(false);
    }
  }, [state, isPending]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl h-12 px-6 font-black uppercase italic tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
          <Plus className="mr-2 h-4 w-4" /> Deploy Service
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl rounded-[2.5rem] border-border bg-card p-0 overflow-hidden shadow-2xl">
        <form action={formAction}>
          {/* Hidden input to pass merchantId to the Server Action */}
          <input type="hidden" name="merchantId" value={merchantId} />
          
          <div className="p-8 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
                New Signal Deployment
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                Register a new digital asset and its primary pricing tier.
              </DialogDescription>
            </DialogHeader>

            {/* --- SECTION 1: IDENTITY & CHANNELS --- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Zap className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Service Identity</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1">Service Name</Label>
                  <Input name="name" placeholder="VIP GOLD SIGNALS" required className="rounded-xl border-muted bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1">Category Tag</Label>
                  <Input name="categoryTag" placeholder="FOREX" className="rounded-xl border-muted bg-muted/20" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase ml-1">Public Description</Label>
                <Textarea name="description" placeholder="Short summary of signals, accuracy, and frequency..." className="rounded-xl min-h-[80px] bg-muted/20" />
              </div>

              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase ml-1 text-primary font-bold">VIP Channel ID (Target)</Label>
                <Input 
                  name="vipChannelId" 
                  placeholder="-100123456789" 
                  required 
                  className="rounded-xl border-primary/20 bg-primary/5 font-mono" 
                />
                <p className="text-[8px] font-bold text-muted-foreground uppercase px-1">Must include -100 prefix for private channels.</p>
              </div>
            </div>

            {/* --- SECTION 2: PRICING TIER --- */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-emerald-500">
                <Layers className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Initial Pricing Tier</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1">Tier Name</Label>
                  <Input name="tierName" placeholder="Monthly Full Access" required className="rounded-xl bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1">Price (USD)</Label>
                  <Input name="price" type="number" step="0.01" placeholder="49.99" required className="rounded-xl bg-muted/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1">Billing Interval</Label>
                  <select 
                    name="interval" 
                    className="w-full h-10 rounded-xl border border-muted bg-muted/20 px-3 text-xs font-bold uppercase cursor-pointer"
                  >
                    <option value="MONTH">Monthly</option>
                    <option value="WEEK">Weekly</option>
                    <option value="YEAR">Yearly</option>
                    <option value="DAY">Daily</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1">Sub Type</Label>
                  <select 
                    name="type" 
                    className="w-full h-10 rounded-xl border border-muted bg-muted/20 px-3 text-xs font-bold uppercase cursor-pointer"
                  >
                    <option value="custom">Standard</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
              </div>
            </div>

            {/* --- ERROR DISPLAY --- */}
            {state?.error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 animate-shake">
                <p className="text-[10px] font-black uppercase text-destructive text-center">
                  {state.error}
                </p>
              </div>
            )}
          </div>

          <div className="bg-muted/30 p-6 flex justify-end gap-3 border-t border-border">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="rounded-xl bg-primary px-8 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10"
            >
              {isPending ? (
                <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Deploying...</>
              ) : (
                <><ShieldCheck className="mr-2 h-3 w-3" /> Confirm & Deploy</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}