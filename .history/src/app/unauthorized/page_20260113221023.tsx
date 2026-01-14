import Link from "next/link";
import { ShieldAlert, Terminal, ArrowLeft, Lock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * 🛰️ SECURITY INTERCEPT NODE (Institutional v14.2.0)
 * Logic: Hardened gate for RBAC clearance failures.
 */
export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background relative selection:bg-rose-500/30 text-foreground overflow-hidden">
      
      {/* 🌌 DANGER AMBIENT GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-rose-500/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
        
        {/* --- INTERCEPT ICON --- */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full" />
            <div className="relative h-20 w-20 rounded-[2rem] bg-rose-500/10 border-2 border-rose-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="h-10 w-10 text-rose-500" />
            </div>
          </div>
          
          <div className="text-center space-y-1">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-rose-500">
              Clearance <span className="text-foreground">Denied</span>
            </h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40">
              Protocol: RBAC_RESTRICTION_GATE
            </p>
          </div>
        </div>

        {/* --- SYSTEM LOG OUTPUT --- */}
        <div className="bg-card/40 border border-rose-500/10 rounded-[2.5rem] backdrop-blur-3xl p-8 relative overflow-hidden">
          <Terminal className="absolute -bottom-6 -right-6 h-24 w-24 opacity-[0.03] pointer-events-none" />
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-500/60">
                <Lock className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Access Intercepted</span>
              </div>
              <p className="text-xs font-bold leading-relaxed text-muted-foreground uppercase italic">
                Your identity signature does not possess the required clearance level to ingress this node.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/5 border border-border/10 space-y-2">
              <div className="flex items-center gap-2 opacity-40">
                <Info className="h-3 w-3" />
                <span className="text-[8px] font-black uppercase tracking-widest leading-none">Possible Causes</span>
              </div>
              <ul className="text-[8px] font-bold text-muted-foreground/60 uppercase space-y-1 tracking-widest list-disc ml-3">
                <li>INSUFFICIENT_STAFF_PRIVILEGE</li>
                <li>EXPIRED_IDENTITY_ANCHOR</li>
                <li>UNREGISTERED_MERCHANT_ID</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link href="/home" className="block">
                <Button className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-black uppercase italic tracking-widest text-[11px] transition-all active:scale-95">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Home
                </Button>
              </Link>
              
              <Link href="/dashboard/login" className="block">
                <Button variant="ghost" className="w-full h-12 rounded-2xl border border-border/10 font-black uppercase tracking-widest text-[9px] opacity-60 hover:opacity-100 transition-opacity">
                  Try Re-Authentication
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* --- SECURITY FOOTER --- */}
        <div className="text-center opacity-20 flex flex-col items-center gap-2">
           <p className="text-[8px] font-black uppercase tracking-[0.5em] italic">Zipha_Guard_Sentinel // v4.0</p>
           <div className="flex gap-1">
             {[...Array(4)].map((_, i) => (
               <div key={i} className="h-1 w-4 rounded-full bg-rose-500/50" />
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}