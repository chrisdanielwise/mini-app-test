"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ INPUT_OTP (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology Handshake.
 */
function InputOTP({
  className,
  containerClassName,
  onBlur,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2.5 has-disabled:opacity-20",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

/**
 * 🛰️ OTP_SLOT
 * Strategy: Technical Logic Well & Hardware Handshake.
 */
function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};
  const { impact } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  // 🏁 TACTILE SYNC: Trigger hardware pulse on node hydration
  React.useEffect(() => {
    if (char && isReady) impact("light");
  }, [char, impact, isReady]);

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 15%
        "relative flex items-center justify-center border transition-all duration-300",
        isMobile ? "h-10 w-8 rounded-md" : "h-11 w-9 rounded-lg",
        
        // 🌫️ LAMINAR DEPTH: Stationary HUD aesthetic
        "border-white/5 bg-zinc-950/20 backdrop-blur-xl",
        "text-[12px] font-black italic tracking-widest text-primary/80",
        
        // 🚀 KINETIC FOCUS: The "Logic Well" engages
        "data-[active=true]:scale-105 data-[active=true]:border-primary/20 data-[active=true]:bg-primary/5 data-[active=true]:ring-2 data-[active=true]:ring-primary/5",
        
        // 🛡️ Error States
        "aria-invalid:border-rose-500/30 aria-invalid:text-rose-500",
        
        className
      )}
      {...props}
    >
      <span className={cn(char ? "animate-in fade-in zoom-in-95 duration-200" : "")}>
        {char}
      </span>

      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-4 w-0.5 rounded-full bg-primary/40" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" className="text-white/10" {...props}>
      <Activity className="size-3" />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };