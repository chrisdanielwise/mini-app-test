"use client";

import * as React from "react";
import { format } from "date-fns";
import { 
  DollarSign, 
  Activity, 
  Terminal, 
  ArrowUpRight, 
  Clock,
  Search,
  Filter,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

