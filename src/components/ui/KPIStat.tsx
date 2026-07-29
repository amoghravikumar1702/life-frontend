import clsx from "clsx";

interface KPIStatProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  className?: string;
}

export default function KPIStat({
  title,
  value,
  subtitle,
  color = "text-white",
  className,
}: KPIStatProps) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-[#D4AF37]/30",
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
        {title}
      </p>

      <h2
        className={clsx(
          "mt-5 text-4xl font-semibold tracking-tight",
          color
        )}
      >
        {value}
      </h2>

      {subtitle && (
        <p className="mt-3 text-sm leading-6 text-zinc-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}