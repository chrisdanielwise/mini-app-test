"use client";

import { useActionState } from "react";
import { createServiceAction } from "@/src/lib/actions/service.actions";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Zap, ShieldCheck, Layers, Loader2 } from "lucide-react";

export function ServiceForm({ merchantId }: { merchantId: string }) {
  const [state, formAction, isPending] = useActionState(createServiceAction, null);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="merchantId" value={merchantId} />

      {/* Section 1: Core Service Identity */}
      <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-black uppercase tracking-widest">Service Identity</h2>
        </div>
        
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase opacity-60">Service Name</Label>
            <Input name="name" placeholder="e.g., Gold VIP Signals" required className="rounded-xl" />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase opacity-60">Description</Label>
            <Textarea name="description" placeholder="What value do subscribers get?" className="rounded-xl min-h-[100px]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">Category Tag</Label>
              <Input name="categoryTag" placeholder="FOREX" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">Telegram Channel ID</Label>
              <Input name="vipChannelId" placeholder="-100..." className="rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Initial Pricing Tier */}
      <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Layers className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-black uppercase tracking-widest">First Pricing Tier</h2>
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase opacity-60">Tier Name</Label>
            <Input name="tierName" placeholder="Monthly Access" required className="rounded-xl" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">Price (USD)</Label>
              <Input name="price" type="number" step="0.01" placeholder="49.99" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">Interval</Label>
              <select name="interval" className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                <option value="MONTH">Monthly</option>
                <option value="WEEK">Weekly</option>
                <option value="YEAR">Yearly</option>
                <option value="DAY">Daily</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">Sub Type</Label>
              <select name="type" className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                <option value="CUSTOM">Standard</option>
                <option value="LIFETIME">Lifetime</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {state?.error && (
        <p className="text-xs font-bold text-destructive uppercase bg-destructive/5 p-4 rounded-xl border border-destructive/20 text-center">
          {state.error}
        </p>
      )}

      <Button 
        type="submit" 
        disabled={isPending}
        className="w-full h-14 rounded-[1.5rem] text-xs font-black uppercase italic tracking-widest shadow-lg shadow-primary/20"
      >
        {isPending ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deploying to Blockchain...</>
        ) : (
          <><ShieldCheck className="mr-2 h-4 w-4" /> Finalize & Deploy Service</>
        )}
      </Button>
    </form>
  );
}