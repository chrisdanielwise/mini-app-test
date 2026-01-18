"use client";

import { create } from "zustand";
import { useHaptics } from "./use-haptics"; // Relative path for directory safety
import { useGlobalSignal } from "./use-global-signal";
import { toast } from "sonner";

/**
 * 🛰️ USE_IMPERSONATION (Institutional v16.45.02)
 * Strategy: Global State Sync & Security Handshake.
 */

interface ImpersonationState {
  isActive: boolean;
  targetMerchantId: string | null;
  targetMerchantName: string | null;
  actions: {
    initiate: (id: string, name: string) => void;
    terminate: () => void;
  };
}

const useImpersonationStore = create<ImpersonationState>((set) => ({
  isActive: false,
  targetMerchantId: null,
  targetMerchantName: null,
  actions: {
    initiate: (id, name) => set({ isActive: true, targetMerchantId: id, targetMerchantName: name }),
    terminate: () => set({ isActive: false, targetMerchantId: null, targetMerchantName: null }),
  },
}));

export function useImpersonation() {
  const { impact, notification, selectionChange } = useHaptics();
  const { sendSignal } = useGlobalSignal();
  const { isActive, targetMerchantId, targetMerchantName, actions } = useImpersonationStore();

  const initiateSwap = async (merchantId: string, merchantName: string) => {
    selectionChange();
    impact("medium");

    toast.loading("ESTABLISHING_TUNNEL", {
      description: `Mirroring node [${merchantName}]...`,
    });

    try {
      // 🛡️ SECURITY_HANDSHAKE
      // Handshake logic here...
      
      actions.initiate(merchantId, merchantName);
      notification("success");
      
      window.location.href = "/dashboard";
    } catch (error) {
      notification("error");
      toast.error("TUNNEL_FAILED");
    }
  };

  const terminateSwap = () => {
    impact("heavy");
    notification("warning");
    window.location.href = "/api/auth/impersonate/exit";
  };

  return {
    isActive,
    targetMerchantId,
    targetMerchantName,
    initiateSwap,
    terminateSwap
  };
}