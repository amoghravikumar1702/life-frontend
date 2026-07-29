"use client";

import { createContext } from "react";
import type { BusinessConfig } from "@/config/business/types";

export interface BusinessContextValue {
  business: BusinessConfig;
}

export const BusinessContext =
  createContext<BusinessContextValue | null>(null);