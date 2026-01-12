import { requireMerchantSession } from "@/lib/auth/merchant-session";
import { MerchantService } from "@/lib/services/merchant.service";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Key, 
  LogOut, 
  Terminal, 
  Fingerprint, 
  Lock, 
  BadgeCheck 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * 🏛️ ADMINISTRATIVE IDENTITY TERMINAL (Apex Tier)
 * Normalized: World-standard typography and responsive viewport constraints.
 * Fixed: Identity handshake aligned with hardened session logic.
 */
export default async function MerchantProfilePage() {
  // 🛡️ 1. Auth Guard: Verify administrative credentials
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;
  
  // 🛰️ 2. Fetch the Merchant's personal telemetry data
  const merchant = await MerchantService.getById(realMerchantId);

  if (!merchant) {
    return (
      <div className="flex h-[60vh] items-center justify-center animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <Terminal className="h-10 w-10 text-rose-500 mx-auto opacity-20" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-rose-500">
            Error: Identity_Node_Not_Found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 max-w-5xl mx-auto">
      
      {/* --- HUD HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 border-b border-border/40 pb-8 md:pb-12">
        <div className="space-y-2 md:space-y-4">
          <div className="flex items-center gap-3 text-primary mb-1">
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Fingerprint className="h-3.5 w-3.5 md:h-4 md:w-4 fill-primary animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Admin Identity Node
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Account <span className="text-primary">Profile</span>
          </h1>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-40">
            Node_Owner: <span className="text-foreground">{session.user?.email || "UNSPECIFIED"}</span>
          </p>
        </div>

        <Button className="w-full md:w-auto h-12 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
          Deploy Identity Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-12 xl:gap-16">
        
        {/* --- LEFT: PERSONAL TELEMETRY (Major Viewport) --- */}
        <div className="xl:col-span-2 space-y-8 md:space-y-12">
          <section className="rounded-3xl md:rounded-[3.5rem] border border-border/40 bg-card/40 p-6 sm:p-10 md:p-14 backdrop-blur-3xl shadow-2xl relative overflow-hidden group transition-all hover:border-primary/20">
            <div className="relative z-10 space-y-8 md:space-y-10">
              <div className="flex items-center gap-4 border-b border-border/20 pb-6">
                <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Personal Manifest</h2>
              </div>
              
              <div className="grid gap-6 md:gap-10 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-primary/70">Legal Label (Full Name)</Label>
                  <Input 
                    defaultValue={session.user?.fullName || "Merchant Admin"} 
                    className="h-12 md:h-14 rounded-xl md:rounded-2xl border-border/40 bg-muted/10 px-6 font-black uppercase italic text-xs tracking-tight focus:ring-primary/20 transition-all shadow-inner" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-primary/70">Primary Contact (Email)</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30" />
                    <Input 
                      defaultValue={session.user?.email || ""} 
                      className="h-12 md:h-14 rounded-xl md:rounded-2xl border-border/40 bg-muted/5 pl-12 font-bold text-xs opacity-50 cursor-not-allowed" 
                      disabled 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Terminal className="absolute -bottom-10 -right-10 h-48 w-48 md:h-64 md:w-64 opacity-[0.02] pointer-events-none -rotate-12" />
          </section>

          {/* Integration Status (Fluid Layout) */}
          <div className="p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-muted/10 border border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner border border-emerald-500/20">
                <BadgeCheck className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 leading-none">Access Status</p>
                <p className="text-xs md:text-sm font-black uppercase italic tracking-tighter mt-1">Verified Merchant Node</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-30 italic">Active Since</p>
              <p className="text-[10px] font-bold text-foreground opacity-60">2026.01.10</p>
            </div>
          </div>
        </div>

        {/* --- RIGHT: SECURITY HUD (Control Strip) --- */}
        <div className="space-y-6 md:space-y-8">
          <section className="rounded-3xl md:rounded-[3rem] border border-border/40 bg-card/40 p-6 md:p-10 backdrop-blur-3xl shadow-2xl space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 text-primary">
              <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Access Level</h2>
            </div>
            
            <div className="space-y-6">
              <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5 md:p-6 shadow-inner">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary opacity-60 mb-2">Protocol Role</p>
                <p className="text-xl md:text-2xl font-black italic text-primary uppercase tracking-tighter truncate">MERCHANT_OWNER</p>
              </div>

              <div className="space-y-3 md:space-y-4">
                <Button variant="outline" className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border-border/40 bg-muted/10 font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all group">
                  <Key className="mr-3 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Rotate Password
                </Button>
                
                <Button variant="ghost" className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl text-rose-500 hover:bg-rose-500/10 font-black uppercase text-[10px] tracking-widest transition-all">
                  <LogOut className="mr-3 h-4 w-4" />
                  Terminate Session
                </Button>
              </div>
            </div>
          </section>

          {/* Security Tip */}
          <div className="px-4 md:px-6 space-y-3 opacity-30">
            <div className="flex items-center gap-2">
               <Lock className="h-3 w-3" />
               <p className="text-[8px] font-black uppercase tracking-[0.4em]">Audit Protocol</p>
            </div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed tracking-widest">
              Identity changes are logged and broadcasted to the security node cluster. Unauthorized access attempts trigger an immediate lockdown.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}