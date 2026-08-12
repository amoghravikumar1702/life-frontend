"use client";

import { ChangeEvent } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;

  placeholder?: string;

  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchInputProps) {
  return (
    <div
      className={`group flex h-12 w-full items-center rounded-2xl border border-white/[0.06] bg-[#101214] px-4 transition-all duration-200 focus-within:border-[#D4AF37]/50 focus-within:bg-[#14171B] ${className}`}
    >
      <Search
        size={18}
        className="mr-3 shrink-0 text-zinc-500 transition-colors group-focus-within:text-[#D4AF37]"
      />

      <input
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="h-full w-full bg-transparent text-[15px] text-white outline-none placeholder:text-zinc-500"
      />

      {value.length > 0 && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="ml-2 flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-white"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}