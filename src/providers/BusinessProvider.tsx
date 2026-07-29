"use client";

import { ReactNode } from "react";

import { BusinessContext } from "@/context/BusinessContext";
import type { BusinessConfig } from "@/config/business/types";

interface Props {
  business: BusinessConfig;
  children: ReactNode;
}

export default function BusinessProvider({
  business,
  children,
}: Props) {
  return (
    <BusinessContext.Provider
      value={{ business }}
    >
      {children}
    </BusinessContext.Provider>
  );
}