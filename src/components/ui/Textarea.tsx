"use client";

import {
  forwardRef,
  TextareaHTMLAttributes,
} from "react";
import clsx from "clsx";

interface TextareaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "rows"
  > {
  label: string;

  helper?: string;

  error?: string;

  required?: boolean;

  rows?: number;

  containerClassName?: string;
}

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(
  (
    {
      label,
      helper,
      error,
      required = false,
      rows = 5,
      className,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId =
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
          htmlFor={textareaId}
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

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={clsx(
            "w-full rounded-2xl",

            "border border-white/[0.06]",

            "bg-[#101214]",

            "px-5 py-4",

            "text-[15px] text-white",

            "placeholder:text-zinc-500",

            "outline-none",

            "resize-none",

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

Textarea.displayName = "Textarea";

export default Textarea;