"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PrintWrapper({
  children,
}: Props) {
  return (
    <div
      id="executive-report"
      className="
        mx-auto
        w-full
        max-w-[1200px]
        bg-white
        text-black
      "
    >
      {children}
    </div>
  );
}