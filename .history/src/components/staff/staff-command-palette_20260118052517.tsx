"use client";

import * as React from "react";
import { 
  Search, 
  Users, 
  ShieldAlert, 
  ArrowRightLeft, 
  CreditCard, 
  Settings,
  Command as CommandIcon,
  Zap,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useSettlement } from "@/lib/hooks/use-settleme";
import { useImpersonation } from "@/lib/hooks/use-impersonation";

/**
 * 🛰️ STAFF_COMMAND_PALETTE (Institutional v16.42.10)
 * Strategy: Global Keyboard Listener & Rapid Node Ingress.
 * Mission: Zero-latency navigation and identity tunneling for operators.
 */
export function StaffCommandPalette() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const { impact, selectionChange } = useHaptics();
  const { triggerSettlement } = useSettlement();
  const { initiateSwap } = useImpersonation();

  // 🛡️ KEYBOARD_LISTENER: Ctrl+K or Cmd+K to summon the palette
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        selectionChange();
        setIsOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [selectionChange]);

  const handleAction = (action: () => void) => {
    impact("medium");
    action();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-md flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- 🛡️ SEARCH_INGRESS --- */}
        <div className="flex items-center px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <Search className="size-5 text-muted-foreground/40 mr-4" />
          <input 
            autoFocus
            placeholder="EXECUTE_COMMAND_OR_SEARCH_NODES..."
            className="flex-1 bg-transparent border-none outline-none text-[13px] font-black uppercase italic tracking-widest text-foreground placeholder:opacity-20"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10">
            <span className="text-[9px] font-black opacity-40 italic">ESC</span>
          </div>
        </div>

        {/* --- 🚀 COMMAND_VOLUME --- */}
        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
          <CommandGroup label="Identity_Protocols">
            <CommandItem 
              icon={ArrowRightLeft} 
              label="Initiate_Impersonation" 
              sub="Tunnel into merchant node" 
              onClick={() => handleAction(() => {
                // Tactical implementation: Trigger identity shift
                initiateSwap("m_alpha_8841", "Merchant_Alpha_Cluster");
              })} 
            />
            <CommandItem 
              icon={Users} 
              label="Global_Staff_List" 
              sub="Manage L80+ permissions" 
              onClick={() => handleAction(() => window.location.href = "/staff/users")} 
            />
          </CommandGroup>

          <CommandGroup label="Liquidity_Operations">
            <CommandItem 
              icon={CreditCard} 
              label="Quick_Settlement" 
              sub="Initiate fund disbursement" 
              onClick={() => handleAction(() => triggerSettlement(4250.75))} 
            />
            <CommandItem 
              icon={Terminal} 
              label="View_Platform_Ledger" 
              sub="Global disbursement audit" 
              onClick={() => handleAction(() => window.location.href = "/staff/ledger")} 
            />
          </CommandGroup>

          <CommandGroup label="System_Tactical">
            <CommandItem 
              icon={ShieldAlert} 
              label="Security_Override" 
              sub="Emergency node lockdown" 
              severity="rose"
              onClick={() => handleAction(() => {
                impact("heavy");
                console.log("LOCKDOWN_INITIATED");
              })} 
            />
            <CommandItem 
              icon={Settings} 
              label="Global_Config" 
              sub="Edit platform parameters" 
              onClick={() => handleAction(() => window.location.href = "/staff/config")} 
            />
          </CommandGroup>
        </div>

        {/* --- 🌊 COMMAND_FOOTER --- */}
        <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] flex items-center justify-center">
           <div className="flex items-center gap-2 opacity-20 italic">
              <Zap className="size-3 text-primary animate-pulse" />
              <p className="text-[7px] font-black uppercase tracking-[0.5em] italic">Command_Horizon_Active // Institutional_Apex</p>
           </div>
        </div>
      </div>
      
      {/* Background click to close */}
      <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />
    </div>
  );
}

/** --- ATOMIC UI COMPONENTS --- */

function CommandGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h4 className="px-4 py-2 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">{label}</h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function CommandItem({ icon: Icon, label, sub, onClick, severity = "default" }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-all group text-left"
    >
      <div className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg border transition-all",
        severity === "rose" ? "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]" : "bg-white/5 border-white/10 text-muted-foreground group-hover:text-primary group-hover:border-primary/20"
      )}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase italic tracking-widest text-foreground group-hover:text-primary transition-colors leading-none">
          {label}
        </p>
        <p className="text-[8px] text-muted-foreground/20 font-bold uppercase tracking-[0.2em] mt-1 italic leading-none group-hover:text-muted-foreground/40 transition-colors">
          {sub}
        </p>
      </div>
    </button>
  );
}