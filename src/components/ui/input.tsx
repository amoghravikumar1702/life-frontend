"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size"
  > {
  label: string;

  helper?: string;

  error?: string;

  required?: boolean;

  containerClassName?: string;
}

const Input = forwardRef<
  HTMLInputElement,
  InputProps
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
      ...props
    },
    ref
  ) => {
    const inputId =
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
          htmlFor={inputId}
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

        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "h-14 w-full rounded-2xl",

            "border border-white/[0.06]",

            "bg-[#101214]",

            "px-5",

            "text-[15px] text-white",

            "placeholder:text-zinc-500",

            "outline-none",

            "transition-all duration-200",

            "hover:bg-[#14171B]",

            "focus:border-[#D4AF37]",

            "focus:bg-[#14171B]",

            "focus:ring-2",

            "focus:ring-[#D4AF37]/15",

            "disabled:cursor-not-allowed",

            "disabled:opacity-50",

            error &&
              "border-red-500/50 focus:border-red-500 focus:ring-red-500/15",

            className
          )}
          {...props}
        />

        {error && (
          <p className="text-xs font-medium text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;