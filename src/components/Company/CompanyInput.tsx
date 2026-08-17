type Props = {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

export default function CompanyInput({
  label,
  name,
  value,
  placeholder,
  type = "text",
  required = false,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-[13px] font-medium tracking-wide text-zinc-400"
      >
        {label}
        {required && (
          <span className="ml-1 text-[#D4AF37]">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className="w-full rounded-xl border border-white/[0.08] bg-[#0D0F12] px-4 py-3.5 text-sm text-white placeholder:text-zinc-700 outline-none transition duration-200 hover:border-white/[0.13] focus:border-[#D4AF37]/50 focus:bg-[#101216] focus:ring-2 focus:ring-[#D4AF37]/10"
      />
    </div>
  );
}