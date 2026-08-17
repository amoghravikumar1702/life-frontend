// src/components/ui/SearchInput.tsx

"use client";

import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      {/* Search icon */}
      <Search
        size={16}
        strokeWidth={1.8}
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-zinc-600
          transition-colors
          duration-200
        "
      />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="
          h-11
          w-full
          rounded-2xl
          border
          border-white/[0.07]
          bg-white/[0.025]
          pl-11
          pr-11
          text-sm
          text-white
          outline-none
          placeholder:text-zinc-700
          transition-all
          duration-200
          hover:border-white/[0.11]
          focus:border-[#D4AF37]/25
          focus:bg-white/[0.035]
          focus:ring-1
          focus:ring-[#D4AF37]/10
        "
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="
            absolute
            right-3
            top-1/2
            flex
            h-7
            w-7
            -translate-y-1/2
            items-center
            justify-center
            rounded-lg
            text-zinc-600
            transition
            hover:bg-white/[0.06]
            hover:text-zinc-300
          "
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}