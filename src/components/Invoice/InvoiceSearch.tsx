type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function InvoiceSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-8">

      <input
        type="text"
        placeholder="🔍 Search invoices..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#0B1220] p-4 text-white outline-none transition focus:border-cyan-400"
      />

    </div>
  );
}