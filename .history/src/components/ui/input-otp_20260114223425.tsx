"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID OTP INPUT
 * Logic: Haptic-synced authentication bridge.
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
        "flex items-center gap-3 has-disabled:opacity-40",
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
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

/**
 * 🌊 WATER OTP SLOT
 * Logic: Momentum-based focus wells with "filling" animation.
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
  const { selectionChange, impact } = useHaptics();

  // 🏁 TACTILE SYNC: Trigger haptics when a character is registered
  React.useEffect(() => {
    if (char) impact("light");
  }, [char, impact]);

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism Wells
        "relative flex h-12 w-10 items-center justify-center rounded-xl border border-white/10 bg-card/20",
        "text-[14px] font-black italic tracking-widest text-primary transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "backdrop-blur-md shadow-inner",
        
        // 🌊 WATER FOCUS: The "Well" fills with primary radiance
        "data-[active=true]:scale-110 data-[active=true]:border-primary/40 data-[active=true]:bg-primary/5 data-[active=true]:ring-4 data-[active=true]:ring-primary/5",
        
        // 🛡️ Error States
        "aria-invalid:border-destructive/50 aria-invalid:text-destructive",
        
        className
      )}
      {...props}
    >
      <span className={cn(char ? "animate-in fade-in zoom-in-50 duration-300" : "")}>
        {char}
      </span>

      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-5 w-0.5 rounded-full bg-primary duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" className="text-foreground/20" {...props}>
      <MinusIcon className="size-4" />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };