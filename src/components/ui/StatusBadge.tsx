import clsx from "clsx";

interface StatusBadgeProps {
  status: string;
}

const variants: Record<string, string> = {
  success:
    "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300",

  warning:
    "border border-amber-500/20 bg-amber-500/10 text-amber-300",

  danger:
    "border border-red-500/20 bg-red-500/10 text-red-300",

  info:
    "border border-sky-500/20 bg-sky-500/10 text-sky-300",
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const variant =
    variants[status.toLowerCase()] ?? variants.info;

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider",
        variant
      )}
    >
      {status}
    </span>
  );
}