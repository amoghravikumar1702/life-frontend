"use client";

import {
  forwardRef,
  SelectHTMLAttributes,
  ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

interface SelectProps
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    "size"
  > {
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  containerClassName?: string;
  children: ReactNode;
}

const Select = forwardRef<
  HTMLSelectElement,
  SelectProps
>(
  (
    {
      label,
      helper,
      error,
      required = false,
      className,
      containerClassName,
      id,
      children,
      ...props
    },
    ref
  ) => {
    const selectId =
      id ??
      label
        .toLowerCase()
        .replace(/\s+/g, "-");

    return (
      <div
        className={clsx(
          "space-y-2",
          containerClassName
        )}
      >
        <label
          htmlFor={selectId}
          className="flex items-center gap-1 text-sm font-medium tracking-tight text-zinc-200"
        >
          {label}

          {required && (
            <span className="text-[#D4AF37]">
              *
            </span>
          )}
        </label>

        {helper && !error && (
          <p className="text-xs leading-5 text-zinc-500">
            {helper}
          </p>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={clsx(
              "h-14 w-full appearance-none rounded-2xl",
              "border border-white/[0.06]",
              "bg-[#101214]",
              "px-5 pr-12",
              "text-[15px] text-white",
              "outline-none",
              "transition-all duration-200",
              "hover:bg-[#14171B]",
              "focus:border-[#D4AF37]",
              "focus:bg-[#14171B]",
              "focus:ring-2",
              "focus:ring-[#D4AF37]/15",
              error &&
                "border-red-500/50 focus:border-red-500 focus:ring-red-500/15",
              className
            )}
            {...props}
          >
            {children}
          </select>

          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />
        </div>

        {error && (
          <p className="text-xs font-medium text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;