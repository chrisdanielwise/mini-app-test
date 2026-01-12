"use client";

import { useState, useEffect } from "react";
import { useTelegramContext } from "@/src/components/telegram/telegram-provider";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Smartphone } from "lucide-react";

export default function UserPreferencesPage() {
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  // Load setting on mount
  useEffect(() => {
    const saved = localStorage.getItem("user_haptics_enabled");
    setHapticsEnabled(saved !== "false");
  }, []);

  const toggleHaptics = (checked: boolean) => {
    setHapticsEnabled(checked);
    localStorage.setItem("user_haptics_enabled", checked.toString());
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold italic uppercase">App Settings</h1>

      <div className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-0.5">
            <Label className="font-bold uppercase text-xs">
              Haptic Feedback
            </Label>
            <p className="text-[10px] text-muted-foreground">
              Vibrate phone on clicks
            </p>
          </div>
        </div>
        <Switch checked={hapticsEnabled} onCheckedChange={toggleHaptics} />
      </div>
    </div>
  );
}
