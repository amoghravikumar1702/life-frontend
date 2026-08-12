import { InputHTMLAttributes } from "react";
import clsx from "clsx";

export default function GlassInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-2xl border border-white/10 bg-white/[0.03]",
        "px-4 py-3 text-white placeholder:text-zinc-500",
        "outline-none transition-all duration-300",
        "focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20",
        className
      )}
    />
  );
}