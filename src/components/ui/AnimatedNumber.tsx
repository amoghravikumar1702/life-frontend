"use client";

import { useEffect, useState } from "react";

function formatCurrency(value: number) {
  return `₹${new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`;
}

function formatPlainNumber(value: number) {
  return value.toLocaleString("en-IN");
}

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  format?: "currency" | "number";
}

export default function AnimatedNumber({
  value,
  duration = 1000,
  format = "number",
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;

    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  const formatted =
    format === "currency"
      ? formatCurrency(displayValue)
      : formatPlainNumber(displayValue);

  return <>{formatted}</>;
}