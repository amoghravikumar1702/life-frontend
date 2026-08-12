type Props = {
  status: string;
};

export default function InvoiceStatus({
  status,
}: Props) {
  const styles: Record<
    string,
    {
      dot: string;
      classes: string;
    }
  > = {
    Pending: {
      dot: "bg-[#D4AF37]",
      classes:
        "border border-[#D4AF37]/20 bg-[#D4AF37]/12 text-[#F4D77B]",
    },

    Paid: {
      dot: "bg-emerald-400",
      classes:
        "border border-emerald-500/20 bg-emerald-500/12 text-emerald-300",
    },

    Overdue: {
      dot: "bg-rose-400",
      classes:
        "border border-rose-500/20 bg-rose-500/12 text-rose-300",
    },
  };

  const current =
    styles[status] ?? {
      dot: "bg-zinc-400",
      classes:
        "border border-zinc-500/20 bg-zinc-500/12 text-zinc-300",
    };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide ${current.classes}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${current.dot}`}
      />

      {status}
    </span>
  );
}