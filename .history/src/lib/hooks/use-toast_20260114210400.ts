"use client";

import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ TOAST ORCHESTRATOR (Institutional v16.16.12)
 * Philosophy: Atomic Lifecycle & Native Hardware Bridging.
 * Standards: Merged Apex Tier Logic + v9.4.4 Security Hardening.
 */

const TOAST_LIMIT = 1; 
const TOAST_REMOVE_DELAY = 5000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// 🛡️ MEMORY MANAGEMENT: Set-based listeners prevent memory leaks during slow DB handshakes
let memoryState: { toasts: ToasterToast[] } = { toasts: [] };
const listeners = new Set<(state: { toasts: ToasterToast[] }) => void>();

function dispatch(action: any) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

export const reducer = (state: { toasts: ToasterToast[] }, action: any) => {
  switch (action.type) {
    case "ADD_TOAST":
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId || action.toastId === undefined ? { ...t, open: false } : t
        ),
      };

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: action.toastId === undefined 
          ? [] 
          : state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

/**
 * 🚀 GLOBAL TACTICAL TRIGGER
 * Optimized for institutional alerts and hardware haptics.
 */
export function toast({ ...props }: Omit<ToasterToast, "id">) {
  const id = Math.random().toString(36).substring(2, 9);

  // 🏁 TACTILE SYNC (v9.5.0): Direct Hardware Bridge
  if (typeof window !== "undefined") {
    if (props.variant === "destructive") hapticFeedback("error");
    else hapticFeedback(props.variant === "default" ? "light" : "success");
  }

  const update = (newProps: Partial<ToasterToast>) =>
    dispatch({ type: "UPDATE_TOAST", toast: { ...newProps, id } });

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  // Atomic cleanup queue
  setTimeout(() => {
    dispatch({ type: "REMOVE_TOAST", toastId: id });
  }, TOAST_REMOVE_DELAY + 1000);

  return { id, dismiss, update };
}

/**
 * 🕵️ useToast Hook (v16.16.12)
 * Logic: Set-based synchronization for fluid rendering.
 */
export function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useLayoutEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}