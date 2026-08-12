"use client";

import { ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export interface CountryCode {
  code: string;
  label: string;
  flag: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: "+91", label: "India", flag: "🇮🇳" },
  { code: "+1", label: "United States", flag: "🇺🇸" },
  { code: "+44", label: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", label: "Australia", flag: "🇦🇺" },
  { code: "+971", label: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+65", label: "Singapore", flag: "🇸🇬" },
  { code: "+81", label: "Japan", flag: "🇯🇵" },
  { code: "+49", label: "Germany", flag: "🇩🇪" },
];

interface PhoneInputProps {
  label: string;

  countryCode: string;

  phone: string;

  onCountryCodeChange: (value: string) => void;

  onPhoneChange: (value: string) => void;

  helper?: string;

  error?: string;

  required?: boolean;

  disabled?: boolean;
}

export default function PhoneInput({
  label,
  countryCode,
  phone,
  onCountryCodeChange,
  onPhoneChange,
  helper,
  error,
  required = false,
  disabled = false,
}: PhoneInputProps) {
  function handlePhoneChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const numbers = e.target.value.replace(/\D/g, "");

    onPhoneChange(numbers);
  }

  return (
    <div className="space-y-2">

      <label className="flex items-center gap-1 text-sm font-medium text-zinc-200">

        {label}

        {required && (
          <span className="text-[#D4AF37]">*</span>
        )}

      </label>

      {helper && !error && (
        <p className="text-xs text-zinc-500">
          {helper}
        </p>
      )}

      <div
        className={clsx(
          "flex h-14 overflow-hidden rounded-2xl",

          "border border-white/[0.06]",

          "bg-[#101214]",

          "transition-all duration-200",

          "focus-within:border-[#D4AF37]",

          "focus-within:ring-2",

          "focus-within:ring-[#D4AF37]/15",

          error &&
            "border-red-500/50 focus-within:border-red-500 focus-within:ring-red-500/15"
        )}
      >
        <div className="relative">

          <select
            value={countryCode}
            disabled={disabled}
            onChange={(e) =>
              onCountryCodeChange(
                e.target.value
              )
            }
            className="h-full appearance-none border-r border-white/[0.06] bg-transparent py-0 pl-4 pr-10 text-sm text-white outline-none"
          >
            {COUNTRY_CODES.map((country) => (
              <option
                key={country.code}
                value={country.code}
                className="bg-[#101214]"
              >
                {country.flag} {country.code}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

        </div>

        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          disabled={disabled}
          value={phone}
          onChange={handlePhoneChange}
          placeholder="9876543210"
          className="flex-1 bg-transparent px-5 text-[15px] text-white outline-none placeholder:text-zinc-500"
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