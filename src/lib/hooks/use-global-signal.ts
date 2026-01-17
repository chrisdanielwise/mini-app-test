"use client";

import { toast } from "sonner";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { cn } from "@/lib/utils"; // 🛡️ Ensure this utility is imported

/**
 * 🛰️ USE_GLOBAL_SIGNAL (Institutional Apex v16.16.31)
 * Path: @/hooks/use-global-signal
 * Priority: Synchronized Tactile & Visual Feedback.
 */
export const useGlobalSignal = () => {
  const { notification, impact } = useHaptics();

  const sendSignal = (
    title: string, 
    description: string, 
    level: "SUCCESS" | "WARN" | "ERROR" | "INFO" = "INFO"
  ) => {
    // 🏁 TACTILE SYNC: Trigger physical hardware feedback
    switch (level) {
      case "SUCCESS": notification("success"); break;
      case "ERROR": notification("error"); break;
      case "WARN": notification("warning"); break;
      default: impact("medium");
    }

    // 🌊 UI SYNC: Vapour-Glass Toast Rendering
    toast(title, {
      description: `[TELEMETRY_LOG]: ${description.toUpperCase()}`,
      className: cn(
        "group border-white/10 bg-card/90 backdrop-blur-3xl", // Base Style
        level === "ERROR" && "border-rose-500/20 bg-rose-500/10 text-rose-500",
        level === "WARN" && "border-amber-500/20 bg-amber-500/10 text-amber-500",
        level === "SUCCESS" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
      ),
    });
  };

  return { sendSignal };
};