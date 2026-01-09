import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Bot, 
  ShieldCheck, 
  Maximize, 
  Key, 
  Settings2,
  CheckCircle2,
  X
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/**
 * ⚙️ MERCHANT COMMAND SETTINGS
 * Features: Immersive "Back" navigation, Full-size toggle, and hidden "Exit" logic.
 */
export default async function SettingsPage() {
  const session = await requireMerchantSession();

  return (
    <div className="min-h-screen bg-background space-y-12 p-6 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- IMMERSIVE HEADER --- */}
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div className="space-y-1">
          <Link 
            href="/dashboard" 
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> 
            Back to Command
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-3">
            System Config <Settings2 className="h-7 w-7 text-primary" />
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Merchant: {session.merchant.companyName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* --- LEFT COLUMN: BOT & SECURITY --- */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Bot Identity Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Bot className="h-4 w-4" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Telegram Bot Identity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase opacity-60 ml-1">Bot Username</Label>
                <Input 
                  defaultValue={session.merchant.botUsername} 
                  className="rounded-xl border-muted bg-muted/20 h-12 font-bold"
                  placeholder="@MySignalBot"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase opacity-60 ml-1">Bot Token (API)</Label>
                <div className="relative">
                  <Input 
                    type="password" 
                    defaultValue="••••••••••••••••"
                    className="rounded-xl border-muted bg-muted/20 h-12 font-mono pr-12"
                  />
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30" />
                </div>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="space-y-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-emerald-500">
              <Maximize className="h-4 w-4" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Interface Preferences</h2>
            </div>
            <div className="space-y-4">
              {/* Full Size Option Toggle */}
              <div className="flex items-center justify-between p-6 rounded-[2rem] bg-muted/10 border border-border">
                <div>
                  <p className="text-xs font-black uppercase italic">Ultra-Wide Viewport</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">Toggle full-size layout for widescreen monitors.</p>
                </div>
                <Switch className="data-[state=checked]:bg-primary" />
              </div>

              <div className="flex items-center justify-between p-6 rounded-[2rem] bg-muted/10 border border-border">
                <div>
                  <p className="text-xs font-black uppercase italic">Dark Mode Sync</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">Sync dashboard theme with Telegram Client.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
              </div>
            </div>
          </section>
        </div>

        {/* --- RIGHT COLUMN: STATUS & EXIT --- */}
        <div className="space-y-6">
          <div className="rounded-[2.5rem] bg-card border border-border p-8 shadow-xl">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">Security Profile</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase">SSL Encryption Active</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase">Webhook Certified</span>
              </li>
              <li className="flex items-center gap-3 opacity-30">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase">2FA (Coming Soon)</span>
              </li>
            </ul>
            <Button className="w-full mt-8 rounded-2xl bg-primary font-black uppercase text-[10px] tracking-widest h-12 shadow-lg shadow-primary/20">
              Save Configuration
            </Button>
          </div>

          {/* 🔥 THE "END OF NAVIGATION" CLOSE BUTTON 
              Only revealed at the very bottom/end of the right column 
          */}
          <div className="pt-12 flex flex-col items-center gap-4">
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-30">Finish Session</p>
            <Link href="/dashboard">
              <Button 
                variant="outline" 
                className="h-16 w-16 rounded-full border-muted-foreground/20 hover:bg-destructive hover:text-white hover:border-destructive transition-all group"
              >
                <X className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}