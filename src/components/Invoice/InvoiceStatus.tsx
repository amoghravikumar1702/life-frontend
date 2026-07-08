type Props = {
  status: string;
};

export default function InvoiceStatus({ status }: Props) {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-500/20 text-yellow-300",
    Paid: "bg-green-500/20 text-green-300",
    Overdue: "bg-red-500/20 text-red-300",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        styles[status] ?? "bg-gray-500/20 text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}