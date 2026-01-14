"use client";

import { AlertTriangle, Info, Megaphone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface EmergencyBannerProps {
  active: boolean;
  message: string;
  level: "INFO" | "WARN" | "CRITICAL";
}

export function EmergencyBanner({ active, message, level }: EmergencyBannerProps) {
  const [closed, setClosed] = useState(false);
  if (!active || closed) return null;

  const styles = {
    INFO: "bg-blue-500/10 border-blue-500/20 text-blue-500",
    WARN: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    CRITICAL: "bg-rose-500/10 border-rose-500/20 text-rose-500",
  };

  const icons = {
    INFO: <Info className="h-3 w-3" />,
    WARN: <AlertTriangle className="h-3 w-3" />,
    CRITICAL: <Megaphone className="h-3 w-3" />,
  };

  return (
    <div className={cn(
      "w-full border-b backdrop-blur-md px-4 py-2 flex items-center justify-between transition-all animate-in slide-in-from-top duration-500",
      styles[level]
    )}>
      <div className="flex items-center gap-3">
        {icons[level]}
        <span className="text-[9px] font-black uppercase tracking-widest italic leading-none">
          {level}_BROADCAST // {message}
        </span>
      </div>
      
      <button 
        onClick={() => setClosed(true)}
        className="opacity-40 hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}